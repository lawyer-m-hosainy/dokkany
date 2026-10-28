'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Package,
  Layers,
  PlusCircle,
  ExternalLink,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { Logo } from '@/components/common/Logo';

export function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      router.push('/admin/login');
    }
  };

  const navItems = [
    {
      label: 'الطلبات والمبيعات',
      href: '/admin',
      icon: Package,
      active: pathname === '/admin',
    },
    {
      label: 'إدارة المنتجات',
      href: '/admin/products',
      icon: Layers,
      active: pathname.startsWith('/admin/products') && pathname !== '/admin/products/new',
    },
    {
      label: 'إضافة منتج جديد',
      href: '/admin/products/new',
      icon: PlusCircle,
      active: pathname === '/admin/products/new',
      highlight: true,
    },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Badge */}
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-2">
            <Logo className="h-7 w-auto" />
            <div className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>لوحة الإدارة</span>
            </div>
          </Link>

          {/* Navigation Tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 ms-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    item.active
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/30'
                      : item.highlight
                      ? 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">عرض المتجر</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-lg border border-rose-500/30 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>خروج</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Sub-bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800/80 px-2 py-2 bg-slate-950/60">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${
                item.active
                  ? 'bg-emerald-600 text-white'
                  : item.highlight
                  ? 'text-emerald-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
