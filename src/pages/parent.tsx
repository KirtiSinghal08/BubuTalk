import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  BookOpen, Clock, MessageSquare, Globe, ArrowLeft, Shield, BarChart2,
} from 'lucide-react';import {
  fetchProgress, xpToLevel, LANGUAGE_COLORS, LANGUAGE_FLAGS,
  type ProgressSummary,
} from '@/lib/bubutalk-api';

export default function ParentDashboardPage() {
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await fetchProgress();
      setSummary(data);
    } catch (_) {}
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const totalSessions = summary?.recentSessions.length ?? 0;
  const activeLanguages = summary?.progress.length ?? 0;
  const totalMinutes = summary?.totalMinutes ?? 0;
  const totalXp = summary?.totalXp ?? 0;
  const xpInfo = xpToLevel(totalXp);

  // Compute per-language breakdown
  const langBreakdown = summary?.progress ?? [];

  return (
    <div className="min-h-screen" style={{ background: '#0A1628', fontFamily: "'DM Sans', sans-serif", color: '#E8EDF5' }}>
      <title>Parent Dashboard - BubuTalk</title>

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
            <Shield size={20} color="#3B6FD4" />
            <span className="font-bold text-lg" style={{ color: '#3B6FD4', fontFamily: "'Nunito', sans-serif" }}>
              Parent Dashboard
            </span>
          </div>
        </div>
        <div className="text-xs opacity-50 flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          Live data
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

            {/* Child info banner */}
            <div className="rounded-2xl p-6 mb-8 flex items-center gap-5"
              style={{ background: 'linear-gradient(135deg, rgba(59,111,212,0.2), rgba(108,159,232,0.1))', border: '1px solid rgba(59,111,212,0.25)' }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0"
                style={{ background: summary?.user?.avatarColor ?? '#3B6FD4', fontFamily: "'Nunito', sans-serif" }}>
                {(summary?.user?.name ?? 'L').charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="text-xl font-bold" style={{ fontFamily: "'Nunito', sans-serif" }}>
                  {summary?.user?.name ?? 'Your Learner'}
                </div>
                <div className="text-sm opacity-60 mt-0.5">
                  Level {xpInfo.level} — {xpInfo.label}
                </div>
                <div className="mt-2 h-2 rounded-full overflow-hidden max-w-xs" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <div className="h-full rounded-full" style={{ width: `${xpInfo.progress}%`, background: 'linear-gradient(90deg, #3B6FD4, #FBB924)' }} />
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold" style={{ color: '#FBB924', fontFamily: "'Nunito', sans-serif" }}>
                  {totalXp}
                </div>
                <div className="text-xs opacity-50">Total XP</div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Globe, label: 'Languages', value: activeLanguages, color: '#3B6FD4', bg: 'rgba(59,111,212,0.1)' },
                { icon: BookOpen, label: 'Lessons Done', value: summary?.totalLessons ?? 0, color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
                { icon: Clock, label: 'Minutes Practiced', value: totalMinutes, color: '#F06292', bg: 'rgba(240,98,146,0.1)' },
                { icon: MessageSquare, label: 'Chat Sessions', value: totalSessions, color: '#FBB924', bg: 'rgba(251,191,36,0.1)' },
              ].map(({ icon: Icon, label, value, color, bg }) => (
                <motion.div key={label} whileHover={{ scale: 1.02 }}
                  className="rounded-2xl p-5"
                  style={{ background: 'rgba(15,34,64,0.8)', border: '1px solid rgba(59,111,212,0.15)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: bg }}>
                    <Icon size={20} color={color} />
                  </div>
                  <div className="text-2xl font-bold" style={{ color, fontFamily: "'Nunito', sans-serif" }}>{value}</div>
                  <div className="text-xs opacity-50 mt-1">{label}</div>
                </motion.div>
              ))}
            </div>

            {/* Language breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Per-language progress */}
              <div className="rounded-2xl p-6"
                style={{ background: 'rgba(15,34,64,0.8)', border: '1px solid rgba(59,111,212,0.15)' }}>
                <h3 className="font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "'Nunito', sans-serif" }}>
                  <BarChart2 size={18} color="#3B6FD4" />
                  Language Progress
                </h3>
                {langBreakdown.length === 0 ? (
                  <p className="text-sm opacity-40">No languages started yet.</p>
                ) : (
                  <div className="space-y-4">
                    {langBreakdown.map(p => {
                      const color = LANGUAGE_COLORS[p.language] ?? '#3B6FD4';
                      const info = xpToLevel(p.xp);
                      return (
                        <div key={p.id}>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold px-1.5 py-0.5 rounded"
                                style={{ background: color + '25', color }}>
                                {LANGUAGE_FLAGS[p.language] ?? p.language.slice(0, 2)}
                              </span>
                              <span className="text-sm font-medium">{p.language}</span>
                            </div>
                            <span className="text-xs opacity-50">{p.xp} XP · {info.label}</span>
                          </div>
                          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                            <motion.div className="h-full rounded-full"
                              style={{ background: color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${info.progress}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }} />
                          </div>
                          <div className="flex gap-3 mt-1 text-xs opacity-40">
                            <span>{p.lessonsCompleted} lessons</span>
                            <span>{p.wordsLearned} words</span>
                            <span>{p.minutesPracticed} min</span>
                            <span className="capitalize">{p.level}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Vocabulary by language */}
              <div className="rounded-2xl p-6"
                style={{ background: 'rgba(15,34,64,0.8)', border: '1px solid rgba(59,111,212,0.15)' }}>
                <h3 className="font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "'Nunito', sans-serif" }}>
                  <BookOpen size={18} color="#22C55E" />
                  Vocabulary Saved
                </h3>
                {Object.keys(summary?.vocabByLang ?? {}).length === 0 ? (
                  <p className="text-sm opacity-40">No vocabulary saved yet.</p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(summary?.vocabByLang ?? {}).map(([lang, count]) => {
                      const color = LANGUAGE_COLORS[lang] ?? '#3B6FD4';
                      const maxCount = Math.max(...Object.values(summary?.vocabByLang ?? {}));
                      return (
                        <div key={lang} className="flex items-center gap-3">
                          <span className="text-xs font-bold w-8 text-center px-1 py-0.5 rounded"
                            style={{ background: color + '25', color }}>
                            {LANGUAGE_FLAGS[lang] ?? lang.slice(0, 2)}
                          </span>
                          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                            <motion.div className="h-full rounded-full"
                              style={{ background: color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${(count / maxCount) * 100}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }} />
                          </div>
                          <span className="text-sm font-semibold w-8 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Recent sessions */}
            <div className="rounded-2xl p-6 mb-8"
              style={{ background: 'rgba(15,34,64,0.8)', border: '1px solid rgba(59,111,212,0.15)' }}>
              <h3 className="font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "'Nunito', sans-serif" }}>
                <MessageSquare size={18} color="#F06292" />
                Recent Chat Sessions
              </h3>
              {(summary?.recentSessions.length ?? 0) === 0 ? (
                <p className="text-sm opacity-40">No chat sessions yet. Encourage your child to talk with Bubu.</p>
              ) : (
                <div className="space-y-2">
                  {summary!.recentSessions.map(s => (
                    <div key={s.id} className="flex items-center justify-between py-2 border-b"
                      style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                          style={{ background: (LANGUAGE_COLORS[s.language] ?? '#3B6FD4') + '25', color: LANGUAGE_COLORS[s.language] ?? '#3B6FD4' }}>
                          {LANGUAGE_FLAGS[s.language] ?? s.language.slice(0, 2)}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{s.language} session</div>
                          <div className="text-xs opacity-40">{new Date(s.startedAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="text-sm opacity-50">{s.messageCount} messages</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tips for parents */}
            <div className="rounded-2xl p-6"
              style={{ background: 'rgba(59,111,212,0.08)', border: '1px solid rgba(59,111,212,0.2)' }}>
              <h3 className="font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "'Nunito', sans-serif", color: '#6C9FE8' }}>
                <Shield size={18} />
                Tips for Supporting Your Learner
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {[
                  { title: 'Practice daily', desc: 'Even 5 minutes a day builds strong language habits. Consistency beats long sessions.' },
                  { title: 'Celebrate progress', desc: 'Acknowledge XP gains and streaks. Positive reinforcement keeps kids motivated.' },
                  { title: 'Use it in real life', desc: 'Ask your child to teach you words they learned. Teaching reinforces memory.' },
                  { title: 'Mix it up', desc: 'Alternate between lessons, vocabulary review, and chatting with Bubu for variety.' },
                ].map(tip => (
                  <div key={tip.title} className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: '#3B6FD4' }} />
                    <div>
                      <div className="font-semibold mb-0.5">{tip.title}</div>
                      <div className="opacity-50 leading-relaxed">{tip.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}
      </div>
    </div>
  );
}
