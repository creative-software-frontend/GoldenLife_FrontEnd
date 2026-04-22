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

// ─── Types ────────────────────────────────────────────────────────────────────
interface VideoItem { id: number; url: string; label: string; }
interface Lesson { id: number; title: string; videos: VideoItem[]; duration: string; }
interface Module { id: number; title: string; lessons: Lesson[]; open: boolean; }

// ─── Constants ────────────────────────────────────────────────────────────────
const COURSE_TYPES = ['Module (Video Course)', 'Product', 'Live Class', 'Ebook'];
const CATEGORIES = ['Digital Marketing', 'Web Development', 'Graphic Design', 'Data Science', 'Programming', 'Business'];

const mkLesson = (): Lesson => ({ id: Date.now() + Math.random(), title: '', videos: [{ id: Date.now(), url: '', label: 'Video 1' }], duration: '' });
const mkModule = (): Module => ({ id: Date.now(), title: '', lessons: [mkLesson()], open: true });

// ─── Styled helpers ───────────────────────────────────────────────────────────
const inp = 'w-full h-11 px-4 rounded-2xl border border-gray-200 bg-gray-50 text-black font-bold placeholder-black/40 outline-none focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 transition-all text-sm shadow-sm';
const sel = `${inp} cursor-pointer appearance-none`;
const ta  = 'w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-black font-bold placeholder-black/40 outline-none focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 transition-all text-sm resize-none shadow-sm';

const Field = ({ label, req, children, span2 }: { label: string; req?: boolean; children: React.ReactNode; span2?: boolean }) => (
  <div className={span2 ? 'col-span-2' : ''}>
    <label className="block text-[11px] font-bold text-black uppercase tracking-wider mb-2 px-1">
      {label}{req && <span className="text-red-600 ml-0.5">*</span>}
    </label>
    {children}
  </div>
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
  const [saving, setSaving] = useState(false);
  const [img, setImg] = useState<File | null>(null);
  const [modules, setModules] = useState<Module[]>([mkModule()]);
  const [form, setForm] = useState({
    instructorName: '', titleEn: '', titleBn: '', courseType: '',
    courseCode: '', category: '', duration: '',
    sellerFee: '', regularFee: '', offerFee: '', earningValue: '',
    detailsEn: '', detailsBn: '',
  });

  const isModule = form.courseType === 'Module (Video Course)';
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<any>) => setForm(p => ({ ...p, [k]: e.target.value }));

  /* Go back handler */
  const handleBack = () => navigate('/instructor/dashboard/courses');

  /* Module helpers */
  const addMod    = () => setModules(p => [...p, mkModule()]);
  const delMod    = (id: number) => setModules(p => p.filter(m => m.id !== id));
  const togMod    = (id: number) => setModules(p => p.map(m => m.id === id ? { ...m, open: !m.open } : m));
  const setModTitle = (id: number, v: string) => setModules(p => p.map(m => m.id === id ? { ...m, title: v } : m));

  /* Lesson helpers */
  const addLesson = (mId: number) => setModules(p => p.map(m => m.id === mId ? { ...m, lessons: [...m.lessons, mkLesson()] } : m));
  const delLesson = (mId: number, lId: number) => setModules(p => p.map(m => m.id === mId ? { ...m, lessons: m.lessons.filter(l => l.id !== lId) } : m));
  const setLesField = (mId: number, lId: number, k: keyof Pick<Lesson,'title'|'duration'>, v: string) =>
    setModules(p => p.map(m => m.id === mId ? { ...m, lessons: m.lessons.map(l => l.id === lId ? { ...l, [k]: v } : l) } : m));

  /* Video helpers */
  const addVideo = (mId: number, lId: number) =>
    setModules(p => p.map(m => m.id === mId ? {
      ...m, lessons: m.lessons.map(l => l.id === lId ? {
        ...l, videos: [...l.videos, { id: Date.now(), url: '', label: `Video ${l.videos.length + 1}` }]
      } : l)
    } : m));
  const delVideo = (mId: number, lId: number, vId: number) =>
    setModules(p => p.map(m => m.id === mId ? {
      ...m, lessons: m.lessons.map(l => l.id === lId ? { ...l, videos: l.videos.filter(v => v.id !== vId) } : l)
    } : m));
  const setVideoUrl = (mId: number, lId: number, vId: number, url: string) =>
    setModules(p => p.map(m => m.id === mId ? {
      ...m, lessons: m.lessons.map(l => l.id === lId ? {
        ...l, videos: l.videos.map(v => v.id === vId ? { ...v, url } : v)
      } : l)
    } : m));

  const handleSave = async () => {
    if (!form.titleEn || !form.courseType || !form.category) { toast.error('Fill required fields.'); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 1400));
    setSaving(false);
    toast.success('Course created successfully!');
    handleBack();
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
            initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', damping: 20 }}
            className="flex items-center justify-between mb-12"
          >
            <div className="flex items-center gap-6">
              <motion.button 
                whileHover={{ scale: 1.1, x: -5 }} whileTap={{ scale: 0.9 }}
                onClick={handleBack} 
                className="w-14 h-14 rounded-3xl bg-white border border-gray-100 flex items-center justify-center text-black shadow-lg shadow-gray-200/50 transition-all"
              >
                <ArrowLeft size={24} strokeWidth={3} />
              </motion.button>
              <div>
                <div className="flex items-center gap-2 text-black/60 text-[11px] font-bold uppercase tracking-[0.2em] mb-2">
                  <span>Academy</span><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /><span>Architecture</span>
                </div>
                <h1 className="text-4xl font-bold text-black tracking-tighter flex items-center gap-4">
                  Add New Curriculum
                  <Badge className="bg-black text-white border-none font-bold text-[10px] tracking-widest uppercase py-1.5 px-3 rounded-xl shadow-lg shadow-black/20">LIVE EDITOR</Badge>
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={handleBack} className="rounded-2xl text-black font-bold px-8 text-xs uppercase tracking-widest hover:bg-gray-100 h-14">
                Discard
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={saving} 
                className="rounded-2xl bg-black hover:bg-emerald-600 text-white font-bold px-12 h-14 gap-3 shadow-2xl shadow-black/20 transition-all hover:scale-[1.05] active:scale-95 disabled:opacity-60"
              >
                {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} strokeWidth={3} />}
                {saving ? 'SYNCING…' : 'DEPLOY CURRICULUM'}
              </Button>
            </div>
          </motion.div>

          {/* ── Main Content Card ── */}
          <motion.div
            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, type: 'spring', stiffness: 100 }}
            className="rounded-[3rem] border border-gray-100 bg-white p-12 space-y-16 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)]"
          >

            {/* ── Section: Basic Info ── */}
            <section>
              <SectionHead>Structural Data</SectionHead>
              <div className="grid grid-cols-2 gap-8">
                <Field label="Instructor Identification"><Input className={inp} placeholder="Full name of curator" value={form.instructorName} onChange={set('instructorName')} /></Field>
                <Field label="System Title (English)" req><Input className={inp} placeholder="e.g. Master of Neural Networks" value={form.titleEn} onChange={set('titleEn')} /></Field>
                <Field label="Native Title (Local)"><Input className={inp} placeholder="বাংলায় কোর্সের নাম" value={form.titleBn} onChange={set('titleBn')} /></Field>
                <Field label="Schema Type" req>
                  <div className="relative group">
                    <select className={sel} value={form.courseType} onChange={set('courseType')}>
                      <option value="">Choose Logic Structure</option>
                      {COURSE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-black pointer-events-none group-focus-within:rotate-180 transition-transform" size={18} strokeWidth={3} />
                  </div>
                </Field>
                <Field label="Unique Registry Code"><Input className={inp} placeholder="e.g. GL-SY-001" value={form.courseCode} onChange={set('courseCode')} /></Field>
                <Field label="Target Taxonomy" req>
                  <div className="relative group">
                    <select className={sel} value={form.category} onChange={set('category')}>
                      <option value="">Define Domain</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-black pointer-events-none group-focus-within:rotate-180 transition-transform" size={18} strokeWidth={3} />
                  </div>
                </Field>
                <Field label="Temporal Allocation"><Input className={inp} placeholder="e.g. 40 Continuous Hours" value={form.duration} onChange={set('duration')} /></Field>
              </div>
            </section>

            {/* ── Section: Pricing ── */}
            <section>
              <SectionHead>Financial Parameters</SectionHead>
              <div className="grid grid-cols-4 gap-8 bg-gray-50/80 p-8 rounded-[2rem] border border-gray-100 shadow-inner">
                {([['sellerFee','Vendor Unit'],['regularFee','Retail Value'],['offerFee','Special Offer'],['earningValue','Net Surplus']] as const).map(([k,l]) => (
                  <Field key={k} label={l}>
                    <div className="relative group">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-black font-bold text-sm transition-transform group-focus-within:scale-125">৳</span>
                      <Input className={`${inp} pl-10 border-gray-200/50`} type="number" placeholder="0.00" value={(form as any)[k]} onChange={set(k as any)} />
                    </div>
                  </Field>
                ))}
              </div>
            </section>

            {/* ── Section: Media ── */}
            <section>
              <SectionHead>Assets & Context</SectionHead>
              <div className="space-y-8">
                <Field label="Primary Visual Indicator">
                  <motion.label 
                    whileHover={{ scale: 1.01, borderColor: 'rgba(0,0,0,0.2)' }} whileTap={{ scale: 0.99 }}
                    className="flex items-center gap-5 h-16 px-8 rounded-[1.5rem] border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-white cursor-pointer transition-all group"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center text-white shadow-xl shadow-black/20 group-hover:bg-emerald-600 transition-colors">
                      <Upload size={20} strokeWidth={3} />
                    </div>
                    <span className="text-xs font-bold text-black/60 group-hover:text-black transition-colors uppercase tracking-[0.2em]">
                      {img ? img.name : 'Select High-Resolution Asset…'}
                    </span>
                    <input type="file" accept="image/*" className="hidden" onChange={e => setImg(e.target.files?.[0] || null)} />
                  </motion.label>
                </Field>
                <div className="grid grid-cols-2 gap-8">
                  <Field label="Descriptive Core (EN)">
                    <textarea rows={7} className={ta} placeholder="Detailed curriculum synthesis in English…" value={form.detailsEn} onChange={set('detailsEn')} />
                  </Field>
                  <Field label="Descriptive Core (BN)">
                    <textarea rows={7} className={ta} placeholder="বাংলায় কোর্সের মূলভাব ব্যাখ্যা করুন…" value={form.detailsBn} onChange={set('detailsBn')} />
                  </Field>
                </div>
              </div>
            </section>

            {/* ── Section: Curriculum (only for Module type) ── */}
            <AnimatePresence>
              {isModule && (
                <motion.section
                  key="curriculum"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', damping: 20 }}
                >
                  <SectionHead
                    action={
                      <Button 
                        onClick={addMod} 
                        variant="outline" 
                        className="h-12 rounded-2xl text-[11px] font-bold gap-3 border-2 border-black text-black hover:bg-black hover:text-white uppercase tracking-widest transition-all shadow-xl shadow-black/5"
                      >
                        <Plus size={16} strokeWidth={4} /> Append Logical Module
                      </Button>
                    }
                  >
                    Structural Hierarchy
                  </SectionHead>

                  <LayoutGroup>
                    <div className="space-y-8">
                      {modules.map((mod, mIdx) => (
                        <motion.div
                          layout
                          key={mod.id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          className="rounded-[2.5rem] border border-gray-100 overflow-hidden bg-white shadow-2xl shadow-gray-200/40"
                        >
                          {/* Module header */}
                          <div className="flex items-center gap-5 px-8 py-6 bg-gray-50/50 border-b border-gray-100">
                            <GripVertical size={20} className="text-gray-300 shrink-0" />
                            <Badge className="bg-black text-white border-none text-[11px] font-bold px-4 py-2 shrink-0 rounded-2xl tracking-tighter italic">
                              LVL-{String(mIdx + 1).padStart(2, '0')}
                            </Badge>
                            <input
                              className="flex-1 bg-transparent text-black font-bold text-lg placeholder-black/40 outline-none"
                              placeholder={`Define module objective…`}
                              value={mod.title}
                              onChange={e => setModTitle(mod.id, e.target.value)}
                            />
                            <div className="flex items-center gap-3">
                              <motion.button 
                                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                onClick={() => togMod(mod.id)} 
                                className="w-12 h-12 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-black transition-all"
                              >
                                {mod.open ? <ChevronUp size={20} strokeWidth={3} /> : <ChevronDown size={20} strokeWidth={3} />}
                              </motion.button>
                              <motion.button 
                                whileHover={{ scale: 1.1, backgroundColor: '#fef2f2', color: '#ef4444' }} whileTap={{ scale: 0.9 }}
                                onClick={() => delMod(mod.id)} 
                                className="w-12 h-12 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-400 transition-all"
                              >
                                <Trash2 size={18} strokeWidth={3} />
                              </motion.button>
                            </div>
                          </div>

                          {/* Lessons */}
                          <AnimatePresence>
                            {mod.open && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="p-10 space-y-6">
                                  {mod.lessons.map((les, lIdx) => (
                                    <motion.div
                                      layout
                                      key={les.id}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      className="rounded-[2rem] border border-gray-100 p-8 space-y-6 bg-gray-50/20 hover:border-black/10 transition-colors group/les"
                                    >
                                      {/* Lesson title row */}
                                      <div className="flex items-center gap-5">
                                        <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-lg shadow-black/20">
                                          {lIdx + 1}
                                        </div>
                                        <input
                                          className="flex-1 bg-transparent text-black font-bold text-base placeholder-black/40 outline-none border-b-2 border-gray-100 pb-2 focus:border-black transition-colors"
                                          placeholder={`Unit designation…`}
                                          value={les.title}
                                          onChange={e => setLesField(mod.id, les.id, 'title', e.target.value)}
                                        />
                                        <div className="relative">
                                          <Clock size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-black/60 group-focus-within/les:text-black transition-colors" strokeWidth={3} />
                                          <input
                                            className="w-44 bg-transparent text-black font-bold text-[11px] uppercase tracking-widest placeholder-black/40 outline-none border-b-2 border-gray-100 pb-2 pl-6 text-right focus:border-black transition-colors"
                                            placeholder="Runtime"
                                            value={les.duration}
                                            onChange={e => setLesField(mod.id, les.id, 'duration', e.target.value)}
                                          />
                                        </div>
                                        <motion.button 
                                          whileHover={{ scale: 1.1, color: '#ef4444' }} 
                                          onClick={() => delLesson(mod.id, les.id)} 
                                          className="w-10 h-10 rounded-xl hover:bg-red-50 text-gray-300 transition-all shrink-0 flex items-center justify-center"
                                        >
                                          <Trash2 size={16} strokeWidth={3} />
                                        </motion.button>
                                      </div>

                                      {/* Videos */}
                                      <div className="space-y-4 pl-14">
                                        {les.videos.map((vid, vIdx) => (
                                          <motion.div
                                            layout
                                            key={vid.id}
                                            className="flex items-center gap-4"
                                          >
                                            <div className="flex items-center gap-3 w-28 shrink-0">
                                              <div className="w-2 h-2 rounded-full bg-black group-focus-within:bg-emerald-500 transition-colors" />
                                              <span className="text-[10px] font-bold text-black/30 uppercase tracking-[0.2em]">Stream {vIdx + 1}</span>
                                            </div>
                                            <div className="flex-1 relative group/vid">
                                              <Link2 size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-black/60 group-focus-within/vid:text-black transition-colors" strokeWidth={3} />
                                              <input
                                                className="w-full h-12 pl-12 pr-5 rounded-2xl border border-gray-100 bg-white text-black font-bold text-xs placeholder-black/40 outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all shadow-sm"
                                                placeholder="Endpoint URL (Cloud, CDN, S3)..."
                                                value={vid.url}
                                                onChange={e => setVideoUrl(mod.id, les.id, vid.id, e.target.value)}
                                              />
                                            </div>
                                            {les.videos.length > 1 && (
                                              <motion.button 
                                                whileHover={{ scale: 1.2, color: '#ef4444' }}
                                                onClick={() => delVideo(mod.id, les.id, vid.id)} 
                                                className="w-10 h-10 rounded-xl text-gray-200 transition-all shrink-0 flex items-center justify-center"
                                              >
                                                <X size={16} strokeWidth={4} />
                                              </motion.button>
                                            )}
                                          </motion.div>
                                        ))}
                                        <motion.button
                                          whileHover={{ x: 5, color: '#10b981' }}
                                          onClick={() => addVideo(mod.id, les.id)}
                                          className="flex items-center gap-2 text-[11px] font-bold text-black/60 hover:text-black uppercase tracking-widest mt-4 transition-all"
                                        >
                                          <Plus size={14} strokeWidth={4} /> Supplement Digital Asset
                                        </motion.button>
                                      </div>
                                    </motion.div>
                                  ))}

                                  <motion.button
                                    whileHover={{ scale: 1.01, backgroundColor: '#fafafa' }} whileTap={{ scale: 0.99 }}
                                    onClick={() => addLesson(mod.id)}
                                    className="w-full py-6 rounded-[2rem] border-4 border-dashed border-gray-100 text-black/60 hover:text-black hover:border-black/20 text-[12px] font-bold tracking-[0.3em] uppercase transition-all flex items-center justify-center gap-4"
                                  >
                                    <Plus size={20} strokeWidth={4} /> Append Lesson Unit
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

          {/* ── Bottom Save Bar ── */}
          <motion.div
            initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            className="flex items-center justify-end gap-6 mt-12 pb-20"
          >
            <Button variant="ghost" onClick={handleBack} className="rounded-2xl text-black/60 hover:text-black font-bold px-12 text-xs uppercase tracking-[0.2em] h-16">
              Discard Draft
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saving} 
              className="rounded-[2rem] bg-black hover:bg-emerald-600 text-white font-bold px-20 h-20 gap-4 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.3)] transition-all hover:scale-[1.05] active:scale-95 disabled:opacity-60 text-base uppercase tracking-widest"
            >
              {saving ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} strokeWidth={3} />}
              {saving ? 'SYNCING…' : 'DEPLOY CURRICULUM'}
            </Button>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
};

export default InstructorAddCourse;
