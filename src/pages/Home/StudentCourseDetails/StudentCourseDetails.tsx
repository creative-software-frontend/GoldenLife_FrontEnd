import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudentCourseDetailsQuery } from '@/hooks/useStudentCourses';
import { Loader2, ArrowLeft, Clock, BookOpen, Star, Users, CheckCircle, ShieldCheck, PlayCircle, ShoppingCart } from 'lucide-react';
import { useQueryClient } from "@tanstack/react-query";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '@/store/cartStore';

const baseImageURL = 'https://admin.goldenlifeltd.com/uploads/course/course_image/';

interface StudentCourseDetailsProps {
    courseId?: string;
    onClose?: () => void;
}

const StudentCourseDetails: React.FC<StudentCourseDetailsProps> = ({ courseId, onClose }) => {
    const { id: paramId } = useParams<{ id: string }>();
    const id = courseId || paramId;
    const navigate = useNavigate();
    const { data, isLoading, isError } = useStudentCourseDetailsQuery(id);
    const queryClient = useQueryClient();
    const { t } = useTranslation("global");
    const { addItem } = useCartStore();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
            </div>
        );
    }

    if (isError || !data?.course) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center bg-slate-50 gap-4 w-full">
                <h2 className="text-2xl font-bold text-slate-800">Course Not Found</h2>
                {onClose ? (
                    <Button onClick={onClose} variant="outline">Close</Button>
                ) : (
                    <Button onClick={() => navigate('/allcourses')} variant="outline">
                        Back to Courses
                    </Button>
                )}
            </div>
        );
    }

    const { course } = data;
    const imageUrl = course.image?.startsWith('http') ? course.image : `${baseImageURL}${course.image}`;

    const handleAddToCart = () => {
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
            image: imageUrl,
            quantity: 1,
            offer_price: Number(course.regular_fee) || 0, // Member Price
            regular_price: Number(course.offer_fee) || 0, // Customer Price
            type: 'course',
            seller_name: instructorName,
            seller_id: instructorId
        });
    };

    return (
        <div className={`${onClose ? 'w-full' : 'min-h-screen'} bg-slate-50 pb-20`}>
            {/* Hero Section */}
            <div className="relative w-full h-[400px] md:h-[500px] bg-slate-900 overflow-hidden">
                <img 
                    src={imageUrl} 
                    alt={course.course_title_english} 
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                    onError={(e) => { (e.target as any).src = '/placeholder.svg' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
                
                <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-12 md:pb-16 pt-20">
                    {onClose ? (
                        <button 
                            onClick={onClose}
                            className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors mb-6 font-medium text-sm w-fit group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Close
                        </button>
                    ) : (
                        <button 
                            onClick={() => navigate('/allcourses')}
                            className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors mb-6 font-medium text-sm w-fit group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Courses
                        </button>
                    )}

                    <div className="flex flex-wrap gap-3 mb-4">
                        <Badge className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border-emerald-500/30">
                            {course.course_type}
                        </Badge>
                        <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border-blue-500/30">
                            Category {course.category}
                        </Badge>
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
                        {course.course_title_english}
                    </h1>
                    
                    <p className="text-slate-300 text-lg md:text-xl max-w-2xl mb-6">
                        {course.course_title_bangla}
                    </p>

                    <div className="flex flex-wrap items-center gap-6 text-slate-300 text-sm md:text-base">
                        <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                            <span className="font-bold text-white">4.8</span>
                            <span>(124 reviews)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-slate-400" />
                            <span>1,200+ Students enrolled</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content & Sidebar Container */}
            <div className="container mx-auto px-4 mt-8 md:mt-12">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* Left Column - Details */}
                    <div className="w-full lg:w-2/3 space-y-8">
                        
                        {/* Course Stats Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-2">
                                <Clock className="w-6 h-6 text-emerald-500" />
                                <div className="text-2xl font-bold text-slate-800">{course.course_duration || 'Self-paced'}</div>
                                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Duration</div>
                            </div>
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-2">
                                <BookOpen className="w-6 h-6 text-blue-500" />
                                <div className="text-2xl font-bold text-slate-800">12</div>
                                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Modules</div>
                            </div>
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-2">
                                <PlayCircle className="w-6 h-6 text-purple-500" />
                                <div className="text-2xl font-bold text-slate-800">45+</div>
                                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Lessons</div>
                            </div>
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-2">
                                <ShieldCheck className="w-6 h-6 text-amber-500" />
                                <div className="text-2xl font-bold text-slate-800">Yes</div>
                                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Certificate</div>
                            </div>
                        </div>

                        {/* About Section */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">About this Course</h2>
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-800">English Description</h3>
                                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed" 
                                     dangerouslySetInnerHTML={{ __html: course.course_details_english || 'No description provided.' }} />
                                
                                <div className="h-px w-full bg-slate-100 my-6"></div>

                                <h3 className="text-lg font-bold text-slate-800">Bangla Description</h3>
                                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed" 
                                     dangerouslySetInnerHTML={{ __html: course.course_details_bangla || 'No description provided.' }} />
                            </div>
                        </div>

                        {/* What you'll learn */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">What you'll learn</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    "Master the core concepts and principles.",
                                    "Build real-world projects from scratch.",
                                    "Learn industry best practices.",
                                    "Understand advanced techniques.",
                                    "Optimize performance and scaling.",
                                    "Prepare for technical interviews."
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                        <span className="text-slate-600 font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right Column - Sticky Sidebar */}
                    <div className="w-full lg:w-1/3">
                        <div className="sticky top-24 bg-white rounded-3xl shadow-lg border border-slate-100 p-6 overflow-hidden">
                            
                            {/* Accent line at top */}
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>

                            <div className="mb-8 mt-2">
                                <div className="flex items-end gap-3 mb-2">
                                    <span className="text-4xl font-extrabold text-slate-900">৳{course.offer_fee}</span>
                                    <span className="text-lg font-medium text-slate-400 line-through mb-1">৳{course.regular_fee}</span>
                                </div>
                                <div className="inline-block bg-emerald-50 text-emerald-600 font-bold px-3 py-1 rounded-md text-sm">
                                    Save ৳{Number(course.regular_fee) - Number(course.offer_fee)}
                                </div>
                            </div>

                            <Button 
                                onClick={handleAddToCart}
                                className="w-full h-14 text-lg font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-emerald-500/20 shadow-lg transition-all hover:-translate-y-1"
                            >
                                <ShoppingCart className="w-5 h-5 mr-2" />
                                Add to Cart
                            </Button>

                            <div className="mt-8 space-y-4">
                                <h4 className="font-bold text-slate-900">This course includes:</h4>
                                <ul className="space-y-3 text-sm text-slate-600 font-medium">
                                    <li className="flex items-center gap-3">
                                        <PlayCircle className="w-4 h-4 text-emerald-500" />
                                        Full lifetime access
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <BookOpen className="w-4 h-4 text-blue-500" />
                                        Comprehensive learning materials
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <ShieldCheck className="w-4 h-4 text-amber-500" />
                                        Certificate of completion
                                    </li>
                                </ul>
                            </div>

                            {/* Earning Value Banner */}
                            {Number(course.earning_value) > 0 && (
                                <div className="mt-8 bg-amber-50 rounded-xl p-4 border border-amber-100 text-center">
                                    <div className="text-sm font-bold text-amber-800 uppercase tracking-wider mb-1">Reseller Bonus</div>
                                    <div className="text-amber-600 font-medium text-sm">
                                        Earn <span className="font-bold">৳{course.earning_value}</span> when you resell this course!
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default StudentCourseDetails;
