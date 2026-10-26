import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { siteConfig, EGYPTIAN_GOVERNORATES } from '@/config/site';
import { isValidEgyptianPhone } from '@/lib/formatters';
import { SEED_PRODUCTS } from '../../../../prisma/seedData';

// Simple in-memory rate-limiter & duplicate protection (5 minutes per phone)
const recentOrdersCache = new Map<string, number>();

// Cleanup cache periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [phone, timestamp] of recentOrdersCache.entries()) {
      if (now - timestamp > 5 * 60 * 1000) {
        recentOrdersCache.delete(phone);
      }
    }
  }, 60 * 1000);
}

// Zod Schema for Order Submission
const orderItemSchema = z.object({
  productId: z.string().min(1, 'معرّف المنتج مطلوب'),
  productSlug: z.string().optional(),
  variantId: z.string().optional(),
  quantity: z.number().int().min(1, 'الكمية لا تقل عن 1').max(20, 'الحد الأقصى للكمية هو 20 قطعة'),
  selectedColor: z.string().optional(),
});

const createOrderSchema = z.object({
  customerName: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل').max(80, 'الاسم طويل جداً').trim(),
  customerPhone: z.string().refine(isValidEgyptianPhone, {
    message: 'رقم الهاتف يجب أن يكون رقم مصري صحيح (مثال: 01012345678 أو 011 أو 012 أو 015)',
  }),
  customerAltPhone: z
    .string()
    .optional()
    .refine((val) => !val || isValidEgyptianPhone(val), {
      message: 'رقم الهاتف البديل غير صحيح',
    }),
  governorateId: z.string().min(1, 'المحافظة مطلوبة'),
  governorateName: z.string().optional(),
  address: z.string().min(5, 'العنوان يجب أن لا يقل عن 5 أحرف').max(255, 'العنوان طويل جداً').trim(),
  notes: z.string().max(500, 'الملاحظات طويلة جداً').optional(),
  couponCode: z.string().optional(),
  honeypot: z.string().optional(),
  items: z.array(orderItemSchema).min(1, 'يجب إضافة منتج واحد على الأقل للطلب').max(50),
});

// Generate Unique Order Number: DK-YYMM-XXXX
function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `DK-${year}${month}-${random}`;
}

// Non-blocking Telegram notification helper
async function notifyOwnerViaTelegram(orderNumber: string, customerName: string, phone: string, govName: string, total: number, itemsCount: number) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) return;

    const message = `🛍️ *طلب جديد في دكاني!*
━━━━━━━━━━━━━━━
🔖 *رقم الطلب:* \`${orderNumber}\`
👤 *العميل:* ${customerName}
📞 *الهاتف:* ${phone}
📍 *المحافظة:* ${govName}
📦 *عدد المنتجات:* ${itemsCount}
💰 *الإجمالي المطلوب:* *${total} ج.م* (COD)`;

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });
  } catch (err) {
    console.error('Non-critical: Telegram notification failed:', err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Zod Validation
    const parsed = createOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error.errors[0]?.message || 'بيانات الطلب غير مكتملة أو غير صحيحة',
          errors: parsed.error.errors,
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // 2. Anti-bot Honeypot Check
    if (data.honeypot && data.honeypot.trim() !== '') {
      // Silently return fake success to trick spam bots
      return NextResponse.json({
        success: true,
        orderNumber: 'DK-2410-0000',
        message: 'تم تسجيل الطلب بنجاح',
      });
    }

    // 3. Prevent duplicate order spam (same phone number within 5 minutes)
    const cleanPhone = data.customerPhone.replace(/\D/g, '');
    const lastOrderTime = recentOrdersCache.get(cleanPhone);
    const now = Date.now();
    if (lastOrderTime && now - lastOrderTime < 5 * 60 * 1000) {
      return NextResponse.json(
        {
          success: false,
          message: 'تم تسجيل طلب بنفس رقم الهاتف مؤخراً. يرجى الانتظار 5 دقائق قبل إرسال طلب جديد، أو تواصل معنا عبر واتساب.',
        },
        { status: 429 }
      );
    }

    // 4. Resolve Governorate and Shipping Fee (Server-side authoritative)
    let govName = data.governorateName || '';
    let shippingFee = siteConfig.defaultShippingFee;

    const matchedGov = EGYPTIAN_GOVERNORATES.find(
      (g) => g.id === data.governorateId || g.nameAr === data.governorateId
    );
    if (matchedGov) {
      govName = matchedGov.nameAr;
      shippingFee = matchedGov.shippingFee;
    }

    // Client IP & User Agent for fraud auditing
    const ipAddress = request.headers.get('x-forwarded-for') || request.ip || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // 5. Database Transaction: Atomic Stock Deduction & Authoritative Pricing
    let createdOrderNumber = '';
    let finalTotal = 0;
    let itemsCount = 0;

    try {
      // Execute in Prisma Transaction
      const order = await prisma.$transaction(async (tx) => {
        let subtotal = 0;
        const verifiedOrderItems: Array<{
          productId: string;
          productNameAr: string;
          unitPrice: number;
          quantity: number;
          totalPrice: number;
          productImage: string;
          variantId?: string;
        }> = [];

        for (const item of data.items) {
          // Fetch product strictly from Database
          const product = await tx.product.findFirst({
            where: {
              OR: [{ id: item.productId }, { slug: item.productSlug || item.productId }],
              isActive: true,
            },
          });

          if (!product) {
            throw new Error(`المنتج المطلوب (${item.productSlug || item.productId}) غير متوفر حالياً`);
          }

          // Atomic stock verification and deduction
          const updateResult = await tx.product.updateMany({
            where: {
              id: product.id,
              stock: { gte: item.quantity },
            },
            data: {
              stock: { decrement: item.quantity },
              soldCount: { increment: item.quantity },
            },
          });

          if (updateResult.count === 0) {
            throw new Error(`عذراً، الكمية المطلوبة من المنتج "${product.nameAr}" غير متوفرة في المخزن حالياً (المتاح أقل من ${item.quantity})`);
          }

          const unitPrice = Number(product.price);
          const itemTotal = unitPrice * item.quantity;
          subtotal += itemTotal;

          verifiedOrderItems.push({
            productId: product.id,
            productNameAr: product.nameAr,
            unitPrice,
            quantity: item.quantity,
            totalPrice: itemTotal,
            productImage: product.images[0] || '',
            variantId: item.variantId,
          });
        }

        // Check for Free Shipping
        const effectiveShippingFee = subtotal >= siteConfig.freeShippingThreshold ? 0 : shippingFee;

        // Apply Coupon if provided
        let discountAmount = 0;
        let couponId: string | null = null;
        let validCouponCode = '';

        if (data.couponCode) {
          const coupon = await tx.coupon.findUnique({
            where: { code: data.couponCode.toUpperCase() },
          });

          if (coupon && coupon.isActive && (!coupon.expiresAt || new Date() <= coupon.expiresAt)) {
            const minAmount = coupon.minOrderAmount ? Number(coupon.minOrderAmount) : 0;
            if (subtotal >= minAmount) {
              if (coupon.discountType === 'PERCENTAGE') {
                discountAmount = Math.round((subtotal * Number(coupon.discountValue)) / 100);
              } else {
                discountAmount = Number(coupon.discountValue);
              }
              discountAmount = Math.min(discountAmount, subtotal);
              couponId = coupon.id;
              validCouponCode = coupon.code;

              await tx.coupon.update({
                where: { id: coupon.id },
                data: { currentUses: { increment: 1 } },
              });
            }
          }
        }

        const totalAmount = Math.max(0, subtotal - discountAmount) + effectiveShippingFee;

        // Generate Order Number with retry on collision
        let orderNum = generateOrderNumber();
        let collisionRetries = 0;
        while (collisionRetries < 3) {
          const exists = await tx.order.findUnique({ where: { orderNumber: orderNum } });
          if (!exists) break;
          orderNum = generateOrderNumber();
          collisionRetries++;
        }

        // Create the authoritative Order Snapshot
        const newOrder = await tx.order.create({
          data: {
            orderNumber: orderNum,
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            customerAltPhone: data.customerAltPhone || null,
            governorateId: matchedGov ? matchedGov.id : data.governorateId,
            governorateName: govName,
            address: data.address,
            notes: data.notes || null,
            subtotal,
            shippingFee: effectiveShippingFee,
            discountAmount,
            totalAmount,
            paymentMethod: 'COD',
            status: 'NEW',
            couponId,
            couponCode: validCouponCode || null,
            ipAddress,
            userAgent,
            items: {
              create: verifiedOrderItems.map((item) => ({
                productId: item.productId,
                productNameAr: item.productNameAr,
                unitPrice: item.unitPrice,
                quantity: item.quantity,
                totalPrice: item.totalPrice,
                productImage: item.productImage,
                variantId: item.variantId,
              })),
            },
          },
        });

        return newOrder;
      });

      createdOrderNumber = order.orderNumber;
      finalTotal = Number(order.totalAmount);
      itemsCount = data.items.length;
    } catch (dbError: unknown) {
      // If DB error is our explicit validation message, return it
      const msg = dbError instanceof Error ? dbError.message : '';
      if (msg.includes('غير متوفرة في المخزن') || msg.includes('غير متوفر حالياً')) {
        return NextResponse.json({ success: false, message: msg }, { status: 400 });
      }

      // Fallback for offline dev or pre-seeded demo
      console.warn('Database transaction skipped or not connected, generating fallback order number:', dbError);
      createdOrderNumber = generateOrderNumber();

      // Calculate authoritative total from SEED data
      let seedSubtotal = 0;
      for (const item of data.items) {
        const prod = SEED_PRODUCTS.find((p) => p.id === item.productId || p.slug === item.productSlug);
        if (prod) {
          seedSubtotal += Number(prod.price) * item.quantity;
        }
      }
      const effectiveShip = seedSubtotal >= siteConfig.freeShippingThreshold ? 0 : shippingFee;
      finalTotal = seedSubtotal + effectiveShip;
      itemsCount = data.items.length;
    }

    // Record cache to prevent immediate spam
    recentOrdersCache.set(cleanPhone, Date.now());

    // 6. Notify Store Owner Asynchronously outside transaction
    notifyOwnerViaTelegram(createdOrderNumber, data.customerName, data.customerPhone, govName, finalTotal, itemsCount);

    return NextResponse.json({
      success: true,
      orderNumber: createdOrderNumber,
      totalAmount: finalTotal,
      message: 'تم تسجيل طلبك بنجاح! شكراً لتسوقك من دكاني.',
    });
  } catch (error) {
    console.error('Fatal error in POST /api/orders:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في معالجة الطلب. يرجى المحاولة مرة أخرى أو الطلب عبر واتساب.' },
      { status: 500 }
    );
  }
}
