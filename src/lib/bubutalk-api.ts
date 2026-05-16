// ── BubuTalk API client ───────────────────────────────────────────────────────
// Generates a persistent session ID for guest users (stored in localStorage)

export function getSessionId(): string {
  if (typeof window === 'undefined') return 'ssr';
  let id = localStorage.getItem('bubutalk_session');
  if (!id) {
    id = `bt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem('bubutalk_session', id);
  }
  return id;
}

// ── Types ─────────────────────────────────────────────────────────────────────
export interface ProgressRow {
  id: number;
  userId: number;
  language: string;
  level: string;
  xp: number;
  streak: number;
  lastActiveAt: string | null;
  lessonsCompleted: number;
  wordsLearned: number;
  minutesPracticed: number;
}

export interface VocabRow {
  id: number;
  userId: number;
  language: string;
  word: string;
  translation: string;
  context: string | null;
  mastered: boolean;
  reviewCount: number;
  createdAt: string;
}

export interface LessonSummary {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  durationMinutes: number;
  vocabCount: number;
  quizCount: number;
}

export interface LessonDetail {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  durationMinutes: number;
  vocabulary: Array<{ word: string; translation: string; example: string }>;
  quiz: Array<{ question: string; options: string[]; answer: number }>;
}

export interface ProgressSummary {
  user: { id: number; name: string; avatarColor: string; createdAt: string } | null;
  progress: ProgressRow[];
  totalXp: number;
  totalLessons: number;
  totalWords: number;
  totalMinutes: number;
  recentSessions: Array<{ id: number; language: string; startedAt: string; messageCount: number }>;
  vocabByLang: Record<string, number>;
}

// ── API calls ─────────────────────────────────────────────────────────────────

export async function fetchProgress(language?: string): Promise<ProgressSummary> {
  const sessionId = getSessionId();
  const params = new URLSearchParams({ sessionId });
  if (language) params.set('language', language);
  const res = await fetch(`/api/progress?${params}`);
  if (!res.ok) throw new Error('Failed to fetch progress');
  return res.json();
}

export async function postProgress(payload: {
  language: string;
  xpDelta?: number;
  lessonCompleted?: boolean;
  wordsLearnedDelta?: number;
  minutesDelta?: number;
  level?: string;
}): Promise<{ progress: ProgressRow }> {
  const res = await fetch('/api/progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId: getSessionId(), ...payload }),
  });
  if (!res.ok) throw new Error('Failed to update progress');
  return res.json();
}

export async function fetchLessons(language: string, level: string): Promise<{
  lessons: LessonSummary[];
  totalLessons: number;
  availableLevels: string[];
}> {
  const params = new URLSearchParams({ language, level });
  const res = await fetch(`/api/lessons?${params}`);
  if (!res.ok) throw new Error('Failed to fetch lessons');
  return res.json();
}

export async function fetchLesson(language: string, level: string, lessonId: string): Promise<{ lesson: LessonDetail }> {
  const params = new URLSearchParams({ language, level, lessonId });
  const res = await fetch(`/api/lessons?${params}`);
  if (!res.ok) throw new Error('Failed to fetch lesson');
  return res.json();
}

export async function completeLesson(payload: {
  language: string;
  lessonId: string;
  score: number;
  xpReward: number;
  wordsCount: number;
}): Promise<{ success: boolean; xpEarned: number }> {
  const res = await fetch('/api/lessons/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId: getSessionId(), ...payload }),
  });
  if (!res.ok) throw new Error('Failed to complete lesson');
  return res.json();
}

export async function fetchVocab(language?: string): Promise<{ vocab: VocabRow[] }> {
  const sessionId = getSessionId();
  const params = new URLSearchParams({ sessionId });
  if (language) params.set('language', language);
  const res = await fetch(`/api/vocab?${params}`);
  if (!res.ok) throw new Error('Failed to fetch vocab');
  return res.json();
}

export async function saveVocab(payload: {
  language: string;
  word: string;
  translation: string;
  context?: string;
}): Promise<{ vocab: VocabRow; alreadySaved: boolean }> {
  const res = await fetch('/api/vocab', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId: getSessionId(), ...payload }),
  });
  if (!res.ok) throw new Error('Failed to save vocab');
  return res.json();
}

export async function markVocabMastered(id: number, mastered: boolean): Promise<{ vocab: VocabRow }> {
  const res = await fetch(`/api/vocab/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mastered }),
  });
  if (!res.ok) throw new Error('Failed to update vocab');
  return res.json();
}

export async function sendChatMessage(payload: {
  message: string;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
  language: string;
  chatSessionId?: number;
}): Promise<{ reply: string; chatSessionId: number }> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId: getSessionId(), ...payload }),
  });
  if (!res.ok) throw new Error('Failed to send chat message');
  return res.json();
}

// ── XP level thresholds ───────────────────────────────────────────────────────
export function xpToLevel(xp: number): { level: number; label: string; nextXp: number; progress: number } {
  const thresholds = [0, 100, 250, 500, 900, 1400, 2000, 2800, 3800, 5000];
  const labels = ['Seedling', 'Explorer', 'Adventurer', 'Scholar', 'Linguist', 'Expert', 'Master', 'Champion', 'Legend', 'Grandmaster'];
  let lvl = 0;
  for (let i = 0; i < thresholds.length - 1; i++) {
    if (xp >= thresholds[i]) lvl = i;
  }
  const nextXp = thresholds[lvl + 1] ?? thresholds[thresholds.length - 1];
  const prevXp = thresholds[lvl];
  const progress = Math.min(100, Math.round(((xp - prevXp) / (nextXp - prevXp)) * 100));
  return { level: lvl + 1, label: labels[lvl], nextXp, progress };
}

export const LANGUAGE_FLAGS: Record<string, string> = {
  Spanish: 'ES', French: 'FR', German: 'DE', Japanese: 'JP',
  Korean: 'KR', Chinese: 'CN', Portuguese: 'PT', Italian: 'IT',
  Russian: 'RU', Hindi: 'IN', Arabic: 'SA', English: 'GB',
};

export const LANGUAGE_COLORS: Record<string, string> = {
  Spanish: '#E63946', French: '#457B9D', German: '#2D3A3A',
  Japanese: '#BC4749', Korean: '#3D405B', Chinese: '#E07A5F',
  Portuguese: '#006400', Italian: '#118AB2', Russian: '#073B4C',
  Hindi: '#FF6B35', Arabic: '#6B4226', English: '#264653',
};
