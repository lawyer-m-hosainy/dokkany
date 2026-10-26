import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({ className = 'h-10 w-auto', variant = 'light' }) => {
  const isDark = variant === 'dark';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Icon: Geometric Bag + 'د' Motif */}
      <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-bold text-xl shadow-sm shrink-0">
        <svg
          viewBox="0 0 40 40"
          className="w-6 h-6 fill-none stroke-current"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Shopping handle */}
          <path d="M14 16C14 12.6863 16.6863 10 20 10C23.3137 10 26 12.6863 26 16" />
          {/* Bag Body */}
          <path d="M10 16H30L28 32C28 33.1046 27.1046 34 26 34H14C12.8954 34 12 33.1046 12 32L10 16Z" fill="currentColor" fillOpacity="0.25" />
          {/* Checkmark badge */}
          <path d="M17 25L19.5 27.5L24 22" />
        </svg>
      </div>

      {/* Typography: Wordmark + Domain */}
      <div className="flex flex-col text-start">
        <span
          className={`text-2xl font-black tracking-tight leading-none ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          دكاني
        </span>
        <span className="text-[10px] font-bold text-emerald-600 tracking-wider font-mono mt-0.5">
          DOKKANY.SHOP
        </span>
      </div>
    </div>
  );
};
