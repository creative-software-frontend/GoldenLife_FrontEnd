import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Plus,
  FileText,
  Edit2,
  Trash2,
  CheckCircle2,
  HelpCircle,
  AlertCircle,
  Save,
  ChevronRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  useInstructorCourseDetailsQuery, 
  useAddQuizMutation 
} from '@/hooks/useInstructorAuth';
import { toast } from 'react-toastify';
import { Input } from '@/components/ui/input';

const InstructorCourseQuizzes: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: course, isLoading } = useInstructorCourseDetailsQuery(id);
  const addQuizMutation = useAddQuizMutation();

  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: 'a',
    points: 10
  });

  const handleSubmit = async () => {
    if (!formData.question || !id) return;
    try {
      await addQuizMutation.mutateAsync({
        courseId: id,
        data: formData
      });
      setIsAdding(false);
      setFormData({
        question: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_answer: 'a',
        points: 10
      });
      toast.success('Question added successfully');
    } catch (err) {
      toast.error('Failed to add question');
    }
  };

  if (isLoading) return <div className="p-10 text-center font-black animate-pulse text-gray-400 uppercase tracking-widest">Loading Assessments...</div>;

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
              <h1 className="text-xl font-bold text-gray-900 leading-none mb-1">Assessments Management</h1>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{course?.course_title_english}</p>
            </div>
          </div>
          <Button 
            onClick={() => setIsAdding(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black text-xs px-6 h-11 gap-2 shadow-lg shadow-orange-500/20"
          >
            <Plus size={16} strokeWidth={3} /> ADD QUESTION
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-white rounded-[2.5rem] border border-orange-100 p-10 shadow-xl overflow-hidden space-y-8"
            >
              <h3 className="text-sm font-black text-orange-600 uppercase tracking-widest">New Question</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Question Text</label>
                  <Input 
                    value={formData.question}
                    onChange={(e) => setFormData({...formData, question: e.target.value})}
                    placeholder="Enter your question here..."
                    className="h-14 rounded-2xl bg-gray-50 border-none font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {[
                    { id: 'a', label: 'Option A' },
                    { id: 'b', label: 'Option B' },
                    { id: 'c', label: 'Option C' },
                    { id: 'd', label: 'Option D' },
                  ].map((opt) => (
                    <div key={opt.id} className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{opt.label}</label>
                      <div className="relative">
                        <Input 
                          value={(formData as any)[`option_${opt.id}`]}
                          onChange={(e) => setFormData({...formData, [`option_${opt.id}`]: e.target.value})}
                          placeholder={`Enter ${opt.label}...`}
                          className={`h-12 rounded-xl bg-gray-50 border-none font-bold pl-12`}
                        />
                        <button 
                          onClick={() => setFormData({...formData, correct_answer: opt.id})}
                          className={`absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs transition-all ${
                            formData.correct_answer === opt.id ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white text-gray-300'
                          }`}
                        >
                          {opt.id.toUpperCase()}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                  <div className="flex items-center gap-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Points</label>
                    <Input 
                      type="number"
                      value={formData.points}
                      onChange={(e) => setFormData({...formData, points: parseInt(e.target.value) || 0})}
                      className="w-24 h-11 rounded-xl bg-gray-50 border-none font-bold text-center"
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button 
                      variant="ghost"
                      onClick={() => setIsAdding(false)}
                      className="rounded-xl font-black text-gray-400 h-12 px-6"
                    >
                      CANCEL
                    </Button>
                    <Button 
                      onClick={handleSubmit}
                      disabled={addQuizMutation.isPending}
                      className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black h-12 px-10"
                    >
                      {addQuizMutation.isPending ? 'SAVING...' : 'SAVE QUESTION'}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-6">
          {course?.quizzes && course.quizzes.length > 0 ? (
            course.quizzes.map((quiz, qIdx) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: qIdx * 0.05 }}
                className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-lg transition-all"
              >
                {/* Top Row */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-5">
                    {/* Orange Number Badge */}
                    <div className="w-14 h-14 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-black text-2xl shrink-0 shadow-lg shadow-orange-200">
                      {qIdx + 1}
                    </div>
                    <div className="space-y-2 pt-1">
                      {/* Tags */}
                      <div className="flex items-center gap-3">
                        <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                          Question
                        </span>
                        <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                          {quiz.points} Points
                        </span>
                      </div>
                      {/* Question */}
                      <h4 className="text-xl font-black text-gray-900 leading-snug max-w-2xl">
                        {quiz.question}
                      </h4>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-300 hover:text-gray-500 hover:bg-gray-50 transition-all">
                      <Edit2 size={16} />
                    </button>
                    <button className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-[4.75rem]">
                  {[
                    { label: 'A', value: quiz.option_a },
                    { label: 'B', value: quiz.option_b },
                    { label: 'C', value: quiz.option_c },
                    { label: 'D', value: quiz.option_d },
                  ].map((opt) => {
                    const isCorrect = quiz.correct_answer.toLowerCase() === opt.label.toLowerCase();
                    return (
                      <div
                        key={opt.label}
                        className={`p-4 rounded-2xl flex items-center gap-3 border transition-all ${
                          isCorrect
                            ? 'bg-emerald-50 border-emerald-100'
                            : 'bg-gray-50/60 border-gray-100'
                        }`}
                      >
                        {/* Letter Circle */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                          isCorrect ? 'bg-emerald-500 text-white' : 'bg-white text-gray-400 border border-gray-200'
                        }`}>
                          {opt.label}
                        </div>
                        <span className={`text-sm font-semibold leading-snug ${
                          isCorrect ? 'text-emerald-700' : 'text-gray-600'
                        }`}>
                          {opt.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-200">
              <FileText className="mx-auto text-gray-200 mb-6" size={64} strokeWidth={1} />
              <h3 className="text-xl font-black text-gray-900 mb-2">No Quizzes Added</h3>
              <p className="text-gray-400 font-medium mb-8">Add assessment questions to measure student progress.</p>
              <Button 
                className="bg-black text-white rounded-2xl px-10 h-14 font-black transition-all hover:scale-105"
              >
                Create First Question
              </Button>
            </div>
          )}
        </div>
      </main>
    </motion.div>
  );
};

export default InstructorCourseQuizzes;
