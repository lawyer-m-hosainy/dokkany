# 🛒 متجر دكاني (Dokkany Store) - dokkany.shop

متجر إلكتروني متكامل للجمهورية المصرية، متخصص في:
- 📚 الأدوات المكتبية والمدرسية
- 💻 إكسسوارات الكمبيوتر واللابتوب
- 📱 إكسسوارات الهواتف الذكية والأجهزة المحمولة

مبني بنظام **الدفع عند الاستلام (COD)** مع دعم كامل لحساب مصاريف الشحن لـ **27 محافظة مصرية**، وتأكيد الطلبات عبر **واتساب**.

---

## 🛠️ التقنيات المستخدمة (Tech Stack)

- **Framework:** [Next.js 14+ (App Router)](https://nextjs.org/) مع React 18
- **Language:** TypeScript 5.7+
- **Styling:** Tailwind CSS 3.4 مع دعم اللغة العربية واتجاه RTL وخط Cairo عبر `next/font/google`
- **Database:** PostgreSQL عبر Prisma ORM (Neon / Supabase)
- **State Management:** Zustand 5 مع دعم persist في LocalStorage ومعالجة الـ Hydration
- **Data Validation:** Zod للتحقق الصارم في الخادم والواجهة
- **Authentication:** JWT عبر مكتبة `jose` بملفات تعريف الارتباط المشفرة `httpOnly + secure`
- **Security:** Anti-bot Honeypots، حماية تكرار الطلبات، خصم المخزون الذري في Transactions لمنع بيع منتجات نافدة
- **Testing:** Standalone Suite (Phone Regex, Server Pricing, Arabic Normalization, Order Numbers)

---

## 🚀 التشغيل المحلي (Getting Started)

### 1. تثبيت الحزم
```bash
npm install --legacy-peer-deps
```

### 2. إعداد قاعدة البيانات وتوليد Prisma Client
```bash
# توليد عميل بريزما
npx prisma generate

# في حالة الاتصال بقاعدة بيانات حية (Neon / Supabase):
# npx prisma migrate deploy
# npm run db:seed
```

### 3. تشغيل خادم التطوير
```bash
npm run dev
```
افتح المتصفح على [http://localhost:3000](http://localhost:3000).

---

## 🧪 أوامر الجودة والاختبارات

```bash
# فحص الأنواع (TypeScript Check)
npm run typecheck

# فحص الأكواد ومطابقة المعايير (Lint)
npm run lint

# تشغيل الاختبارات الآلية
npm test

# بناء نسخة الإنتاج الكاملة
npm run build
```

---

## 🔐 لوحة الإدارة (Admin Panel)

- **الرابط:** `/admin`
- **صفحة الدخول:** `/admin/login`
- **البريد الافتراضي:** `admin@dokkany.shop`
- **كلمة المرور الافتراضية:** `AdminChangeThis123!` (يمكن تغييرها من خلال متغير `ADMIN_DEFAULT_PASSWORD` في `.env`)

### مميزات لوحة الإدارة:
1. إحصائيات فورية بالمبيعات والطلبات الجديدة.
2. إدارة حالة الطلب (جديد ← مؤكد ← مشحون ← تم التسليم ← ملغي ← مرتجع).
3. **استرجاع تلقائي للمخزون** إلى قاعدة البيانات في حالة الإلغاء أو المرتجع.
4. طباعة فاتورة رسمية وبوليصة شحن للمندوب.
5. تصدير كافة الطلبات بصيغة CSV.

---

## 🌐 النشر على Vercel

1. ارفع المشروع إلى GitHub (Private Repository).
2. أنشئ مشروعاً جديداً على [Vercel](https://vercel.com).
3. أضف متغيرات البيئة من ملف `.env.example`:
   - `DATABASE_URL` و `DIRECT_URL` (من Neon أو Supabase).
   - `ADMIN_JWT_SECRET` (مفتاح عشوائي بطول 64 حرفاً).
   - `ADMIN_DEFAULT_PASSWORD` (كلمة مرور قوية).
   - `NEXT_PUBLIC_WHATSAPP_PHONE` (رقم واتساب المبيعات بصيغة 2010xxxxxxxx).
   - `NEXT_PUBLIC_APP_URL` (`https://dokkany.shop`).
   - `TELEGRAM_BOT_TOKEN` و `TELEGRAM_CHAT_ID` (اختياري للإشعارات الفورية).
4. اضغط **Deploy**.
