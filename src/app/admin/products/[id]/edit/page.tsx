import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ProductForm, ProductFormData } from '@/components/admin/ProductForm';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: EditProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    select: { nameAr: true },
  });

  return {
    title: product ? `تعديل: ${product.nameAr} | لوحة إدارة دكاني` : 'تعديل منتج',
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });

  if (!product) {
    notFound();
  }

  const initialData: ProductFormData = {
    id: product.id,
    nameAr: product.nameAr,
    nameEn: product.nameEn || '',
    slug: product.slug,
    descriptionAr: product.descriptionAr,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    costPrice: product.costPrice ? Number(product.costPrice) : null,
    stock: product.stock,
    categoryId: product.categoryId,
    brandId: product.brandId || '',
    images: product.images,
    badgeText: product.badgeText || '',
    features: (product.features as string[]) || [],
    isActive: product.isActive,
    isFeatured: product.isFeatured,
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-16" dir="rtl">
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            تعديل المنتج: {product.nameAr}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            عدل أي بيانات أو أسعار أو صور وسيتم تحديثها فوراً في قاعدة البيانات والمتجر
          </p>
        </div>

        <ProductForm initialData={initialData} isEdit={true} />
      </div>
    </div>
  );
}
