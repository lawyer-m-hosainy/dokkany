import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import {
  SEED_GOVERNORATES,
  SEED_CATEGORIES,
  SEED_BRANDS,
  SEED_PRODUCTS,
} from './seedData';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Dokkany database seeding...');

  // 1. Seed Admin User
  const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@dokkany.shop';
  const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'AdminChangeThis123!';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      name: 'Dokkany Super Admin',
      passwordHash,
      role: 'SUPER_ADMIN',
    },
  });
  console.log(`✅ Admin user seeded: ${admin.email}`);

  // 2. Seed 27 Governorates
  console.log('📍 Seeding Egyptian Governorates...');
  for (const gov of SEED_GOVERNORATES) {
    await prisma.governorate.upsert({
      where: { nameAr: gov.nameAr },
      update: {
        shippingFee: gov.shippingFee,
        sortOrder: gov.sortOrder,
      },
      create: {
        nameAr: gov.nameAr,
        nameEn: gov.nameEn,
        shippingFee: gov.shippingFee,
        sortOrder: gov.sortOrder,
        isActive: true,
      },
    });
  }
  console.log(`✅ ${SEED_GOVERNORATES.length} Governorates seeded.`);

  // 3. Seed Categories
  console.log('🏷️ Seeding Categories...');
  for (const cat of SEED_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        nameAr: cat.nameAr,
        nameEn: cat.nameEn,
        descriptionAr: cat.descriptionAr,
        imageUrl: cat.imageUrl,
        sortOrder: cat.sortOrder,
      },
      create: {
        id: cat.id,
        slug: cat.slug,
        nameAr: cat.nameAr,
        nameEn: cat.nameEn,
        descriptionAr: cat.descriptionAr,
        imageUrl: cat.imageUrl,
        sortOrder: cat.sortOrder,
        isActive: true,
      },
    });
  }
  console.log(`✅ ${SEED_CATEGORIES.length} Categories seeded.`);

  // 4. Seed Brands
  console.log('🏢 Seeding Brands...');
  for (const brand of SEED_BRANDS) {
    const brandLogo = 'logoUrl' in brand ? (brand as { logoUrl?: string }).logoUrl : undefined;
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: {
        nameAr: brand.nameAr,
        nameEn: brand.nameEn,
        logoUrl: brandLogo,
      },
      create: {
        id: brand.id,
        slug: brand.slug,
        nameAr: brand.nameAr,
        nameEn: brand.nameEn,
        logoUrl: brandLogo,
        isActive: true,
      },
    });
  }
  console.log(`✅ ${SEED_BRANDS.length} Brands seeded.`);

  // 5. Seed 14 Real Products
  console.log('📦 Seeding Products...');
  for (const prod of SEED_PRODUCTS) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        nameAr: prod.nameAr,
        nameEn: prod.nameEn,
        descriptionAr: prod.descriptionAr,
        price: prod.price,
        compareAtPrice: prod.compareAtPrice,
        costPrice: prod.costPrice,
        stock: prod.stock,
        images: prod.images,
        isFeatured: prod.isFeatured,
        soldCount: prod.soldCount,
        badgeText: prod.badgeText,
        features: prod.features || [],
        specs: prod.specs || undefined,
        categoryId: prod.categoryId,
        brandId: prod.brandId,
      },
      create: {
        id: prod.id,
        slug: prod.slug,
        nameAr: prod.nameAr,
        nameEn: prod.nameEn,
        descriptionAr: prod.descriptionAr,
        price: prod.price,
        compareAtPrice: prod.compareAtPrice,
        costPrice: prod.costPrice,
        stock: prod.stock,
        images: prod.images,
        isFeatured: prod.isFeatured,
        soldCount: prod.soldCount,
        badgeText: prod.badgeText,
        features: prod.features || [],
        specs: prod.specs || undefined,
        categoryId: prod.categoryId,
        brandId: prod.brandId,
        isActive: true,
      },
    });
  }
  console.log(`✅ ${SEED_PRODUCTS.length} Products seeded.`);

  // 6. Seed Sample Active Coupon
  const sampleCoupon = await prisma.coupon.upsert({
    where: { code: 'DOKKANY10' },
    update: {
      discountType: 'PERCENTAGE',
      discountValue: 10,
      isActive: true,
    },
    create: {
      code: 'DOKKANY10',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderAmount: 100,
      maxUses: 1000,
      isActive: true,
    },
  });
  console.log(`✅ Coupon seeded: ${sampleCoupon.code}`);

  console.log('✨ Dokkany database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
