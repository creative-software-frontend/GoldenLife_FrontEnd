import * as React from "react"
import { useAllCoursesQuery } from "@/hooks/useAllCourses"
import CourseGrid from "./CourseGrid"
import { Loader2, Search, ChevronLeft, ChevronRight, RotateCcw, Filter, SearchX, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cartStore"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import StudentCourseDetails from "../StudentCourseDetails/StudentCourseDetails"
import { motion, AnimatePresence } from "framer-motion"
import { useCourseCategoriesQuery } from '@/hooks/useInstructorAuth'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const baseImageURL = 'https://admin.goldenlifeltd.com/uploads/course/course_image/';

/** Custom hook for debouncing state */
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
    React.useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

export default function AllCoursesListView() {
    const { addItem } = useCartStore();
    
    const [searchQuery, setSearchQuery] = React.useState("");
    const [currentPage, setCurrentPage] = React.useState(1);
    const [selectedCourseId, setSelectedCourseId] = React.useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [courseTypeFilter, setCourseTypeFilter] = React.useState("All");
    const [categoryFilter, setCategoryFilter] = React.useState("all");

    const debouncedSearch = useDebounce(searchQuery, 500);

    // Fetch courses with API-side filtering
    const { data: courses = [], isLoading } = useAllCoursesQuery({
        type: courseTypeFilter,
        search: debouncedSearch,
        category_id: categoryFilter
    });
    
    // Fetch categories from API
    const { data: apiCategories = [] } = useCourseCategoriesQuery();
    
    const itemsPerPage = 8;

    // We still apply client-side search/category filtering as a fallback 
    // in case the API doesn't fully support all filter combinations
    const filteredCourses = React.useMemo(() => {
        return courses.filter(course => {
            const matchesSearch = 
                course.course_title_english.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                (course.category_name || "").toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                (course.instructor?.name || "").toLowerCase().includes(debouncedSearch.toLowerCase());
            
            const matchesCategory = categoryFilter === "all" || 
                                   String(course.category_id) === String(categoryFilter) ||
                                   String(course.category) === String(categoryFilter);
            
            const matchesType = courseTypeFilter === "All" || 
                               course.course_type === courseTypeFilter;
            
            return matchesSearch && matchesCategory && matchesType;
        });
    }, [courses, debouncedSearch, categoryFilter, courseTypeFilter]);

    const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCourses = filteredCourses.slice(startIndex, startIndex + itemsPerPage);

    const handleCourseSelect = (course: any) => {
        setSelectedCourseId(course.id.toString());
        setIsModalOpen(true);
    };

    const handleAddToCart = (course: any) => {
        const instructorId = course.instructor_id || course.instructor?.id;
        const instructorName = course.instructor?.name || course.instructor_name || `Instructor #${instructorId}`;

        addItem({
            id: Number(course.id),
            name: course.course_title_english,
            product_title_english: course.course_title_english,
            image: course.image?.startsWith('http') ? course.image : `${baseImageURL}${course.image}`,
            quantity: 1,
            offer_price: Number(course.regular_fee) || 0,
            regular_price: Number(course.offer_fee) || 0,
            type: 'course',
            seller_name: instructorName,
            seller_id: instructorId
        });
    };

    if (isLoading && courses.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-6"
                >
                    <div className="relative">
                        <Loader2 className="h-16 w-16 animate-spin text-emerald-500" strokeWidth={1.5} />
                        <div className="absolute inset-0 blur-xl bg-emerald-500/20 animate-pulse rounded-full" />
                    </div>
                    <div className="text-center space-y-1">
                        <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tighter">Golden Life</h3>
                        <p className="text-slate-500 font-bold tracking-widest animate-pulse uppercase text-[10px]">Syncing with academy...</p>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="bg-[#f8fafc] min-h-screen pb-20 selection:bg-emerald-100">
            {/* --- TOP HEADER SECTION --- */}
            <div className="bg-white border-b border-slate-200/60 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-emerald-50/30 to-transparent pointer-events-none" />
                
                <div className="container mx-auto px-4 py-12 md:py-16">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 max-w-[1760px] mx-auto relative z-10">
                        
                        {/* Title & Description */}
                        <motion.div 
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="space-y-3 px-2 md:px-4"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <span className="h-px w-6 bg-emerald-500 rounded-full" />
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-600">Premium Curricula</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-[1.1]">
                                Explore All <br />
                                <span className="text-emerald-600 italic">Courses</span>
                            </h1>
                            <p className="text-slate-500 font-bold max-w-sm text-xs md:text-sm leading-relaxed">
                                Join thousands of students mastering new skills daily with Golden Life.
                            </p>
                        </motion.div>

                        {/* Search & Filter Controls - Matching InstructorCourseList Style */}
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20 flex flex-col xl:flex-row gap-5 w-full lg:max-w-[1000px] relative"
                        >
                            {isLoading && (
                                <div className="absolute -top-1 left-1/2 -translate-x-1/2">
                                    <div className="h-1 w-24 bg-emerald-500 animate-pulse rounded-full" />
                                </div>
                            )}

                            {/* Search Input */}
                            <div className="relative flex-1 group">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500 group-focus-within:text-emerald-600 transition-colors" size={20} strokeWidth={3} />
                                <Input 
                                    placeholder="Search by title or category..." 
                                    className="pl-14 h-14 bg-gray-50/50 border-none focus:bg-white focus:ring-4 focus:ring-emerald-500/5 rounded-2xl font-bold text-gray-700 transition-all text-base w-full shadow-inner"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-4">
                                {/* Category Filter */}
                                <Select value={categoryFilter} onValueChange={(val) => { setCategoryFilter(val); setCurrentPage(1); }}>
                                    <SelectTrigger className="h-14 w-full sm:w-[200px] bg-gray-50/50 border-none rounded-2xl font-black text-gray-600 focus:ring-4 focus:ring-emerald-500/5 group">
                                        <SelectValue placeholder="All Categories" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-none shadow-2xl p-2 max-h-[400px]">
                                        <SelectItem value="all" className="rounded-xl font-bold py-3 transition-colors focus:bg-emerald-50 focus:text-emerald-600">
                                            <div className="flex items-center justify-between w-full">
                                                All Categories
                                                {categoryFilter === "all" && <Check className="h-4 w-4 ml-2 text-emerald-500" />}
                                            </div>
                                        </SelectItem>
                                        {apiCategories?.map(cat => (
                                            <SelectItem key={cat.id} value={String(cat.id)} className="rounded-xl font-bold py-3 transition-colors focus:bg-emerald-50 focus:text-emerald-600">
                                                <div className="flex items-center justify-between w-full">
                                                    {cat.category_name}
                                                    {String(categoryFilter) === String(cat.id) && <Check className="h-4 w-4 ml-2 text-emerald-500" />}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* Type Filter - Matching InstructorCourseList Values */}
                                <Select value={courseTypeFilter} onValueChange={(val) => { setCourseTypeFilter(val); setCurrentPage(1); }}>
                                    <SelectTrigger className="h-14 w-full sm:w-[180px] bg-gray-50/50 border-none rounded-2xl font-black text-gray-600 focus:ring-4 focus:ring-emerald-500/5 group">
                                        <SelectValue placeholder="All Types" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                                        <SelectItem value="All" className="rounded-xl font-bold py-3 transition-colors focus:bg-emerald-50 focus:text-emerald-600">
                                            <div className="flex items-center justify-between w-full">
                                                All Types
                                                {courseTypeFilter === "All" && <Check className="h-4 w-4 ml-2 text-emerald-500" />}
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="Course (Video)" className="rounded-xl font-bold py-3 transition-colors focus:bg-emerald-50 focus:text-emerald-600">
                                            <div className="flex items-center justify-between w-full">
                                                Course (Video)
                                                {courseTypeFilter === "Course (Video)" && <Check className="h-4 w-4 ml-2 text-emerald-500" />}
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="Live Class" className="rounded-xl font-bold py-3 transition-colors focus:bg-emerald-50 focus:text-emerald-600">
                                            <div className="flex items-center justify-between w-full">
                                                Live Class
                                                {courseTypeFilter === "Live Class" && <Check className="h-4 w-4 ml-2 text-emerald-500" />}
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="Ebook" className="rounded-xl font-bold py-3 transition-colors focus:bg-emerald-50 focus:text-emerald-600">
                                            <div className="flex items-center justify-between w-full">
                                                Ebook
                                                {courseTypeFilter === "Ebook" && <Check className="h-4 w-4 ml-2 text-emerald-500" />}
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Reset Button */}
                                <Button 
                                    variant="outline" 
                                    className="h-14 w-14 p-0 rounded-2xl border-gray-100 bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shrink-0 active:scale-95 shadow-sm"
                                    onClick={() => {
                                        setSearchQuery("");
                                        setCourseTypeFilter("All");
                                        setCategoryFilter("all");
                                        setCurrentPage(1);
                                    }}
                                    title="Reset Filters"
                                >
                                    <RotateCcw className="h-5 w-5" strokeWidth={3} />
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* --- COURSES GRID --- */}
            <div className="container mx-auto px-4 md:px-6 mt-16 max-w-[1760px]">
                <AnimatePresence mode="wait">
                    {paginatedCourses.length > 0 ? (
                        <motion.div 
                            key="grid"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-16"
                        >
                            <CourseGrid 
                                courses={paginatedCourses as any} 
                                title={`${filteredCourses.length} ${filteredCourses.length === 1 ? 'Curriculum' : 'Curricula'} Found`}
                                onSelect={handleCourseSelect}
                                onAddToCart={handleAddToCart}
                            />

                            {/* Premium Pagination */}
                            {totalPages > 1 && (
                                <div className="flex flex-col items-center gap-6">
                                    <div className="flex items-center gap-2 bg-white p-1.5 rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-200/20">
                                        <Button
                                            variant="ghost"
                                            className="h-11 w-11 p-0 rounded-full hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-20 transition-all"
                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft className="h-5 w-5" strokeWidth={3} />
                                        </Button>

                                        <div className="flex items-center gap-1 px-1">
                                            {[...Array(totalPages)].map((_, i) => (
                                                <Button
                                                    key={i + 1}
                                                    variant="ghost"
                                                    className={`h-11 w-11 p-0 rounded-full font-black text-sm transition-all ${
                                                        currentPage === i + 1 
                                                            ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200" 
                                                            : "text-slate-400 hover:bg-emerald-50 hover:text-emerald-600"
                                                    }`}
                                                    onClick={() => setCurrentPage(i + 1)}
                                                >
                                                    {i + 1}
                                                </Button>
                                            ))}
                                        </div>

                                        <Button
                                            variant="ghost"
                                            className="h-11 w-11 p-0 rounded-full hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-20 transition-all"
                                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                            disabled={currentPage === totalPages}
                                        >
                                            <ChevronRight className="h-5 w-5" strokeWidth={3} />
                                        </Button>
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCourses.length)} of {filteredCourses.length}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="empty"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-32 text-center"
                        >
                            <div className="relative inline-flex mb-8">
                                <div className="absolute inset-0 blur-3xl bg-emerald-500/10 rounded-full animate-pulse" />
                                <div className="relative h-28 w-28 rounded-full bg-white border border-slate-100 shadow-2xl flex items-center justify-center">
                                    <SearchX className="h-12 w-12 text-slate-200" strokeWidth={1.5} />
                                </div>
                            </div>
                            <h3 className="text-2xl font-black text-slate-950 mb-3 tracking-tight">No results matched your search</h3>
                            <p className="text-slate-500 font-bold max-w-sm mx-auto mb-10 leading-relaxed">
                                We couldn't find any courses matching your current filters. Try adjusting your search or resetting all filters.
                            </p>
                            <Button 
                                className="bg-gray-900 hover:bg-black text-white px-8 h-14 rounded-2xl font-black shadow-xl transition-all gap-2 active:scale-95 border-none"
                                onClick={() => {
                                    setSearchQuery("");
                                    setCourseTypeFilter("All");
                                    setCategoryFilter("all");
                                    setCurrentPage(1);
                                }}
                            >
                                <RotateCcw size={18} strokeWidth={4} />
                                Reset All Filters
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* --- MODALS --- */}
            {isModalOpen && selectedCourseId && (
                <Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
                    <DialogContent className="max-w-6xl p-0 overflow-hidden border-none bg-transparent shadow-none">
                        <div className="bg-white rounded-[2.5rem] overflow-y-auto max-h-[90vh] shadow-2xl ring-1 ring-black/5">
                            <StudentCourseDetails courseId={selectedCourseId} onClose={() => setIsModalOpen(false)} />
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}
