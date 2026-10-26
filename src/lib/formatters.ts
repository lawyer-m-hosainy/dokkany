/**
 * Dokkany Price & Number Formatter
 * دالة مرنة قابلة للتبديل لعرض الأرقام والأسعار بصيغة عربية مشرقية (١٥٠ ج.م) أو غربية (150 ج.م)
 */

export type NumeralSystem = 'western' | 'eastern'; // 'western' = 123, 'eastern' = ١٢٣

const EASTERN_ARABIC_DIGITS: Record<string, string> = {
  '0': '٠',
  '1': '١',
  '2': '٢',
  '3': '٣',
  '4': '٤',
  '5': '٥',
  '6': '٦',
  '7': '٧',
  '8': '٨',
  '9': '٩',
  '.': '٫',
};

/**
 * تحويل الأرقام الإنجليزية إلى أرقام عربية مشرقية
 */
export function toEasternArabicNumerals(numStr: string | number): string {
  return String(numStr).replace(/[0-9.]/g, (char) => EASTERN_ARABIC_DIGITS[char] || char);
}

/**
 * الدالة المركزية لتنسيق أسعار المتجر
 * @param price القيمة الرقمية
 * @param numeralSystem نظام الأرقام ('western' = 150 ج.م | 'eastern' = ١٥٠ ج.م) - الافتراضي western لسهولة قراءة المستخدم المصري
 * @param includeCurrency تضمين عملة "ج.م"
 */
export function formatPrice(
  price: number | string,
  numeralSystem: NumeralSystem = 'western',
  includeCurrency = true
): string {
  const numericVal = typeof price === 'string' ? parseFloat(price) : price;
  const rounded = Number.isInteger(numericVal) ? numericVal.toString() : numericVal.toFixed(2);

  const formattedNum = numeralSystem === 'eastern'
    ? toEasternArabicNumerals(rounded)
    : rounded;

  if (!includeCurrency) {
    return formattedNum;
  }

  return `${formattedNum} ج.م`;
}

/**
 * التحقق من صحة أرقام الهواتف المصرية (010, 011, 012, 015)
 */
export function isValidEgyptianPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s-+]/g, '');
  // يقبل 01012345678 أو 201012345678 أو +201012345678
  const regex = /^(?:\+?20|0)?1[0125]\d{8}$/;
  return regex.test(cleaned);
}

/**
 * توحيد رقم الهاتف للصيغة الدولية لواتساب (2010xxxxxxxx)
 */
export function normalizePhoneForWhatsApp(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('01')) {
    cleaned = '2' + cleaned;
  } else if (cleaned.startsWith('002')) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.startsWith('1') && cleaned.length === 10) {
    cleaned = '20' + cleaned;
  }
  return cleaned;
}
