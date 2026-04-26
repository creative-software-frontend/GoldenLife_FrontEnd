import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  MoreVertical,
  BookOpen,
  Clock,
  Star,
  Edit,
  Eye,
  LayoutGrid,
  List as ListIcon,
  ChevronRight,
  TrendingUp,
  Award,
  Users,
  SearchX,
  RotateCcw,
  Loader2,
  AlertCircle,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInstructorCoursesQuery } from '@/hooks/useInstructorAuth';

const baseImageURL = 'https://admin.goldenlifeltd.com/uploads/course/course_image/';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

const InstrutorCourseList: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // ── Real API data ──────────────────────────────────────────────────────────
  const { data: courses = [], isLoading, isError, error, refetch } = useInstructorCoursesQuery();

  // Derive unique categories from the fetched data
  const categories = useMemo(() => [...new Set(courses.map(c => c.category).filter(Boolean))], [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch =
        course.course_title_english.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course.category || '').toLowerCase().includes(searchQuery.toLowerCase());
      const isActive = String(course.status) === '1';
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && isActive) ||
        (statusFilter === 'inactive' && !isActive);
      const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [courses, searchQuery, statusFilter, categoryFilter]);

  const statusLabel = (s?: string | number) => (String(s) === '1' ? 'ACTIVE' : 'INACTIVE');
  const statusColor = (s?: string | number) => (String(s) === '1' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white');
  const courseImage = (img?: string) => {
    if (!img) return null;
    if (img.startsWith('http')) return img;
    const path = img.startsWith('/') ? img.substring(1) : img;
    return `${baseImageURL}${path}`;
  };
  // ── Loading State ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 size={40} className="animate-spin text-emerald-500" />
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Courses…</p>
      </div>
    );
  }

  // ── Error State ────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <div className="p-6 bg-red-50 rounded-3xl text-red-400">
          <AlertCircle size={48} strokeWidth={1.5} />
        </div>
        <div className="text-center space-y-2">
          <p className="font-black text-gray-900 text-lg">Failed to load courses</p>
          <p className="text-sm text-gray-400 font-medium">{(error as any)?.message || 'Please check your connection and try again.'}</p>
        </div>
        <Button onClick={() => refetch()} className="rounded-2xl bg-black text-white px-8 h-12 font-bold gap-2">
          <RotateCcw size={16} strokeWidth={3} /> Retry
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-4 sm:p-6 md:p-8 max-w-[1760px] mx-auto space-y-10"
    >
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <motion.div variants={itemVariants} className="space-y-1">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            Course Management
            <Badge className="bg-emerald-50 text-emerald-700 border-none rounded-lg px-2 py-0.5 text-xs font-black">
              {courses.length} CURRICULA
            </Badge>
          </h1>
          <p className="text-gray-500 font-bold tracking-normal text-sm">Manage, filter, and evolve your educational assets.</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Button
            onClick={() => navigate('add')}
            className="bg-gray-900 hover:bg-black text-white shadow-2xl shadow-black/10 px-8 py-6 rounded-2xl font-black gap-3 transition-all hover:scale-[1.02] active:scale-95 h-auto group border-none"
          >
            <Plus size={18} strokeWidth={4} />
            Add New Course
          </Button>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Courses', value: String(courses.length), icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Published', value: String(courses.filter(c => c.status === '1' || c.status === 'published').length), icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Drafts', value: String(courses.filter(c => c.status !== '1' && c.status !== 'published').length), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Course Types', value: String(new Set(courses.map(c => c.course_type)).size), icon: Award, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-3xl overflow-hidden bg-white group cursor-default">
            <CardContent className="p-6 flex items-center gap-5">
              <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl group-hover:scale-110 transition-transform duration-500 ring-4 ring-white`}>
                <stat.icon size={26} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-xl font-black text-gray-900 leading-none tracking-tight">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20 flex flex-col xl:flex-row gap-5 sticky top-4 z-40">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={20} strokeWidth={3} />
          <Input
            placeholder="Search by title or category..."
            className="pl-14 h-14 bg-gray-50/50 border-none focus:bg-white focus:ring-4 focus:ring-emerald-500/5 rounded-2xl font-bold text-gray-700 transition-all text-base max-w-2xl w-full shadow-inner"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {categories.length > 0 && (
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-14 w-[180px] bg-gray-50/50 border-none rounded-2xl font-black text-gray-600 focus:ring-4 focus:ring-emerald-500/5">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-2xl">
                <SelectItem value="all" className="font-bold">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat} className="font-bold text-emerald-600">{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-14 w-[160px] bg-gray-50/50 border-none rounded-2xl font-black text-gray-600 focus:ring-4 focus:ring-emerald-500/5">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-2xl">
              <SelectItem value="all" className="font-bold">All Status</SelectItem>
              <SelectItem value="active" className="font-bold text-emerald-600">Active</SelectItem>
              <SelectItem value="inactive" className="font-bold text-red-600">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
            className="h-14 px-6 rounded-2xl border-gray-100 font-black text-xs uppercase gap-3 hover:bg-gray-900 hover:text-white transition-all shadow-sm active:scale-95"
          >
            {viewMode === 'grid' ? <><ListIcon size={18} strokeWidth={3} /> Switch View</> : <><LayoutGrid size={18} strokeWidth={3} /> Switch View</>}
          </Button>
        </div>
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'table' ? (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="hidden lg:block bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden"
          >
            <div className="overflow-x-auto no-scrollbar">
              <Table className="min-w-[1000px]">
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-gray-50 uppercase tracking-[0.1em] text-[10px]">
                    <TableHead className="h-20 font-black text-gray-400 px-6">Curriculum</TableHead>
                    <TableHead className="h-20 font-black text-gray-400 px-6">Type</TableHead>
                    <TableHead className="h-20 font-black text-gray-400 px-6">Regular Price (MRP)</TableHead>
                    <TableHead className="h-20 font-black text-gray-400 px-6">Offer Price (Selling)</TableHead>
                    <TableHead className="h-20 font-black text-gray-400 px-6 text-center">Status</TableHead>
                    <TableHead className="h-20 font-black text-gray-400 px-6 text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.map((course) => {
                    const img = courseImage(course.image);
                    return (
                      <TableRow key={course.id} className="group hover:bg-emerald-50/[0.03] transition-colors border-b border-gray-50 last:border-0">
                        <TableCell className="px-6 py-8">
                          <div className="flex items-center gap-6 overflow-hidden">
                            <div className="w-20 h-14 rounded-2xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100 group-hover:scale-105 transition-transform duration-500">
                              {img
                                ? <img src={img} alt={course.course_title_english} className="w-full h-full object-cover" />
                                : <div className="w-full h-full bg-emerald-500/5 flex items-center justify-center text-emerald-500 font-black text-[9px] tracking-tighter">GL</div>
                              }
                            </div>
                            <div className="flex flex-col gap-0.5 overflow-hidden">
                              <p className="font-black text-gray-900 group-hover:text-emerald-500 transition-colors text-base tracking-tight leading-tight line-clamp-2 max-w-[380px]">
                                {course.course_title_english}
                              </p>
                              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest whitespace-nowrap">
                                {course.course_title_bangla}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6">
                          <div className="w-36 h-11 bg-emerald-50 text-emerald-700 font-black rounded-xl text-[10px] uppercase flex items-center justify-center tracking-widest border border-emerald-100 shadow-sm">
                            {course.course_type}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 font-bold text-gray-400 text-lg line-through italic">৳{course.offer_fee}</TableCell>
                        <TableCell className="px-6 font-bold text-orange-500 text-xl tracking-tighter">৳{course.regular_fee}</TableCell>
                        <TableCell className="px-6 text-center">
                          <Badge className={`font-black border-none px-5 py-2 rounded-2xl text-[9px] tracking-[0.1em] uppercase ${statusColor(course.status)}`}>
                            {statusLabel(course.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 text-right pr-6">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-12 w-12 rounded-2xl hover:bg-gray-100 transition-all">
                                <MoreVertical size={24} className="text-gray-400" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 min-w-[190px]">
                              <DropdownMenuLabel className="font-black text-[9px] uppercase text-gray-400 px-3 py-2 tracking-widest">Management</DropdownMenuLabel>
                              <DropdownMenuItem 
                                className="rounded-xl font-black gap-3 py-3 px-3 cursor-pointer group text-sm"
                                onClick={() => navigate(`/instructor/dashboard/courses/view/${course.id}`)}
                              >
                                <Eye size={18} className="text-blue-500 group-hover:scale-110 transition-transform" /> View details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="rounded-xl font-black gap-3 py-3 px-3 cursor-pointer group text-sm"
                                onClick={() => navigate(`/instructor/dashboard/courses/update/${course.id}`)}
                              >
                                <Edit size={18} className="text-emerald-500 group-hover:scale-110 transition-transform" /> Edit Course
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial="hidden" animate="visible"
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8"
          >
            {filteredCourses.map((course) => {
              const img = courseImage(course.image);
              return (
                <motion.div key={course.id} variants={itemVariants}>
                  <Card className="group border-none shadow-sm hover:shadow-2xl transition-all duration-700 rounded-[2.5rem] overflow-hidden bg-white ring-1 ring-gray-100 flex flex-col h-full transform-gpu">
                    <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden">
                      {img
                        ? <img src={img} alt={course.course_title_english} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        : <div className="w-full h-full bg-emerald-500/[0.03] flex items-center justify-center text-emerald-500 font-black text-3xl tracking-tighter opacity-70 group-hover:scale-105 transition-transform duration-1000 select-none">GL</div>
                      }
                      <div className="absolute top-5 right-5 z-20">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="bg-white/95 backdrop-blur-md p-3 rounded-2xl text-gray-700 shadow-xl hover:bg-emerald-500 hover:text-white transition-all transform active:scale-90">
                              <MoreVertical size={20} strokeWidth={3} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 min-w-[160px]">
                            <DropdownMenuItem className="rounded-xl font-black py-3 px-4" onClick={() => navigate(`/instructor/dashboard/courses/update/${course.id}`)}>

                              <Edit size={16} className="mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl font-black py-3 px-4" onClick={() => navigate(`/instructor/dashboard/courses/view/${course.id}`)}>
                              <Eye size={16} className="mr-2" /> View
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <Badge className={`absolute bottom-5 left-5 font-black border-none px-5 py-2 rounded-2xl shadow-xl transition-all duration-500 z-10 ${statusColor(course.status)}`}>
                        {statusLabel(course.status)}
                      </Badge>
                    </div>

                    <CardContent className="p-5 sm:p-6 space-y-5 flex-1 flex flex-col">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2.5 text-emerald-600 font-black text-[9px] uppercase tracking-[0.2em]">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                          {course.course_type}
                        </div>
                        <h3 className="text-base font-black text-gray-900 group-hover:text-emerald-600 transition-colors leading-tight line-clamp-2 tracking-tight">
                          {course.course_title_english}
                        </h3>
                        <p className="text-xs text-gray-400 font-medium line-clamp-1">{course.course_title_bangla}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50 my-auto">
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-gray-400 tracking-[0.2em] uppercase">MRP</p>
                          <p className="text-sm font-bold text-gray-400 line-through tracking-tight italic">৳{course.offer_fee}</p>
                        </div>
                        <div className="space-y-1 text-right">
                          <p className="text-[9px] font-black text-orange-500 tracking-[0.2em] uppercase">Selling</p>
                          <p className="text-lg font-black text-orange-500 tracking-tight">৳{course.regular_fee}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="space-y-0.5">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Duration</p>
                          <p className="text-sm font-black text-gray-700 tracking-tight">{course.course_duration || '—'}</p>
                        </div>
                        <Button
                          variant="secondary"
                          onClick={() => navigate(`/instructor/dashboard/courses/edit/${course.id}`)}
                          className="bg-gray-100 hover:bg-gray-900 hover:text-white text-gray-900 font-black px-5 h-10 rounded-xl transition-all group/btn shadow-sm active:scale-95 leading-none"
                        >
                          Edit
                          <ChevronRight size={16} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      <AnimatePresence>
        {filteredCourses.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="py-32 text-center flex flex-col items-center gap-8 bg-gradient-to-br from-white to-gray-50/50 rounded-[4rem] border-2 border-dashed border-gray-200 shadow-inner"
          >
            <div className="p-12 bg-white rounded-full shadow-2xl text-orange-500 animate-pulse relative">
              <SearchX size={80} strokeWidth={1} />
              <div className="absolute top-0 right-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center border-4 border-white">
                <Clock size={16} />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-black text-gray-900 italic tracking-tighter uppercase">No Courses Found.</h3>
              <p className="text-gray-500 font-bold max-w-sm mx-auto leading-relaxed px-10">
                {courses.length === 0 ? "You haven't created any courses yet." : "No courses match your current filters."}
              </p>
            </div>
            {courses.length === 0 ? (
              <Button onClick={() => navigate('add')} className="rounded-3xl font-black px-12 h-16 bg-[#FF8A00] text-white hover:bg-orange-600 transition-all active:scale-95 shadow-xl shadow-orange-500/30 gap-3">
                <Plus size={20} strokeWidth={3} /> Create First Course
              </Button>
            ) : (
              <Button onClick={() => { setSearchQuery(''); setStatusFilter('all'); setCategoryFilter('all'); }}
                className="rounded-3xl font-black px-12 h-16 bg-[#FF8A00] text-white hover:bg-orange-600 transition-all active:scale-95 shadow-xl shadow-orange-500/30 gap-3">
                <RotateCcw size={20} strokeWidth={3} /> Reset Filters
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InstrutorCourseList;
