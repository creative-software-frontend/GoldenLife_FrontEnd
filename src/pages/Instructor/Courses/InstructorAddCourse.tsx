import React, { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  X, Plus, Trash2, ChevronDown, ChevronUp, BookOpen,
  Upload, Save, Loader2, GripVertical, Video, Link2,
  ArrowLeft, Sparkles, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-toastify';
import { cn } from '@/lib/utils';
import { useCreateCourseMutation, useCourseCategoriesQuery } from '@/hooks/useInstructorAuth';

// ─── Types ────────────────────────────────────────────────────────────────────
interface VideoItem { id: number; url: string; label: string; }
interface Lesson { id: number; title: string; videos: VideoItem[]; duration: string; }
interface Module { id: number; title: string; lessons: Lesson[]; open: boolean; }

const COURSE_TYPES = ['Course (Video)', 'Live Class', 'Ebook'];

// ─── Styled helpers ───────────────────────────────────────────────────────────
const inp = 'w-full h-12 px-5 rounded-2xl border border-gray-200 bg-gray-50/50 text-black font-semibold placeholder-gray-400 outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all text-sm shadow-sm';
const sel = `${inp} cursor-pointer appearance-none`;
const ta = 'w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 text-black font-semibold placeholder-gray-400 outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all text-sm resize-none shadow-sm';

const Field = ({ label, req, children, span2 }: { label: string; req?: boolean; children: React.ReactNode; span2?: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={span2 ? 'col-span-2' : ''}
  >
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
const InstructorAddCourse: React.FC = () => {
  const navigate = useNavigate();
  const [img, setImg] = useState<File | null>(null);
  const createMutation = useCreateCourseMutation();
  const { data: categories, isLoading: isCatsLoading } = useCourseCategoriesQuery();
  const [form, setForm] = useState({
    instructorName: '', titleEn: '', titleBn: '', courseType: '',
    downloadUrl: '', courseCode: '', category: '', duration: '',
    sellerFee: '', regularFee: '', offerFee: '', earningValue: '',
    detailsEn: '', detailsBn: '',
  });

  // ── Populate Instructor Name from Session ──────────────────────────────────
  React.useEffect(() => {
    try {
      const session = sessionStorage.getItem('instructor_session');
      if (session) {
        const { user } = JSON.parse(session);
        if (user?.name) {
          setForm(prev => ({ ...prev, instructorName: user.name }));
        }
      }
    } catch (err) {
      console.error('Failed to parse instructor session:', err);
    }
  }, []);

  // ── Automatic Price Calculation ──────────────────────────────────────────────
  React.useEffect(() => {
    const seller = Number(form.sellerFee);
    if (seller && seller > 0) {
      const sellingVal = Math.round(seller + seller * 0.3);
      const mrpVal = Math.round(sellingVal + sellingVal * 0.2);
      setForm(prev => ({
        ...prev,
        regularFee: String(sellingVal),
        offerFee: String(mrpVal),
      }));
    } else {
      setForm(prev => ({
        ...prev,
        regularFee: '',
        offerFee: '',
      }));
    }
  }, [form.sellerFee]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<any>) => setForm(p => ({ ...p, [k]: e.target.value }));

  /* Go back handler */
  const handleBack = () => navigate('/instructor/dashboard/courses');

  const handleSave = () => {
    if (!form.titleEn || !form.courseType || !form.category) { toast.error('Fill required fields.'); return; }
    const fd = new FormData();
    if (img) fd.append('image', img);
    fd.append('course_title_english', form.titleEn);
    fd.append('course_title_bangla', form.titleBn);
    fd.append('course_type', form.courseType);
    fd.append('category', form.category);
    fd.append('course_code', form.courseCode);
    fd.append('course_duration', form.duration);
    fd.append('seller_fee', form.sellerFee);
    fd.append('regular_fee', form.regularFee);
    fd.append('offer_fee', form.offerFee);
    fd.append('earning_value', form.earningValue);
    fd.append('course_details_english', form.detailsEn);
    fd.append('course_details_bangla', form.detailsBn);
    
    // Always send URL field for these types
    fd.append('video_url', form.downloadUrl);

    createMutation.mutate(fd, {
      onSuccess: () => { toast.success('Course created successfully!'); handleBack(); },
      onError: (err) => toast.error(err.message || 'Something went wrong'),
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50/50"
    >
      <div className="px-4 py-12 sm:px-12">
        <div className="max-w-5xl mx-auto">

          {/* ── Top Bar ── */}
          <motion.div
            initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="mb-10 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1, x: -5 }} whileTap={{ scale: 0.9 }}
                onClick={handleBack}
                className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-500 shadow-sm hover:text-black transition-colors"
              >
                <ArrowLeft size={20} strokeWidth={3} />
              </motion.button>
              <h1 className="text-2xl font-bold text-black tracking-tight">Course Add</h1>
            </div>
            <Badge className="bg-orange-100 text-orange-600 border-none font-bold text-[10px] tracking-widest uppercase py-1.5 px-3 rounded-lg">MODERN EDITOR</Badge>
          </motion.div>

          {/* ── Main Content Card ── */}
          <motion.div
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="rounded-xl border border-gray-100 bg-white p-8 space-y-12 shadow-sm"
          >

            {/* ── Section: Fields ── */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">

              <Field label="Course Title (English)"><Input className={inp} placeholder="Enter English Title" value={form.titleEn} onChange={set('titleEn')} /></Field>

              <Field label="Course Title (Bangla)"><Input className={inp} placeholder="বাংলায় টাইটেল দিন" value={form.titleBn} onChange={set('titleBn')} /></Field>
              <Field label="Course Type">
                <div className="relative group">
                  <select className={sel} value={form.courseType} onChange={set('courseType')}>
                    <option value="">Select a Course Type</option>
                    {COURSE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </Field>

              {form.courseType && (
                <Field label={getUrlLabel()}>
                  <Input 
                    className={inp} 
                    placeholder={getUrlPlaceholder()} 
                    value={form.downloadUrl} 
                    onChange={set('downloadUrl')} 
                  />
                </Field>
              )}
              <Field label="Course Code"><Input className={inp} placeholder="Enter Code" value={form.courseCode} onChange={set('courseCode')} /></Field>

              <Field label="Category">
                <div className="relative group">
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
              <Field label="Course Duration"><Input className={inp} placeholder="Enter Duration" value={form.duration} onChange={set('duration')} /></Field>

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

            {/* ── Section: Media & Details ── */}
            <div className="space-y-8 pt-4 border-t border-gray-50">
              <Field label="Featured Image">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-16 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0">
                    {img ? (
                      <img src={URL.createObjectURL(img)} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px] font-bold uppercase italic">No Image</div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center justify-center px-6 py-2.5 border-2 border-gray-100 rounded-xl cursor-pointer bg-white hover:bg-gray-50 hover:border-orange-500/20 transition-all text-xs font-bold text-gray-600 shadow-sm">
                      {img ? 'Change Image' : 'Select Featured Image'}
                      <input type="file" accept="image/*" className="hidden" onChange={e => setImg(e.target.files?.[0] || null)} />
                    </label>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                      {img ? img.name : 'JPEG, PNG or WebP allowed'}
                    </span>
                  </div>
                </div>
              </Field>

              <div className="space-y-6">
                <Field label="Course Details (English)">
                  <textarea rows={4} className={ta} placeholder="Enter Course Details in English" value={form.detailsEn} onChange={set('detailsEn')} />
                </Field>
                <Field label="Course Details (Bangla)">
                  <textarea rows={4} className={ta} placeholder="বাংলায় কোর্সের বিবরণ দিন" value={form.detailsBn} onChange={set('detailsBn')} />
                </Field>
              </div>
            </div>

          </motion.div>

          {/* ── Bottom Save Bar ── */}
          <div className="flex items-center justify-end mt-16 pb-20">
            <Button
              onClick={handleSave}
              disabled={createMutation.isPending}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-12 h-14 gap-3 shadow-[0_20px_40px_-10px_rgba(249,115,22,0.4)] transition-all disabled:opacity-60 text-sm uppercase tracking-wider"
            >
              {createMutation.isPending ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} strokeWidth={3} />}
              {createMutation.isPending ? 'Saving...' : 'Save Course'}
            </Button>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default InstructorAddCourse;
