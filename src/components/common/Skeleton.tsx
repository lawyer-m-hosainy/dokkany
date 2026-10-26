import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-neutral-200/80 rounded-lg ${className}`}
      aria-hidden="true"
    />
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-neutral-200/80 rounded-2xl overflow-hidden flex flex-col p-4 space-y-4">
      {/* Image Skeleton */}
      <Skeleton className="aspect-[4/3] w-full rounded-xl" />

      {/* Meta Line */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-12" />
      </div>

      {/* Title */}
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Price & Rating */}
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-12" />
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-2">
        <Skeleton className="h-9 w-full rounded-xl" />
        <Skeleton className="h-9 w-full rounded-xl" />
      </div>
    </div>
  );
};

export const HeroSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-12 w-full max-w-lg" />
          <Skeleton className="h-5 w-full max-w-md" />
          <Skeleton className="h-5 w-2/3" />
          <div className="flex gap-4 pt-4">
            <Skeleton className="h-12 w-40 rounded-xl" />
            <Skeleton className="h-12 w-40 rounded-xl" />
          </div>
        </div>
        <div className="lg:col-span-5">
          <Skeleton className="h-80 sm:h-96 w-full rounded-3xl" />
        </div>
      </div>
    </div>
  );
};
