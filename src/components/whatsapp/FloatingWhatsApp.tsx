'use client';

import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { siteConfig } from '@/config/site';

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const handleOpenWhatsApp = (text: string) => {
    window.open(
      `https://wa.me/${siteConfig.whatsappPhone}?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer'
    );
    setIsOpen(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMsg.trim()) return;
    handleOpenWhatsApp(`مرحباً دكاني 👋\n${customMsg.trim()}`);
    setCustomMsg('');
  };

  return (
    <div className="fixed bottom-6 start-6 z-40 flex flex-col items-start font-sans" dir="rtl">
      {/* Quick Chat Popup Card */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-start animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
                د
              </div>
              <div>
                <h4 className="text-sm font-bold">خدمة عملاء دكاني</h4>
                <p className="text-[10px] text-emerald-100">
                  متواجدون للمساعدة الفورية وتأكيد الطلبات
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="إغلاق المحادثة"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Shortcuts */}
          <div className="p-4 space-y-3 bg-slate-50/70">
            <p className="text-xs text-slate-600">
              أهلاً بك في متجر دكاني! كيف تحب نساعدك اليوم؟
            </p>

            <div className="space-y-1.5">
              <button
                onClick={() => handleOpenWhatsApp('مرحباً دكاني، أرغب في تأكيد طلب منتج محدد عبر واتساب')}
                className="w-full text-start p-2.5 bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 rounded-xl border border-slate-200 text-xs font-bold transition-colors flex items-center justify-between"
              >
                <span>📦 أرغب في طلب منتج محدد</span>
                <span className="text-emerald-600 text-xs">←</span>
              </button>

              <button
                onClick={() => handleOpenWhatsApp('مرحباً دكاني، أود الاستفسار عن حالة شحنتي وموعد وصولها')}
                className="w-full text-start p-2.5 bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 rounded-xl border border-slate-200 text-xs font-bold transition-colors flex items-center justify-between"
              >
                <span>🚚 تتبع شحنة طلبي</span>
                <span className="text-emerald-600 text-xs">←</span>
              </button>

              <button
                onClick={() => handleOpenWhatsApp('مرحباً دكاني، أرغب في الاستفسار عن أسعار وعروض تجهيز المكاتب والشركات')}
                className="w-full text-start p-2.5 bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 rounded-xl border border-slate-200 text-xs font-bold transition-colors flex items-center justify-between"
              >
                <span>✨ استفسار عن طلبات الشركات والمكاتب</span>
                <span className="text-emerald-600 text-xs">←</span>
              </button>
            </div>

            {/* Custom Input */}
            <form onSubmit={handleCustomSubmit} className="pt-2 border-t border-slate-200 flex gap-2">
              <input
                type="text"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="اكتب استفسارك هنا..."
                className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
                title="إرسال عبر واتساب"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
        aria-label="تواصل مع مبيعات دكاني عبر واتساب"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="hidden sm:inline text-xs font-bold">تحدث مع المبيعات</span>
      </button>
    </div>
  );
};
