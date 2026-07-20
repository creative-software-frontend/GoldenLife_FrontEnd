import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
  Info,
  Layout,
  FileText,
  Play,
  Download,
  ExternalLink
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useInstructorCourseDetailsQuery } from '@/hooks/useInstructorAuth';
import { toast } from 'react-toastify';

const baseImageURL = 'https://admin.goldenlifeltd.com/uploads/course/course_image/';

// ── Unified embed URL resolver ───────────────────────────────────
const getEmbedUrl = (url: string): { src: string; type: 'youtube' | 'document' } | null => {
  if (!url) return null;
  try {
    // YouTube short link
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1].split('?')[0];
      return { src: `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`, type: 'youtube' };
    }
    // YouTube full link
    if (url.includes('youtube.com/watch')) {
      const id = new URL(url).searchParams.get('v');
      if (id) return { src: `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`, type: 'youtube' };
    }
    // YouTube Shorts link
    if (url.includes('youtube.com/shorts/')) {
      const id = url.split('youtube.com/shorts/')[1].split('?')[0];
      return { src: `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`, type: 'youtube' };
    }
    // Google Drive file
    if (url.includes('drive.google.com/file/d/')) {
      const match = url.match(/\/file\/d\/([^/?]+)/);
      if (match) return { src: `https://drive.google.com/file/d/${match[1]}/preview`, type: 'document' };
    }
    // Google Docs
    if (url.includes('docs.google.com/document/d/')) {
      const match = url.match(/\/document\/d\/([^/?]+)/);
      if (match) return { src: `https://docs.google.com/document/d/${match[1]}/preview`, type: 'document' };
    }
    // Direct PDF
    if (url.toLowerCase().endsWith('.pdf')) {
      return { src: url, type: 'document' };
    }
  } catch { /* ignore */ }
  return null;
};

const resolveMediaUrl = (url: string): string => {
  if (!url) return '';
  const cleanUrl = url.trim();
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    return cleanUrl;
  }
  const path = cleanUrl.startsWith('/') ? cleanUrl.substring(1) : cleanUrl;
  return `https://admin.goldenlifeltd.com/${path}`;
};

const InstructorCourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const initialTab = (location.state as any)?.activeTab || 'overview';
  const [activeTab, setActiveTab] = React.useState<'overview' | 'curriculum' | 'assessments'>(initialTab);
  const { data: course, isLoading, isError, error } = useInstructorCourseDetailsQuery(id);
  const [showEmbed, setShowEmbed] = React.useState(false);

  React.useEffect(() => {
    setShowEmbed(false);
  }, [activeTab, id]);

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
              <h1 className="text-xl font-bold text-gray-900 leading-none mb-1">Course Content</h1>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">ID: #{course.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center bg-gray-100 p-1 rounded-2xl">
              {[
                { id: 'overview', label: 'Overview', icon: Info },
                { id: 'curriculum', label: 'Modules and Lessons', icon: Layout },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === tab.id
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                  <tab.icon size={14} strokeWidth={3} />
                  {tab.label.toUpperCase()}
                </button>
              ))}
            </nav>
            <div className="flex items-center gap-3 border-l border-gray-100 pl-6">
              <Badge className={`font-black border-none px-4 py-2 rounded-xl text-[10px] tracking-widest uppercase ${isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                {isActive ? 'Active' : 'Inactive'}
              </Badge>
              <Button
                onClick={() => navigate(`/instructor/dashboard/courses/update/${course.id}`)}
                className="bg-black text-white hover:bg-emerald-600 transition-all rounded-xl font-bold text-xs px-6 h-10"
              >
                Edit
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-10"
            >
              <div className="lg:col-span-2 space-y-8">
                {/* ── Inline media viewer (YouTube / Drive / Docs / PDF) or course image ── */}
                {(() => {
                  const embed = course.download_url ? getEmbedUrl(course.download_url) : null;
                  if (embed && showEmbed) {
                    const isDoc = embed.type === 'document';
                    return (
                      <div className={`rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-2xl shadow-gray-200/50 bg-black relative flex flex-col ${ isDoc ? 'h-[700px]' : 'aspect-video' }`}>
                        {/* Media Bar */}
                        <div className="bg-gray-900 px-6 py-4 flex items-center justify-between border-b border-gray-800">
                          <div className="flex items-center gap-3">
                            <Badge className="bg-white/10 text-white border-none font-bold px-3 py-1 rounded-xl text-[10px]">
                              {course.course_type}
                            </Badge>
                            {isDoc && (
                              <Badge className="bg-amber-500 text-white border-none font-bold px-3 py-1 rounded-xl text-[10px]">
                                {course.course_type === 'Ebook' ? 'Ebook' : 'Document'}
                              </Badge>
                            )}
                          </div>
                          
                          <Button
                            variant="ghost"
                            onClick={() => setShowEmbed(false)}
                            className="bg-white/10 hover:bg-white/20 text-white hover:text-white font-bold px-4 py-2 rounded-xl transition-all border border-white/10 flex items-center gap-2 h-9 text-xs"
                          >
                            <ArrowLeft size={14} />
                            Back to Cover
                          </Button>
                        </div>
                        <div className="flex-1 w-full bg-black">
                          <iframe
                            src={embed.src}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={course.course_title_english}
                          />
                        </div>
                      </div>
                    );
                  }
                  // Fallback: show course image with Play/View overlay
                  return (
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

                      {/* Play / View Overlay Button */}
                      {embed && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/50 transition-colors duration-300">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowEmbed(true)}
                            className="flex items-center gap-3 bg-white text-black font-black px-8 py-4 rounded-2xl shadow-2xl hover:bg-emerald-600 hover:text-white transition-all duration-300"
                          >
                            {embed.type === 'youtube' ? (
                              <>
                                <Play size={20} fill="currentColor" />
                                <span>PLAY VIDEO</span>
                              </>
                            ) : (
                              <>
                                <FileText size={20} />
                                <span>VIEW DOCUMENT</span>
                              </>
                            )}
                          </motion.button>
                        </div>
                      )}

                      <div className="absolute top-6 left-6 flex gap-2">
                        <Badge className="bg-white/90 backdrop-blur text-black border-none font-bold px-4 py-2 rounded-xl text-[10px] shadow-lg">
                          {course.course_type}
                        </Badge>
                        <Badge className="bg-orange-500 text-white border-none font-bold px-4 py-2 rounded-xl text-[10px] shadow-lg shadow-orange-500/20">
                          {typeof course.category === 'object' ? (course.category as any).category_name : course.category}
                        </Badge>
                      </div>
                    </div>
                  );
                })()}

                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">{course.course_title_english}</h2>
                    <p className="text-xl font-bold text-gray-400 italic">{course.course_title_bangla}</p>
                  </div>
                  <div className="h-px bg-gray-100 w-full" />
                  <div className="prose prose-sm max-w-none text-gray-600 font-medium leading-relaxed">
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] mb-4">Description</h3>
                    <p className="mb-6">{course.course_details_english}</p>
                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 border-l-4 border-l-emerald-500">
                      <p className="text-gray-500 italic text-sm">{course.course_details_bangla}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-xl shadow-gray-100/30 space-y-8">
                  <div className="space-y-6">
                    {[
                      { icon: Clock, label: 'Duration', value: course.course_duration },
                      { icon: Tag, label: 'Course Code', value: course.course_code },
                      { icon: Info, label: 'Validity', value: (course as any).validity || '90 Days' },
                    ].map((stat, i) => (
                      <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                        <div className="flex items-center gap-3 text-gray-400">
                          <stat.icon size={18} strokeWidth={2.5} />
                          <span className="text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
                        </div>
                        <span className="font-bold text-gray-900 text-sm">{stat.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-emerald-50 rounded-[2rem] p-6 border border-emerald-100 space-y-6">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Regular Price</span>
                      <p className="text-lg font-bold text-emerald-800/40 line-through tracking-tighter italic">৳{course.offer_fee}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Selling Price</span>
                      <p className="text-4xl font-black text-emerald-600 tracking-tighter">৳{course.regular_fee}</p>
                    </div>
                  </div>

                  <div className="bg-black rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Your Earning</p>
                      <p className="text-3xl font-black tracking-tight">৳{course.seller_fee}</p>
                      <p className="text-[10px] font-bold text-emerald-400 mt-2 flex items-center gap-1">
                        <CheckCircle2 size={12} /> {course.earning_value}% Profit Margin
                      </p>
                    </div>
                    <DollarSign className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 rotate-12" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'curriculum' && (
            <motion.div
              key="curriculum"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto space-y-10"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">Course Content</h3>
                  <p className="text-sm font-bold text-gray-400">{course.modules?.length || 0} Modules • {course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0} Lessons</p>
                </div>
              </div>

              <div className="space-y-6">
                {course.modules && course.modules.length > 0 ? (
                  course.modules.map((module, mIdx) => (
                    <ModuleAccordion key={mIdx} module={module} index={mIdx} />
                  ))
                ) : (
                  <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                    <Layout className="mx-auto text-gray-200 mb-4" size={48} strokeWidth={1} />
                    <p className="text-gray-400 font-bold">No modules have been added yet.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </motion.div >
  );
};

const ModuleAccordion: React.FC<{ module: any; index: number }> = ({ module, index }) => {
  const [isOpen, setIsOpen] = React.useState(index === 0);
  const [playingVideo, setPlayingVideo] = React.useState<string | null>(null);

  const handleVideoClick = (url: string) => {
    if (!url || url.trim() === '' || url === '#') {
      toast.error('No video link is provided for this lesson.');
      return;
    }

    if (url.includes('[suspicious link removed]') || url.toLowerCase().includes('suspicious')) {
      toast.error('This video link has been flagged or removed.');
      return;
    }

    const fullUrl = resolveMediaUrl(url);

    // Try to get embed URL using global resolver
    const embed = getEmbedUrl(fullUrl);
    if (embed || fullUrl.toLowerCase().endsWith('.mp4') || fullUrl.toLowerCase().endsWith('.webm')) {
      setPlayingVideo(prev => prev === url ? null : url);
    } else {
      // Fallback: open in new tab for truly unsupported formats
      window.open(fullUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      <div className="rounded-[2rem] border border-gray-100 overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500 group">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between p-8 transition-colors ${isOpen ? 'bg-gray-50/50' : 'hover:bg-gray-50/30'}`}
        >
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 font-black text-lg group-hover:bg-emerald-600 group-hover:text-white transition-all">
              {index + 1}
            </div>
            <div className="text-left space-y-1">
              <h4 className="font-black text-gray-900 text-xl tracking-tight leading-tight">{module.module_title}</h4>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{module.lessons?.length || 0} Lessons</span>
                <span className="w-1 h-1 rounded-full bg-gray-200" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order: {module.serial_number || (index + 1)}</span>
              </div>
            </div>
          </div>
          <div className={`p-3 rounded-xl bg-gray-100 text-gray-400 transition-all ${isOpen ? 'rotate-90 bg-emerald-50 text-emerald-500' : ''}`}>
            <ChevronRight size={20} strokeWidth={3} />
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-8 pt-0 space-y-4">
                {module.lessons?.map((lesson: any, lIdx: number) => (
                  <div key={lIdx} className="space-y-3">
                    <div className="flex items-center justify-between p-6 rounded-2xl bg-gray-50/50 border border-gray-100 hover:bg-white hover:border-emerald-500/20 hover:shadow-lg transition-all group/lesson">
                      <div className="flex items-center gap-5">
                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 text-gray-400 flex items-center justify-center font-black text-sm group-hover/lesson:bg-emerald-50 group-hover/lesson:text-emerald-500 transition-colors">
                          {lIdx + 1}
                        </div>
                        <div>
                          <h5 className="text-base font-black text-gray-700 group-hover/lesson:text-gray-900">{lesson.lesson_title}</h5>
                          {lesson.description && <p className="text-xs text-gray-400 mt-1 line-clamp-1">{lesson.description}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {lesson.is_free === 1 && <Badge className="bg-emerald-100 text-emerald-600 text-[9px] px-2 py-0.5 border-none font-black uppercase">Preview</Badge>}
                        <Badge variant="outline" className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-gray-200">{lesson.videos?.length || 0} Videos</Badge>
                      </div>
                    </div>

                    {/* Videos Sub-list */}
                    {lesson.videos && lesson.videos.length > 0 && (
                      <div className="ml-14 pl-6 border-l-2 border-gray-100 space-y-2 py-2">
                        {lesson.videos.map((video: any, vIdx: number) => {
                          const embed = getEmbedUrl(video.video_url);
                          const isDoc = embed?.type === 'document';
                          return (
                            <React.Fragment key={vIdx}>
                              <div
                                onClick={() => handleVideoClick(video.video_url)}
                                className={`flex items-center gap-4 py-2 px-4 rounded-xl transition-colors cursor-pointer group/video ${playingVideo === video.video_url ? 'bg-emerald-50 border border-emerald-100 shadow-sm' : 'hover:bg-emerald-50'}`}
                              >
                                {isDoc
                                  ? <FileText size={14} className={`shrink-0 ${playingVideo === video.video_url ? 'text-amber-500' : 'text-gray-300 group-hover/video:text-amber-500'}`} />
                                  : <Play size={14} className={`shrink-0 ${playingVideo === video.video_url ? 'text-emerald-500' : 'text-gray-300 group-hover/video:text-emerald-500'}`} />
                                }
                                <span className={`text-xs font-bold ${playingVideo === video.video_url ? 'text-emerald-700' : 'text-gray-500 group-hover/video:text-emerald-700'}`}>{video.video_title || `Video ${vIdx + 1}`}</span>
                                {isDoc && <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest">Doc</span>}
                                <span className={`text-[10px] font-black ml-auto uppercase tracking-widest ${playingVideo === video.video_url ? 'text-emerald-600' : 'text-gray-300 group-hover/video:text-emerald-300'}`}>{video.duration || '—'}</span>
                              </div>
                              {/* INLINE MEDIA PLAYER */}
                              {playingVideo === video.video_url && (() => {
                                const fullUrl = resolveMediaUrl(video.video_url);
                                const currentEmbed = getEmbedUrl(fullUrl);
                                const currentIsDoc = currentEmbed?.type === 'document';
                                const isNativeVideo = !currentEmbed && (fullUrl.toLowerCase().endsWith('.mp4') || fullUrl.toLowerCase().endsWith('.webm'));
                                return (
                                  <div className={`mt-3 mb-5 overflow-hidden rounded-2xl border border-gray-100 shadow-lg bg-black relative ${currentIsDoc ? 'w-full h-[600px]' : 'w-full aspect-video'}`}>
                                    <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-black/60 to-transparent z-10 pointer-events-none" />
                                    <button
                                      onClick={(e) => { e.stopPropagation(); setPlayingVideo(null); }}
                                      className="absolute top-4 right-4 z-20 w-8 h-8 bg-black/60 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-md"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                    </button>
                                    {currentEmbed ? (
                                      <iframe src={currentEmbed.src} className="w-full h-full border-0 relative z-0" allowFullScreen title="Video Player" />
                                    ) : isNativeVideo ? (
                                      <video src={fullUrl} controls autoPlay className="w-full h-full relative z-0" />
                                    ) : (
                                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-3 bg-gray-50">
                                        <AlertCircle size={32} />
                                        <p className="text-sm font-bold">Unsupported media format</p>
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    )}
                    {/* Quizzes Sub-list */}
                    {lesson.quizzes && lesson.quizzes.length > 0 && (
                      <div className="ml-14 pl-6 border-l-2 border-amber-100 space-y-2 py-2">
                        {lesson.quizzes.map((quiz: any, qIdx: number) => (
                          <div key={`q-${qIdx}`} className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 mt-2 space-y-3 group/quiz">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">Q</div>
                                <div>
                                  <span className="text-sm font-bold text-amber-900">{quiz.question}</span>
                                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {[
                                      { label: 'A', value: quiz.option_a },
                                      { label: 'B', value: quiz.option_b },
                                      { label: 'C', value: quiz.option_c },
                                      { label: 'D', value: quiz.option_d },
                                    ].map((opt) => (
                                      <div
                                        key={opt.label}
                                        className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                                          quiz.correct_answer?.toLowerCase() === opt.label.toLowerCase() || quiz.correct_answer === `option_${opt.label.toLowerCase()}`
                                            ? 'bg-emerald-100 border-emerald-200 text-emerald-800'
                                            : 'bg-white border-amber-100/50 text-amber-700/80'
                                        }`}
                                      >
                                        <span className="opacity-50">{opt.label}:</span>
                                        <span className="line-clamp-1">{opt.value}</span>
                                        {(quiz.correct_answer?.toLowerCase() === opt.label.toLowerCase() || quiz.correct_answer === `option_${opt.label.toLowerCase()}`) && (
                                          <CheckCircle2 size={12} className="text-emerald-600 ml-auto" />
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest whitespace-nowrap shrink-0">{quiz.points} pts</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
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
