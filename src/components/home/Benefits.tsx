import React from 'react';
import { Truck, ShieldCheck, RefreshCw, MessageSquareQuote } from 'lucide-react';

export const Benefits: React.FC = () => {
  const benefits = [
    {
      icon: <Truck className="w-6 h-6 text-emerald-600" />,
      title: 'توصيل سريع لجميع المحافظات',
      description: 'شحن فوري ومؤمن يغطي كافة محافظات مصر الـ 27 مع إمكانية تتبع مسار الشحنة.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      title: 'الدفع عند الاستلام (COD)',
      description: 'لا تحتاج لبطاقة بنكية، عاين منتجاتك وافحصها بنفسك أولاً ثم ادفع للمندوب نقداً.',
    },
    {
      icon: <RefreshCw className="w-6 h-6 text-emerald-600" />,
      title: 'ضمان الجودة واستبدال 14 يوماً',
      description: 'جميع منتجاتنا أصلية ومطابقة للوصف مع حق الإرجاع والاستبدال السلس والسهل.',
    },
    {
      icon: <MessageSquareQuote className="w-6 h-6 text-emerald-600" />,
      title: 'دعم مباشر ومتابعة عبر واتساب',
      description: 'فريق مبيعات متواجد لمساعدتك في اختيار المنتجات، الرد على الاستفسارات، وتأكيد طلبك.',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
            لماذا يفضل المتسوقون متجر دكاني؟
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            تجربة تسوق آمنة ومريحة من الباب للباب
          </h2>
        </div>

        {/* 4 Benefits Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition-all text-start flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100/80 flex items-center justify-center mb-4">
                  {b.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                  {b.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {b.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
