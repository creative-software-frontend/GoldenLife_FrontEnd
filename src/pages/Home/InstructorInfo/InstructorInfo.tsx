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
    banner?: string;
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
    joining_date?: string;
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
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-emerald-600 border-opacity-50"></div>
                    <p className="text-slate-500 font-medium animate-pulse">Loading instructor profile...</p>
                </div>
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

    if (!instructor) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-slate-500">Instructor not found.</p>
        </div>
    );

    const profileImg = instructor.image?.startsWith('http')
        ? instructor.image
        : `${baseURL}/uploads/instructor/image/${instructor.image}`;

    const bannerImg = instructor.banner?.startsWith('http')
        ? instructor.banner
        : `${baseURL}/uploads/instructor/banner/${instructor.banner}`;

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
            <div className="relative h-[250px] md:h-[400px] w-full overflow-hidden bg-slate-900">
                {instructor.banner ? (
                    <img 
                        src={bannerImg} 
                        alt="Instructor Banner" 
                        className="w-full h-full object-cover opacity-60"
                        onError={(e) => {
                            (e.target as any).src = 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2070';
                        }}
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0c2a4c] to-[#1a4a7c] opacity-90" />
                )}
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#f8fafc]" />
            </div>

            {/* --- MAIN INSTRUCTOR CARD --- */}
            <div className="container mx-auto px-4 -mt-24 md:-mt-40 relative z-20">
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] border border-white p-6 md:p-10 shadow-[0_30px_60px_rgba(15,23,42,0.1)]"
                >
                    <div className="flex flex-col xl:flex-row items-center xl:items-start justify-between gap-8">
                        
                        {/* Left Section: Profile + Name */}
                        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 w-full">
                            
                            {/* Profile Image */}
                            <div className="relative -mt-20 md:-mt-32 flex-shrink-0">
                                <img
                                    src={profileImg}
                                    alt={instructor.name}
                                    className="w-40 h-40 md:w-56 md:h-56 rounded-[2.5rem] object-cover border-[10px] border-white shadow-2xl bg-white"
                                    onError={(e) => { (e.target as any).src = '/image/logo/logo.jpg' }}
                                />
                                <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-3 rounded-2xl shadow-lg border-4 border-white">
                                    <CheckCircle2 size={24} />
                                </div>
                            </div>

                            {/* Instructor Identity */}
                            <div className="text-center lg:text-left pt-2 flex-1">
                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-5">
                                    <div className="flex items-center gap-3">
                                        <div className="hidden lg:block w-1.5 h-12 bg-emerald-500 rounded-full" />
                                        <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tight uppercase leading-none">
                                            {instructor.name}
                                        </h1>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-blue-600 text-white text-[11px] font-black tracking-widest uppercase px-5 py-2.5 rounded-full shadow-lg shadow-blue-200">
                                        {instructor.designation}
                                    </div>
                                </div>

                                {/* Detailed Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mb-8 max-w-3xl">
                                    <div className="flex items-center gap-3 text-slate-600 group">
                                        <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                            <GraduationCap size={18} className="shrink-0" />
                                        </div>
                                        <span className="text-sm font-bold">{instructor.qualification}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600 group">
                                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <Briefcase size={18} className="shrink-0" />
                                        </div>
                                        <span className="text-sm font-bold">{instructor.experience} Experience</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600 group">
                                        <div className="p-2 bg-orange-50 rounded-lg text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                            <MapPin size={18} className="shrink-0" />
                                        </div>
                                        <span className="text-sm font-bold">{instructor.department} Department</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600 group">
                                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                            <Mail size={18} className="shrink-0" />
                                        </div>
                                        <span className="text-sm font-bold">{instructor.email}</span>
                                    </div>
                                    {instructor.business_name && (
                                        <div className="flex items-center gap-3 text-slate-600 group col-span-full">
                                            <div className="p-2 bg-slate-100 rounded-lg text-slate-600 group-hover:bg-slate-600 group-hover:text-white transition-colors">
                                                <Briefcase size={18} className="shrink-0" />
                                            </div>
                                            <span className="text-sm font-bold">Business: <span className="text-emerald-600">{instructor.business_name}</span></span>
                                        </div>
                                    )}
                                </div>

                                {/* Social Links */}
                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                                    {instructor.whatsapp && (
                                        <a href={`https://wa.me/${instructor.whatsapp}`} target="_blank" rel="noreferrer" className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm hover:shadow-emerald-200">
                                            <MessageSquare size={20} />
                                        </a>
                                    )}
                                    {instructor.facebook && (
                                        <a href={instructor.facebook} target="_blank" rel="noreferrer" className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm hover:shadow-blue-200">
                                            <Facebook size={20} />
                                        </a>
                                    )}
                                    {instructor.website && (
                                        <a href={instructor.website} target="_blank" rel="noreferrer" className="p-3 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-600 hover:text-white transition-all shadow-sm">
                                            <Globe size={20} />
                                        </a>
                                    )}
                                    <div className="flex items-center gap-3 px-6 py-3 bg-white text-slate-700 rounded-2xl border border-slate-200 font-bold text-sm ml-auto lg:ml-0 shadow-sm">
                                        <Phone size={16} className="text-emerald-500" />
                                        {instructor.mobile}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Section: Quick Stats */}
                        <div className="grid grid-cols-2 gap-4 w-full xl:w-auto xl:min-w-[320px]">
                            {[
                                { label: 'Courses', value: result?.course_count || courses.length, color: 'text-emerald-600', bg: 'bg-emerald-50/50', icon: <BookOpen size={18}/> },
                                { label: 'Rating', value: '4.8/5.0', color: 'text-orange-500', bg: 'bg-orange-50/50', icon: <Star size={18}/> },
                                { label: 'Students', value: '1.2k+', color: 'text-blue-600', bg: 'bg-blue-50/50', icon: <User size={18}/> },
                                { label: 'Member Since', value: instructor.joining_date ? new Date(instructor.joining_date).getFullYear() : '2023', color: 'text-purple-600', bg: 'bg-purple-50/50', icon: <CheckCircle2 size={18}/> },
                            ].map((stat, i) => (
                                <div key={i} className={`${stat.bg} p-5 rounded-3xl border border-white shadow-sm flex flex-col items-center xl:items-start transition-transform hover:-translate-y-1`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={stat.color}>{stat.icon}</span>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                                    </div>
                                    <h4 className={`text-2xl font-black ${stat.color}`}>{stat.value}</h4>
                                </div>
                            ))}
                        </div>

                    </div>
                </motion.div>
            </div>

            {/* --- INSTRUCTOR COURSES --- */}
            <div className="container mx-auto px-4 mt-16 max-w-7xl">
                <div className="mb-10 text-center md:text-left">
                    <h2 className="text-3xl font-black text-slate-900 mb-2">Instructor Courses</h2>
                    <p className="text-slate-500 font-medium">Browse all professional programs offered by {instructor.name}</p>
                </div>
                <CourseGrid 
                    courses={courses} 
                    title="" 
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
