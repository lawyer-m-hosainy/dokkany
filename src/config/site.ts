/**
 * Dokkany Store Global Site Configuration
 */

export const siteConfig = {
  name: 'دكاني',
  nameEn: 'Dokkany',
  tagline: 'متجر الأدوات المكتبية وإكسسوارات التكنولوجيا',
  description:
    'متجر دكاني الإلكتروني - وجهتك الأولى في مصر للأدوات المكتبية والمدرسية، إكسسوارات الكمبيوتر، وإكسسوارات الهواتف الذكية مع الدفع عند الاستلام والتوصيل السريع لكافة المحافظات.',
  domain: 'dokkany.shop',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://dokkany.shop',
  email: 'info@dokkany.shop',
  // TODO(owner): تأكد من إعداد رقم واتساب التجاري الفعلي في متغير NEXT_PUBLIC_WHATSAPP_PHONE
  whatsappPhone: process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '201141973834',
  whatsappDisplay: process.env.NEXT_PUBLIC_WHATSAPP_DISPLAY || '01141973834',
  currency: 'ج.م',
  freeShippingThreshold: 500, // حد الشحن المجاني (ج.م)
  defaultShippingFee: 40, // الشحن الافتراضي
};

export interface GovernorateData {
  id: string;
  nameAr: string;
  nameEn: string;
  shippingFee: number;
}

export const EGYPTIAN_GOVERNORATES: GovernorateData[] = [
  { id: 'cairo', nameAr: 'القاهرة', nameEn: 'Cairo', shippingFee: 40 },
  { id: 'giza', nameAr: 'الجيزة', nameEn: 'Giza', shippingFee: 40 },
  { id: 'qalyubia', nameAr: 'القليوبية', nameEn: 'Qalyubia', shippingFee: 45 },
  { id: 'alexandria', nameAr: 'الإسكندرية', nameEn: 'Alexandria', shippingFee: 45 },
  { id: 'beheira', nameAr: 'البحيرة', nameEn: 'Beheira', shippingFee: 50 },
  { id: 'matrouh', nameAr: 'مطروح', nameEn: 'Matrouh', shippingFee: 75 },
  { id: 'gharbia', nameAr: 'الغربية', nameEn: 'Gharbia', shippingFee: 50 },
  { id: 'monufia', nameAr: 'المنوفية', nameEn: 'Monufia', shippingFee: 50 },
  { id: 'dakahlia', nameAr: 'الدقهلية', nameEn: 'Dakahlia', shippingFee: 50 },
  { id: 'sharkia', nameAr: 'الشرقية', nameEn: 'Sharkia', shippingFee: 50 },
  { id: 'kafr-el-sheikh', nameAr: 'كفر الشيخ', nameEn: 'Kafr El Sheikh', shippingFee: 50 },
  { id: 'damietta', nameAr: 'دمياط', nameEn: 'Damietta', shippingFee: 50 },
  { id: 'port-said', nameAr: 'بورسعيد', nameEn: 'Port Said', shippingFee: 50 },
  { id: 'ismailia', nameAr: 'الإسماعيلية', nameEn: 'Ismailia', shippingFee: 50 },
  { id: 'suez', nameAr: 'السويس', nameEn: 'Suez', shippingFee: 50 },
  { id: 'fayoum', nameAr: 'الفيوم', nameEn: 'Fayoum', shippingFee: 55 },
  { id: 'beni-suef', nameAr: 'بني سويف', nameEn: 'Beni Suef', shippingFee: 55 },
  { id: 'minya', nameAr: 'المنيا', nameEn: 'Minya', shippingFee: 60 },
  { id: 'asyut', nameAr: 'أسيوط', nameEn: 'Asyut', shippingFee: 60 },
  { id: 'sohag', nameAr: 'سوهاج', nameEn: 'Sohag', shippingFee: 65 },
  { id: 'qena', nameAr: 'قنا', nameEn: 'Qena', shippingFee: 70 },
  { id: 'luxor', nameAr: 'الأقصر', nameEn: 'Luxor', shippingFee: 70 },
  { id: 'aswan', nameAr: 'أسوان', nameEn: 'Aswan', shippingFee: 75 },
  { id: 'red-sea', nameAr: 'البحر الأحمر', nameEn: 'Red Sea', shippingFee: 80 },
  { id: 'new-valley', nameAr: 'الوادي الجديد', nameEn: 'New Valley', shippingFee: 85 },
  { id: 'south-sinai', nameAr: 'جنوب سيناء', nameEn: 'South Sinai', shippingFee: 80 },
  { id: 'north-sinai', nameAr: 'شمال سيناء', nameEn: 'North Sinai', shippingFee: 85 },
];

export const CATEGORIES_CONFIG = [
  {
    slug: 'stationery',
    nameAr: 'أدوات مكتبية ومدرسية',
    nameEn: 'Stationery & School',
    descriptionAr: 'دفاتر جلدية فاخرة، أقلام راقية، منظمات مكتبية ومستلزمات دراسية متينة.',
    image: '/images/cat_stationery_supplies.jpg',
  },
  {
    slug: 'computer',
    nameAr: 'إكسسوارات كمبيوتر ولابتوب',
    nameEn: 'Computer Accessories',
    descriptionAr: 'كيبوردات ميكانيكية، ماوسات مريحة، كابلات شاشات وموزعات USB للإنتاجية.',
    image: '/images/cat_computer_gear.jpg',
  },
  {
    slug: 'mobile',
    nameAr: 'إكسسوارات موبايل',
    nameEn: 'Mobile Accessories',
    descriptionAr: 'سماعات أصلية، كابلات شحن مدرعة، جرابات حماية فخمة وحوامل شحن لاسلكي.',
    image: '/images/cat_mobile_accessories.jpg',
  },
];
