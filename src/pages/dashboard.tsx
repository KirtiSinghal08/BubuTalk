import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  BookOpen, Star, Flame, Clock, Trophy, ChevronRight,
  CheckCircle, Circle, Play, RotateCcw, BookMarked, X, ArrowLeft } from
'lucide-react';
import {
  fetchProgress, fetchLessons, fetchLesson, completeLesson, fetchVocab,
  markVocabMastered, xpToLevel,
  LANGUAGE_FLAGS, LANGUAGE_COLORS,
  type ProgressSummary, type LessonSummary, type LessonDetail, type VocabRow } from
'@/lib/bubutalk-api';

const LANGUAGES = ['Spanish', 'French', 'German', 'Japanese', 'Korean', 'Chinese', 'Portuguese', 'Italian'];
const LEVELS = ['beginner', 'intermediate', 'advanced'];

type View = 'home' | 'lessons' | 'lesson-detail' | 'quiz' | 'vocab';

export default function DashboardPage() {
  const [view, setView] = useState<View>('home');
  const [selectedLang, setSelectedLang] = useState('Spanish');
  const [selectedLevel, setSelectedLevel] = useState('beginner');
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [lessons, setLessons] = useState<LessonSummary[]>([]);
  const [activeLesson, setActiveLesson] = useState<LessonDetail | null>(null);
  const [vocab, setVocab] = useState<VocabRow[]>([]);

  // Quiz state
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizDone, setQuizDone] = useState(false);

  const loadSummary = useCallback(async () => {
    try {
      const data = await fetchProgress();
      setSummary(data);
    } catch (_) {}
  }, []);

  const loadLessons = useCallback(async () => {
    try {
      const data = await fetchLessons(selectedLang, selectedLevel);
      setLessons(data.lessons);
    } catch (_) {}
  }, [selectedLang, selectedLevel]);

  const loadVocab = useCallback(async () => {
    try {
      const data = await fetchVocab(selectedLang);
      setVocab(data.vocab);
    } catch (_) {}
  }, [selectedLang]);

  useEffect(() => {loadSummary();}, [loadSummary]);
  useEffect(() => {if (view === 'lessons') loadLessons();}, [view, loadLessons]);
  useEffect(() => {if (view === 'vocab') loadVocab();}, [view, loadVocab]);

  const openLesson = async (lesson: LessonSummary) => {
    try {
      const data = await fetchLesson(selectedLang, selectedLevel, lesson.id);
      setActiveLesson(data.lesson);
      setView('lesson-detail');
    } catch (_) {}
  };

  const startQuiz = () => {
    setQuizIdx(0);
    setQuizAnswers([]);
    setQuizSelected(null);
    setQuizDone(false);
    setView('quiz');
  };

  const answerQuiz = async (optionIdx: number) => {
    if (quizSelected !== null) return;
    setQuizSelected(optionIdx);
    const newAnswers = [...quizAnswers, optionIdx];
    setQuizAnswers(newAnswers);

    setTimeout(async () => {
      if (quizIdx + 1 < (activeLesson?.quiz.length ?? 0)) {
        setQuizIdx(quizIdx + 1);
        setQuizSelected(null);
      } else {
        // Quiz complete
        setQuizDone(true);
        const correct = newAnswers.filter((a, i) => a === activeLesson!.quiz[i].answer).length;
        const score = Math.round(correct / activeLesson!.quiz.length * 100);
        try {
          await completeLesson({
            language: selectedLang,
            lessonId: activeLesson!.id,
            score,
            xpReward: Math.round(activeLesson!.xpReward * (score / 100)),
            wordsCount: activeLesson!.vocabulary.length
          });
          await loadSummary();
        } catch (_) {}
      }
    }, 900);
  };

  const progressForLang = summary?.progress.find((p) => p.language === selectedLang);
  const xpInfo = xpToLevel(progressForLang?.xp ?? 0);

  return (
    <div className="min-h-screen" style={{ background: '#0A1628', fontFamily: "'DM Sans', sans-serif", color: '#E8EDF5' }}>
      <title>Learning Dashboard - BubuTalk</title>

      {/* Header */}
      <header style={{ background: 'rgba(15,34,64,0.95)', borderBottom: '1px solid rgba(59,111,212,0.2)' }}
      className="sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
            <ArrowLeft size={18} />
            <span className="text-sm">Home</span>
          </Link>
          <span className="opacity-30">|</span>
          <div className="flex items-center gap-2">
            <img src="/airo-assets/images/pages/dashboard/bubu" alt="Bubu" className="w-7 h-7 object-contain" />
            <span className="font-bold text-lg" style={{ color: '#3B6FD4', fontFamily: "'Nunito', sans-serif" }}>
              Learning Dashboard
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Language selector */}
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="text-sm rounded-lg px-3 py-1.5 border outline-none"
            style={{ background: 'rgba(59,111,212,0.15)', borderColor: 'rgba(59,111,212,0.3)', color: '#E8EDF5' }}>

            {LANGUAGES.map((l) => <option key={l} value={l} style={{ background: '#0F2240' }}>{l}</option>)}
          </select>
          {/* XP badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold"
          style={{ background: 'rgba(251,191,36,0.15)', color: '#FBB924', border: '1px solid rgba(251,191,36,0.3)' }}>
            <Star size={14} fill="currentColor" />
            {progressForLang?.xp ?? 0} XP
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* ── HOME VIEW ── */}
        {view === 'home' &&
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
            { icon: Star, label: 'Total XP', value: summary?.totalXp ?? 0, color: '#FBB924', bg: 'rgba(251,191,36,0.1)' },
            { icon: Flame, label: 'Day Streak', value: progressForLang?.streak ?? 0, color: '#F06292', bg: 'rgba(240,98,146,0.1)' },
            { icon: BookOpen, label: 'Lessons Done', value: summary?.totalLessons ?? 0, color: '#3B6FD4', bg: 'rgba(59,111,212,0.1)' },
            { icon: Clock, label: 'Minutes', value: summary?.totalMinutes ?? 0, color: '#22C55E', bg: 'rgba(34,197,94,0.1)' }].
            map(({ icon: Icon, label, value, color, bg }) =>
            <motion.div key={label} whileHover={{ scale: 1.02 }}
            className="rounded-2xl p-5 flex flex-col gap-2"
            style={{ background: 'rgba(15,34,64,0.8)', border: '1px solid rgba(59,111,212,0.15)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                    <Icon size={20} color={color} />
                  </div>
                  <div className="text-2xl font-bold" style={{ color, fontFamily: "'Nunito', sans-serif" }}>{value}</div>
                  <div className="text-xs opacity-60">{label}</div>
                </motion.div>
            )}
            </div>

            {/* XP Level bar */}
            <div className="rounded-2xl p-6 mb-8"
          style={{ background: 'rgba(15,34,64,0.8)', border: '1px solid rgba(59,111,212,0.15)' }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-sm opacity-60">Level {xpInfo.level} — </span>
                  <span className="font-bold" style={{ color: '#FBB924', fontFamily: "'Nunito', sans-serif" }}>{xpInfo.label}</span>
                </div>
                <span className="text-sm opacity-60">{progressForLang?.xp ?? 0} / {xpInfo.nextXp} XP</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #3B6FD4, #FBB924)' }}
                initial={{ width: 0 }}
                animate={{ width: `${xpInfo.progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }} />

              </div>
            </div>

            {/* Language progress cards */}
            <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "'Nunito', sans-serif" }}>Your Languages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {(summary?.progress.length ?? 0) > 0 ? summary!.progress.map((p) => {
              const info = xpToLevel(p.xp);
              const color = LANGUAGE_COLORS[p.language] ?? '#3B6FD4';
              return (
                <motion.div key={p.id} whileHover={{ scale: 1.01 }}
                className="rounded-2xl p-5 cursor-pointer"
                style={{ background: 'rgba(15,34,64,0.8)', border: `1px solid ${color}40` }}
                onClick={() => {setSelectedLang(p.language);setView('lessons');}}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                      style={{ background: color + '30', color }}>
                          {LANGUAGE_FLAGS[p.language] ?? p.language.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold">{p.language}</div>
                          <div className="text-xs opacity-50 capitalize">{p.level}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold" style={{ color: '#FBB924' }}>{p.xp} XP</div>
                        <div className="text-xs opacity-50">{info.label}</div>
                      </div>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${info.progress}%`, background: color }} />
                    </div>
                    <div className="flex gap-4 mt-3 text-xs opacity-50">
                      <span>{p.lessonsCompleted} lessons</span>
                      <span>{p.wordsLearned} words</span>
                      <span>{p.minutesPracticed} min</span>
                    </div>
                  </motion.div>);

            }) :
            <div className="col-span-2 rounded-2xl p-8 text-center opacity-50"
            style={{ border: '1px dashed rgba(59,111,212,0.3)' }}>
                  No language progress yet. Start a lesson to begin your journey.
                </div>
            }
            </div>

            {/* Quick actions */}
            <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "'Nunito', sans-serif" }}>Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
            { icon: BookOpen, label: 'Start Lessons', desc: `Learn ${selectedLang}`, action: () => setView('lessons'), color: '#3B6FD4' },
            { icon: BookMarked, label: 'My Vocabulary', desc: 'Review saved words', action: () => setView('vocab'), color: '#22C55E' },
            { icon: Trophy, label: 'Talk with Bubu', desc: 'Practice conversation', action: () => window.location.href = '/mascot', color: '#F06292' }].
            map(({ icon: Icon, label, desc, action, color }) =>
            <motion.button key={label} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={action}
            className="rounded-2xl p-5 text-left flex items-center gap-4"
            style={{ background: 'rgba(15,34,64,0.8)', border: `1px solid ${color}30` }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: color + '20' }}>
                    <Icon size={22} color={color} />
                  </div>
                  <div>
                    <div className="font-semibold">{label}</div>
                    <div className="text-xs opacity-50 mt-0.5">{desc}</div>
                  </div>
                  <ChevronRight size={16} className="ml-auto opacity-40" />
                </motion.button>
            )}
            </div>
          </motion.div>
        }

        {/* ── LESSONS VIEW ── */}
        {view === 'lessons' &&
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setView('home')} className="opacity-60 hover:opacity-100 transition-opacity">
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-xl font-bold" style={{ fontFamily: "'Nunito', sans-serif" }}>
                {selectedLang} Lessons
              </h2>
            </div>

            {/* Level tabs */}
            <div className="flex gap-2 mb-6">
              {LEVELS.map((lvl) =>
            <button key={lvl}
            onClick={() => setSelectedLevel(lvl)}
            className="px-4 py-2 rounded-full text-sm font-medium capitalize transition-all"
            style={{
              background: selectedLevel === lvl ? '#3B6FD4' : 'rgba(59,111,212,0.1)',
              color: selectedLevel === lvl ? 'white' : 'rgba(232,237,245,0.6)',
              border: `1px solid ${selectedLevel === lvl ? '#3B6FD4' : 'rgba(59,111,212,0.2)'}`
            }}>
                  {lvl}
                </button>
            )}
            </div>

            {lessons.length === 0 ?
          <div className="rounded-2xl p-12 text-center opacity-50"
          style={{ border: '1px dashed rgba(59,111,212,0.3)' }}>
                No lessons available for this level yet. More coming soon.
              </div> :

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lessons.map((lesson, i) =>
            <motion.div key={lesson.id}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ scale: 1.01 }}
            className="rounded-2xl p-5 cursor-pointer"
            style={{ background: 'rgba(15,34,64,0.8)', border: '1px solid rgba(59,111,212,0.15)' }}
            onClick={() => openLesson(lesson)}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-semibold text-base">{lesson.title}</div>
                        <div className="text-sm opacity-50 mt-0.5">{lesson.description}</div>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ml-3"
                style={{ background: 'rgba(251,191,36,0.15)', color: '#FBB924' }}>
                        <Star size={11} fill="currentColor" />
                        {lesson.xpReward} XP
                      </div>
                    </div>
                    <div className="flex gap-4 text-xs opacity-50">
                      <span>{lesson.vocabCount} words</span>
                      <span>{lesson.quizCount} quiz questions</span>
                      <span>{lesson.durationMinutes} min</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-sm font-medium" style={{ color: '#3B6FD4' }}>
                      <Play size={14} />
                      Start lesson
                    </div>
                  </motion.div>
            )}
              </div>
          }
          </motion.div>
        }

        {/* ── LESSON DETAIL VIEW ── */}
        {view === 'lesson-detail' && activeLesson &&
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setView('lessons')} className="opacity-60 hover:opacity-100 transition-opacity">
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-xl font-bold" style={{ fontFamily: "'Nunito', sans-serif" }}>
                {activeLesson.title}
              </h2>
              <div className="ml-auto flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-full"
            style={{ background: 'rgba(251,191,36,0.15)', color: '#FBB924' }}>
                <Star size={13} fill="currentColor" />
                {activeLesson.xpReward} XP
              </div>
            </div>

            {/* Vocabulary cards */}
            <h3 className="text-base font-semibold mb-4 opacity-70">Vocabulary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
              {activeLesson.vocabulary.map((v, i) =>
            <motion.div key={i}
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-xl p-4"
            style={{ background: 'rgba(15,34,64,0.8)', border: '1px solid rgba(59,111,212,0.15)' }}>
                  <div className="font-bold text-lg mb-1" style={{ color: '#3B6FD4', fontFamily: "'Nunito', sans-serif" }}>
                    {v.word}
                  </div>
                  <div className="text-sm font-medium mb-2">{v.translation}</div>
                  <div className="text-xs opacity-50 italic">{v.example}</div>
                </motion.div>
            )}
            </div>

            {/* Start quiz button */}
            <div className="flex justify-center">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={startQuiz}
            className="px-8 py-4 rounded-2xl font-bold text-white flex items-center gap-3"
            style={{ background: 'linear-gradient(135deg, #3B6FD4, #6C9FE8)', fontFamily: "'Nunito', sans-serif", fontSize: '1.05rem' }}>
                <Play size={20} />
                Take the Quiz
              </motion.button>
            </div>
          </motion.div>
        }

        {/* ── QUIZ VIEW ── */}
        {view === 'quiz' && activeLesson &&
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="max-w-xl mx-auto">

            {!quizDone ?
          <>
                {/* Progress bar */}
                <div className="flex items-center gap-3 mb-8">
                  <button onClick={() => setView('lesson-detail')} className="opacity-60 hover:opacity-100">
                    <X size={20} />
                  </button>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <motion.div className="h-full rounded-full" style={{ background: '#3B6FD4' }}
                animate={{ width: `${quizIdx / activeLesson.quiz.length * 100}%` }}
                transition={{ duration: 0.3 }} />
                  </div>
                  <span className="text-sm opacity-50">{quizIdx + 1}/{activeLesson.quiz.length}</span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div key={quizIdx}
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}>
                    <div className="rounded-2xl p-6 mb-6 text-center"
                style={{ background: 'rgba(15,34,64,0.8)', border: '1px solid rgba(59,111,212,0.2)' }}>
                      <div className="text-lg font-semibold" style={{ fontFamily: "'Nunito', sans-serif" }}>
                        {activeLesson.quiz[quizIdx].question}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {activeLesson.quiz[quizIdx].options.map((opt, i) => {
                    const correct = activeLesson.quiz[quizIdx].answer;
                    const isSelected = quizSelected === i;
                    const isCorrect = i === correct;
                    let bg = 'rgba(15,34,64,0.8)';
                    let border = 'rgba(59,111,212,0.2)';
                    if (quizSelected !== null) {
                      if (isCorrect) {bg = 'rgba(34,197,94,0.15)';border = '#22C55E';} else
                      if (isSelected) {bg = 'rgba(239,68,68,0.15)';border = '#EF4444';}
                    }
                    return (
                      <motion.button key={i} whileHover={quizSelected === null ? { scale: 1.02 } : {}}
                      whileTap={quizSelected === null ? { scale: 0.98 } : {}}
                      onClick={() => answerQuiz(i)}
                      className="rounded-xl p-4 text-left font-medium transition-all"
                      style={{ background: bg, border: `1px solid ${border}`, color: '#E8EDF5' }}>
                            <span className="mr-3 opacity-50">{String.fromCharCode(65 + i)}.</span>
                            {opt}
                          </motion.button>);

                  })}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </> :

          // Quiz complete
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12">
                <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(251,191,36,0.15)' }}>
                  <Trophy size={44} color="#FBB924" />
                </div>
                <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Nunito', sans-serif" }}>
                  Lesson Complete!
                </h2>
                {(() => {
              const correct = quizAnswers.filter((a, i) => a === activeLesson.quiz[i].answer).length;
              const score = Math.round(correct / activeLesson.quiz.length * 100);
              const xpEarned = Math.round(activeLesson.xpReward * (score / 100));
              return (
                <>
                      <p className="opacity-60 mb-6">{correct}/{activeLesson.quiz.length} correct — {score}%</p>
                      <div className="flex items-center justify-center gap-2 text-xl font-bold mb-8"
                  style={{ color: '#FBB924', fontFamily: "'Nunito', sans-serif" }}>
                        <Star size={22} fill="currentColor" />
                        +{xpEarned} XP earned
                      </div>
                    </>);

            })()}
                <div className="flex gap-3 justify-center">
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => {setView('lessons');loadSummary();}}
              className="px-6 py-3 rounded-xl font-semibold"
              style={{ background: '#3B6FD4', color: 'white' }}>
                    Back to Lessons
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={startQuiz}
              className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
              style={{ background: 'rgba(59,111,212,0.15)', color: '#6C9FE8', border: '1px solid rgba(59,111,212,0.3)' }}>
                    <RotateCcw size={16} />
                    Retry
                  </motion.button>
                </div>
              </motion.div>
          }
          </motion.div>
        }

        {/* ── VOCAB VIEW ── */}
        {view === 'vocab' &&
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setView('home')} className="opacity-60 hover:opacity-100 transition-opacity">
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-xl font-bold" style={{ fontFamily: "'Nunito', sans-serif" }}>
                My {selectedLang} Vocabulary
              </h2>
              <span className="ml-auto text-sm opacity-50">{vocab.length} words</span>
            </div>

            {vocab.length === 0 ?
          <div className="rounded-2xl p-12 text-center opacity-50"
          style={{ border: '1px dashed rgba(59,111,212,0.3)' }}>
                No vocabulary saved yet. Words you save during lessons will appear here.
              </div> :

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {vocab.map((v) =>
            <motion.div key={v.id} whileHover={{ scale: 1.01 }}
            className="rounded-xl p-4 flex items-start justify-between gap-3"
            style={{
              background: 'rgba(15,34,64,0.8)',
              border: `1px solid ${v.mastered ? 'rgba(34,197,94,0.3)' : 'rgba(59,111,212,0.15)'}`
            }}>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold" style={{ color: '#3B6FD4', fontFamily: "'Nunito', sans-serif" }}>
                        {v.word}
                      </div>
                      <div className="text-sm mt-0.5">{v.translation}</div>
                      {v.context && <div className="text-xs opacity-40 mt-1 italic truncate">{v.context}</div>}
                    </div>
                    <button
                onClick={async () => {
                  await markVocabMastered(v.id, !v.mastered);
                  loadVocab();
                }}
                title={v.mastered ? 'Mark as unlearned' : 'Mark as mastered'}>
                      {v.mastered ?
                <CheckCircle size={20} color="#22C55E" /> :
                <Circle size={20} className="opacity-30" />}
                    </button>
                  </motion.div>
            )}
              </div>
          }
          </motion.div>
        }

      </div>
    </div>);

}