import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { User, GraduationCap, Briefcase, Mail, Phone, Globe, Facebook, MessageSquare, BookOpen, Star, CheckCircle2, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import CourseGrid from "../AllCourses/CourseGrid";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import StudentCourseDetails from "../StudentCourseDetails/StudentCourseDetails";
import { useCartStore } from "@/store/cartStore";

interface InstructorData {
    id: number;
    name: string;
    image: string;
    qualification: string;
    experience: string;
    designation: string;
    department: string;
    business_name: string;
    email: string;
    mobile: string;
    website?: string;
    facebook?: string;
    telegram?: string;
    whatsapp?: string;
}

export default function InstructorInfo() {
    const { id } = useParams<{ id: string }>();
    const { addItem } = useCartStore();
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';
    const baseImageURL = `${baseURL}/uploads/course/course_image/`;

    const { data: result, isLoading } = useQuery({
        queryKey: ['instructorDetails', id],
        queryFn: async () => {
            const response = await axios.get(`${baseURL}/api/instructor-wise?id=${id}`);
            return response.data;
        },
        enabled: !!id
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-emerald-600 border-opacity-50"></div>
            </div>
        );
    }

    const instructor: InstructorData | null = result?.instructor || null;
    const courses = (result?.data || []).map((course: any) => ({
        ...course,
        instructor_name: result?.instructor?.name || instructor?.name,
        instructor_id: result?.instructor?.id || instructor?.id,
        image: course.image
    }));

    if (!instructor) return null;

    const profileImg = instructor.image?.startsWith('http')
        ? instructor.image
        : `${baseURL}/uploads/instructor/image/${instructor.image}`;

    const handleCourseSelect = (course: any) => {
        setSelectedCourseId(course.id.toString());
        setIsModalOpen(true);
    };

    const handleAddToCart = (course: any) => {
        addItem({
            id: Number(course.id),
            name: course.course_title_english,
            product_title_english: course.course_title_english,
            image: course.image?.startsWith('http') ? course.image : `${baseImageURL}${course.image}`,
            quantity: 1,
            offer_price: Number(course.regular_fee) || 0,
            regular_price: Number(course.offer_fee) || 0,
            type: 'course',
            seller_name: instructor.name || `Instructor #${instructor.id}`,
            seller_id: instructor.id
        });
    };

    return (
        <div className="bg-[#f8fafc] min-h-screen pb-20 w-full font-sans selection:bg-emerald-100 overflow-x-hidden">
            
            {/* --- HERO / BANNER --- */}
            <div className="relative h-[200px] md:h-[300px] w-full overflow-hidden bg-gradient-to-r from-[#0c2a4c] to-[#1a4a7c]">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#f8fafc]" />
            </div>

            {/* --- MAIN INSTRUCTOR CARD --- */}
            <div className="container mx-auto px-4 -mt-20 md:-mt-32 relative z-20">
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] border border-white p-6 md:p-10 shadow-[0_30px_60px_rgba(15,23,42,0.1)]"
                >
                    <div className="flex flex-col xl:flex-row items-center xl:items-start justify-between gap-8">
                        
                        {/* Left Section: Profile + Name */}
                        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 w-full">
                            
                            {/* Profile Image */}
                            <div className="relative -mt-16 md:-mt-24 flex-shrink-0">
                                <img
                                    src={profileImg}
                                    alt={instructor.name}
                                    className="w-36 h-36 md:w-48 md:h-48 rounded-[2rem] object-cover border-[10px] border-white shadow-xl bg-white"
                                    onError={(e) => { (e.target as any).src = '/image/logo/logo.jpg' }}
                                />
                                <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-2.5 rounded-2xl shadow-lg border-4 border-white">
                                    <CheckCircle2 size={20} />
                                </div>
                            </div>

                            {/* Instructor Identity */}
                            <div className="text-center lg:text-left pt-2 flex-1">
                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-5">
                                    <div className="flex items-center gap-3">
                                        <div className="hidden lg:block w-1.5 h-10 bg-emerald-500 rounded-full" />
                                        <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tight uppercase leading-none">
                                            {instructor.name}
                                        </h1>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-blue-600 text-white text-[10px] font-black tracking-widest uppercase px-4 py-2 rounded-full shadow-lg shadow-blue-200">
                                        {instructor.designation}
                                    </div>
                                </div>

                                {/* Detailed Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 mb-6 max-w-2xl">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <GraduationCap size={18} className="text-emerald-500 shrink-0" />
                                        <span className="text-sm font-semibold">{instructor.qualification}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Briefcase size={18} className="text-emerald-500 shrink-0" />
                                        <span className="text-sm font-semibold">{instructor.experience} Experience</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <MapPin size={18} className="text-emerald-500 shrink-0" />
                                        <span className="text-sm font-semibold">{instructor.department} Dept.</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Mail size={18} className="text-emerald-500 shrink-0" />
                                        <span className="text-sm font-semibold">{instructor.email}</span>
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                                    {instructor.whatsapp && (
                                        <a href={`https://wa.me/${instructor.whatsapp}`} target="_blank" rel="noreferrer" className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all">
                                            <MessageSquare size={18} />
                                        </a>
                                    )}
                                    {instructor.facebook && (
                                        <a href={instructor.facebook} target="_blank" rel="noreferrer" className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                                            <Facebook size={18} />
                                        </a>
                                    )}
                                    {instructor.website && (
                                        <a href={instructor.website} target="_blank" rel="noreferrer" className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-600 hover:text-white transition-all">
                                            <Globe size={18} />
                                        </a>
                                    )}
                                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 rounded-xl border border-slate-100 font-bold text-xs ml-auto lg:ml-0">
                                        <Phone size={14} className="text-emerald-500" />
                                        {instructor.mobile}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Section: Quick Stats */}
                        <div className="grid grid-cols-2 gap-3 w-full xl:w-auto xl:min-w-[300px]">
                            {[
                                { label: 'Courses', value: result?.course_count || 0, color: 'text-emerald-600', bg: 'bg-emerald-50/50', icon: <BookOpen size={16}/> },
                                { label: 'Rating', value: '4.8/5.0', color: 'text-orange-500', bg: 'bg-orange-50/50', icon: <Star size={16}/> },
                                { label: 'Students', value: '1.2k+', color: 'text-blue-600', bg: 'bg-blue-50/50', icon: <User size={16}/> },
                                { label: 'Joined', value: '2023', color: 'text-purple-600', bg: 'bg-purple-50/50', icon: <CheckCircle2 size={16}/> },
                            ].map((stat, i) => (
                                <div key={i} className={`${stat.bg} p-4 rounded-2xl border border-white shadow-sm flex flex-col items-center xl:items-start`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={stat.color}>{stat.icon}</span>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                                    </div>
                                    <h4 className={`text-xl font-black ${stat.color}`}>{stat.value}</h4>
                                </div>
                            ))}
                        </div>

                    </div>
                </motion.div>
            </div>

            {/* --- INSTRUCTOR COURSES --- */}
            <div className="container mx-auto px-4 mt-16">
                <CourseGrid 
                    courses={courses} 
                    title={`Courses by ${instructor.name}`} 
                    onSelect={handleCourseSelect}
                    onAddToCart={handleAddToCart}
                />
            </div>

            {/* Course Details Modal */}
            {isModalOpen && selectedCourseId && (
                <Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
                    <DialogContent className="max-w-6xl p-0 overflow-hidden border-none bg-transparent shadow-none">
                        <div className="bg-white rounded-3xl overflow-y-auto max-h-[90vh]">
                            <StudentCourseDetails courseId={selectedCourseId} onClose={() => setIsModalOpen(false)} />
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
