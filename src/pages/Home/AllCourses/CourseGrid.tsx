import * as React from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, ShoppingCart, Star, User, Clock, ChevronRight, Eye, Loader2 } from 'lucide-react'
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { useInstructorQuery } from "@/hooks/useInstructor"

interface Lesson {
    id: number | string
    instructor_id: string | number
    course_title_english: string
    course_type: string
    image: string
    instructor_name?: string
    instructor?: {
        id: number | string
        instructor_id?: string | number
        name: string
    }
    rating?: number
    studentsEnrolled?: number
    course_duration?: string
    regular_fee: string
    offer_fee: string
    badge?: string
    color?: string
}

const InstructorName: React.FC<{ instructorId: string | number, fallbackName?: string }> = ({ instructorId, fallbackName }) => {
    const { data: instructor, isLoading } = useInstructorQuery(instructorId);

    if (isLoading) return <span className="animate-pulse bg-slate-100 h-3 w-20 rounded inline-block" />;
    
    return (
        <Link 
            to={`/dashboard/instructor-info/${instructorId}`}
            className="line-clamp-1 font-bold text-slate-700 hover:text-emerald-600 transition-colors"
        >
            {instructor?.name || fallbackName || 'Golden Life Instructor'}
        </Link>
    );
};

const baseImageURL = 'https://admin.goldenlifeltd.com/uploads/course/course_image/';

const CourseGrid: React.FC<{
    courses: Lesson[],
    title: string,
    onSelect: (lesson: Lesson) => void,
    onAddToCart: (lesson: Lesson) => void
}> = ({ courses, title, onSelect, onAddToCart }) => {
    const [t] = useTranslation("global")
    const [showAll, setShowAll] = React.useState(false)

    const displayedCourses = showAll ? courses : courses.slice(0, 10)


    return (
        <section className="w-full py-4 md:py-8 bg-white">
            <div className="container mx-auto px-4 md:px-6">

                {/* Section Header */}
                <div className="flex items-center justify-between mb-6 md:mb-8 max-w-7xl mx-auto">
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                        {title}
                    </h3>
                    {courses.length >= 10 && (
                        <Link
                            to="/dashboard/all-courses-view"
                            className="group flex items-center gap-1.5 text-sm font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-5 py-2.5 rounded-full border border-emerald-200 transition-all duration-300"
                        >
                            All Courses
                            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    )}
                </div>

                {/* Grid Layout Container - 4 Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {displayedCourses.map((lesson, index) => {
                        return (
                            <Card key={index} className="h-full border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden group flex flex-col bg-white">

                                {/* Image Section */}
                                <div className="relative aspect-video overflow-hidden bg-slate-100 cursor-pointer" onClick={() => onSelect(lesson)}>
                                    <img
                                        src={lesson.image?.startsWith('http') ? lesson.image : `${baseImageURL}${lesson.image}`}
                                        alt={lesson.course_title_english}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        onError={(e) => { (e.target as any).src = '/placeholder.svg' }}
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                                    {lesson.badge && (
                                        <Badge className="absolute top-2.5 left-2.5 bg-white/95 text-slate-800 hover:bg-white shadow-sm backdrop-blur-sm border-0 font-bold text-[10px] px-2 py-0.5 uppercase tracking-wide">
                                            {lesson.badge}
                                        </Badge>
                                    )}

                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-75 group-hover:scale-100">
                                        <div className="bg-white/95 p-2.5 rounded-full shadow-lg text-green-600 transition-transform hover:scale-110">
                                            <Play className="h-5 w-5 fill-current ml-0.5" />
                                        </div>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <CardContent className="p-4 flex-1 flex flex-col gap-2.5">
                                    {/* Top Meta: Type & Rating */}
                                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                        <div className="flex items-center gap-1.5">
                                            <span className={`w-2 h-2 rounded-full shadow-sm ${lesson.color || 'bg-emerald-500'}`} />
                                            <span>{lesson.course_type}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded-md">
                                            <Star className="w-3 h-3 fill-current" />
                                            <span className="text-slate-700">{lesson.rating || '4.5'}</span>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h4
                                        className="font-bold text-[15px] leading-snug text-slate-900 line-clamp-2 cursor-pointer hover:text-green-600 transition-colors mt-0.5"
                                        onClick={() => onSelect(lesson)}
                                        title={lesson.course_title_english}
                                    >
                                        {lesson.course_title_english}
                                    </h4>

                                    {/* Bottom Meta (Pushed to bottom) */}
                                    <div className="mt-auto pt-2 flex flex-col gap-2.5">
                                        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                                            <User className="w-3.5 h-3.5 text-slate-400" />
                                            <InstructorName 
                                                instructorId={lesson.instructor_id || (lesson.instructor as any)?.instructor_id || (lesson.instructor as any)?.id} 
                                                fallbackName={lesson.instructor_name || (lesson.instructor as any)?.name}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 border-t border-slate-100 pt-3 mt-1">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                <span className="font-bold text-slate-700">{lesson.course_duration || 'Self-paced'}</span>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <div className="flex items-center gap-1.5 leading-none">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Member:</span>
                                                    <span className="font-black text-emerald-600 text-base">৳{lesson.regular_fee}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 leading-none opacity-60">
                                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Customer:</span>
                                                    <span className="font-bold text-slate-500 text-[10px] line-through decoration-slate-400">৳{lesson.offer_fee}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>

                                {/* Actions Footer */}
                                <CardFooter className="p-4 pt-0 flex gap-2">
                                    <Button
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-lg transition-all font-bold text-xs h-10 rounded-lg gap-2"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onAddToCart(lesson);
                                        }}
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        Add to Cart
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="w-10 h-10 shrink-0 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-green-600 transition-all rounded-lg shadow-sm"
                                        onClick={() => onSelect(lesson)}
                                        title="View Details"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                </CardFooter>

                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    )
}

export default CourseGrid