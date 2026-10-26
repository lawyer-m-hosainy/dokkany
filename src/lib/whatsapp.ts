import { CartItem, Order, Product } from '@/types/store';
import { siteConfig } from '@/config/site';

/**
 * Clean phone number for WhatsApp deep link (removes + and spaces)
 */
export function formatPhoneForWhatsApp(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

/**
 * Generate direct WhatsApp link for ordering a single product
 */
export function generateProductWhatsAppUrl(
  product: Product,
  quantity = 1,
  color?: string
): string {
  const phone = formatPhoneForWhatsApp(siteConfig.whatsappPhone);

  const text = `مرحباً دكاني 👋
أرغب في الاستفسار والطلب المباشر للمنتج التالي:

📦 *${product.nameAr}*
🔹 *العلامة التجارية:* ${product.brand}
🔹 *الكمية المطلوبة:* ${quantity}
${color ? `🔹 *اللون/النوع:* ${color}\n` : ''}💰 *السعر:* ${product.price * quantity} ${siteConfig.currency}
🔗 *رابط المتجر:* ${siteConfig.url}/product/${product.slug || product.id}

هل المنتج متوفر حالياً لإتمام الشحن وتأكيد تفاصيل التوصيل؟`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

/**
 * Generate comprehensive WhatsApp Order confirmation message for a full cart order
 */
export function generateOrderWhatsAppUrl(order: Order): string {
  const phone = formatPhoneForWhatsApp(siteConfig.whatsappPhone);

  const itemsList = order.items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.product.nameAr}*\n   الكمية: ${item.quantity} × ${item.product.price} = ${item.quantity * item.product.price} ${siteConfig.currency}`
    )
    .join('\n\n');

  const text = `🎉 *تأكيد طلب عبر متجر دكاني*
━━━━━━━━━━━━━━━━━━━━
🔖 *رقم الطلب:* #${order.orderId}
📅 *التاريخ:* ${new Date(order.createdAt).toLocaleDateString('ar-EG', { dateStyle: 'long' })}

👤 *بيانات العميل المستلم:*
• الاسم: ${order.customer.fullName}
• الهاتف: ${order.customer.phone}
• المحافظة: ${order.customer.governorate}
• العنوان: ${order.customer.address}
${order.customer.notes ? `• ملاحظات التوصيل: ${order.customer.notes}\n` : ''}
🛒 *المنتجات المطلوبة:*
${itemsList}

━━━━━━━━━━━━━━━━━━━━
💵 *تفاصيل الحساب:*
• المجموع الفرعي: ${order.subtotal} ${siteConfig.currency}
• الخصم: ${order.discount > 0 ? `-${order.discount} ${siteConfig.currency}` : 'لا يوجد'}
• مصاريف الشحن: ${order.shippingFee === 0 ? 'شحن مجاني 🎁' : `${order.shippingFee} ${siteConfig.currency}`}
⭐ *الإجمالي النهائي المطلوب:* *${order.total} ${siteConfig.currency}*
💳 *طريقة الدفع:* الدفع عند الاستلام (COD)

أرغب في تأكيد الطلب وتحديد موعد تسليم الشحنة. شكراً لكم!`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

/**
 * General Help/Customer Service WhatsApp link
 */
export function generateSupportWhatsAppUrl(topic = 'عام'): string {
  const phone = formatPhoneForWhatsApp(siteConfig.whatsappPhone);
  const text = `مرحباً فريق دكاني Dokkany 🙋‍♂️
أرغب في المساعدة بخصوص: ${topic}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
