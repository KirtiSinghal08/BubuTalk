import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Volume2, VolumeX, PhoneOff, Sparkles, RotateCcw } from 'lucide-react';
import AnimatedMascot, { type MascotEmotion } from '@/components/AnimatedMascot';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ChatMessage {
  id: string;
  role: 'bubu' | 'user';
  text: string;
}

// ─── Bubu scripted responses (keyword-matched) ────────────────────────────────
const RESPONSES: { keywords: string[]; replies: string[]; emotion: MascotEmotion }[] = [
  {
    keywords: ['hello', 'hi', 'hey', 'hola', 'bonjour', 'ciao', 'hallo'],
    replies: [
      "Hi there! I'm Bubu, your language buddy! What language shall we explore today?",
      "Hello, friend! Ready to learn something amazing? I know Spanish, French, Japanese, and more!",
      "Hey! Great to see you! What language would you like to practice?",
    ],
    emotion: 'waving',
  },
  {
    keywords: ['spanish', 'espanol', 'español'],
    replies: [
      "Hola! Let's learn Spanish! Try saying 'Hola, ¿cómo estás?' — it means 'Hello, how are you?'",
      "Spanish is so fun! Did you know 'gracias' means 'thank you'? Can you say it? Gra-ci-as!",
      "Vamos! In Spanish, 'amigo' means friend — and you're my amigo!",
    ],
    emotion: 'excited',
  },
  {
    keywords: ['french', 'français', 'francais'],
    replies: [
      "Bonjour! French is the language of art and adventure! 'Bonjour' means hello — can you say it?",
      "Ooh la la! Let's learn French! 'Merci' means thank you. Mer-ci. Beautiful, right?",
      "French is magnifique — that means magnificent! What French word would you like to learn?",
    ],
    emotion: 'happy',
  },
  {
    keywords: ['japanese', 'nihongo', 'japan'],
    replies: [
      "Konnichiwa! That means hello in Japanese! Japan has a beautiful language. Say it with me: Ko-ni-chi-wa!",
      "In Japanese, 'arigatou' means thank you! Isn't that a fun word to say?",
      "Sugoi! That means amazing in Japanese — and YOU are sugoi for learning!",
    ],
    emotion: 'excited',
  },
  {
    keywords: ['german', 'deutsch'],
    replies: [
      "Guten Tag! That's hello in German! German is a powerful language. Can you say 'Guten Tag'?",
      "In German, 'Danke' means thank you! It's short and easy — Danke!",
    ],
    emotion: 'happy',
  },
  {
    keywords: ['thank', 'thanks', 'danke', 'merci', 'gracias', 'arigatou'],
    replies: [
      "You're so welcome! You're doing amazing — keep it up!",
      "Aww, you're very welcome! Learning languages is the best adventure!",
    ],
    emotion: 'encouraging',
  },
  {
    keywords: ['good', 'great', 'awesome', 'amazing', 'wonderful', 'cool', 'nice'],
    replies: [
      "Yes! You're doing so well! I'm so proud of you!",
      "That's fantastic! You're a natural language learner!",
      "Woohoo! Keep going — you're on fire!",
    ],
    emotion: 'excited',
  },
  {
    keywords: ['help', 'how', 'what', 'teach', 'learn', 'practice'],
    replies: [
      "I'd love to help! Just tell me which language you want to practice and I'll guide you step by step!",
      "Great question! I can teach you words, phrases, and pronunciation in many languages. Which one interests you?",
      "Let's learn together! Pick a language — Spanish, French, Japanese, German, Italian, or more!",
    ],
    emotion: 'thinking',
  },
  {
    keywords: ['bye', 'goodbye', 'see you', 'later', 'ciao', 'adios', 'au revoir'],
    replies: [
      "Goodbye! Keep practicing — you're doing amazing! Come back soon!",
      "Au revoir! That's goodbye in French! See you next time, language superstar!",
      "Adios amigo! That's Spanish for goodbye! You're doing great — keep it up!",
    ],
    emotion: 'waving',
  },
  {
    keywords: ['number', 'count', 'uno', 'one', 'two', 'three'],
    replies: [
      "Let's count! In Spanish: uno, dos, tres! In French: un, deux, trois! Can you repeat after me?",
      "Numbers are so fun! In Japanese: ichi, ni, san — that's one, two, three!",
    ],
    emotion: 'happy',
  },
];

const FALLBACK_RESPONSES: { text: string; emotion: MascotEmotion }[] = [
  { text: "Hmm, that's interesting! Tell me more — or ask me about a language you want to learn!", emotion: 'thinking' },
  { text: "I'm not sure I understood that, but I love your enthusiasm! Which language shall we explore?", emotion: 'happy' },
  { text: "Ooh, I'm still learning too! Try asking me about Spanish, French, Japanese, or German!", emotion: 'encouraging' },
  { text: "That's a great thing to say! Now, shall we practice some words together?", emotion: 'excited' },
];

function getBubuResponse(input: string): { text: string; emotion: MascotEmotion } {
  const lower = input.toLowerCase();
  for (const group of RESPONSES) {
    if (group.keywords.some((kw) => lower.includes(kw))) {
      const reply = group.replies[Math.floor(Math.random() * group.replies.length)];
      return { text: reply, emotion: group.emotion };
    }
  }
  return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
}

// ─── Speech synthesis helper ──────────────────────────────────────────────────
function speakText(
  text: string,
  onStart: () => void,
  onEnd: () => void,
  onIntensity: (v: number) => void,
) {
  if (!('speechSynthesis' in window)) {
    onStart();
    setTimeout(onEnd, text.length * 50);
    return;
  }
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.rate = 0.92;
  utt.pitch = 1.15;
  utt.volume = 1;

  // Pick a friendly voice
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(
    (v) =>
      v.name.toLowerCase().includes('samantha') ||
      v.name.toLowerCase().includes('karen') ||
      v.name.toLowerCase().includes('google us english') ||
      v.lang === 'en-US',
  );
  if (preferred) utt.voice = preferred;

  utt.onstart = () => {
    onStart();
    // Simulate lip-sync intensity with a timer
    let t = 0;
    const interval = setInterval(() => {
      t += 80;
      onIntensity(0.4 + Math.random() * 0.6);
      if (t > text.length * 55) {
        clearInterval(interval);
        onIntensity(0);
      }
    }, 80);
  };
  utt.onend = () => {
    onIntensity(0);
    onEnd();
  };
  utt.onerror = () => {
    onIntensity(0);
    onEnd();
  };
  window.speechSynthesis.speak(utt);
}

// ─── Speech Recognition types ─────────────────────────────────────────────────
interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((e: ISpeechRecognitionEvent) => void) | null;
  start(): void;
  stop(): void;
}
interface ISpeechRecognitionResult {
  isFinal: boolean;
  0: { transcript: string };
}
interface ISpeechRecognitionResultList {
  length: number;
  [index: number]: ISpeechRecognitionResult;
}
interface ISpeechRecognitionEvent {
  results: ISpeechRecognitionResultList;
}
type SpeechRecognitionConstructor = new () => ISpeechRecognition;

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MascotPage() {
  const [emotion, setEmotion] = useState<MascotEmotion>('waving');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [speakingIntensity, setSpeakingIntensity] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'bubu',
      text: "Hi there! I'm Bubu, your language learning buddy! Say hello or ask me about any language!",
    },
  ]);
  const [transcript, setTranscript] = useState('');
  const [isCallActive, setIsCallActive] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [inputText, setInputText] = useState('');
  const [micStatus, setMicStatus] = useState<'idle' | 'listening' | 'denied' | 'unsupported'>('idle');

  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const callTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Call timer
  useEffect(() => {
    if (isCallActive) {
      callTimerRef.current = setInterval(() => setCallDuration((d) => d + 1), 1000);
    }
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [isCallActive]);

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Greet on mount
  useEffect(() => {
    setTimeout(() => {
      if (!isMuted) {
        speakText(
          messages[0].text,
          () => { setIsSpeaking(true); setEmotion('waving'); },
          () => { setIsSpeaking(false); setEmotion('idle'); },
          setSpeakingIntensity,
        );
      }
    }, 800);
  }, []);

  // ── Bubu responds ──
  const bubuRespond = useCallback(
    (userText: string) => {
      const { text, emotion: newEmotion } = getBubuResponse(userText);

      // Add user message
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: 'user', text: userText },
      ]);

      // Thinking pause
      setEmotion('thinking');
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: (Date.now() + 1).toString(), role: 'bubu', text },
        ]);
        setEmotion(newEmotion);

        if (!isMuted) {
          speakText(
            text,
            () => setIsSpeaking(true),
            () => { setIsSpeaking(false); setEmotion('idle'); },
            setSpeakingIntensity,
          );
        }
      }, 700);
    },
    [isMuted],
  );

  // ── Voice input ──
  const startListening = useCallback(() => {
    const w = window as Window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const SpeechRecognitionCtor = w.SpeechRecognition || w.webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      setMicStatus('unsupported');
      return;
    }

    // Request mic permission explicitly first
    navigator.mediaDevices?.getUserMedia({ audio: true })
      .then(() => {
        window.speechSynthesis?.cancel();
        setIsSpeaking(false);
        setSpeakingIntensity(0);

        const recognition = new SpeechRecognitionCtor();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setMicStatus('listening');
          setEmotion('listening');
          setTranscript('');
        };

        recognition.onresult = (e: ISpeechRecognitionEvent) => {
          const interim = Array.from({ length: e.results.length })
            .map((_, i) => e.results[i][0].transcript)
            .join('');
          setTranscript(interim);

          if (e.results[e.results.length - 1].isFinal) {
            setTranscript('');
            setIsListening(false);
            setMicStatus('idle');
            bubuRespond(interim.trim());
          }
        };

        recognition.onerror = ((e: Event) => {
          const err = e as Event & { error?: string };
          setIsListening(false);
          setTranscript('');
          if (err.error === 'not-allowed' || err.error === 'service-not-allowed') {
            setMicStatus('denied');
          } else {
            setMicStatus('idle');
          }
          setEmotion('idle');
        }) as () => void;

        recognition.onend = () => {
          setIsListening(false);
          if (micStatus === 'listening') setMicStatus('idle');
          setEmotion('idle');
        };

        recognitionRef.current = recognition;
        recognition.start();
      })
      .catch(() => {
        setMicStatus('denied');
      });
  }, [bubuRespond, micStatus]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setTranscript('');
    setMicStatus('idle');
    setEmotion('idle');
  }, []);

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleMuteToggle = () => {
    setIsMuted((m) => {
      if (!m) window.speechSynthesis?.cancel();
      return !m;
    });
  };

  const handleEndCall = () => {
    window.speechSynthesis?.cancel();
    recognitionRef.current?.stop();
    setIsCallActive(false);
    setEmotion('waving');
  };

  const handleRestart = () => {
    setIsCallActive(true);
    setCallDuration(0);
    setMessages([
      {
        id: '0',
        role: 'bubu',
        text: "Hi again! I'm Bubu, your language learning buddy! What shall we learn today?",
      },
    ]);
    setEmotion('waving');
    setIsSpeaking(false);
    setIsListening(false);
    setMicStatus('idle');
    setTranscript('');
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    bubuRespond(inputText.trim());
    setInputText('');
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#0A1628', fontFamily: "'DM Sans', sans-serif" }}
    >
      <title>Talk with Bubu — BubuTalk</title>
      <meta name="description" content="Have a real-time animated video call with Bubu, your AI language learning mascot." />

      {/* ── Top bar ── */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm font-semibold" style={{ color: '#94A3B8', fontFamily: "'Nunito', sans-serif" }}>
            {isCallActive ? `Live • ${formatDuration(callDuration)}` : 'Call Ended'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles size={16} color="#6C9FE8" />
          <span className="text-sm font-bold" style={{ color: '#fff', fontFamily: "'Nunito', sans-serif" }}>
            Bubu<span style={{ color: '#6C9FE8' }}>Talk</span> Live
          </span>
        </div>
        <div className="text-xs font-medium px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(59,111,212,0.15)', color: '#6C9FE8', border: '1px solid rgba(59,111,212,0.25)' }}>
          AI Mascot
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>

        {/* ── Left: Mascot video panel ── */}
        <div
          className="flex flex-col items-center justify-center relative"
          style={{
            flex: '0 0 55%',
            background: 'linear-gradient(160deg, #0D1B2E 0%, #0A1628 100%)',
            borderRight: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          {/* Background grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(59,111,212,0.06) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* Mascot */}
          <motion.div
            className="relative z-10 flex flex-col items-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <AnimatedMascot
              emotion={emotion}
              isSpeaking={isSpeaking}
              isListening={isListening}
              speakingIntensity={speakingIntensity}
              size={300}
            />

            {/* Name tag */}
            <motion.div
              className="mt-5 px-5 py-2 rounded-2xl flex items-center gap-2"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(8px)',
              }}
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm font-bold" style={{ color: '#fff', fontFamily: "'Nunito', sans-serif" }}>
                Bubu — Language Buddy
              </span>
            </motion.div>

            {/* Emotion label */}
            <AnimatePresence mode="wait">
              <motion.div
                key={emotion}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="mt-3 px-3 py-1 rounded-full text-xs font-semibold capitalize"
                style={{
                  background: 'rgba(108,159,232,0.12)',
                  color: '#6C9FE8',
                  border: '1px solid rgba(108,159,232,0.2)',
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: '0.04em',
                }}
              >
                {emotion === 'idle' ? 'Ready' : emotion}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Live transcript bubble */}
          <AnimatePresence>
            {transcript && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-28 left-1/2 -translate-x-1/2 px-5 py-3 rounded-2xl max-w-xs text-center"
                style={{
                  background: 'rgba(59,111,212,0.2)',
                  border: '1px solid rgba(59,111,212,0.4)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <p className="text-sm" style={{ color: '#CBD5E1' }}>
                  <span style={{ color: '#6C9FE8' }}>You: </span>
                  {transcript}
                  <span className="animate-pulse">|</span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Speaking waveform */}
          <AnimatePresence>
            {isSpeaking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-28 left-1/2 -translate-x-1/2 flex items-center gap-1"
              >
                {Array.from({ length: 7 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="rounded-full"
                    style={{ width: 4, background: '#3B6FD4' }}
                    animate={{ height: [6, 6 + speakingIntensity * 24 * Math.sin(i * 0.8 + Date.now() * 0.01), 6] }}
                    transition={{ duration: 0.15, repeat: Infinity, delay: i * 0.05 }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Controls ── */}
          <div className="absolute bottom-8 flex items-center gap-4">
            {/* Mute */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleMuteToggle}
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: isMuted ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.08)',
                border: `1px solid ${isMuted ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.12)'}`,
              }}
              title={isMuted ? 'Unmute Bubu' : 'Mute Bubu'}
            >
              {isMuted
                ? <VolumeX size={18} color="#EF4444" />
                : <Volume2 size={18} color="#94A3B8" />}
            </motion.button>

            {/* End call */}
            {isCallActive ? (
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={handleEndCall}
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: '#EF4444', boxShadow: '0 4px 20px rgba(239,68,68,0.4)' }}
                title="End call"
              >
                <PhoneOff size={22} color="white" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={handleRestart}
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: '#22C55E', boxShadow: '0 4px 20px rgba(34,197,94,0.4)' }}
                title="Start new call"
              >
                <RotateCcw size={22} color="white" />
              </motion.button>
            )}

            {/* Mic */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleMicToggle}
              disabled={!isCallActive || micStatus === 'unsupported'}
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: micStatus === 'listening'
                  ? 'rgba(59,111,212,0.3)'
                  : micStatus === 'denied'
                  ? 'rgba(239,68,68,0.15)'
                  : 'rgba(255,255,255,0.08)',
                border: `1px solid ${
                  micStatus === 'listening'
                    ? 'rgba(59,111,212,0.6)'
                    : micStatus === 'denied'
                    ? 'rgba(239,68,68,0.35)'
                    : 'rgba(255,255,255,0.12)'
                }`,
                boxShadow: micStatus === 'listening' ? '0 0 20px rgba(59,111,212,0.4)' : 'none',
                opacity: (isCallActive && micStatus !== 'unsupported') ? 1 : 0.4,
              }}
              title={
                micStatus === 'denied' ? 'Mic blocked — allow access in browser settings'
                : micStatus === 'unsupported' ? 'Voice not supported in this browser'
                : micStatus === 'listening' ? 'Stop listening'
                : 'Speak to Bubu'
              }
            >
              {micStatus === 'listening'
                ? <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
                    <Mic size={18} color="#3B6FD4" />
                  </motion.div>
                : <MicOff size={18} color={micStatus === 'denied' ? '#EF4444' : '#94A3B8'} />}
            </motion.button>
          </div>
        </div>

        {/* ── Right: Chat panel ── */}
        <div
          className="flex flex-col"
          style={{ flex: '0 0 45%', background: '#0D1B2E' }}
        >
          {/* Chat header */}
          <div
            className="px-5 py-4 flex items-center justify-between"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            <span className="text-sm font-bold" style={{ color: '#fff', fontFamily: "'Nunito', sans-serif" }}>
              Conversation
            </span>
            <span className="text-xs" style={{ color: '#475569' }}>
              {messages.length} messages
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3" style={{ minHeight: 0 }}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className="max-w-xs px-4 py-3 rounded-2xl text-sm leading-relaxed"
                  style={
                    msg.role === 'bubu'
                      ? {
                          background: 'rgba(59,111,212,0.15)',
                          border: '1px solid rgba(59,111,212,0.25)',
                          color: '#CBD5E1',
                          borderTopLeftRadius: 4,
                        }
                      : {
                          background: 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: '#E2E8F0',
                          borderTopRightRadius: 4,
                        }
                  }
                >
                  {msg.role === 'bubu' && (
                    <span className="block text-xs font-bold mb-1" style={{ color: '#6C9FE8' }}>
                      Bubu
                    </span>
                  )}
                  {msg.text}
                </div>
              </motion.div>
            ))}

            {/* Thinking indicator */}
            <AnimatePresence>
              {emotion === 'thinking' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-start"
                >
                  <div
                    className="px-4 py-3 rounded-2xl flex items-center gap-1.5"
                    style={{
                      background: 'rgba(59,111,212,0.1)',
                      border: '1px solid rgba(59,111,212,0.2)',
                      borderTopLeftRadius: 4,
                    }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full"
                        style={{ background: '#6C9FE8' }}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>

          {/* Input panel — always visible */}
          <div
            className="px-5 py-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            {/* Mic status banner */}
            <AnimatePresence>
              {micStatus === 'denied' && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-2 px-3 py-2.5 rounded-xl mb-3 text-xs"
                  style={{
                    background: 'rgba(239,68,68,0.12)',
                    border: '1px solid rgba(239,68,68,0.25)',
                    color: '#FCA5A5',
                  }}
                >
                  <MicOff size={13} style={{ marginTop: 1, flexShrink: 0 }} />
                  <span>
                    Microphone access was blocked. Please allow mic access in your browser settings, or use the text box below to chat with Bubu.
                  </span>
                </motion.div>
              )}
              {micStatus === 'unsupported' && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-3 text-xs"
                  style={{
                    background: 'rgba(251,191,36,0.1)',
                    border: '1px solid rgba(251,191,36,0.2)',
                    color: '#FDE68A',
                  }}
                >
                  <MicOff size={13} style={{ flexShrink: 0 }} />
                  Voice input is not supported in this browser. Use the text box to chat with Bubu.
                </motion.div>
              )}
              {micStatus === 'listening' && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-3 text-xs"
                  style={{
                    background: 'rgba(59,111,212,0.15)',
                    border: '1px solid rgba(59,111,212,0.3)',
                    color: '#93C5FD',
                  }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.7, repeat: Infinity }}
                  >
                    <Mic size={13} style={{ flexShrink: 0 }} />
                  </motion.div>
                  Listening... speak now. Tap mic again to stop.
                </motion.div>
              )}
            </AnimatePresence>

            {/* Always-visible text input */}
            <form onSubmit={handleTextSubmit} className="flex gap-2 mb-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message to Bubu..."
                className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#E2E8F0',
                  fontFamily: "'DM Sans', sans-serif",
                }}
                disabled={!isCallActive}
                autoComplete="off"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold"
                style={{
                  background: 'linear-gradient(135deg, #3B6FD4, #6C9FE8)',
                  color: '#fff',
                  fontFamily: "'Nunito', sans-serif",
                  opacity: isCallActive ? 1 : 0.4,
                }}
                disabled={!isCallActive}
              >
                Send
              </motion.button>
            </form>

            {/* Quick phrases */}
            <div className="flex flex-wrap gap-2">
              {['Say hello', 'Teach me Spanish', 'Count in French', 'Goodbye'].map((phrase) => (
                <motion.button
                  key={phrase}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => isCallActive && bubuRespond(phrase)}
                  disabled={!isCallActive}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium"
                  style={{
                    background: 'rgba(59,111,212,0.1)',
                    border: '1px solid rgba(59,111,212,0.2)',
                    color: '#6C9FE8',
                    fontFamily: "'DM Sans', sans-serif",
                    opacity: isCallActive ? 1 : 0.4,
                  }}
                >
                  {phrase}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Call ended overlay ── */}
      <AnimatePresence>
        {!isCallActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ background: 'rgba(10,22,40,0.85)', backdropFilter: 'blur(8px)' }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="text-center px-10 py-10 rounded-3xl"
              style={{
                background: '#0D1B2E',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              }}
            >
              <AnimatedMascot emotion="waving" isSpeaking={false} isListening={false} size={160} />
              <h2
                className="text-2xl font-bold mt-5 mb-2"
                style={{ color: '#fff', fontFamily: "'Nunito', sans-serif" }}
              >
                Great session!
              </h2>
              <p className="text-sm mb-6" style={{ color: '#64748B' }}>
                Duration: {formatDuration(callDuration)} — Keep practicing!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleRestart}
                className="px-8 py-3 rounded-2xl font-bold text-white text-sm"
                style={{
                  background: 'linear-gradient(135deg, #3B6FD4, #6C9FE8)',
                  boxShadow: '0 4px 20px rgba(59,111,212,0.4)',
                  fontFamily: "'Nunito', sans-serif",
                }}
              >
                Start New Call
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
