import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, FileText, CheckCircle, Loader2, PlayCircle, BookOpen } from 'lucide-react';
import { toast } from 'react-toastify';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

const OPTION_KEYS = ['option_a', 'option_b', 'option_c', 'option_d'] as const;
const OPTION_LABELS = ['A', 'B', 'C', 'D'];

// ── Auth token helper ───────────────────────────────────────────
const getToken = () => {
    try {
        const s =
            sessionStorage.getItem('student_session') ||
            sessionStorage.getItem('vendor_session');
        if (!s) return null;
        const p = JSON.parse(s);
        if (p.expiry && Date.now() > p.expiry) return null;
        return p.token || null;
    } catch {
        return null;
    }
};

// ── Single interactive quiz card ────────────────────────────────
const QuizCard = ({ quiz }: { quiz: any }) => {
    const [selected, setSelected] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<{
        correct: boolean;
        message: string;
        points_earned?: number;
        current_balance?: number;
    } | null>(null);

    const handleSubmit = async () => {
        if (!selected) { toast.error('Please select an option.'); return; }
        setSubmitting(true);
        try {
            const token = getToken();
            const headers: Record<string, string> = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            };
            if (token) headers['X-Auth-Token'] = `Bearer ${token}`;

            const { data } = await axios.post(
                `${baseURL}/api/quiz/submit`,
                { quiz_id: quiz.id, selected_option: selected },
                { headers }
            );
            const correct = data.correct ?? false;
            setResult({
                correct,
                message: data.message || (correct ? 'Correct!' : 'Wrong answer.'),
                points_earned: data.data?.points_earned,
                current_balance: data.data?.current_balance,
            });
            correct
                ? toast.success(data.message || 'Correct! 🎉')
                : toast.error(data.message || 'Wrong answer.');
        } catch (err: any) {
            console.error('Quiz submit error:', err);
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                'Failed to submit. Please try again.';
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const optionStyle = (key: string) => {
        if (!result) {
            return selected === key
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40';
        }
        // After submission: selected option turns green if correct, red if wrong
        if (selected === key) {
            return result.correct
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-red-400 bg-red-50';
        }
        return 'border-slate-200 bg-white opacity-50';
    };

    const radioStyle = (key: string) => {
        if (!result) {
            return selected === key
                ? 'border-indigo-500 bg-indigo-500'
                : 'border-slate-300 bg-transparent';
        }
        if (selected === key) {
            return result.correct
                ? 'border-emerald-500 bg-emerald-500'
                : 'border-red-400 bg-red-400';
        }
        return 'border-slate-300 bg-transparent';
    };

    return (
        <div className="border border-slate-200 bg-white rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
            {/* Question */}
            <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="flex-1">
                    <p className="font-bold text-slate-800 text-sm sm:text-base leading-snug">
                        {quiz.question || quiz.quiz_title || quiz.title || 'Quiz'}
                    </p>
                    {quiz.points && (
                        <span className="inline-block mt-1 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                            Points: {quiz.points}
                        </span>
                    )}
                </div>
            </div>

            {/* Options */}
            {OPTION_KEYS.some(k => quiz[k]) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:ml-12">
                    {OPTION_KEYS.map((key, i) =>
                        quiz[key] ? (
                            <button
                                key={key}
                                disabled={!!result || submitting}
                                onClick={() => !result && !submitting && setSelected(key)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all duration-150 ${optionStyle(key)} ${result ? 'cursor-default' : 'cursor-pointer'}`}
                            >
                                {/* Radio circle */}
                                <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${radioStyle(key)}`}>
                                    {(selected === key) && (
                                        <span className="w-2 h-2 rounded-full bg-white block" />
                                    )}
                                </span>
                                <span className="text-sm text-slate-700">
                                    <span className="font-bold text-slate-900">{OPTION_LABELS[i]}.</span> {quiz[key]}
                                </span>
                            </button>
                        ) : null
                    )}
                </div>
            )}

            {/* Submit / Result */}
            <div className="sm:ml-12">
                {!result ? (
                    <button
                        onClick={handleSubmit}
                        disabled={!selected || submitting}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl flex items-center gap-2 transition shadow-sm"
                    >
                        {submitting
                            ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                            : <><CheckCircle className="w-4 h-4" /> Submit Answer</>
                        }
                    </button>
                ) : (
                    <div className={`flex items-start gap-3 p-4 rounded-xl border-2 ${result.correct ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${result.correct ? 'bg-emerald-100' : 'bg-red-100'}`}>
                            {result.correct
                                ? <CheckCircle className="w-5 h-5 text-emerald-600" />
                                : <span className="text-red-600 font-black text-lg leading-none">✗</span>
                            }
                        </div>
                        <div>
                            <p className="font-bold text-sm">{result.correct ? '🎉 Correct Answer!' : '❌ Wrong Answer'}</p>
                            <p className="text-xs mt-0.5 opacity-80">{result.message}</p>
                            {result.correct && result.points_earned != null && (
                                <p className="mt-1.5 text-xs font-semibold text-emerald-700">
                                    +{result.points_earned} pts earned · Balance: {result.current_balance}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ── Quiz Modal ──────────────────────────────────────────────────
interface QuizModalProps {
    courseId: string | number;
    courseName: string;
    onClose: () => void;
}

export const QuizModal = ({ courseId, courseName, onClose }: QuizModalProps) => {
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const token = getToken();
                const headers: Record<string, string> = { Accept: 'application/json' };
                if (token) headers['X-Auth-Token'] = `Bearer ${token}`;

                const { data } = await axios.get(
                    `${baseURL}/api/course/details?id=${courseId}`,
                    { headers }
                );
                const courseData = data?.data || data;

                // Collect quizzes from modules > lessons > quizzes AND top-level quizzes
                const collected: any[] = [];
                (courseData?.modules || []).forEach((mod: any) => {
                    (mod.lessons || []).forEach((les: any) => {
                        (les.quizzes || []).forEach((q: any) => collected.push(q));
                    });
                });
                (courseData?.quizzes || []).forEach((q: any) => collected.push(q));

                setQuizzes(collected);
            } catch {
                setFetchError(true);
            } finally {
                setLoading(false);
            }
        })();
    }, [courseId]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center pt-8 pb-8 px-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
            onClick={onClose}
        >
            <div
                className="bg-slate-50 rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col my-auto"
                style={{ maxHeight: 'calc(100vh - 4rem)' }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 sm:p-6 bg-white border-b border-slate-200 rounded-t-3xl shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-900 text-base sm:text-lg">Quizzes</h2>
                            <p className="text-xs text-slate-500 truncate max-w-[240px] sm:max-w-xs">{courseName}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 transition"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div
                    className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4"
                    style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 transparent' }}
                >
                    {loading && (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                        </div>
                    )}
                    {!loading && fetchError && (
                        <div className="text-center py-12 text-slate-400 font-medium">
                            Failed to load quizzes.
                        </div>
                    )}
                    {!loading && !fetchError && quizzes.length === 0 && (
                        <div className="text-center py-12 text-slate-400 font-medium">
                            No quizzes found for this course.
                        </div>
                    )}
                    {!loading && !fetchError && quizzes.map((quiz, i) => (
                        <QuizCard key={quiz.id ?? i} quiz={quiz} />
                    ))}
                </div>
            </div>
        </div>
    );
};

// ── Course Action Buttons (exported for use in order pages) ─────
interface CourseActionButtonsProps {
    item: {
        product_id?: string | number;
        product_name: string;
        course_type?: string;
        download_url?: string | null;
        service_type?: string;
    };
}

export const CourseActionButtons = ({ item }: CourseActionButtonsProps) => {
    const [showQuizModal, setShowQuizModal] = useState(false);

    const type = (item.course_type || '').toLowerCase();
    const isEbook = type.includes('ebook');

    if (isEbook) {
        return item.download_url ? (
            <button
                onClick={() => window.open(item.download_url!, '_blank', 'noopener,noreferrer')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition shadow-sm"
            >
                <BookOpen className="w-3.5 h-3.5" /> Download PDF
            </button>
        ) : (
            <span className="text-[10px] text-slate-400 font-bold uppercase italic">PDF Pending</span>
        );
    }

    return (
        <>
            <div className="flex flex-wrap gap-2">
                {/* Lesson Video button — opens URL directly */}
                <button
                    onClick={() => {
                        if (item.download_url) {
                            window.open(item.download_url, '_blank', 'noopener,noreferrer');
                        } else {
                            toast.info('Video link not available yet.');
                        }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition shadow-sm shadow-indigo-100"
                >
                    <PlayCircle className="w-3.5 h-3.5" /> Lesson Video
                </button>

                {/* Quiz button — opens modal */}
                {item.product_id && (
                    <button
                        onClick={() => setShowQuizModal(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition shadow-sm shadow-amber-100"
                    >
                        <FileText className="w-3.5 h-3.5" /> Quiz
                    </button>
                )}
            </div>

            {showQuizModal && item.product_id && (
                <QuizModal
                    courseId={item.product_id}
                    courseName={item.product_name}
                    onClose={() => setShowQuizModal(false)}
                />
            )}
        </>
    );
};
