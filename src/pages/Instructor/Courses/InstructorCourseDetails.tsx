import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Clock,
  Tag,
  Layers,
  Video,
  BookOpen,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  DollarSign,
  Info
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useInstructorCourseDetailsQuery } from '@/hooks/useInstructorAuth';

const baseImageURL = 'https://admin.goldenlifeltd.com/uploads/course/course_image/';

const InstructorCourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: course, isLoading, isError, error } = useInstructorCourseDetailsQuery(id);

  if (isLoading) return <LoadingSkeleton />;
  if (isError || !course) return <ErrorState message={(error as any)?.message} onBack={() => navigate(-1)} />;

  const isActive = String(course.status) === '1';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#F8FAFC] pb-20"
    >
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-xl hover:bg-gray-100 transition-all"
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-none mb-1">Course Details</h1>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">ID: #{course.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={`font-black border-none px-4 py-2 rounded-xl text-[10px] tracking-widest uppercase ${isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
              {isActive ? 'Active' : 'Inactive'}
            </Badge>
            <Button
              onClick={() => navigate(`/instructor/dashboard/courses/update/${course.id}`)}
              className="bg-black text-white hover:bg-orange-600 transition-all rounded-xl font-bold text-xs px-6 h-10"
            >
              Edit Course
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">

        {/* ── Hero Section ── */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="aspect-[21/9] rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-2xl shadow-gray-200/50 bg-white relative group">
              {course.image ? (
                <img
                  src={course.image.startsWith('http') ? course.image : `${baseImageURL}${course.image}`}
                  alt={course.course_title_english}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300 font-black text-4xl italic">GL</div>
              )}
              <div className="absolute top-6 left-6 flex gap-2">
                <Badge className="bg-white/90 backdrop-blur text-black border-none font-bold px-4 py-2 rounded-xl text-[10px] shadow-lg">
                  {course.course_type}
                </Badge>
                <Badge className="bg-orange-500 text-white border-none font-bold px-4 py-2 rounded-xl text-[10px] shadow-lg shadow-orange-500/20">
                  {course.category}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">
                {course.course_title_english}
              </h2>
              <p className="text-xl font-bold text-gray-500">
                {course.course_title_bangla}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* ── Stats Card ── */}
            <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-xl shadow-gray-100/50 space-y-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-50 pb-6">
                  <div className="flex items-center gap-3 text-gray-400">
                    <Clock size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Duration</span>
                  </div>
                  <span className="font-bold text-gray-900">{course.course_duration}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-50 pb-6">
                  <div className="flex items-center gap-3 text-gray-400">
                    <Tag size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Course Code</span>
                  </div>
                  <span className="font-bold text-gray-900">{course.course_code}</span>
                </div>
              </div>

              <div className="space-y-6 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Regular Price (MRP)</span>
                  <span className="text-lg font-bold text-gray-400 line-through">৳{course.offer_fee}</span>
                </div>
                <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em]">Offer Price (Selling)</span>
                    <span className="text-3xl font-black text-orange-600 tracking-tighter">৳{course.regular_fee}</span>
                  </div>
                  <p className="text-[10px] font-bold text-orange-400 italic text-right">Instant access to all modules</p>
                </div>
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <DollarSign size={14} className="text-emerald-500" />
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Instructor Earning</span>
                  </div>
                  <span className="font-black text-emerald-600">৳{course.seller_fee}</span>
                </div>
              </div>
            </div>

            {/* ── Earning Indicator ── */}
            <div className="bg-emerald-500 rounded-2xl p-6 text-white shadow-lg shadow-emerald-500/20 relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-1">Profit Value</p>
                <p className="text-2xl font-black">{course.earning_value}%</p>
              </div>
              <DollarSign className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 rotate-12" />
            </div>
          </div>
        </section>

        {/* ── Content Tabs ── */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-12">

            {/* ── Details ── */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm space-y-10">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest">Course Description</h3>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>
                <div className="prose prose-sm max-w-none text-gray-600 font-medium leading-relaxed">
                  <p className="mb-6">{course.course_details_english}</p>
                  <p className="text-gray-400 italic border-l-4 border-orange-500 pl-6 py-2">{course.course_details_bangla}</p>
                </div>
              </div>

              {/* ── Curriculum ── */}
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest">Curriculum</h3>
                    <div className="h-px w-20 bg-gray-100" />
                  </div>
                  <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-lg">
                    {course.modules?.length || 0} Modules
                  </span>
                </div>

                <div className="space-y-4">
                  {course.modules && course.modules.length > 0 ? (
                    course.modules.map((module, mIdx) => (
                      <ModuleAccordion key={mIdx} module={module} index={mIdx} />
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                      <Layers className="text-gray-300 mb-4" size={32} />
                      <p className="text-gray-400 font-bold text-sm">No modules added yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            {/* ── Quizzes ── */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <HelpCircle size={20} className="text-orange-500" />
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Assessment</h3>
              </div>

              <div className="space-y-4">
                {(course as any).quizzes && (course as any).quizzes.length > 0 ? (
                  (course as any).quizzes.map((quiz: any, qIdx: number) => (
                    <div key={qIdx} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between group hover:bg-black hover:text-white transition-all cursor-default">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-xs font-black shadow-sm text-gray-400 group-hover:text-black">
                          {qIdx + 1}
                        </div>
                        <span className="text-sm font-bold truncate max-w-[150px]">{quiz.title || 'Untitled Quiz'}</span>
                      </div>
                      <Badge className="bg-white text-gray-400 group-hover:bg-orange-500 group-hover:text-white text-[9px] px-2">Quiz</Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="mx-auto text-gray-200 mb-2" size={24} />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No Quizzes Available</p>
                  </div>
                )}
              </div>
            </div>


          </div>
        </section>
      </main>
    </motion.div>
  );
};

const ModuleAccordion: React.FC<{ module: any; index: number }> = ({ module, index }) => {
  const [isOpen, setIsOpen] = React.useState(index === 0);

  return (
    <div className="rounded-2xl border border-gray-100 overflow-hidden bg-white transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 font-black text-xs">
            {index + 1}
          </div>
          <div className="text-left">
            <h4 className="font-black text-gray-900 text-base">{module.module_title}</h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{module.lessons?.length || 0} Lessons</p>
          </div>
        </div>
        <ChevronRight className={`text-gray-300 transition-transform ${isOpen ? 'rotate-90' : ''}`} size={20} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden bg-gray-50/30"
          >
            <div className="p-6 pt-0 space-y-3">
              {module.lessons?.map((lesson: any, lIdx: number) => (
                <div key={lIdx} className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-100 shadow-sm group hover:border-emerald-500/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center">
                      <Video size={16} />
                    </div>
                    <span className="text-sm font-bold text-gray-700">{lesson.lesson_title}</span>
                  </div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{lesson.duration || 'Video'}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="p-10 space-y-10">
    <Skeleton className="h-10 w-40 rounded-xl" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-6">
        <Skeleton className="aspect-[21/9] rounded-[2.5rem]" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-6 w-1/2 rounded-xl" />
      </div>
      <Skeleton className="h-[400px] rounded-[2rem]" />
    </div>
  </div>
);

const ErrorState = ({ message, onBack }: { message?: string; onBack: () => void }) => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-10 text-center">
    <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-2">
      <AlertCircle size={40} />
    </div>
    <h2 className="text-2xl font-black text-gray-900">Failed to load details</h2>
    <p className="text-gray-500 max-w-xs font-medium">{message || 'There was an issue fetching the course information. Please try again later.'}</p>
    <Button onClick={onBack} className="bg-black text-white px-8 h-12 rounded-xl font-bold">
      Go Back
    </Button>
  </div>
);

export default InstructorCourseDetails;
