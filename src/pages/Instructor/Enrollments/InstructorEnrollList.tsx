import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Calendar,
  Clock,
  UserCheck,
  SearchX,
  RefreshCw,
  LayoutGrid,
  List as ListIcon,
  TrendingUp,
  DollarSign,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInstructorNavbarQuery } from '@/hooks/useInstructorNavbar';
import { useInstructorOrders } from './hooks/useInstructorOrders';
import { Order, OrderStatus, OrderFilters } from './types/instructor_order.types';
import { InstructorStatusUpdateModal } from './components/InstructorStatusUpdateModal';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

const InstructorEnrollList: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [filters, setFilters] = useState<OrderFilters>({
    search: '',
    status: 'All',
    page: 1,
    limit: 50
  });

  const { fetchOrders, updateOrderStatus, isLoading } = useInstructorOrders();
  const { data: navbarData, isLoading: isNavbarLoading } = useInstructorNavbarQuery();

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const loadOrders = useCallback(async () => {
    try {
      console.log('🔵 [Orders] Loading instructor orders with filters:', filters);
      const data = await fetchOrders(filters);
      setOrders(data);
      applyLocalFilters(data, filters);
      setLastRefreshed(new Date());
    } catch (error) {
      console.error('❌ [Orders] Failed to load orders:', error);
    }
  }, [filters, fetchOrders]);

  const applyLocalFilters = (data: Order[], currentFilters: OrderFilters) => {
    let filtered = [...data];

    // Apply status filter (if not already handled by API)
    if (currentFilters.status && currentFilters.status !== 'All') {
      if (currentFilters.status === 'today') {
        const today = new Date().toISOString().split('T')[0];
        filtered = filtered.filter(order =>
          new Date(order.created_at).toISOString().split('T')[0] === today
        );
      } else {
        filtered = filtered.filter(order => order.status === currentFilters.status);
      }
    }

    // Apply search filter
    if (currentFilters.search) {
      const searchTerm = currentFilters.search.toLowerCase();
      filtered = filtered.filter(order =>
        order.order_no.toLowerCase().includes(searchTerm) ||
        order.user_name.toLowerCase().includes(searchTerm) ||
        order.user_phone.toLowerCase().includes(searchTerm) ||
        order.products.some(p => p.product_name.toLowerCase().includes(searchTerm))
      );
    }

    setFilteredOrders(filtered);
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status]);

  useEffect(() => {
    applyLocalFilters(orders, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, orders]);

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const handleStatusFilter = (value: string) => {
    setFilters(prev => ({ ...prev, status: value as any, page: 1 }));
  };

  const handleUpdateStatusClick = (order: Order) => {
    setSelectedOrder(order);
    setIsStatusModalOpen(true);
  };

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    if (!selectedOrder) return;

    const success = await updateOrderStatus(selectedOrder.id, newStatus);
    if (success) {
      await loadOrders();
    }
  };

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
      case 'Cancelled': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-4 sm:p-6 md:p-8 pb-48 max-w-[1760px] mx-auto space-y-10"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div variants={itemVariants} className="space-y-1">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-600 p-2.5 rounded-2xl text-white shadow-xl shadow-emerald-600/20">
              <Package size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Order Management</h1>
              <p className="text-gray-500 font-bold text-sm">Monitor course enrollments and product signals.</p>
            </div>
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="text-xs font-black text-gray-400 uppercase tracking-widest">
          Last Synchronized: {lastRefreshed.toLocaleTimeString()}
        </motion.div>
      </div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-gray-900 text-white rounded-[2.5rem] overflow-hidden relative group">
          <CardContent className="p-8 space-y-2 relative z-10">
            <p className="text-white/40 font-black uppercase tracking-[0.2em] text-[9px]">Total Orders</p>
            <h2 className="text-4xl font-black tracking-tighter">{orders.length}</h2>
            <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-black pt-2 uppercase">
              <TrendingUp size={14} /> Real-time Feed
            </div>
          </CardContent>
          <UserCheck className="absolute right-[-10px] bottom-[-10px] w-36 h-36 text-white/[0.04] group-hover:scale-125 transition-transform duration-1000" />
        </Card>

        <Card className="border-none shadow-sm bg-white rounded-[2.5rem] overflow-hidden group ring-1 ring-gray-100">
          <CardContent className="p-8 space-y-2 border-l-8 border-amber-500">
            <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">Processing Pipeline</p>
            <h2 className="text-4xl font-black tracking-tighter text-amber-500">
              {orders.filter(o => o.status === 'Processing' || o.status === 'Order Placed').length}
            </h2>
            <div className="flex items-center gap-2 text-gray-500 text-[11px] font-black pt-2 uppercase">
              <Clock size={14} className="text-amber-400" /> Action Required
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white rounded-[2.5rem] overflow-hidden group ring-1 ring-gray-100">
          <CardContent className="p-8 space-y-2 border-l-8 border-emerald-500">
            <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">Current Balance</p>
            <h2 className="text-4xl font-black tracking-tighter text-emerald-600">
              {isNavbarLoading ? '...' : `৳${navbarData?.balance || '0.00'}`}
            </h2>
            <div className="flex items-center gap-2 text-gray-500 text-[11px] font-black pt-2 uppercase">
              <DollarSign size={14} className="text-emerald-500" /> Real-time Settlement
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Control Engine */}
      <motion.div variants={itemVariants} className="flex flex-col xl:flex-row items-center gap-6 bg-white p-5 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/10">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={20} strokeWidth={3} />
          <Input
            placeholder="Search order number, customer identity, or course title..."
            className="pl-14 h-14 bg-gray-50/50 border-none focus:ring-4 focus:ring-emerald-500/5 rounded-[1.5rem] font-bold text-gray-700 transition-all text-base w-full max-w-4xl shadow-inner"
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">


          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
            className="h-14 px-6 rounded-2xl border-gray-100 font-black text-[10px] uppercase gap-3 hover:bg-gray-900 hover:text-white transition-all shadow-sm active:scale-95"
          >
            {viewMode === 'grid' ? (
              <><ListIcon size={18} strokeWidth={3} /> Switch Mode</>
            ) : (
              <><LayoutGrid size={18} strokeWidth={3} /> Switch Mode</>
            )}
          </Button>

          <Button
            onClick={loadOrders}
            disabled={isLoading}
            className="h-14 w-14 p-0 rounded-2xl bg-gray-900 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
          </Button>
        </div>
      </motion.div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center py-32"
          >
            <div className="flex flex-col items-center gap-4">
              <RefreshCw size={48} className="animate-spin text-emerald-600" />
              <p className="font-black text-gray-400 uppercase tracking-[0.3em] text-xs">Synchronizing API Feed...</p>
            </div>
          </motion.div>
        ) : viewMode === 'table' ? (
          <motion.div
            key="table"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="hidden lg:block bg-white rounded-[3rem] border border-gray-100 shadow-2xl overflow-hidden"
          >
            <div className="overflow-x-auto no-scrollbar">
              <Table className="min-w-[1000px]">
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-gray-100 uppercase tracking-wider text-xs">
                    <TableHead className="h-16 font-semibold text-gray-500 px-6">Entry Token</TableHead>
                    <TableHead className="h-16 font-semibold text-gray-500 px-6">Identity</TableHead>
                    <TableHead className="h-16 font-semibold text-gray-500 px-6">Target Products</TableHead>
                    <TableHead className="h-16 font-semibold text-gray-500 px-6">Yield</TableHead>
                    <TableHead className="h-16 font-semibold text-gray-500 px-10 text-center">Lifecycle</TableHead>
                    <TableHead className="h-16 font-semibold text-gray-500 px-6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} className="group hover:bg-emerald-50/[0.02] transition-colors border-b border-gray-50 last:border-0">
                      <TableCell className="px-6 py-6">
                        <div className="flex flex-col gap-1 whitespace-nowrap">
                          <p className="font-bold text-emerald-600 text-sm tracking-wide">{order.order_no}</p>
                          <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5 uppercase">
                            <Calendar size={12} strokeWidth={2.5} /> {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="flex items-center gap-4">

                          <div className="space-y-1">
                            <p className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors text-sm">{order.user_name}</p>
                            <p className="text-xs text-gray-500 font-medium">
                              {order.user_phone}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="space-y-1.5">
                          {order.products.map((p, idx) => (
                            <p key={idx} className="text-sm font-medium text-gray-700 leading-tight line-clamp-1 max-w-[320px]">
                              {p.product_name} <span className="text-gray-400 text-xs ml-1">x{p.quantity}</span>
                            </p>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 font-bold text-gray-900 text-sm">
                        ৳{order.total}
                      </TableCell>
                      <TableCell className="px-10 text-center">
                        <div className={`w-[120px] h-[32px] font-bold rounded-lg text-[11px] uppercase flex items-center justify-center tracking-wider border shadow-sm mx-auto select-none ${getStatusColor(order.status)}`}>
                          {order.status}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Button
                            variant="outline"
                            onClick={() => navigate(`/instructor/dashboard/orders/${order.order_no}`)}
                            className="h-9 px-5 rounded-lg font-bold text-xs text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
                          >
                            Track
                          </Button>

                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredOrders.map((order) => (
              <motion.div key={order.id} variants={itemVariants}>
                <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white ring-1 ring-gray-100 group hover:shadow-2xl transition-all duration-700 flex flex-col h-full transform-gpu">
                  <CardContent className="p-0 flex-1 flex flex-col">
                    <div className="p-8 bg-gray-50/50 flex flex-col items-center text-center space-y-4 relative border-b border-gray-50">

                      <div className="space-y-1">
                        <p className="font-black text-lg text-gray-900 tracking-tight leading-none">{order.user_name}</p>
                        <p className="text-[9px] font-black text-emerald-600 tracking-widest uppercase">{order.order_no}</p>
                      </div>
                    </div>

                    <div className="p-7 space-y-7 flex-1 flex flex-col">
                      <div className="space-y-2 text-center">
                        {order.products.slice(0, 2).map((p, idx) => (
                          <p key={idx} className="text-[10px] font-black text-gray-800 leading-snug line-clamp-1 px-1">{p.product_name}</p>
                        ))}
                        {order.products.length > 2 && (
                          <p className="text-[8px] font-black text-gray-400">+{order.products.length - 2} more items</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 py-5 border-y border-gray-50 mt-auto">
                        <div className="space-y-0.5 text-center border-r border-gray-50">
                          <p className="text-[8px] font-black text-gray-400 tracking-widest uppercase">Yield</p>
                          <p className="text-base font-black text-emerald-600 italic tracking-tighter leading-none">৳{order.total}</p>
                        </div>
                        <div className="space-y-0.5 text-center">
                          <p className="text-[8px] font-black text-gray-400 tracking-widest uppercase">Lifecycle</p>
                          <p className={`text-[10px] font-black uppercase tracking-tighter leading-none ${getStatusColor(order.status).split(' ')[0]}`}>{order.status}</p>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-1">
                        <Button
                          variant="outline"
                          onClick={() => navigate(`/instructor/dashboard/orders/${order.order_no}`)}
                          className="flex-1 h-12 rounded-2xl border-gray-200 font-black text-[10px] text-gray-600 hover:bg-gray-900 hover:text-white transition-all uppercase"
                        >
                          Track
                        </Button>
                        {/* <Button
                          onClick={() => handleUpdateStatusClick(order)}
                          className="flex-1 h-12 rounded-2xl bg-gray-900 hover:bg-black text-white font-black text-[10px] shadow-xl active:scale-95 transition-all uppercase"
                        >
                          Update
                        </Button> */}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State Logic */}
      <AnimatePresence>
        {!isLoading && filteredOrders.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="py-32 text-center space-y-8 bg-gradient-to-br from-white to-gray-50/50 rounded-[4rem] border-2 border-dashed border-gray-200 shadow-inner flex flex-col items-center"
          >
            <div className="w-28 h-28 bg-white rounded-full shadow-2xl flex items-center justify-center text-orange-500">
              <SearchX size={54} strokeWidth={1} />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Signal Void.</h3>
              <p className="text-gray-500 font-bold max-w-sm mx-auto leading-relaxed px-10 text-sm">No signals detected on the current frequency. Resetting filters might re-establish connection.</p>
            </div>
            <Button
              onClick={() => setFilters({ search: '', status: 'All', page: 1, limit: 50 })}
              className="h-15 px-12 rounded-3xl bg-[#FF8A00] hover:bg-orange-600 text-white font-black gap-3 shadow-2xl shadow-orange-500/20 active:scale-95 transition-all"
            >
              <RefreshCw size={18} strokeWidth={3} /> Re-Synchronize Channel
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Update Modal */}
      {selectedOrder && (
        <InstructorStatusUpdateModal
          isOpen={isStatusModalOpen}
          onClose={() => {
            setIsStatusModalOpen(false);
            setSelectedOrder(null);
          }}
          currentStatus={selectedOrder.status}
          onUpdate={handleStatusUpdate}
          orderNo={selectedOrder.order_no}
        />
      )}
    </motion.div>
  );
};

export default InstructorEnrollList;
