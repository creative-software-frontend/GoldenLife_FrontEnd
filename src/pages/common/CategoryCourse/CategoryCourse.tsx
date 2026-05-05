import React from 'react';
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Timer, ChevronRight, ArrowUpRight, Star, User, Clock, ShoppingCart, Eye } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import StudentCourseDetails from "../../Home/StudentCourseDetails/StudentCourseDetails";
import { Button } from "@/components/ui/button";
import { useInstructorQuery } from "@/hooks/useInstructor";

interface CategoryWiseCourse {
    id: number;
    course_title_english: string;
    image: string;
    regular_fee: string;
    offer_fee: string;
    course_type: string;
    course_duration: string;
    instructor_name?: string;
    instructor_id?: string | number;
    instructor?: {
        id: number | string;
        name: string;
    };
}

const InstructorName: React.FC<{ instructorId: string | number, fallbackName?: string }> = ({ instructorId, fallbackName }) => {
    const { data: instructor, isLoading } = useInstructorQuery(instructorId);

    if (isLoading) return <span className="animate-pulse bg-slate-100 h-3 w-20 rounded inline-block" />;
    
    return (
        <Link 
            to={`/dashboard/instructor-info/${instructorId}`}
            className="text-[11px] font-bold text-[#3470a2] hover:text-[#0fa958] transition-colors"
        >
            {instructor?.name || fallbackName || 'Golden Life Instructor'}
        </Link>
    );
};

export default function CategoryCourse() {
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation("global");
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { addItem } = useCartStore();
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

    const { data: result, isLoading } = useQuery({
        queryKey: ['categoryWiseCourses', id],
        queryFn: async () => {
            const res = await axios.get(`${baseURL}/api/category-wise?id=${id}`);
            return res.data;
        },
        enabled: !!id
    });

    const courses: CategoryWiseCourse[] = result?.data || [];
    const [selectedCourseId, setSelectedCourseId] = React.useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const handleCourseSelect = (course: CategoryWiseCourse) => {
        setSelectedCourseId(course.id.toString());
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCourseId(null);
    };

    const handleAddToCart = (e: React.MouseEvent, course: CategoryWiseCourse) => {
        e.preventDefault();
        
        // Try to get instructor name from cache if possible
        const instructorId = course.instructor_id || course.instructor?.id;
        
        // Normalize ID to try both string and number in cache
        let instructorData: any = null;
        if (instructorId) {
            instructorData = queryClient.getQueryData(['instructor', String(instructorId)]) || 
                             queryClient.getQueryData(['instructor', Number(instructorId)]);
        }

        const instructorName = instructorData?.name || course.instructor_name || course.instructor?.name || `Instructor #${instructorId}`;

        addItem({
            id: Number(course.id),
            name: course.course_title_english,
            product_title_english: course.course_title_english,
            image: course.image?.startsWith('http') ? course.image : `${baseURL}/uploads/course/course_image/${course.image}`,
            quantity: 1,
            offer_price: Number(course.regular_fee) || 0, // Member Price
            regular_price: Number(course.offer_fee) || 0, // Customer Price
            original_regular_price: Number(course.offer_fee) || 0,
            type: 'course',
            seller_name: instructorName,
            seller_id: instructorId
        });
    };

    if (isLoading) {
        return (
            <div className="w-full py-10 px-4 flex justify-center items-center h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0fa958]"></div>
            </div>
        );
    }

    return (
        <section className="w-full py-8 px-4 bg-[#f8fcfb] min-h-[70vh]">
            <div className="container mx-auto">
                {/* Modern Banner */}
                <div className="bg-[#4a8a5b] rounded-xl mb-8 flex items-center justify-between p-3 md:p-4 shadow-sm">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="bg-white/20 px-4 py-2 rounded-full border border-white/10">
                            <span className="text-white font-bold text-sm">Category Deals</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 bg-black/10 px-4 py-2 rounded-lg border border-black/5">
                            <Timer className="w-4 h-4 text-white" />
                            <span className="text-white font-bold text-sm tracking-wider">02 : 29 : 49</span>
                        </div>
                    </div>
                    <Link to="/courses" className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all border border-white/10">
                        All Courses <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                <h2 className="text-2xl md:text-3xl font-extrabold text-[#0c2a4c] mb-8">
                    {result?.data?.[0]?.category?.category_name || "Category Courses"} ({result?.course_count || 0})
                </h2>
                {courses.length === 0 ? (
                    <p className="text-slate-500 bg-white p-8 rounded-2xl text-center shadow-sm">No courses found for this category.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                        {courses.map((course) => (
                            <div
                                key={course.id}
                                className="group flex flex-col h-full bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <div 
                                    onClick={() => handleCourseSelect(course)} 
                                    className="block h-44 w-full relative overflow-hidden bg-slate-50 cursor-pointer"
                                >
                                    <img
                                        src={course.image?.startsWith('http') ? course.image : `${baseURL}/uploads/course/course_image/${course.image}`}
                                        alt={course.course_title_english}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => { e.currentTarget.src = "/image/logo/logo.jpg"; }}
                                    />
                                </div>
                                <div className="p-4 flex flex-col flex-grow">
                                    {/* Top Info */}
                                    <div className="flex justify-between items-center mb-2.5">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-[#0fa958]"></div>
                                            <span className="text-[10px] font-bold text-[#3470a2] uppercase tracking-wider">
                                                {course.course_type || "MODULEBOOK"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded text-amber-600">
                                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                            <span className="text-[10px] font-bold text-slate-800">4.5</span>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <div onClick={() => handleCourseSelect(course)} className="cursor-pointer">
                                        <h3 className="text-[15px] font-bold text-[#0c2a4c] line-clamp-2 mb-2 group-hover:text-[#0fa958] transition-colors">
                                            {course.course_title_english}
                                        </h3>
                                    </div>

                                    {/* Instructor */}
                                    <div className="flex items-center gap-1.5 mb-3">
                                        <User className="w-3.5 h-3.5 text-slate-400" />
                                        <InstructorName 
                                            instructorId={course.instructor_id || (course.instructor as any)?.id} 
                                            fallbackName={course.instructor_name}
                                        />
                                    </div>

                                    {/* Divider */}
                                    <div className="h-px w-full bg-slate-100 mb-3"></div>

                                    {/* Price and Duration */}
                                    <div className="flex justify-between items-end mb-4">
                                        <div className="flex items-center gap-1.5 mb-0.5">
                                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                                            <span className="text-[11px] font-bold text-[#0c2a4c]">
                                                {course.course_duration || "30days"}
                                            </span>
                                        </div>

                                        <div className="flex flex-col items-end leading-tight">
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">MEMBER:</span>
                                                <span className="text-[18px] font-black text-[#0fa958]">৳{course.regular_fee || 0}</span>
                                            </div>
                                            {course.offer_fee && (
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-[8px] font-bold text-slate-300 uppercase tracking-wider">CUSTOMER:</span>
                                                    <span className="text-[10px] text-slate-400 line-through font-bold">৳{course.offer_fee}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions Footer */}
                                    <div className="flex gap-2 mt-auto">
                                        <Button 
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-lg transition-all font-bold text-xs h-10 rounded-lg gap-2" 
                                            onClick={(e) => handleAddToCart(e, course)}
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            Add to Cart
                                        </Button>
                                        
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="w-10 h-10 shrink-0 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-green-600 transition-all rounded-lg shadow-sm"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleCourseSelect(course);
                                            }}
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isModalOpen && selectedCourseId && (
                <Dialog open={isModalOpen} onOpenChange={closeModal}>
                    <DialogContent className="max-w-6xl p-0 overflow-hidden border-none bg-transparent shadow-none">
                        <div className="bg-white rounded-3xl overflow-y-auto max-h-[90vh]">
                            <StudentCourseDetails courseId={selectedCourseId} onClose={closeModal} />
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </section>
    );
}
