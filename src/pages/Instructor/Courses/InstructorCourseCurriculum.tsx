import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Plus,
  Layout,
  Video,
  ChevronRight,
  MoreVertical,
  Edit2,
  Trash2,
  Play,
  Layers,
  Save,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  useInstructorCourseDetailsQuery,
  useAddModuleMutation,
  useAddLessonMutation,
  useUpdateModuleMutation,
  useDeleteModuleMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation
} from '@/hooks/useInstructorAuth';
import { toast } from 'react-toastify';

const InstructorCourseCurriculum: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: course, isLoading, isError } = useInstructorCourseDetailsQuery(id);
  const addModuleMutation = useAddModuleMutation();

  const [isAddingModule, setIsAddingModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');

  const handleAddModule = async () => {
    if (!newModuleTitle.trim() || !id) return;
    try {
      await addModuleMutation.mutateAsync({
        courseId: id,
        data: { module_title: newModuleTitle, serial_number: (course?.modules?.length || 0) + 1 }
      });
      setNewModuleTitle('');
      setIsAddingModule(false);
      toast.success('Module added successfully');
    } catch (err) {
      toast.error('Failed to add module');
    }
  };

  if (isLoading) return <div className="p-10 text-center font-black animate-pulse text-gray-400 uppercase tracking-widest">Loading Curriculum...</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50/30"
    >
      {/* Header */}
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
              <h1 className="text-xl font-bold text-gray-900 leading-none mb-1">Module and Lesson</h1>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{course?.course_title_english}</p>
            </div>
          </div>
          <Button
            onClick={() => setIsAddingModule(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs px-6 h-11 gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Plus size={16} strokeWidth={3} /> ADD MODULE
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* Add Module Inline Form */}
        <AnimatePresence>
          {isAddingModule && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-emerald-50 rounded-[2.5rem] border border-emerald-100 p-8 space-y-4 overflow-hidden"
            >
              <h3 className="text-sm font-black text-emerald-600 uppercase tracking-widest">New Module</h3>
              <div className="flex gap-4">
                <Input
                  value={newModuleTitle}
                  onChange={(e) => setNewModuleTitle(e.target.value)}
                  placeholder="Enter module title..."
                  className="bg-white border-none h-14 rounded-2xl font-bold shadow-inner"
                />
                <Button
                  onClick={handleAddModule}
                  disabled={addModuleMutation.isPending}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-14 px-8 font-black shrink-0"
                >
                  {addModuleMutation.isPending ? 'Saving...' : 'SAVE MODULE'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setIsAddingModule(false)}
                  className="rounded-2xl h-14 px-6 font-black text-emerald-600 hover:bg-emerald-100"
                >
                  CANCEL
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Module List */}
        <div className="space-y-6">
          {course?.modules && course.modules.length > 0 ? (
            course.modules.map((module, mIdx) => (
              <ModuleEditor key={mIdx} module={module} index={mIdx} />
            ))
          ) : (
            <div className="py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-200">
              <Layers className="mx-auto text-gray-200 mb-6" size={64} strokeWidth={1} />
              <h3 className="text-xl font-black text-gray-900 mb-2">No Content Yet</h3>
              <p className="text-gray-400 font-medium mb-8">Start building your course by adding your first module.</p>
              <Button
                onClick={() => setIsAddingModule(true)}
                className="bg-black text-white rounded-2xl px-10 h-14 font-black transition-all hover:scale-105"
              >
                Create Module
              </Button>
            </div>
          )}
        </div>
      </main>
    </motion.div>
  );
};

const ModuleEditor: React.FC<{ module: any; index: number }> = ({ module, index }) => {
  const [isOpen, setIsOpen] = useState(index === 0);

  const [isEditingModule, setIsEditingModule] = useState(false);
  const [editModuleTitle, setEditModuleTitle] = useState(module.module_title);

  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [lessonForm, setLessonForm] = useState({ lesson_title: '', serial_number: 1, videos: [''] });

  const { id: courseId } = useParams<{ id: string }>();

  const addLessonMutation = useAddLessonMutation();
  const updateModuleMutation = useUpdateModuleMutation();
  const deleteModuleMutation = useDeleteModuleMutation();
  const updateLessonMutation = useUpdateLessonMutation();
  const deleteLessonMutation = useDeleteLessonMutation();

  const addVideoField = () => setLessonForm(f => ({ ...f, videos: [...f.videos, ''] }));
  const removeVideoField = (idx: number) => setLessonForm(f => ({ ...f, videos: f.videos.filter((_, i) => i !== idx) }));
  const updateVideoField = (idx: number, val: string) =>
    setLessonForm(f => ({ ...f, videos: f.videos.map((v, i) => (i === idx ? val : v)) }));

  const handleAddLesson = async () => {
    if (!lessonForm.lesson_title.trim() || !courseId) return;
    const validVideos = lessonForm.videos.filter(v => v.trim() !== '');
    try {
      if (editingLessonId) {
        await updateLessonMutation.mutateAsync({
          lessonId: editingLessonId,
          courseId,
          data: {
            lesson_title: lessonForm.lesson_title,
            serial_number: lessonForm.serial_number,
            videos: validVideos,
          }
        });
        toast.success('Lesson updated successfully');
      } else {
        await addLessonMutation.mutateAsync({
          moduleId: module.id,
          courseId,
          data: {
            lesson_title: lessonForm.lesson_title,
            serial_number: (module.lessons?.length || 0) + 1,
            videos: validVideos,
          }
        });
        toast.success('Lesson added successfully');
      }

      setLessonForm({ lesson_title: '', serial_number: 1, videos: [''] });
      setIsAddingLesson(false);
      setEditingLessonId(null);
    } catch (err) {
      toast.error(editingLessonId ? 'Failed to update lesson' : 'Failed to add lesson');
    }
  };

  const handleEditLessonClick = (lesson: any) => {
    setIsAddingLesson(true);
    setIsOpen(true);
    setEditingLessonId(lesson.id);
    setLessonForm({
      lesson_title: lesson.lesson_title,
      serial_number: lesson.serial_number,
      videos: lesson.videos?.length ? lesson.videos.map((v: any) => v.video_url || v.url || v) : ['']
    });
  };

  const handleDeleteLesson = (lessonId: number) => {
    if (!courseId) return;
    const toastId = toast(
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-gray-900">
          <AlertCircle size={20} className="text-red-500" />
          <p className="font-bold">Delete this lesson?</p>
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <Button size="sm" variant="ghost" className="h-8 px-3 rounded-lg text-xs font-bold" onClick={() => toast.dismiss(toastId)}>Cancel</Button>
          <Button
            size="sm"
            className="h-8 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
            onClick={async () => {
              toast.dismiss(toastId);
              try {
                await deleteLessonMutation.mutateAsync({ lessonId, courseId });
                toast.success('Lesson deleted successfully');
              } catch (err) {
                toast.error('Failed to delete lesson');
              }
            }}
          >
            Confirm
          </Button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false, draggable: false }
    );
  };

  const handleUpdateModule = async () => {
    if (!editModuleTitle.trim() || !courseId) return;
    try {
      await updateModuleMutation.mutateAsync({
        moduleId: module.id,
        courseId,
        data: {
          module_title: editModuleTitle,
          serial_number: module.serial_number
        }
      });
      setIsEditingModule(false);
      toast.success('Module updated successfully');
    } catch (err) {
      toast.error('Failed to update module');
    }
  };

  const handleDeleteModule = () => {
    if (!courseId) return;
    const toastId = toast(
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-gray-900">
          <AlertCircle size={20} className="text-red-500" />
          <p className="font-bold">Delete this module?</p>
        </div>
        <p className="text-xs text-gray-500 font-medium">All lessons within will be lost.</p>
        <div className="flex justify-end gap-2 mt-2">
          <Button size="sm" variant="ghost" className="h-8 px-3 rounded-lg text-xs font-bold" onClick={() => toast.dismiss(toastId)}>Cancel</Button>
          <Button
            size="sm"
            className="h-8 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
            onClick={async () => {
              toast.dismiss(toastId);
              try {
                await deleteModuleMutation.mutateAsync({ moduleId: module.id, courseId });
                toast.success('Module deleted successfully');
              } catch (err) {
                toast.error('Failed to delete module');
              }
            }}
          >
            Confirm
          </Button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false, draggable: false }
    );
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
      <div className={`p-8 flex items-center justify-between transition-colors ${isOpen ? 'bg-gray-50/50' : ''}`}>
        <div className="flex items-center gap-6 flex-1 pr-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xl shrink-0">
            {index + 1}
          </div>
          {isEditingModule ? (
            <div className="flex-1 flex gap-3">
              <Input
                value={editModuleTitle}
                onChange={(e) => setEditModuleTitle(e.target.value)}
                className="bg-white border border-gray-200 h-12 rounded-xl font-bold shadow-inner w-full"
                autoFocus
              />
              <Button onClick={handleUpdateModule} disabled={updateModuleMutation.isPending} className="h-12 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700">Save</Button>
              <Button onClick={() => setIsEditingModule(false)} variant="ghost" className="h-12 rounded-xl text-gray-500">Cancel</Button>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">{module.module_title}</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{module.lessons?.length || 0} Lessons • Order: {module.serial_number || index + 1}</p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {!isEditingModule && (
            <>
              <Button onClick={() => setIsEditingModule(true)} variant="ghost" size="icon" className="rounded-xl text-gray-400 hover:text-emerald-500 hover:bg-emerald-50">
                <Edit2 size={18} />
              </Button>
              <Button onClick={handleDeleteModule} disabled={deleteModuleMutation.isPending} variant="ghost" size="icon" className="rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50">
                <Trash2 size={18} />
              </Button>
              <div className="w-px h-6 bg-gray-100 mx-2" />
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className={`rounded-xl transition-all ${isOpen ? 'rotate-90 bg-emerald-600 text-white hover:bg-emerald-700' : 'text-gray-400 hover:bg-gray-100'}`}
          >
            <ChevronRight size={20} strokeWidth={3} />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-8 pt-0 space-y-6">
              <div className="h-px bg-gray-100 -mx-8 mb-8" />

              <div className="space-y-4">
                {module.lessons?.map((lesson: any, lIdx: number) => (
                  <div key={lIdx} className="space-y-4">
                    <div className="flex items-center justify-between p-6 rounded-3xl bg-gray-50/50 border border-gray-100 group hover:bg-white hover:border-emerald-500/20 transition-all">
                      <div className="flex items-center gap-5">
                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 text-gray-400 flex items-center justify-center font-black text-sm group-hover:text-emerald-500 transition-colors">
                          {lIdx + 1}
                        </div>
                        <div>
                          <h4 className="font-black text-gray-700">{lesson.lesson_title}</h4>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{lesson.videos?.length || 0} Videos</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button onClick={() => handleEditLessonClick(lesson)} variant="ghost" size="sm" className="rounded-lg text-[10px] font-black uppercase text-gray-400 hover:text-emerald-500">Edit</Button>
                        <Button onClick={() => handleDeleteLesson(lesson.id)} disabled={deleteLessonMutation.isPending} variant="ghost" size="sm" className="rounded-lg text-[10px] font-black uppercase text-gray-400 hover:text-red-500">Delete</Button>
                      </div>
                    </div>

                    {/* Video List */}
                    <div className="ml-14 pl-6 border-l-2 border-gray-100 space-y-2">
                      {lesson.videos?.map((video: any, vIdx: number) => (
                        <div key={vIdx} className="flex items-center justify-between py-3 px-5 rounded-2xl hover:bg-emerald-50 transition-colors group/video">
                          <div className="flex items-center gap-4">
                            <Play size={14} className="text-gray-300 group-hover/video:text-emerald-500" />
                            <span className="text-sm font-bold text-gray-500 group-hover/video:text-emerald-700">{video.video_title || `Video ${vIdx + 1}`}</span>
                          </div>
                          {/* <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{video.duration || '—'}</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md opacity-0 group-hover/video:opacity-100 transition-opacity">
                              <Trash2 size={12} className="text-red-400" />
                            </Button>
                          </div> */}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {isAddingLesson && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="p-8 bg-gray-50 rounded-3xl border border-gray-100 space-y-6 overflow-hidden"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-black text-gray-700 uppercase tracking-widest">{editingLessonId ? 'Edit Lesson' : 'New Lesson'}</h4>
                        <button onClick={() => { setIsAddingLesson(false); setEditingLessonId(null); }} className="text-gray-400 hover:text-gray-600 font-black text-xs">CANCEL</button>
                      </div>

                      {/* Lesson Title */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lesson Title</label>
                        <Input
                          value={lessonForm.lesson_title}
                          onChange={(e) => setLessonForm(f => ({ ...f, lesson_title: e.target.value }))}
                          placeholder="e.g. Installing Laravel via Composer"
                          className="bg-white border-none h-12 rounded-xl font-bold shadow-inner"
                        />
                      </div>

                      {/* Video URLs */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Video URLs</label>
                          <button
                            onClick={addVideoField}
                            className="flex items-center gap-1 text-[10px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest"
                          >
                            <Plus size={12} strokeWidth={3} /> Add URL
                          </button>
                        </div>
                        {lessonForm.videos.map((url, vIdx) => (
                          <div key={vIdx} className="flex gap-3 items-center">
                            <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-400 flex items-center justify-center font-black text-xs shrink-0">
                              {vIdx + 1}
                            </div>
                            <Input
                              value={url}
                              onChange={(e) => updateVideoField(vIdx, e.target.value)}
                              placeholder="https://youtube.com/watch?v=..."
                              className="bg-white border-none h-11 rounded-xl font-medium flex-1 shadow-inner"
                            />
                            {lessonForm.videos.length > 1 && (
                              <button
                                onClick={() => removeVideoField(vIdx)}
                                className="text-red-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      <Button
                        onClick={handleAddLesson}
                        disabled={addLessonMutation.isPending}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-12 font-black"
                      >
                        {addLessonMutation.isPending ? 'SAVING...' : 'SAVE LESSON'}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  onClick={() => {
                    setIsOpen(true);
                    setIsAddingLesson(true);
                  }}
                  className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-100 border-dashed rounded-2xl h-14 font-black text-xs uppercase tracking-widest gap-2"
                >
                  <Plus size={16} strokeWidth={3} /> Add Lesson to {module.module_title}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InstructorCourseCurriculum;
