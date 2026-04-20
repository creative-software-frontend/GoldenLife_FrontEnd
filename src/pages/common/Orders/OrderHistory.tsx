import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Calendar,
  ChevronDown,
  ChevronUp,
  Wallet,
  Truck,
  ShoppingBag,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

// --- Types ---
interface Product {
  id: number;
  product_id?: string | number; // Added to match OrderDetails logic
  product_name: string;
  product_image: string;
  quantity: string;
  subtotal: string;
  ebook?: string;
  video_link?: string;
}

interface Order {
  id: number;
  order_no: string;
  total: string;
  delivery_charge: string;
  status: string;
  created_at: string;
  payment?: {
    payment_method: string;
    transaction_number: string;
  } | null;
  products?: Product[];
}

// Skeleton Card Component (smaller widths)
const OrderSkeleton = () => (
  <div className="bg-white/70 border border-slate-200/70 rounded-2xl sm:rounded-3xl overflow-hidden animate-pulse">
    <div className="p-4 sm:p-5 lg:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start sm:items-center gap-3 sm:gap-4">
        <div className="h-9 w-9 sm:h-10 sm:w-10 bg-slate-200 rounded-xl sm:rounded-2xl" />
        <div className="space-y-1.5">
          <div className="h-4 w-36 bg-slate-200 rounded" />
          <div className="flex gap-2">
            <div className="h-3.5 w-24 bg-slate-200 rounded" />
            <div className="h-3.5 w-14 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto pt-3 sm:pt-0">
        <div className="text-right">
          <div className="h-2.5 w-10 bg-slate-200 rounded mx-auto" />
          <div className="h-6 w-16 bg-slate-200 rounded mt-1" />
        </div>
        <div className="h-8 w-8 bg-slate-200 rounded-full" />
      </div>
    </div>
  </div>
);

const OrderHistory = () => {
  const navigate = useNavigate();
  const {
    orders,
    isOrdersLoading: loading,
    fetchOrders,
    studentProfile,
    personalInfo
  } = useAppStore();

  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

  const goToDetails = (e: React.MouseEvent, orderId: number, orderNo: string) => {
    e.stopPropagation();
    navigate(`/dashboard/order-details`, { state: { id: orderId, orderNo: orderNo } });
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  const toggleOrder = (id: number) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };



  // ==================== SKELETON LOADING ====================
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/40">
        <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-6 sm:py-8 lg:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-8 lg:mb-10">
            <div className="p-3 bg-slate-200 rounded-2xl w-fit" />
            <div className="space-y-1.5">
              <div className="h-7 w-52 bg-slate-200 rounded" />
              <div className="h-3.5 w-64 bg-slate-200 rounded" />
            </div>
          </div>
          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <OrderSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // No orders state
  if (!orders?.length) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-12 text-center sm:px-6 lg:px-8">
        <div className="inline-flex p-5 bg-slate-50 rounded-full mb-6">
          <ShoppingBag className="text-slate-300 w-10 h-10" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">No orders found</h2>
        <p className="mt-3 text-slate-500 max-w-md mx-auto">
          You haven't made any purchases yet.
        </p>
      </div>
    );
  }

  // ==================== MAIN UI ====================
  return (
    <div className="min-h-screen bg-slate-50/40">
      <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-6 sm:py-8 lg:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-8 lg:mb-10">
          <div className="p-3.5 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-200/40 inline-flex">
            <ShoppingBag className="text-white w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              Order History
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Review your past purchases
            </p>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-5 lg:space-y-6">
          {orders.map((order: Order) => (
            <div
              key={order.id}
              className={`transition-all duration-300 rounded-2xl sm:rounded-3xl overflow-hidden backdrop-blur-sm border ${expandedOrderId === order.id
                ? 'bg-white/90 border-emerald-200 shadow-xl shadow-emerald-100/30'
                : 'bg-white/70 border-slate-200/70 shadow-sm hover:shadow-md hover:border-slate-300'
                }`}
            >
              <div
                onClick={() => toggleOrder(order.id)}
                className="p-4 sm:p-5 lg:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-white/60 active:bg-white/70 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                  <div
                    className={`h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors ${expandedOrderId === order.id ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                      }`}
                  >
                    <Package size={18} />
                  </div>

                  <div>
                    <div
                      onClick={(e) => goToDetails(e, order.id, order.order_no)}
                      className="group flex items-center gap-1.5 w-fit"
                    >
                      <h3 className="font-black text-slate-900 text-sm sm:text-base lg:text-lg group-hover:text-emerald-600 transition-colors">
                        Order #{order.order_no}
                      </h3>
                      <ExternalLink size={12} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1.5 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 rounded-md border border-slate-100">
                        <Calendar size={12} className="text-slate-400" />
                        {new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                      {(() => {
                        const s = order.status.toLowerCase();
                        let colorClass = "bg-slate-100 text-slate-700 border-slate-200"; // default

                        if (s.includes('delivered')) colorClass = "bg-emerald-50 text-emerald-700 border-emerald-100";
                        else if (s.includes('pending') || s.includes('placed')) colorClass = "bg-amber-50 text-amber-700 border-amber-100";
                        else if (s.includes('process') || s.includes('packag')) colorClass = "bg-indigo-50 text-indigo-700 border-indigo-100";
                        else if (s.includes('way') || s.includes('courier')) colorClass = "bg-sky-50 text-sky-700 border-sky-100";
                        else if (s.includes('returned') || s.includes('cancel')) colorClass = "bg-rose-50 text-rose-700 border-rose-100";

                        return (
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border shadow-sm ${colorClass}`}>
                            {order.status}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</p>
                    {/* Exact value, no formatting */}
                    <p className="text-base sm:text-lg lg:text-xl font-black text-slate-900">৳{order.total}</p>
                  </div>
                  <div className={`p-2 rounded-full ${expandedOrderId === order.id ? 'bg-emerald-50' : 'bg-slate-100/70'}`}>
                    {expandedOrderId === order.id ? (
                      <ChevronUp className="text-emerald-600" size={18} />
                    ) : (
                      <ChevronDown className="text-slate-500" size={18} />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedOrderId === order.id && (
                <div className="border-t border-slate-100/60 bg-gradient-to-b from-white/80 to-white/60 p-4 sm:p-5 lg:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4 mb-6 lg:mb-8">
                    <div className="bg-white/90 p-4 rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-slate-200">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        <Wallet size={12} className="text-slate-300" /> Payment
                      </p>
                      <p className="font-bold text-slate-800 text-sm">{order.payment?.payment_method ?? 'N/A'}</p>
                      {order.payment?.transaction_number && (
                        <p className="text-[10px] text-slate-400 mt-0.5 font-medium italic">TXN: {order.payment.transaction_number}</p>
                      )}
                    </div>

                    <div className="bg-white/90 p-4 rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-slate-200">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        <Truck size={12} className="text-slate-300" /> Delivery
                      </p>
                      <p className="font-bold text-slate-800 text-sm">৳{Number(order.delivery_charge).toFixed(2)}</p>
                    </div>

                    <div
                      onClick={(e) => goToDetails(e, order.id, order.order_no)}
                      className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 shadow-sm hover:bg-indigo-50 cursor-pointer transition-all flex flex-col justify-center group/btn"
                    >
                      <p className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                        Deep Insights <ArrowRight size={11} className="transition-transform group-hover/btn:translate-x-0.5" />
                      </p>
                      <p className="text-xs font-semibold text-indigo-900/80">View Full Invoice & Tracker</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3 px-1">
                      Order Items
                    </h4>

                    <div className="hidden md:grid grid-cols-12 gap-3 pb-3 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase px-2">
                      <div className="col-span-7 lg:col-span-8">Product</div>
                      <div className="col-span-2 text-center">Qty</div>
                      <div className="col-span-3 lg:col-span-2 text-right">Subtotal</div>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {order.products?.map((item: Product) => (
                        <div
                          key={item.id}
                          className="py-4 px-2 flex flex-col md:grid md:grid-cols-12 md:items-center gap-3 group hover:bg-slate-50/50 transition-colors rounded-xl"
                        >
                          <div className="md:col-span-7 lg:col-span-8 flex items-center gap-3">
                            <div className="h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm">
                              <img
                                src={`${baseURL}/uploads/ecommarce/product_image/${item.product_image}`}
                                alt={item.product_name}
                                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150?text=No+Image')}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-slate-800 text-xs sm:text-sm line-clamp-2">
                                {item.product_name}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between md:contents gap-3">
                            <div className="md:col-span-2 md:text-center">
                              <span className="md:hidden text-[10px] text-slate-500 block mb-0.5 font-bold uppercase">Qty</span>
                              <span className="font-bold text-slate-700 text-sm bg-slate-100/50 px-2 py-0.5 rounded">×{item.quantity}</span>
                            </div>
                            <div className="md:col-span-3 lg:col-span-2 md:text-right flex flex-col items-end">
                              <span className="md:hidden text-[10px] text-slate-500 block mb-0.5 font-bold uppercase">Subtotal</span>
                              <span className="font-black text-slate-900 text-sm sm:text-base">৳{Number(item.subtotal).toFixed(2)}</span>

                              {/* New Access Button for E-books */}
                              {/* {item.ebook === "1" && item.video_link ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(item.video_link, '_blank', 'noopener,noreferrer');
                                  }}
                                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold transition-all shadow-sm shadow-indigo-100 no-print"
                                >
                                  <Download size={12} />
                                  DOWNLOAD
                                </button>
                              ) : item.ebook === "1" ? (
                                <span className="text-[10px] text-amber-600 font-bold mt-1 uppercase tracking-tighter italic">Digitizing...</span>
                              ) : null} */}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;