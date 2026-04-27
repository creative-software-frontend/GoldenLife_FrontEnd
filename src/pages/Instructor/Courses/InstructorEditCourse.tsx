import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
  X, Plus, Trash2, ChevronDown, ChevronUp,
  Save, Loader2, GripVertical, Link2, ArrowLeft, Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-toastify';
import {
  useInstructorCourseDetailsQuery,
  useUpdateCourseMutation,
  useCourseCategoriesQuery
} from '@/hooks/useInstructorAuth';

const baseImageURL = 'https://admin.goldenlifeltd.com/uploads/course/course_image/';

// ─── Types ────────────────────────────────────────────────────────────────────
interface VideoItem { id: number; url: string; }
interface Lesson { id: number; title: string; videos: VideoItem[]; duration: string; }
interface Module { id: number; title: string; lessons: Lesson[]; open: boolean; }

// ─── Constants ────────────────────────────────────────────────────────────────
const COURSE_TYPES = ['Course (Video)', 'Live Class', 'Ebook'];

// ─── Styled helpers ───────────────────────────────────────────────────────────
const inp = 'w-full h-12 px-5 rounded-2xl border border-gray-200 bg-gray-50/50 text-black font-semibold placeholder-gray-400 outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all text-sm shadow-sm';
const sel = `${inp} cursor-pointer appearance-none`;
const ta  = 'w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 text-black font-semibold placeholder-gray-400 outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all text-sm resize-none shadow-sm';

const Field = ({ label, req, children, span2 }: { label: string; req?: boolean; children: React.ReactNode; span2?: boolean }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={span2 ? 'col-span-2' : ''}>
    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2 px-1">
      {label}{req && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
  </motion.div>
);

const SectionHead = ({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) => (
  <div className="flex items-center gap-4 mb-8">
    <h3 className="text-[15px] font-bold text-black uppercase tracking-widest whitespace-nowrap">{children}</h3>
    <div className="flex-1 h-[2px] bg-black/40 rounded-full" />
    {action}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const InstructorEditCourse: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [img, setImg] = useState<File | null>(null);
  const [form, setForm] = useState({
    titleEn: '', titleBn: '', courseType: '', videoUrl: '',
    courseCode: '', category: '', duration: '',
    sellerFee: '', regularFee: '', offerFee: '', earningValue: '',
    detailsEn: '', detailsBn: '',
  });

  // ── Automatic Price Calculation ──────────────────────────────────────────────
  useEffect(() => {
    const seller = Number(form.sellerFee);
    if (seller && seller > 0) {
      const sellingVal = Math.round(seller + seller * 0.3);
      const mrpVal = Math.round(sellingVal + sellingVal * 0.2);
      setForm(prev => ({
        ...prev,
        regularFee: String(sellingVal),
        offerFee: String(mrpVal),
      }));
    }
    // We don't clear on empty here to preserve loaded data if sellerFee is cleared,
    // but typically it should follow the same logic. Let's match Add page.
    else if (form.sellerFee === '') {
      setForm(prev => ({ ...prev, regularFee: '', offerFee: '' }));
    }
  }, [form.sellerFee]);

  // ── TanStack Query ──────────────────────────────────────────────────────────
  const { data: course, isLoading, isError, error } = useInstructorCourseDetailsQuery(id);
  const { data: categories, isLoading: isCatsLoading } = useCourseCategoriesQuery();
  const updateMutation = useUpdateCourseMutation(id);
  // ── Populate form once course data arrives ──────────────────────────────────
  useEffect(() => {
    if (!course) return;
    setForm({
      titleEn:     course.course_title_english   || '',
      titleBn:     course.course_title_bangla    || '',
      courseType:  course.course_type            || '',
      videoUrl:    course.video_url || course.download_url || '',
      courseCode:  course.course_code            || '',
      category:    course.category              || '',
      duration:    course.course_duration        || '',
      sellerFee:   String(course.seller_fee      || ''),
      regularFee:  String(course.regular_fee     || ''),
      offerFee:    String(course.offer_fee       || ''),
      earningValue: String(course.earning_value  || ''),
      detailsEn:   course.course_details_english || '',
      detailsBn:   course.course_details_bangla  || '',
    });
  }, [course]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<any>) => setForm(p => ({ ...p, [k]: e.target.value }));
  const handleBack = () => navigate('/instructor/dashboard/courses');

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSave = () => {
    if (!form.titleEn || !form.courseType || !form.category) {
      toast.error('Fill required fields.');
      return;
    }
    const fd = new FormData();
    if (img) fd.append('image', img);
    fd.append('course_title_english',  form.titleEn);
    fd.append('course_title_bangla',   form.titleBn);
    fd.append('course_type',           form.courseType);
    fd.append('category',              form.category);
    fd.append('course_code',           form.courseCode);
    fd.append('course_duration',       form.duration);
    fd.append('seller_fee',            form.sellerFee);
    fd.append('regular_fee',           form.regularFee);
    fd.append('offer_fee',             form.offerFee);
    fd.append('earning_value',         form.earningValue);
    fd.append('course_details_english', form.detailsEn);
    fd.append('course_details_bangla',  form.detailsBn);
    
    // Always send URL for these types
    fd.append('video_url', form.videoUrl);

    updateMutation.mutate(fd, {
      onSuccess: () => { toast.success('Course updated successfully!'); handleBack(); },
      onError:   (err) => toast.error(err.message || 'Something went wrong'),
    });
  };

  // ── Helpers for dynamic URL field ──
  const getUrlLabel = () => {
    if (form.courseType === 'Live Class') return "Live Class URL";
    if (form.courseType === 'Ebook') return "Ebook URL";
    return "Course video URL";
  };
  const getUrlPlaceholder = () => {
    if (form.courseType === 'Live Class') return "Enter Live Class URL";
    if (form.courseType === 'Ebook') return "Enter Ebook URL";
    return "Enter Course video URL";
  };

  // ── Loading / Error states ──────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="animate-spin text-orange-500" />
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Course…</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-red-500 font-bold">Failed to load course data.</p>
          <p className="text-sm text-gray-400 font-medium max-w-xs">{(error as any)?.message || 'There was an issue fetching the course information.'}</p>
          <Button onClick={handleBack} className="rounded-xl bg-black text-white px-6 h-10 text-sm font-bold">
            <ArrowLeft size={16} className="mr-2" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gray-50/50">
      <div className="px-4 py-12 sm:px-12">
        <div className="max-w-5xl mx-auto">

          {/* Top Bar */}
          <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button whileHover={{ scale: 1.1, x: -5 }} whileTap={{ scale: 0.9 }} onClick={handleBack}
                className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-500 shadow-sm hover:text-black transition-colors">
                <ArrowLeft size={20} strokeWidth={3} />
              </motion.button>
              <h1 className="text-2xl font-bold text-black tracking-tight">Edit Course</h1>
            </div>
            <Badge className="bg-orange-100 text-orange-600 border-none font-bold text-[10px] tracking-widest uppercase py-1.5 px-3 rounded-lg">
              EDIT MODE
            </Badge>
          </motion.div>

          {/* Main Card */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="rounded-xl border border-gray-100 bg-white p-8 space-y-12 shadow-sm">

            {/* Fields Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <Field label="Course Title (English)" req>
                <Input className={inp} placeholder="Enter English Title" value={form.titleEn} onChange={set('titleEn')} />
              </Field>
              <Field label="Course Title (Bangla)">
                <Input className={inp} placeholder="বাংলায় টাইটেল দিন" value={form.titleBn} onChange={set('titleBn')} />
              </Field>

              <Field label="Course Type" req>
                <div className="relative">
                  <select className={sel} value={form.courseType} onChange={set('courseType')}>
                    <option value="">Select a Course Type</option>
                    {COURSE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </Field>

              {form.courseType && (
                <Field label={getUrlLabel()} req>
                  <Input 
                    className={inp} 
                    placeholder={getUrlPlaceholder()} 
                    value={form.videoUrl} 
                    onChange={set('videoUrl')} 
                  />
                </Field>
              )}

              <Field label="Category" req>
                <div className="relative">
                  <select 
                    className={cn(sel, isCatsLoading && "opacity-50 cursor-wait")} 
                    value={form.category} 
                    onChange={set('category')}
                    disabled={isCatsLoading}
                  >
                    <option value="">{isCatsLoading ? 'Loading categories...' : 'Select a Category'}</option>
                    {categories?.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.category_name}
                      </option>
                    ))}
                  </select>
                  {isCatsLoading ? (
                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-500 animate-spin" size={16} />
                  ) : (
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                  )}
                </div>
              </Field>

              <Field label="Course Code">
                <Input className={inp} placeholder="Enter Code" value={form.courseCode} onChange={set('courseCode')} />
              </Field>

              <Field label="Course Duration">
                <Input className={inp} placeholder="e.g. 30days" value={form.duration} onChange={set('duration')} />
              </Field>

              <Field label="Seller Price (Cost)">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg pointer-events-none">৳</span>
                  <Input className={cn(inp, "pl-9")} type="number" placeholder="৳0" value={form.sellerFee} onChange={set('sellerFee')} />
                </div>
              </Field>

              <Field label="Offer Price (Selling)">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg pointer-events-none">৳</span>
                  <Input className={cn(inp, "pl-9", "bg-gray-100 cursor-not-allowed")} type="number" placeholder="৳0" value={form.regularFee} readOnly />
                </div>
              </Field>

              <Field label="Regular Price (MRP)">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg pointer-events-none">৳</span>
                  <Input className={cn(inp, "pl-9", "bg-gray-100 cursor-not-allowed")} type="number" placeholder="৳0" value={form.offerFee} readOnly />
                </div>
              </Field>

              <Field label="Earning Value">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg pointer-events-none">৳</span>
                  <Input className={cn(inp, "pl-9")} type="number" placeholder="৳0" value={form.earningValue} onChange={set('earningValue')} />
                </div>
              </Field>
            </div>

            {/* Image & Details */}
            <div className="space-y-8 pt-4 border-t border-gray-50">
              <Field label="Featured Image">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-16 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0">
                    {img ? (
                      <img src={URL.createObjectURL(img)} alt="New Preview" className="w-full h-full object-cover" />
                    ) : course?.image ? (
                      <img src={course.image.startsWith('http') ? course.image : `${baseImageURL}${course.image}`} alt="Current" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px] font-bold uppercase italic">No Image</div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center justify-center px-6 py-2.5 border-2 border-gray-100 rounded-xl cursor-pointer bg-white hover:bg-gray-50 hover:border-orange-500/20 transition-all text-xs font-bold text-gray-600 shadow-sm">
                      {course?.image || img ? 'Change Image' : 'Select Featured Image'}
                      <input type="file" accept="image/*" className="hidden" onChange={e => setImg(e.target.files?.[0] || null)} />
                    </label>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                      {img ? img.name : (course?.image ? 'Current featured image' : 'JPEG, PNG or WebP allowed')}
                    </span>
                  </div>
                </div>
              </Field>
              <Field label="Course Details (English)">
                <textarea rows={4} className={ta} placeholder="Enter Course Details in English" value={form.detailsEn} onChange={set('detailsEn')} />
              </Field>
              <Field label="Course Details (Bangla)">
                <textarea rows={4} className={ta} placeholder="বাংলায় কোর্সের বিবরণ দিন" value={form.detailsBn} onChange={set('detailsBn')} />
              </Field>
            </div>

            {/* Curriculum — Modulebook only */}
            <AnimatePresence>
              {isModule && (
                <motion.section key="curriculum" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ type: 'spring', damping: 20 }}>
                  <SectionHead action={
                    <Button onClick={addMod} className="h-10 rounded-xl text-xs font-bold gap-2 bg-black text-white hover:bg-orange-600 transition-all shadow-lg shadow-black/10">
                      <Plus size={16} strokeWidth={3} /> Add Module
                    </Button>
                  }>
                    Course Curriculum (Modules & Lessons)
                  </SectionHead>

                  <LayoutGroup>
                    <div className="space-y-8">
                      {modules.map((mod, mIdx) => (
                        <motion.div layout key={mod.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }}
                          className="rounded-[2.5rem] border border-gray-100 overflow-hidden bg-white shadow-2xl shadow-gray-200/40">

                          {/* Module header */}
                          <div className="flex items-center gap-5 px-8 py-6 bg-gray-50/50 border-b border-gray-100">
                            <GripVertical size={20} className="text-gray-300 shrink-0" />
                            <Badge className="bg-black text-white border-none text-[11px] font-bold px-4 py-2 shrink-0 rounded-2xl tracking-tighter italic">
                              LVL-{String(mIdx + 1).padStart(2, '0')}
                            </Badge>
                            <input className="flex-1 bg-transparent text-black font-bold text-lg placeholder-black/40 outline-none"
                              placeholder="Module Title" value={mod.title} onChange={e => setModTitle(mod.id, e.target.value)} />
                            <div className="flex items-center gap-3">
                              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => togMod(mod.id)}
                                className="w-12 h-12 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-black transition-all">
                                {mod.open ? <ChevronUp size={20} strokeWidth={3} /> : <ChevronDown size={20} strokeWidth={3} />}
                              </motion.button>
                              <motion.button whileHover={{ scale: 1.1, backgroundColor: '#fef2f2', color: '#ef4444' }} whileTap={{ scale: 0.9 }}
                                onClick={() => delMod(mod.id)}
                                className="w-12 h-12 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-400 transition-all">
                                <Trash2 size={18} strokeWidth={3} />
                              </motion.button>
                            </div>
                          </div>

                          {/* Lessons */}
                          <AnimatePresence>
                            {mod.open && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="p-10 space-y-6">
                                  {mod.lessons.map((les, lIdx) => (
                                    <motion.div layout key={les.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                                      className="rounded-[2rem] border border-gray-100 p-8 space-y-6 bg-gray-50/20 hover:border-black/10 transition-colors group/les">
                                      <div className="flex items-center gap-5">
                                        <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center text-xs font-bold shrink-0">{lIdx + 1}</div>
                                        <input className="flex-1 bg-transparent text-black font-bold text-base placeholder-black/40 outline-none border-b-2 border-gray-100 pb-2 focus:border-black transition-colors"
                                          placeholder="Lesson Title" value={les.title} onChange={e => setLesField(mod.id, les.id, 'title', e.target.value)} />
                                        <div className="relative">
                                          <Clock size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-black/60" strokeWidth={3} />
                                          <input className="w-44 bg-transparent text-black font-bold text-[11px] uppercase tracking-widest placeholder-black/40 outline-none border-b-2 border-gray-100 pb-2 pl-6 text-right focus:border-black transition-colors"
                                            placeholder="Duration" value={les.duration} onChange={e => setLesField(mod.id, les.id, 'duration', e.target.value)} />
                                        </div>
                                        <motion.button whileHover={{ scale: 1.1, color: '#ef4444' }} onClick={() => delLesson(mod.id, les.id)}
                                          className="w-10 h-10 rounded-xl hover:bg-red-50 text-gray-300 transition-all shrink-0 flex items-center justify-center">
                                          <Trash2 size={16} strokeWidth={3} />
                                        </motion.button>
                                      </div>

                                      {/* Videos */}
                                      <div className="space-y-4 pl-14">
                                        {les.videos.map((vid, vIdx) => (
                                          <motion.div layout key={vid.id} className="flex items-center gap-4">
                                            <div className="flex items-center gap-3 w-28 shrink-0">
                                              <div className="w-2 h-2 rounded-full bg-black" />
                                              <span className="text-[10px] font-bold text-black/30 uppercase tracking-[0.2em]">Video {vIdx + 1}</span>
                                            </div>
                                            <div className="flex-1 relative">
                                              <Link2 size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-black/60" strokeWidth={3} />
                                              <input className="w-full h-12 pl-12 pr-5 rounded-2xl border border-gray-100 bg-white text-black font-bold text-xs placeholder-black/40 outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all shadow-sm"
                                                placeholder="Video URL" value={vid.url} onChange={e => setVidUrl(mod.id, les.id, vid.id, e.target.value)} />
                                            </div>
                                            {les.videos.length > 1 && (
                                              <motion.button whileHover={{ scale: 1.2, color: '#ef4444' }} onClick={() => delVideo(mod.id, les.id, vid.id)}
                                                className="w-10 h-10 rounded-xl text-gray-200 transition-all shrink-0 flex items-center justify-center">
                                                <X size={16} strokeWidth={4} />
                                              </motion.button>
                                            )}
                                          </motion.div>
                                        ))}
                                        <motion.button whileHover={{ x: 5, color: '#10b981' }} onClick={() => addVideo(mod.id, les.id)}
                                          className="flex items-center gap-2 text-[11px] font-bold text-black/60 hover:text-black uppercase tracking-widest mt-4 transition-all">
                                          <Plus size={14} strokeWidth={4} /> Add Video
                                        </motion.button>
                                      </div>
                                    </motion.div>
                                  ))}

                                  <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={() => addLesson(mod.id)}
                                    className="w-full py-6 rounded-[2rem] border-4 border-dashed border-gray-100 text-black/60 hover:text-black hover:border-black/20 text-[12px] font-bold tracking-[0.3em] uppercase transition-all flex items-center justify-center gap-4">
                                    <Plus size={20} strokeWidth={4} /> Add Lesson
                                  </motion.button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </div>
                  </LayoutGroup>
                </motion.section>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Save Bar */}
          <div className="flex items-center justify-end mt-16 pb-20">
            <Button onClick={handleSave} disabled={updateMutation.isPending}
              className="rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-12 h-14 gap-3 shadow-[0_20px_40px_-10px_rgba(249,115,22,0.4)] transition-all disabled:opacity-60 text-sm uppercase tracking-wider">
              {updateMutation.isPending ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} strokeWidth={3} />}
              {updateMutation.isPending ? 'Updating...' : 'Update Course'}
            </Button>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default InstructorEditCourse;
