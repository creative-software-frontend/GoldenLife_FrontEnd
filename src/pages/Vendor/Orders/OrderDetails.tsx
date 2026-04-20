import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, User, Phone, MapPin, Printer, Check, CreditCard, Receipt, Mail, Calendar } from 'lucide-react';
import { useOrders } from './hooks/useOrders';
import { Order, OrderStatus } from './types/order.types';
import { OrderStatusBadge } from './components/OrderStatusBadge';
import { StatusUpdateModal } from './components/StatusUpdateModal';
import PrintInvoice from '@/components/Invoice/PrintInvoice';
import { usePrintInvoice } from '@/hooks/usePrintInvoice';
import { OrderForPrint } from '@/hooks/usePrintInvoice';

// Helper function to format address
const formatAddress = (address: string | undefined) => {
  if (!address) return 'Not provided';
  if (!isNaN(Number(address))) {
    return 'Address not available';
  }
  return address;
};

export default function OrderDetails() {
  const { order_no } = useParams<{ order_no: string }>();
  const navigate = useNavigate();
  const { fetchOrderDetails, updateOrderStatus, isLoading } = useOrders();

  const [order, setOrder] = useState<Order | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [fullAddressText, setFullAddressText] = useState<string | null>(null);

  // New state for transactions
  const [orderTransaction, setOrderTransaction] = useState<any | null>(null);

  // Print invoice hook
  const { printInvoice } = usePrintInvoice();
  const progressSteps: OrderStatus[] = [
    "Order Placed",
    "Processing",
    "Packaging",
    "Sent To Courier" as OrderStatus,
    "Ready To Courier" as OrderStatus,
    "On The Way" as OrderStatus,
    "Delivered",
    "Returned" as OrderStatus
  ];

  useEffect(() => {
    if (order_no) {
      loadOrderDetails(order_no);
    }
  }, [order_no]);

  const loadOrderDetails = async (no: string) => {
    try {
      const data = await fetchOrderDetails(no);
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
          const session = sessionStorage.getItem('vendor_session');
          let token = '';
          if (session) {
            token = JSON.parse(session).token;
          }
          const response = await fetch('https://admin.goldenlifeltd.com/api/getAll-OderAddress', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
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

  // Transaction Fetch Logic
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const session = sessionStorage.getItem('vendor_session');
        let token = '';
        if (session) {
          token = JSON.parse(session).token;
        }
        const response = await fetch('https://admin.goldenlifeltd.com/api/vendor/transactions/history', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        const data = await response.json();
        if (data.status === true && data.transactions) {
          console.log(data.transactions);
          // setTransactions(data.transactions);

          // Fetch Transactions
          if (order) {
            const matchingTxn = data.transactions.find((txn: any) =>
              txn.invoice_number?.includes(order.order_no) ||
              txn.Transaction_ID?.includes(order.order_no) ||
              txn.Transaction_ID?.includes(order.id.toString()) ||
              txn.id?.toString() === order.id.toString()
            );
            if (matchingTxn) setOrderTransaction(matchingTxn);
          }
        }
      } catch (err) {
        console.error('Error fetching transactions:', err);
      }
    };
    fetchTransactions();
  }, [order_no, order]);

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
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-light"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-gray-500">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">Order not found</p>
          <Button onClick={() => navigate('/vendor/dashboard/orders')} className="mt-4">
            Back to Orders
          </Button>
        </CardContent>
      </Card>
    );
  }

  const subtotal = parseFloat(order.total) - parseFloat(order.delivery_charge);

  return (
    <div className="max-w-[1400px] mx-auto p-6 space-y-6">

      <PrintInvoice
        order={order}
        fullAddressText={fullAddressText}
        orderTransaction={orderTransaction}
        baseURL="https://admin.goldenlifeltd.com"
      />

      <div className="screen-only flex items-center justify-between">
        <Button onClick={() => navigate('/vendor/dashboard/orders')} variant="outline" className="gap-2 h-10 px-4 rounded-xl font-bold border-gray-200 hover:bg-gray-50 transition-all">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
      </div>

      <div className="screen-only flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mt-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Order #{order.order_no}</h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-gray-500 text-sm font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {formatDate(order.created_at)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
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
                  products: order.products || [],
                  payment: (order as any).payment || null,
                };
                printInvoice(orderForPrint);
              }
            }}
            variant="outline"
            className="flex-1 sm:flex-none gap-2 h-11 px-6 font-bold"
          >
            <Printer className="w-4 h-4" /> PRINT
          </Button>
          <Button
            onClick={() => setIsStatusModalOpen(true)}
            className="flex-1 sm:flex-none bg-primary-light hover:bg-primary-light/90 text-white h-11 px-6 font-bold shadow-lg shadow-primary-light/20"
          >
            Update Status
          </Button>
        </div>
      </div>

      {/* Order Progress Timeline */}
      <div className="screen-only bg-white rounded-2xl border border-gray-100 p-5 sm:p-7 shadow-sm">
        <h3 className="font-black text-xs sm:text-sm mb-8 text-gray-400 uppercase tracking-[0.2em]">ORDER PROGRESS</h3>
        <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          <div className="flex items-center min-w-[900px] lg:min-w-0">
            {progressSteps.map((step, index) => {
              const isCompleted = index < currentStepIndex || order.status === step;
              const isActive = index === currentStepIndex;
              return (
                <div key={step} className="flex-1 flex items-center">
                  <div className="flex flex-col items-center gap-2 group cursor-default">
                    <div
                      className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-2xl transition-all duration-500 shadow-sm ${isActive
                        ? 'bg-primary-light text-white ring-4 ring-primary-light/10 shadow-primary-light/20 rotate-[-5deg]'
                        : isCompleted
                          ? 'bg-green-500 text-white ring-4 ring-green-100 shadow-green-100'
                          : 'bg-gray-50 text-gray-300'
                        }`}
                    >
                      {isCompleted ? <Check className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={3} /> : <Package className="w-5 h-5 opacity-40" />}
                    </div>
                    <span className={`text-[10px] sm:text-[11px] font-black uppercase tracking-wider transition-colors duration-300 ${isActive ? 'text-primary-light' : 'text-gray-400'}`}>
                      {step}
                    </span>
                  </div>
                  {index < progressSteps.length - 1 && (
                    <div className="flex-1 px-4">
                      <div className={`h-[2px] rounded-full transition-all duration-700 min-w-[30px] ${index < currentStepIndex ? 'bg-green-500' : 'bg-gray-100'}`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="screen-only border-gray-100 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100">
              <CardTitle className="text-base font-black flex items-center gap-2 text-gray-600 uppercase tracking-wider">
                <Package className="w-5 h-5 text-primary-light" /> Order Items ({order.products?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {order.products && order.products.length > 0 ? (
                <div className="space-y-4">
                  {order.products.map((product: any) => (
                    <div key={product.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-gray-50 bg-gray-50/30 rounded-2xl hover:bg-white hover:border-primary-light/20 hover:shadow-md transition-all duration-300 group">
                      <div className="w-full sm:w-20 h-20 rounded-xl overflow-hidden bg-white flex-shrink-0 border border-gray-100 p-2 shadow-sm">
                        <img
                          src={product.product_image?.startsWith('http') ? product.product_image : `https://admin.goldenlifeltd.com/uploads/ecommarce/product_image/${product.product_image}`}
                          alt={product.product_name}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/80?text=No+Image'; }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 leading-tight line-clamp-2">{product.product_name}</h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs font-black uppercase tracking-wider text-gray-400">
                          <span className="flex items-center gap-1.5">
                            Price: <span className="text-gray-600">৳{product.price ? parseFloat(product.price).toFixed(2) : (parseFloat(product.subtotal) / parseFloat(product.quantity?.toString() || '1')).toFixed(2)}</span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            Qty: <Badge variant="secondary" className="font-black bg-white text-primary-light border-primary-light/10 h-5 px-1.5">{product.quantity}</Badge>
                          </span>
                        </div>
                      </div>
                      <div className="text-left sm:text-right pt-4 sm:pt-0 border-t sm:border-0 border-gray-100 flex sm:flex-col justify-between items-center sm:items-end">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Subtotal</p>
                        <p className="text-xl font-bold text-primary-light tracking-tight">৳{parseFloat(product.subtotal).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400 font-bold py-12">No products in this order</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="screen-only">
            <CardHeader><CardTitle className="text-lg font-bold">BUYER PROFILE</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] mb-1">Name</div>
                <p className="text-[17px] font-black text-slate-900">{order.user_name}</p>
              </div>

              <div className="space-y-1">
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] mb-2">Contact</div>
                <div className="space-y-2">
                  {order.student?.email && (
                    <div className="flex items-center gap-2.5 text-slate-700">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="text-[15px] font-bold">{order.student.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2.5 text-slate-700">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span className="text-[15px] font-bold">{order.user_phone}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] mb-2">Location</div>
                <div className="flex items-start gap-2.5 text-slate-700">
                  <MapPin className="w-4 h-4 mt-0.5 text-slate-400 shrink-0" />
                  <p className="text-[15px] font-bold leading-relaxed">
                    {order.student?.personal_info?.location || order.student_address?.address || fullAddressText || 'Not provided'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="screen-only">
            <CardHeader><CardTitle className="text-lg font-bold">Order Summary</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="font-medium">৳{subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Delivery Fee</span><span className="font-medium">৳{parseFloat(order.delivery_charge).toFixed(2)}</span></div>
                <div className="border-t pt-3 space-y-3">
                  <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-primary-light">৳{parseFloat(order.total).toFixed(2)}</span></div>
                  <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2.5 flex items-center justify-between gap-3 text-sm">
                    <div className="flex items-center gap-3">
                      <CreditCard size={16} className="text-blue-600" />
                      <div>
                        <div className="font-semibold text-blue-900">{orderTransaction?.payment_method || (order as any).payment?.payment_method || '—'}</div>
                        <div className="text-xs text-blue-600/80">TXN: {orderTransaction?.Transaction_ID || (order as any).payment?.transaction_number || '—'}</div>
                      </div>
                    </div>
                    <Button
                      onClick={() => window.print()}
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                    >
                      <Printer size={14} />
                      PRINT RECEIPT
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {orderTransaction && (
            <Card className="screen-only border-green-200">
              <CardHeader className="bg-green-50 rounded-t-xl border-b border-green-100 pb-3">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-green-800">
                  <Receipt className="w-5 h-5" /> Transaction Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Invoice Ref</span><span className="font-medium text-gray-900">{orderTransaction.invoice_number}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-bold text-gray-900">৳{parseFloat(orderTransaction.amount).toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Transaction ID</span><span className="font-medium text-gray-900">{orderTransaction.Transaction_ID}</span></div>
                  <div className="flex justify-between items-center"><span className="text-gray-500">Status</span><Badge variant={orderTransaction.status === 'approved' ? 'default' : 'secondary'} className={orderTransaction.status === 'approved' ? 'bg-green-100 text-green-800' : ''}>{(orderTransaction.status || 'Pending').toUpperCase()}</Badge></div>
                  <div className="flex justify-between"><span className="text-gray-500">Method</span><span className="font-medium text-gray-900 capitalize">{orderTransaction.payment_method}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Acct No.</span><span className="font-medium text-gray-900">{orderTransaction.number}</span></div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <StatusUpdateModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        currentStatus={order.status}
        onUpdate={handleUpdateStatus}
        orderNo={order.order_no}
      />
    </div>
  );
}