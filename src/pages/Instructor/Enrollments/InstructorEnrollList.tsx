import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Calendar,
  CheckCircle2,
  Clock,
  Mail,
  UserCheck,
  SearchX,
  RefreshCw,
  LayoutGrid,
  List as ListIcon,
  TrendingUp,
  DollarSign
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
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Dummy Data for Enrollments
const DUMMY_ENROLLMENTS = [
  {
    id: "ENR-001",
    student: {
      name: "Ariful Islam",
      email: "arif.islam@example.com",
      phone: "+880 1712-345678",
      avatar: "AI"
    },
    course: "Mastering React.js & Modern Web Development",
    enrollmentDate: "2026-04-18",
    amount: 2500,
    paymentStatus: "completed",
    status: "active",
  },
  {
    id: "ENR-002",
    student: {
      name: "Tahmina Akter",
      email: "tahmina.a@example.com",
      phone: "+880 1912-888999",
      avatar: "TA"
    },
    course: "Complete Graphics Design Bootcamp 2026",
    enrollmentDate: "2026-04-19",
    amount: 1800,
    paymentStatus: "pending",
    status: "pending",
  },
  {
    id: "ENR-003",
    student: {
      name: "Rakib Hassan",
      email: "rakib.h@example.com",
      phone: "+880 1812-111222",
      avatar: "RH"
    },
    course: "Digital Marketing Fundamentals",
    enrollmentDate: "2026-04-20",
    amount: 1500,
    paymentStatus: "completed",
    status: "active",
  },
  {
    id: "ENR-004",
    student: {
      name: "Sabina Yeasmin",
      email: "sabina.y@example.com",
      phone: "+880 1512-555666",
      avatar: "SY"
    },
    course: "Advanced Data Science with Python",
    enrollmentDate: "2026-04-21",
    amount: 3200,
    paymentStatus: "completed",
    status: "active",
  }
];

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
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredEnrollments = useMemo(() => {
    return DUMMY_ENROLLMENTS.filter(enroll => {
      const matchesSearch = 
        enroll.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        enroll.course.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPayment = paymentFilter === 'all' || enroll.paymentStatus === paymentFilter;
      const matchesStatus = statusFilter === 'all' || enroll.status === statusFilter;
      return matchesSearch && matchesPayment && matchesStatus;
    });
  }, [searchQuery, paymentFilter, statusFilter]);

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-4 sm:p-6 md:p-8 max-w-[1760px] mx-auto space-y-10"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div variants={itemVariants} className="space-y-1">
          <div className="flex items-center gap-4">
             <div className="bg-emerald-600 p-2.5 rounded-2xl text-white shadow-xl shadow-emerald-600/20">
                <UserCheck size={28} strokeWidth={2.5} />
             </div>
             <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Student Enrollments</h1>
                <p className="text-gray-500 font-bold text-sm">Monitor acquisition signals with precision.</p>
             </div>
          </div>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-gray-900 text-white rounded-[2.5rem] overflow-hidden relative group">
           <CardContent className="p-8 space-y-2 relative z-10">
              <p className="text-white/40 font-black uppercase tracking-[0.2em] text-[9px]">Total Learners</p>
              <h2 className="text-4xl font-black tracking-tighter">1,248</h2>
              <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-black pt-2 uppercase">
                 <TrendingUp size={14} /> +14.2% Growth
              </div>
           </CardContent>
           <UserCheck className="absolute right-[-10px] bottom-[-10px] w-36 h-36 text-white/[0.04] group-hover:scale-125 transition-transform duration-1000" />
        </Card>

        <Card className="border-none shadow-sm bg-white rounded-[2.5rem] overflow-hidden group ring-1 ring-gray-100">
           <CardContent className="p-8 space-y-2 border-l-8 border-amber-500">
              <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">Awaiting Settlement</p>
              <h2 className="text-4xl font-black tracking-tighter text-amber-500">৳45,200</h2>
              <div className="flex items-center gap-2 text-gray-500 text-[11px] font-black pt-2 uppercase">
                 <Clock size={14} className="text-amber-400" /> Action Required
              </div>
           </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white rounded-[2.5rem] overflow-hidden group ring-1 ring-gray-100">
           <CardContent className="p-8 space-y-2 border-l-8 border-emerald-500">
              <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">Settled Value</p>
              <h2 className="text-4xl font-black tracking-tighter text-emerald-600">৳2,18,500</h2>
              <div className="flex items-center gap-2 text-gray-500 text-[11px] font-black pt-2 uppercase">
                 <DollarSign size={14} className="text-emerald-500" /> Available Credit
              </div>
           </CardContent>
        </Card>
      </motion.div>

      {/* Control Engine */}
      <motion.div variants={itemVariants} className="flex flex-col xl:flex-row items-center gap-6 bg-white p-5 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/10">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={20} strokeWidth={3} />
          <Input 
            placeholder="Search student identity, course title, or transaction ID..." 
            className="pl-14 h-14 bg-gray-50/50 border-none focus:ring-4 focus:ring-emerald-500/5 rounded-[1.5rem] font-bold text-gray-700 transition-all text-base w-full max-w-4xl shadow-inner"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-4 w-full xl:w-auto">
          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
             <SelectTrigger className="h-14 w-full xl:w-[160px] bg-gray-50/50 border-none rounded-2xl font-black text-gray-600 px-6 shadow-sm">
                <SelectValue placeholder="Payment" />
             </SelectTrigger>
             <SelectContent className="rounded-2xl border-none shadow-2xl">
                <SelectItem value="all" className="font-bold">Payments</SelectItem>
                <SelectItem value="completed" className="font-bold text-emerald-600">Completed</SelectItem>
                <SelectItem value="pending" className="font-bold text-amber-600">Pending</SelectItem>
             </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
             <SelectTrigger className="h-14 w-full xl:w-[160px] bg-gray-50/50 border-none rounded-2xl font-black text-gray-600 px-6 shadow-sm">
                <SelectValue placeholder="Status" />
             </SelectTrigger>
             <SelectContent className="rounded-2xl border-none shadow-2xl">
                <SelectItem value="all" className="font-bold">Lifecycle</SelectItem>
                <SelectItem value="active" className="font-bold text-emerald-600">Active</SelectItem>
                <SelectItem value="pending" className="font-bold text-amber-600">Pending</SelectItem>
             </SelectContent>
          </Select>

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
        </div>
      </motion.div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {viewMode === 'table' ? (
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
                  <TableRow className="hover:bg-transparent border-b border-gray-50 uppercase tracking-[0.1em] text-[9px]">
                    <TableHead className="h-20 font-black text-gray-400 px-6">Entry Token</TableHead>
                    <TableHead className="h-20 font-black text-gray-400 px-6">Student Silhouette</TableHead>
                    <TableHead className="h-20 font-black text-gray-400 px-6">Target Track</TableHead>
                    <TableHead className="h-20 font-black text-gray-400 px-6">Yield</TableHead>
                    <TableHead className="h-20 font-black text-gray-400 px-10 text-center">Lifecycle</TableHead>
                    <TableHead className="h-20 font-black text-gray-400 px-6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEnrollments.map((enroll) => (
                    <TableRow key={enroll.id} className="group hover:bg-emerald-50/[0.02] transition-colors border-b border-gray-50 last:border-0">
                      <TableCell className="px-6 py-8">
                         <div className="flex flex-col gap-0.5 whitespace-nowrap">
                            <p className="font-black text-emerald-600 text-[10px] tracking-widest">{enroll.id}</p>
                            <p className="text-[10px] font-black text-gray-400 flex items-center gap-1 uppercase">
                               <Calendar size={10} strokeWidth={3} /> {enroll.enrollmentDate}
                            </p>
                         </div>
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10 border-2 border-white shadow-md ring-1 ring-gray-100">
                            <AvatarFallback className="bg-emerald-50 text-emerald-600 font-black text-[10px]">{enroll.student.avatar}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-0.5">
                            <p className="font-black text-gray-900 group-hover:text-emerald-600 transition-colors text-sm tracking-tight">{enroll.student.name}</p>
                            <p className="text-[10px] text-gray-400 font-black flex items-center gap-1 lowercase">
                               <Mail size={10} /> {enroll.student.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                         <p className="text-sm font-black text-gray-700 tracking-tight leading-tight line-clamp-2 max-w-[320px]">
                            {enroll.course}
                         </p>
                      </TableCell>
                      <TableCell className="px-6 font-black text-gray-900 italic text-base">
                        ৳{enroll.amount}
                      </TableCell>
                      <TableCell className="px-10 text-center">
                         <div className="w-[110px] h-[36px] bg-emerald-50 text-emerald-700 font-black rounded-xl text-[9px] uppercase flex items-center justify-center tracking-widest border border-emerald-100 shadow-sm mx-auto select-none">
                          {enroll.status}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 text-right">
                         <div className="flex items-center justify-end gap-2.5">
                            <Button variant="outline" className="h-9 px-5 rounded-lg font-black text-[9px] text-gray-600 uppercase transition-all shadow-sm">
                               View
                            </Button>
                            <Button className="h-9 px-5 rounded-lg font-black text-[9px] bg-[#FF8A00] hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 active:scale-95 transition-all">
                               Update
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
            {filteredEnrollments.map((enroll) => (
              <motion.div key={enroll.id} variants={itemVariants}>
                <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white ring-1 ring-gray-100 group hover:shadow-2xl transition-all duration-700 flex flex-col h-full transform-gpu">
                   <CardContent className="p-0 flex-1 flex flex-col">
                      <div className="p-8 bg-gray-50/50 flex flex-col items-center text-center space-y-4 relative border-b border-gray-50">
                          <Avatar className="h-20 w-20 border-4 border-white shadow-xl transform transition-all duration-700 group-hover:scale-110">
                            <AvatarFallback className="bg-emerald-600 text-white font-black text-lg">{enroll.student.avatar}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <p className="font-black text-lg text-gray-900 tracking-tight leading-none">{enroll.student.name}</p>
                            <p className="text-[9px] font-black text-emerald-600 tracking-widest uppercase">{enroll.id}</p>
                          </div>
                      </div>
                      
                      <div className="p-7 space-y-7 flex-1 flex flex-col">
                         <div className="space-y-1 text-center">
                            <p className="text-[10px] font-black text-gray-800 leading-snug line-clamp-2 px-1">{enroll.course}</p>
                         </div>

                         <div className="grid grid-cols-2 gap-4 py-5 border-y border-gray-50 mt-auto">
                            <div className="space-y-0.5 text-center border-r border-gray-50">
                               <p className="text-[8px] font-black text-gray-400 tracking-widest uppercase">Yield</p>
                               <p className="text-base font-black text-emerald-600 italic tracking-tighter leading-none">৳{enroll.amount}</p>
                            </div>
                            <div className="space-y-0.5 text-center">
                               <p className="text-[8px] font-black text-gray-400 tracking-widest uppercase">Lifecycle</p>
                               <p className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter leading-none">{enroll.status}</p>
                            </div>
                         </div>

                         <div className="flex gap-3 pt-1">
                            <Button variant="outline" className="flex-1 h-12 rounded-2xl border-gray-200 font-black text-[10px] text-gray-600 hover:bg-gray-900 hover:text-white transition-all uppercase">
                              View Profile
                            </Button>
                            <Button className="flex-1 h-12 rounded-2xl bg-[#FF8A00] hover:bg-orange-600 text-white font-black text-[10px] shadow-xl shadow-orange-500/20 active:scale-95 transition-all uppercase">
                              Update
                            </Button>
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
        {filteredEnrollments.length === 0 && (
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
                 <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Reception Zero.</h3>
                 <p className="text-gray-500 font-bold max-w-sm mx-auto leading-relaxed px-10 text-sm">No signals detected on the current frequency. Resetting filters might re-establish connection.</p>
              </div>
              <Button 
                onClick={() => { setSearchQuery(''); setPaymentFilter('all'); setStatusFilter('all'); }} 
                className="h-15 px-12 rounded-3xl bg-[#FF8A00] hover:bg-orange-600 text-white font-black gap-3 shadow-2xl shadow-orange-500/20 active:scale-95 transition-all"
              >
                 <RefreshCw size={18} strokeWidth={3} /> Synchronize Channel
              </Button>
           </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InstructorEnrollList;
