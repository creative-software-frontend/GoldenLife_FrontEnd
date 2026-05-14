import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Package,
  Phone,
  MapPin,
  Printer,
  Check,
  CreditCard,
  Receipt,
  Mail,
  Calendar,
  Clock,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { useInstructorOrders } from './hooks/useInstructorOrders';
import { Order, OrderStatus } from './types/instructor_order.types';
import { InstructorStatusUpdateModal } from './components/InstructorStatusUpdateModal';
import PrintInvoice from '@/components/Invoice/PrintInvoice';
import { usePrintInvoice } from '@/hooks/usePrintInvoice';
import { OrderForPrint } from '@/hooks/usePrintInvoice';

export default function InstructorOrderDetails() {
  const { order_no } = useParams<{ order_no: string }>();
  const navigate = useNavigate();
  const { fetchOrderTracking, fetchOrders, updateOrderStatus, isLoading } = useInstructorOrders();

  const [order, setOrder] = useState<Order | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [fullAddressText, setFullAddressText] = useState<string | null>(null);

  // Print invoice hook
  const { printInvoice } = usePrintInvoice();

  const progressSteps: OrderStatus[] = [
    "Order Placed",
    "Processing",
    "Packaging",
    "Sent To Courier",
    "Ready To Courier",
    "On The Way",
    "Delivered",
    "Returned"
  ];

  useEffect(() => {
    if (order_no) {
      loadOrderDetails(order_no);
    }
  }, [order_no]);

  const loadOrderDetails = async (no: string) => {
    try {
      let data = await fetchOrderTracking(no);

      // If tracking data exists but has no products, try to fetch from history as fallback
      if (data && (!data.products || data.products.length === 0)) {
        console.log('⚠️ [Details] Tracking data missing products, falling back to history...');
        const historyOrders = await fetchOrders({ search: no, limit: 1 });
        const historyMatch = historyOrders.find(o => o.order_no === no);
        if (historyMatch) {
          data = { ...data, products: historyMatch.products };
        }
      }

      setOrder(data);
    } catch (error) {
      console.error('Failed to load order details:', error);
    }
  };

  // Address Fetch Logic
  useEffect(() => {
    if (order?.user_address && !isNaN(Number(order.user_address))) {
      const fetchAddress = async () => {
        try {
          const session = sessionStorage.getItem('instructor_session');
          let token = '';
          if (session) {
            token = JSON.parse(session).token;
          }
          const response = await fetch('https://admin.goldenlifeltd.com/api/getAll-OderAddress', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Auth-Token': `Bearer ${token}`
            },
            body: JSON.stringify({ id: order.user_id })
          });
          const data = await response.json();
          if (data.status === 'success' && data.addresses) {
            const addr = data.addresses.find((a: any) => a.id.toString() === order.user_address?.toString());
            if (addr) {
              setFullAddressText(addr.address);
            } else {
              setFullAddressText('Address not found');
            }
          }
        } catch (error) {
          console.error('Failed to fetch addresses:', error);
          setFullAddressText('Address not available');
        }
      };
      fetchAddress();
    } else if (order?.user_address) {
      setFullAddressText(order.user_address);
    } else {
      setFullAddressText('Not provided');
    }
  }, [order?.user_address, order?.user_id]);

  const handleUpdateStatus = async (newStatus: OrderStatus) => {
    if (!order) return;
    const success = await updateOrderStatus(order.id, newStatus);
    if (success) {
      await loadOrderDetails(order.order_no);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getCurrentStepIndex = () => {
    if (!order) return -1;
    const index = progressSteps.indexOf(order.status as OrderStatus);
    return index === -1 ? 0 : index;
  };

  const currentStepIndex = getCurrentStepIndex();

  if (isLoading && !order) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-4">
          <Clock size={48} className="animate-spin text-emerald-600" />
          <p className="font-black text-gray-400 uppercase tracking-[0.3em] text-xs">Synchronizing Order Signal...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white">
          <CardContent className="py-24 text-center space-y-8">
            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 mx-auto">
              <Package size={48} strokeWidth={1} />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Signal Lost.</h3>
              <p className="text-gray-500 font-bold max-w-xs mx-auto">The requested order signal could not be established. It may have been decommissioned or moved.</p>
            </div>
            <Button
              onClick={() => navigate('/instructor/dashboard/enrollments')}
              className="h-14 px-10 rounded-2xl bg-gray-900 hover:bg-black text-white font-black uppercase shadow-xl active:scale-95 transition-all"
            >
              Back to Command Center
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'Processing': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'Order Placed': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'Packaging': return 'text-indigo-600 bg-indigo-50 border-indigo-100';
      case 'Sent To Courier': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'Ready To Courier': return 'text-cyan-600 bg-cyan-50 border-cyan-100';
      case 'On The Way': return 'text-violet-600 bg-violet-50 border-violet-100';
      case 'Returned': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 md:p-8 space-y-10">
      <style>{`
        @media print {
          .screen-only { display: none !important; }
          body, #root { background: white !important; }
          main { padding: 0 !important; margin: 0 !important; }
        }
      `}</style>

      {/* 🧾 Print Component (Hidden on Screen) */}
      <PrintInvoice
        order={order as any}
        fullAddressText={fullAddressText}
        orderTransaction={null}
        baseURL="https://admin.goldenlifeltd.com"
      />

      {/* Header Section */}
      <div className="screen-only flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate('/instructor/dashboard/enrollments')}
            variant="outline"
            className="w-12 h-12 p-0 rounded-2xl border-gray-100 hover:bg-gray-900 hover:text-white transition-all shadow-sm group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Button>
          <div className="space-y-1">
            <div className="flex items-center flex-cols gap-3">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Order {order.order_no}</h1>
              <div className={`px-4 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest border shadow-sm ${getStatusColor(order.status)}`}>
                {order.status}
              </div>
            </div>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              Deployment Date: {formatDate(order.created_at)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => {
              if (order) {
                const orderForPrint: OrderForPrint = {
                  order_no: order.order_no,
                  created_at: order.created_at,
                  status: order.status,
                  total: order.total,
                  delivery_charge: order.delivery_charge,
                  user_name: order.user_name,
                  user_phone: order.user_phone,
                  user_address: order.user_address,
                  products: (order.products || []).map(p => ({
                    ...p,
                    price: p.subtotal // Subtotal is used as price for print if price is missing
                  })) as any,
                  payment: null,
                };
                printInvoice(orderForPrint);
              }
            }}
            variant="outline"
            className="h-14 px-8 rounded-2xl border-gray-100 font-black text-[10px] uppercase gap-3 hover:bg-gray-900 hover:text-white transition-all shadow-sm"
          >
            <Printer size={18} /> Print Invoice
          </Button>
          {/* <Button
            onClick={() => setIsStatusModalOpen(true)}
            className="h-14 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] uppercase shadow-xl shadow-emerald-600/20 active:scale-95 transition-all"
          >
            Update Lifecycle
          </Button> */}
        </div>
      </div>


      {/* Order Details Content */}
      <div className="screen-only grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-xl rounded-[2.5rem] bg-white ring-1 ring-gray-100 overflow-hidden">
            <CardHeader className="p-8 border-b border-gray-50 bg-gray-50/30">
              <CardTitle className="text-xs font-black flex items-center gap-3 text-gray-500 uppercase tracking-[0.2em]">
                <Package className="w-5 h-5 text-emerald-600" /> Signal Payload ({order.products?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                {(order.products || []).map((product) => (
                  <div key={product.id} className="flex flex-col sm:flex-row sm:items-center gap-6 p-6 bg-gray-50/50 rounded-[2rem] border border-transparent hover:border-emerald-100 hover:bg-white hover:shadow-2xl transition-all duration-700 group">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white flex-shrink-0 border border-gray-100 p-3 shadow-md group-hover:scale-105 transition-transform duration-700">
                      <img
                        src={product.product_image?.startsWith('http') ? product.product_image : `https://admin.goldenlifeltd.com/uploads/ecommarce/product_image/${product.product_image}`}
                        alt={product.product_name}
                        className="w-full h-full object-contain"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://admin.goldenlifeltd.com/uploads/course/course_image/6a046632f0db7.jfif'; }}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="font-black text-gray-900 text-lg tracking-tight leading-tight group-hover:text-emerald-600 transition-colors">{product.product_name}</h3>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <span className="flex items-center gap-2">
                          Rate: <span className="text-gray-900 font-black italic">৳{parseFloat(product.subtotal) / product.quantity}</span>
                        </span>
                        <span className="flex items-center gap-2">
                          Units: <Badge className="bg-emerald-600 text-white font-black border-none px-2 h-5 rounded-lg">{product.quantity}</Badge>
                        </span>
                      </div>
                    </div>
                    <div className="text-left sm:text-right pt-6 sm:pt-0 border-t sm:border-0 border-gray-100 flex sm:flex-col justify-between items-center sm:items-end">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Payload Value</p>
                      <p className="text-2xl font-black text-emerald-600 italic tracking-tighter">৳{parseFloat(product.subtotal).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-none shadow-xl rounded-[2.5rem] bg-gray-900 text-white overflow-hidden relative group">
            <CardHeader className="p-8 border-b border-white/5 relative z-10">
              <CardTitle className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">RECEPTION IDENTITY</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8 relative z-10">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-white/30 uppercase tracking-widest">Full Name</label>
                <p className="text-xl font-black tracking-tight">{order.user_name}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-white/30 uppercase tracking-widest">Contact Frequency</label>
                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold tracking-tight">{order.user_phone}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-white/30 uppercase tracking-widest">Landing Zone</label>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-1 text-emerald-400 shrink-0" />
                  <p className="text-sm font-bold leading-relaxed text-white/80">
                    {fullAddressText || 'Not specified'}
                  </p>
                </div>
              </div>
            </CardContent>
            <TrendingUp className="absolute right-[-20px] bottom-[-20px] w-48 h-48 text-white/[0.03] group-hover:scale-125 transition-transform duration-1000" />
          </Card>

          <Card className="border-none shadow-xl rounded-[2.5rem] bg-white ring-1 ring-gray-100 overflow-hidden">
            <CardHeader className="p-8 border-b border-gray-50">
              <CardTitle className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">FINANCIAL SUMMARY</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <span>Net Yield</span>
                  <span className="text-gray-900 font-black">৳{(parseFloat(order.total) - parseFloat(order.delivery_charge)).toFixed(2)}</span>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em]">Gross Total</p>
                      <h2 className="text-4xl font-black text-gray-900 tracking-tighter">৳{parseFloat(order.total).toFixed(2)}</h2>
                    </div>
                    <div className="bg-emerald-50 p-2 rounded-xl text-emerald-600">
                      <DollarSign size={24} strokeWidth={3} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Button
                  onClick={() => window.print()}
                  className="w-full h-14 rounded-2xl bg-gray-900 hover:bg-black text-white font-black text-[10px] uppercase gap-3 shadow-xl active:scale-95 transition-all"
                >
                  <Printer size={18} /> Print Command Receipt
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <InstructorStatusUpdateModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        currentStatus={order.status}
        onUpdate={handleUpdateStatus}
        orderNo={order.order_no}
      />
    </div>
  );
}
