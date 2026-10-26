/**
 * تطبيع النصوص العربية (Arabic Text Normalization):
 * - إزالة التشكيل والحركات والمد (Diacritics: Fatha, Damma, Kasra, Sukun, Tanween, Shadda, Tatweel)
 * - توحيد أشكال الألف: [أ, إ, آ, ٱ] -> ا
 * - توحيد التاء المربوطة والهاء: ة -> ه
 * - توحيد الياء والألف المقصورة: ى -> ي
 * - توحيد الكاف والهمزات الأخرى
 */
export function normalizeArabicText(text: string): string {
  if (!text) return '';

  return (
    text
      // إزالة التشكيل والتنوين والشدة
      .replace(/[\u064B-\u065F\u0670\u0617-\u061A]/g, '')
      // إزالة الكشيدة / التطويل (ـ)
      .replace(/\u0640/g, '')
      // توحيد جميع أشكال الألف
      .replace(/[أإآٱ]/g, 'ا')
      // توحيد التاء المربوطة إلى هاء للبحث المرن
      .replace(/ة/g, 'ه')
      // توحيد الألف المقصورة إلى ياء
      .replace(/ى/g, 'ي')
      // تنظيف الفراغات المتكررة
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase()
  );
}

/**
 * دالة التحقق من مطابقة البحث مع النصوص بعد التطبيع
 */
export function arabicSearchMatch(haystack: string, query: string): boolean {
  if (!query || !query.trim()) return true;
  if (!haystack) return false;

  const normalizedHaystack = normalizeArabicText(haystack);
  const normalizedQuery = normalizeArabicText(query);

  // تقسيم كلمات البحث للبحث عن كل كلمة بشكل مستقل (Multi-term matching)
  const queryTerms = normalizedQuery.split(' ').filter(Boolean);
  return queryTerms.every((term) => normalizedHaystack.includes(term));
}
