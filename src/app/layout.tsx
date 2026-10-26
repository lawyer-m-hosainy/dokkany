import type { Metadata, Viewport } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { FloatingWhatsApp } from '@/components/whatsapp/FloatingWhatsApp';
import { siteConfig } from '@/config/site';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-cairo',
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const viewport: Viewport = {
  themeColor: '#059669',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'متجر دكاني',
    'أدوات مكتبية مصر',
    'إكسسوارات كمبيوتر مصر',
    'سماعات أصلية',
    'كابلات شحن',
    'الدفع عند الاستلام مصر',
    'شحن لجميع المحافظات',
    'dokkany shop',
  ],
  authors: [{ name: 'Dokkany Store' }],
  creator: 'Dokkany',
  openGraph: {
    type: 'website',
    locale: 'ar_EG',
    url: siteConfig.url,
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: '/images/hero_dokkany_workspace.jpg',
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - متجر الأدوات المكتبية وإكسسوارات التكنولوجيا`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: ['/images/hero_dokkany_workspace.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-emerald-500 selection:text-white flex flex-col justify-between">
        <Header />
        <main className="flex-1">{children}</main>
        <CartDrawer />
        <FloatingWhatsApp />
        <Footer />
      </body>
    </html>
  );
}
