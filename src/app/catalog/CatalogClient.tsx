'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CatalogSection } from '@/components/catalog/CatalogSection';
import { ProductDetailView } from '@/components/product/ProductDetailView';
import { Product } from '@/types/store';
import { ProductCardData } from '@/components/product/ProductCard';
import { useCartStore } from '@/stores/cart';

interface CatalogClientProps {
  products: Product[];
}

export const CatalogClient: React.FC<CatalogClientProps> = ({ products }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearchQuery = searchParams.get('q') || '';

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const cartStore = useCartStore();

  const handleAddToCart = (productData: ProductCardData) => {
    const fullProduct = products.find((p) => p.id === productData.id || p.slug === productData.slug);
    if (fullProduct) {
      cartStore.addItem(fullProduct, 1);
    }
  };

  const handleOpenDetails = (productData: ProductCardData) => {
    const fullProduct = products.find((p) => p.id === productData.id || p.slug === productData.slug);
    if (fullProduct) {
      setSelectedProduct(fullProduct);
    } else {
      router.push(`/product/${productData.slug || productData.id}`);
    }
  };

  if (selectedProduct) {
    return (
      <ProductDetailView
        product={selectedProduct}
        allProducts={products}
        onBack={() => setSelectedProduct(null)}
        onAddToCart={(p, q) => cartStore.addItem(p, q)}
        onBuyNow={(p, q) => {
          cartStore.addItem(p, q);
          router.push('/checkout');
        }}
        onSelectProduct={(card) => {
          const next = products.find((p) => p.id === card.id || p.slug === card.slug);
          if (next) setSelectedProduct(next);
        }}
      />
    );
  }

  return (
    <CatalogSection
      products={products}
      onAddToCart={handleAddToCart}
      onOpenDetails={handleOpenDetails}
      initialCategory={initialCategory}
      initialSearchQuery={initialSearchQuery}
    />
  );
};
