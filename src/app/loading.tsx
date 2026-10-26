import { HeroSkeleton, ProductCardSkeleton } from '@/components/common/Skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 py-10" dir="rtl">
      <HeroSkeleton />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
