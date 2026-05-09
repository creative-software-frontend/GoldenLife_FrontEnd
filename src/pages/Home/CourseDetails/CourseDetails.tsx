import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useCourseDetailsQuery } from '@/hooks/useAllCourses';
import { Loader2, ArrowLeft, Clock, BookOpen, Star, Users, CheckCircle, ShieldCheck, PlayCircle, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '@/store/cartStore';

const baseImageURL = 'https://admin.goldenlifeltd.com/uploads/course/course_image/';

interface CourseDetailsProps {
    courseId?: string;
    onClose?: () => void;
}

export default function CourseDetails({ courseId, onClose }: CourseDetailsProps) {
    const { id: paramId } = useParams<{ id: string }>();
    const location = useLocation();

    // Attempt to get ID from props, params, or location state
    const id = courseId || paramId || location.state?.id;
    const navigate = useNavigate();
    const { data: course, isLoading, isError } = useCourseDetailsQuery(id);
    const { t } = useTranslation("global");
    const { addItem } = useCartStore();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
            </div>
        );
    }

    if (isError || !course) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center bg-slate-50 gap-4 w-full">
                <h2 className="text-2xl font-bold text-slate-800">Course Not Found</h2>
                {onClose ? (
                    <Button onClick={onClose} variant="outline">Close</Button>
                ) : (
                    <Button onClick={() => navigate('/all-courses-view')} variant="outline">
                        Back to Courses
                    </Button>
                )}
            </div>
        );
    }

    const imageUrl = course.image?.startsWith('http') ? course.image : `${baseImageURL}${course.image}`;

    const handleAddToCart = () => {
        const instructorId = course.instructor_id || course.instructor?.id;
        const instructorName = course.instructor?.name || `Instructor #${instructorId}`;

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
            seller_id: instructorId ? String(instructorId) : `course_${course.id}`
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
                            onClick={() => navigate('/all-courses-view')}
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
                            Category: {typeof course.category === 'object' ? course.category?.category_name : course.category}
                        </Badge>
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
                        {course.course_title_english}
                    </h1>

                    <p className="text-slate-300 ext-lg md:text-xl max-w-2xl mb-6">
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column - Details */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Course Stats Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-2">
                                <Clock className="w-6 h-6 text-emerald-500" />
                                <div className="text-xl md:text-2xl font-bold text-slate-800">{course.course_duration || 'Self-paced'}</div>
                                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Duration</div>
                            </div>
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-2">
                                <BookOpen className="w-6 h-6 text-blue-500" />
                                <div className="text-xl md:text-2xl font-bold text-slate-800">{course.modules?.length || 12}</div>
                                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Modules</div>
                            </div>
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-2">
                                <PlayCircle className="w-6 h-6 text-purple-500" />
                                <div className="text-xl md:text-2xl font-bold text-slate-800">{course.course_code || '45+'}</div>
                                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Code</div>
                            </div>
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-2">
                                <ShieldCheck className="w-6 h-6 text-amber-500" />
                                <div className="text-xl md:text-2xl font-bold text-slate-800">Yes</div>
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

                        {/* Instructor Info */}
                        {course.instructor && (
                            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">Instructor</h2>
                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                    <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 border-4 border-emerald-50">
                                        <img src={`https://admin.goldenlifeltd.com/uploads/instructor/image/${course.instructor.image}`} alt={course.instructor.name} className="w-full h-full object-cover" onError={(e) => { (e.target as any).src = '/placeholder.svg' }} />
                                    </div>
                                    <div className="text-center sm:text-left space-y-2">
                                        <h3 className="text-xl font-bold text-slate-800">{course.instructor.name}</h3>
                                        <p className="text-sm font-medium text-emerald-600">{course.instructor.designation} at {course.instructor.business_name || course.instructor.department}</p>
                                        <p className="text-sm text-slate-600 max-w-xl">
                                            {course.instructor.qualification} with {course.instructor.experience} years of experience.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Modules & Curriculum */}
                        {(course.modules?.length > 0 || course.quizzes?.length > 0) && (
                            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">Curriculum</h2>

                                <div className="space-y-6">
                                    {/* Modules and Lessons */}
                                    {course.modules?.map((module: any, i: number) => (
                                        <div key={module.id || i} className="border border-slate-200 rounded-2xl overflow-hidden hover:border-emerald-200 transition-colors">
                                            {/* Module Header */}
                                            <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-3">
                                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 text-sm shrink-0">
                                                        {i + 1}
                                                    </span>
                                                    {module.module_title}
                                                </h3>
                                                <Badge variant="outline" className="text-slate-500 w-fit">
                                                    {module.lessons?.length || 0} Lessons
                                                </Badge>
                                            </div>

                                            {/* Lessons List */}
                                            {module.lessons && module.lessons.length > 0 ? (
                                                <div className="p-4 space-y-3">
                                                    {module.lessons.map((lesson: any, idx: number) => (
                                                        <div key={lesson.id || idx} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                                            <PlayCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                                            <div>
                                                                <p className="font-semibold text-slate-700">{lesson.lesson_title}</p>
                                                                {lesson.lesson_duration && (
                                                                    <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1">
                                                                        <Clock className="w-3 h-3" />
                                                                        {lesson.lesson_duration}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-4 text-sm text-slate-400 font-medium italic">
                                                    No lessons added yet.
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {/* Quizzes */}
                                    {course.quizzes?.length > 0 && (
                                        <div className="mt-8">
                                            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                <ShieldCheck className="w-6 h-6 text-amber-500" />
                                                Assessments & Quizzes
                                            </h3>
                                            <div className="space-y-3">
                                                {course.quizzes.map((quiz: any, idx: number) => (
                                                    <div key={quiz.id || idx} className="border border-amber-100 bg-amber-50/30 rounded-xl p-4 flex items-center gap-3">
                                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-700 text-sm shrink-0">
                                                            Q{idx + 1}
                                                        </span>
                                                        <p className="font-bold text-amber-900">{quiz.quiz_title || quiz.title || 'Quiz Assessment'}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Right Column - Sticky Sidebar */}
                    <div className="lg:col-span-1">
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
}
