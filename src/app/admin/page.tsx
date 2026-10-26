'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  LogOut,
  Search,
  Filter,
  Printer,
  Download,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { formatPrice } from '@/lib/formatters';

interface AdminOrderItem {
  id: string;
  productNameAr: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productImage?: string;
}

interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAltPhone?: string;
  governorateName: string;
  address: string;
  notes?: string;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: string;
  status: 'NEW' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED';
  couponCode?: string;
  createdAt: string;
  items: AdminOrderItem[];
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  NEW: { label: 'طلب جديد', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  CONFIRMED: { label: 'تم التأكيد', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  SHIPPED: { label: 'تم الشحن', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
  DELIVERED: { label: 'تم التسليم والتحصيل', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  CANCELLED: { label: 'ملغي (مسترد للمخزن)', color: 'bg-rose-100 text-rose-800 border-rose-300' },
  RETURNED: { label: 'مرتجع شحن (مسترد للمخزن)', color: 'bg-slate-100 text-slate-800 border-slate-300' },
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<AdminOrder | null>(null);

  const fetchOrders = React.useCallback(async () => {
    setIsLoading(true);
    try {
      let url = '/api/admin/orders?limit=50';
      if (filterStatus !== 'all') url += `&status=${filterStatus}`;
      if (searchQuery.trim()) url += `&q=${encodeURIComponent(searchQuery.trim())}`;

      const res = await fetch(url);
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filterStatus, searchQuery, router]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as AdminOrder['status'] } : o))
        );
      }
    } catch (err) {
      console.error('Error updating order:', err);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const exportCSV = () => {
    if (orders.length === 0) return;
    const headers = ['رقم الطلب,الاسم,الهاتف,المحافظة,العنوان,الحالة,الإجمالي,التاريخ'];
    const rows = orders.map(
      (o) =>
        `"${o.orderNumber}","${o.customerName}","${o.customerPhone}","${o.governorateName}","${o.address.replace(/"/g, '""')}","${o.status}","${o.totalAmount}","${new Date(o.createdAt).toLocaleDateString('ar-EG')}"`
    );
    const csvContent = '\uFEFF' + [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `dokkany-orders-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Stats calculation
  const totalOrders = orders.length;
  const newOrders = orders.filter((o) => o.status === 'NEW').length;
  const deliveredOrders = orders.filter((o) => o.status === 'DELIVERED').length;
  const totalDeliveredRevenue = orders
    .filter((o) => o.status === 'DELIVERED')
    .reduce((sum, o) => sum + Number(o.totalAmount), 0);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-16" dir="rtl">
      {/* Admin Top Navigation */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Logo variant="dark" />
            <span className="hidden sm:inline-block text-xs bg-emerald-600/30 text-emerald-400 font-bold px-2.5 py-1 rounded-md border border-emerald-500/30">
              لوحة الإدارة
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors"
            >
              عرض المتجر ↗
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
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-start">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-bold mb-1">إجمالي الطلبات المعروضة</p>
              <p className="text-2xl font-black text-slate-900 tabular-nums">{totalOrders}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-bold mb-1">طلبات جديدة في الانتظار</p>
              <p className="text-2xl font-black text-amber-600 tabular-nums">{newOrders}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-bold mb-1">طلبات تم تسليمها وتحصيلها</p>
              <p className="text-2xl font-black text-emerald-600 tabular-nums">{deliveredOrders}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-bold mb-1">المبالغ المحصلة فعلياً (COD)</p>
              <p className="text-2xl font-black text-slate-900 tabular-nums">
                {formatPrice(totalDeliveredRevenue)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filter and Action Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث برقم الطلب، اسم العميل، أو الهاتف..."
                className="w-full ps-9 pe-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shrink-0"
            >
              بحث
            </button>
          </form>

          {/* Status Tabs and Export */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-800 font-bold"
            >
              <option value="all">كافة الحالات</option>
              <option value="NEW">طلبات جديدة</option>
              <option value="CONFIRMED">تم التأكيد</option>
              <option value="SHIPPED">تم الشحن</option>
              <option value="DELIVERED">تم التسليم والتحصيل</option>
              <option value="CANCELLED">ملغي</option>
              <option value="RETURNED">مرتجع</option>
            </select>

            <button
              onClick={exportCSV}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تصدير CSV</span>
            </button>

            <button
              onClick={fetchOrders}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
              title="تحديث البيانات"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="py-3 px-4">رقم الطلب</th>
                  <th className="py-3 px-4">العميل</th>
                  <th className="py-3 px-4">المحافظة والعنوان</th>
                  <th className="py-3 px-4">المنتجات</th>
                  <th className="py-3 px-4">الإجمالي</th>
                  <th className="py-3 px-4">الحالة</th>
                  <th className="py-3 px-4">تغيير الحالة</th>
                  <th className="py-3 px-4 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <span>جاري تحميل الطلبات...</span>
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      لا توجد طلبات مسجلة مطابقة للبحث حالياً.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const statusConfig = STATUS_LABELS[order.status] || {
                      label: order.status,
                      color: 'bg-slate-100 text-slate-800',
                    };

                    return (
                      <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          #{order.orderNumber}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-900">{order.customerName}</p>
                          <a
                            href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-700 hover:underline font-mono"
                          >
                            {order.customerPhone}
                          </a>
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <span className="font-bold text-slate-800 block">{order.governorateName}</span>
                          <span className="text-slate-500 text-[11px] truncate block">{order.address}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-700 tabular-nums">
                            {order.items?.length || 0} صنف
                          </span>
                        </td>
                        <td className="py-3 px-4 font-black text-slate-900 tabular-nums">
                          {formatPrice(order.totalAmount)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-bold border ${statusConfig.color}`}
                          >
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                            className="px-2 py-1 text-xs border border-slate-300 rounded-lg bg-white"
                          >
                            <option value="NEW">طلب جديد</option>
                            <option value="CONFIRMED">تم التأكيد</option>
                            <option value="SHIPPED">تم الشحن</option>
                            <option value="DELIVERED">تم التسليم والتحصيل</option>
                            <option value="CANCELLED">إلغاء واسترداد المخزون</option>
                            <option value="RETURNED">مرتجع واسترداد المخزون</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => setSelectedOrderForInvoice(order)}
                            className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg"
                            title="طباعة الفاتورة وبوليصة الشحن"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Invoice / Shipping Waybill Printable Modal */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl space-y-6 text-start max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <Logo />
                <h3 className="text-base font-black text-slate-900 mt-2">بوليصة شحن وفاتورة استلام نقدي</h3>
              </div>
              <div className="text-end">
                <span className="text-sm font-black font-mono block">#{selectedOrderForInvoice.orderNumber}</span>
                <span className="text-xs text-slate-500">
                  {new Date(selectedOrderForInvoice.createdAt).toLocaleDateString('ar-EG')}
                </span>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl text-xs">
              <div>
                <span className="text-slate-500 block">اسم المستلم:</span>
                <strong className="text-slate-900">{selectedOrderForInvoice.customerName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">الهاتف:</span>
                <strong className="font-mono text-slate-900">{selectedOrderForInvoice.customerPhone}</strong>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500 block">عنوان الشحن:</span>
                <strong className="text-slate-900">
                  {selectedOrderForInvoice.governorateName} - {selectedOrderForInvoice.address}
                </strong>
              </div>
              {selectedOrderForInvoice.notes && (
                <div className="col-span-2">
                  <span className="text-slate-500 block">ملاحظات التوصيل:</span>
                  <span className="text-slate-700">{selectedOrderForInvoice.notes}</span>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700">محتويات الشحنة:</h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-start">
                  <thead className="bg-slate-100 font-bold">
                    <tr>
                      <th className="py-2 px-3">المنتج</th>
                      <th className="py-2 px-3">الكمية</th>
                      <th className="py-2 px-3">السعر</th>
                      <th className="py-2 px-3">الإجمالي</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedOrderForInvoice.items.map((it, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-3 font-bold">{it.productNameAr}</td>
                        <td className="py-2 px-3 tabular-nums">{it.quantity}</td>
                        <td className="py-2 px-3 tabular-nums">{formatPrice(it.unitPrice)}</td>
                        <td className="py-2 px-3 tabular-nums font-bold">{formatPrice(it.totalPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total Calculation */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-sm">
              <span className="font-bold text-emerald-900">المبلغ المطلوب تحصيله نقداً (COD):</span>
              <span className="text-xl font-black text-emerald-800 tabular-nums">
                {formatPrice(selectedOrderForInvoice.totalAmount)}
              </span>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                onClick={() => setSelectedOrderForInvoice(null)}
                className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200"
              >
                إغلاق
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة البوليصة</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
