import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Package, Truck, MapPin, CreditCard, CheckCircle2,
  User, Phone, ArrowLeft, Contact, Mail, Calendar, Download, Printer
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAppStore } from '@/store/useAppStore';
import { OrderProduct } from '@/store/slices/orderSlice';
import PrintInvoice from '@/components/Invoice/PrintInvoice';
import { usePrintInvoice } from '@/hooks/usePrintInvoice';
import { OrderForPrint } from '@/hooks/usePrintInvoice';

// Interfaces removed - using store Order type

// ─── Component ─────────────────────────────────────────────
const OrderDetails = () => {
  const { t } = useTranslation("global");
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const orderNoFromQuery = searchParams.get('order');
  const { id, orderNo: orderNoFromState } = location.state || {};
  const effectiveOrderNo = orderNoFromQuery || orderNoFromState || id?.toString?.() || '';

  const {
    currentOrder: order,
    isOrderDetailsLoading: loading,
    fetchOrderDetails,
    studentProfile,
    personalInfo
  } = useAppStore();

  const [error, setError] = useState("");
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';
  const { printInvoice } = usePrintInvoice();

  useEffect(() => {
    if (!effectiveOrderNo) {
      setError(t("orderDetails.errorNotFound") || "No order number provided.");
      return;
    }
    fetchOrderDetails(effectiveOrderNo);
  }, [effectiveOrderNo, fetchOrderDetails, t]);

  // Shipping info can be derived from the currentOrder or store addresses
  const shippingInfo = order?.student_address || null;

  // Buyer profile - prefer order's student data if available (from backend response)
  // Fallback to logged-in studentProfile and personalInfo from store
  const buyerProfile = order?.student
    ? { student: order.student, personal_info: order.student.personal_info }
    : studentProfile
      ? { student: studentProfile, personal_info: personalInfo }
      : null;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-400 animate-pulse">
          <Package className="w-12 h-12 animate-bounce" />
          <span className="font-medium tracking-wider">LOADING...</span>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <p className="text-red-600 font-medium mb-6">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium"
        >
          Go Back
        </button>
      </div>
    );
  }

  const subtotal = Number(order.total) - Number(order.delivery_charge);
  const totalItems = order.products?.reduce((sum: number, p: OrderProduct) => sum + Number(p.quantity || 0), 0) || 0;

  const statuses = [
    "Order Placed", "Processing", "Packaging", "Sent To Courier",
    "Ready To Courier", "On The Way", "Delivered", "Returned"
  ];

  const currentStatusIndex = statuses.findIndex(s =>
    order.status.toLowerCase().includes(s.toLowerCase())
  );
  const activeIndex = currentStatusIndex >= 0 ? currentStatusIndex : 0;
  const isReturned = order.status.toLowerCase().includes("returned");

  return (
    <div className="min-h-screen bg-slate-50/40 print-wrapper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 space-y-6 lg:space-y-8">
        {/* Print styles */}
        <style>{`
          @media print {
            @page { margin: 10mm; size: A4 portrait; }
            .no-print, header, nav, footer, .fixed, .backdrop-blur,
            .screen-only { display: none !important; }
            .print-only { display: block !important; }
            body, html { background: white !important; color: black !important; margin: 0 !important; padding: 0 !important; }
            .print-wrapper { all: unset; display: block !important; }
            .print-wrapper > * { all: unset; display: block !important; }
          }
        `}</style>

        {/* Print Invoice — hidden on screen, visible when printing */}
        <PrintInvoice
          order={{
            order_no: order.order_no,
            created_at: order.created_at,
            status: order.status,
            total: order.total,
            delivery_charge: order.delivery_charge,
            user_name: order.user_name,
            user_phone: order.user_phone,
            user_address: order.user_address,
            products: order.products,
            payment: order.payment,
            student: order.student,
            student_address: order.student_address,
          }}
          shippingInfo={shippingInfo}
          buyerProfile={buyerProfile}
          baseURL={baseURL}
        />



        {/* ── Screen Header (no-print) ── */}
        <div className="screen-only bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Left: logo + tagline */}
          <div className="flex items-center gap-3">
            <img src="/image/logo/logo.jpg" alt="Golden Life" className="h-10 sm:h-12 object-contain" />
            <div className="hidden sm:block">

            </div>
          </div>
          {/* Right: company info + print button */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                const orderForPrint: OrderForPrint = {
                  order_no: order.order_no,
                  created_at: order.created_at,
                  status: order.status,
                  total: order.total,
                  delivery_charge: order.delivery_charge,
                  user_name: order.user_name,
                  user_phone: order.user_phone,
                  user_address: order.user_address,
                  products: order.products,
                  payment: order.payment,
                };
                printInvoice(orderForPrint);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg flex items-center gap-2 text-sm font-semibold transition shadow-sm"
            >
              <Printer size={15} />
              PRINT RECEIPT
            </button>
          </div>
        </div>

        {/* Title + Status */}
        <div className="screen-only flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Order #{effectiveOrderNo}
              </h1>
              <span
                className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${isReturned ? 'bg-red-100 text-red-700' :
                  order.status.toLowerCase().includes('delivered') ? 'bg-emerald-100 text-emerald-700' :
                    order.status.toLowerCase().includes('way') || order.status.toLowerCase().includes('courier') ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-800'
                  }`}
              >
                {order.status}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-3 text-sm text-slate-600">
              <Calendar size={14} />
              {new Date(order.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </div>
          </div>

          <Link
            to="/dashboard/allProducts"
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1.5 text-sm no-print"
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>
        </div>

        {/* Progress Tracker */}
        <div className="screen-only bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">
            Order Progress
          </h3>

          <div className="relative flex flex-wrap justify-between gap-2 sm:gap-0 items-center max-w-5xl mx-auto">
            <div className="absolute inset-x-0 top-1/2 h-1.5 bg-slate-100 rounded-full -translate-y-1/2 hidden sm:block" />
            <div
              className={`absolute left-0 top-1/2 h-1.5 rounded-full transition-all ${isReturned ? 'bg-red-500' : 'bg-emerald-500'} hidden sm:block`}
              style={{ width: `${(activeIndex / (statuses.length - 1)) * 100}%` }}
            />

            {statuses.map((status, idx) => {
              const isActive = idx <= activeIndex;
              return (
                <div key={status} className="relative z-10 flex flex-col items-center flex-1 min-w-[70px] sm:min-w-0">
                  <div
                    className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shadow-sm transition-all ${isReturned && idx === statuses.length - 1
                      ? 'bg-red-500 text-white ring-2 ring-red-200'
                      : isActive
                        ? 'bg-emerald-500 text-white ring-2 ring-emerald-200'
                        : 'bg-slate-100 text-slate-400'
                      }`}
                  >
                    {idx === statuses.length - 1 ? <CheckCircle2 size={18} /> : <Truck size={16} />}
                  </div>
                  <span className={`mt-2 text-[10px] sm:text-xs font-medium text-center leading-tight ${isActive || (isReturned && idx === statuses.length - 1) ? 'text-slate-800' : 'text-slate-400'
                    }`}>
                    {status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main content */}
        <div className="screen-only grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left - Items + Summary (takes 3/4 on xl) */}
          <div className="xl:col-span-3 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 sm:p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-base font-bold text-slate-700 flex items-center gap-2">
                  <Package size={18} />
                  Order Items
                  <span className="ml-2 bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full font-medium">
                    {totalItems} {totalItems === 1 ? 'item' : 'items'}
                  </span>
                </h3>

                <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2.5 flex items-center gap-3 text-sm">
                  <CreditCard size={16} className="text-blue-600" />
                  <div>
                    <div className="font-semibold text-blue-900">{order.payment?.payment_method || '—'}</div>
                    <div className="text-xs text-blue-600/80">
                      TXN: {order.payment?.transaction_number || '—'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                {order.products?.map((item: OrderProduct) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row gap-4 bg-slate-50/60 p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-all"
                  >
                    <div className="w-full sm:w-24 h-24 sm:h-24 rounded-lg overflow-hidden border border-slate-200 bg-white flex-shrink-0">
                      <img
                        src={`${baseURL}/uploads/ecommarce/product_image/${item.product_image}`}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150?text=No+Image')}
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      <h4 className="font-semibold text-slate-800 line-clamp-2">
                        {item.product_name}
                      </h4>
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <span>Qty:</span>
                        <span className="bg-white border border-slate-200 px-3 py-1 rounded text-slate-700 font-medium">
                          ×{item.quantity}
                        </span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-end justify-between gap-3 sm:gap-4 min-w-[100px]">
                      <p className="font-bold text-lg text-slate-900">
                        ৳{Number(item.subtotal).toFixed(2)}
                      </p>

                      {item.ebook === "1" && item.video_link ? (
                        <button
                          onClick={() => window.open(item.video_link, '_blank', 'noopener,noreferrer')}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs sm:text-sm font-medium flex items-center gap-2 transition no-print whitespace-nowrap"
                        >
                          <Download size={14} />
                          Download
                        </button>
                      ) : item.ebook === "1" ? (
                        <p className="text-xs text-amber-700 italic">Coming soon</p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-slate-50 p-5 sm:p-6 border-t">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between font-medium text-slate-600">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>৳{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-slate-600">
                    <span>Delivery Fee</span>
                    <span>৳{Number(order.delivery_charge).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-4 mt-3 flex justify-between items-center text-lg font-bold">
                    <span className="text-slate-900">Total</span>
                    <span className="text-emerald-600 text-2xl sm:text-3xl">
                      ৳{Number(order.total).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar - Buyer & Shipping */}
          <div className="space-y-6 xl:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <User size={16} /> Buyer Profile
              </h3>
              {buyerProfile ? (
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Name</p>
                    <p className="font-medium">{buyerProfile.student.name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Contact</p>
                    <p className="flex items-center gap-2">
                      <Mail size={14} className="text-slate-400" /> {buyerProfile.student.email}
                    </p>
                    <p className="flex items-center gap-2 mt-1.5">
                      <Phone size={14} className="text-slate-400" /> {buyerProfile.student.mobile}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Location</p>
                    <p className="flex items-center gap-2">
                      <MapPin size={14} className="text-slate-400" />
                      {buyerProfile.personal_info?.location || buyerProfile.personal_info?.district || 'Not provided'}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-slate-400 text-sm italic">Profile unavailable</p>
              )}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Contact size={16} /> Shipping Address
              </h3>
              {shippingInfo ? (
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Name</p>
                    <p className="font-medium">{shippingInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Phone</p>
                    <p>{shippingInfo.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Address</p>
                    <p className="leading-relaxed">{shippingInfo.address}</p>
                  </div>
                </div>
              ) : (
                <p className="text-slate-400 text-sm italic">No shipping details</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;