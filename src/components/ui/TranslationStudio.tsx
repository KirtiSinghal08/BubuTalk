import { useState, useRef, useCallback, useEffect } from 'react';import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  MicOff,
  Volume2,
  ArrowLeftRight,
  Copy,
  Check,
  Loader2,
  X,
  ChevronDown,
  Keyboard,
  Radio,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type Mode = 'text' | 'voice';

interface TranslationState {
  inputText: string;
  outputText: string;
  transcribedText: string;
  isTranslating: boolean;
  isSpeaking: boolean;
  isRecording: boolean;
  error: string | null;
  copied: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Japanese',
  'Korean', 'Chinese', 'Portuguese', 'Italian', 'Russian', 'Hindi', 'Arabic',
];

const LANG_FLAGS: Record<string, string> = {
  English: '🇬🇧', Spanish: '🇪🇸', French: '🇫🇷', German: '🇩🇪',
  Japanese: '🇯🇵', Korean: '🇰🇷', Chinese: '🇨🇳', Portuguese: '🇵🇹',
  Italian: '🇮🇹', Russian: '🇷🇺', Hindi: '🇮🇳', Arabic: '🇸🇦',
};

// ─── Language Selector ────────────────────────────────────────────────────────
function LangSelector({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div className="text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: '#6B7A99', fontFamily: "'DM Sans', sans-serif" }}>
        {label}
      </div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-semibold text-sm w-full"
        style={{
          background: '#fff',
          border: '1.5px solid #E2E8F7',
          color: '#0D1B2E',
          fontFamily: "'Nunito', sans-serif",
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          minWidth: 160,
        }}
      >
        <span style={{ fontSize: 18 }}>{LANG_FLAGS[value]}</span>
        <span className="flex-1 text-left">{value}</span>
        <ChevronDown size={14} style={{ color: '#6B7A99', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 left-0 z-50 rounded-2xl overflow-hidden"
            style={{
              background: '#fff',
              border: '1px solid #E2E8F7',
              boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
              minWidth: 180,
            }}
          >
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                onClick={() => { onChange(lang); setOpen(false); }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left transition-colors"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: lang === value ? '#3B6FD4' : '#374151',
                  background: lang === value ? '#EDF1FB' : 'transparent',
                  fontWeight: lang === value ? 600 : 400,
                }}
                onMouseEnter={(e) => { if (lang !== value) (e.currentTarget as HTMLButtonElement).style.background = '#F8FAFF'; }}
                onMouseLeave={(e) => { if (lang !== value) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
              >
                <span style={{ fontSize: 16 }}>{LANG_FLAGS[lang]}</span>
                {lang}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Waveform animation ───────────────────────────────────────────────────────
function Waveform({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-0.5" style={{ height: 24 }}>
      {[...Array(7)].map((_, i) => (
        <motion.div
          key={i}
          style={{ width: 3, borderRadius: 2, background: active ? '#3B6FD4' : '#CBD5E1' }}
          animate={active ? {
            height: [6, 18 + Math.random() * 10, 6],
          } : { height: 4 }}
          transition={active ? {
            duration: 0.5 + i * 0.07,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.06,
          } : { duration: 0.3 }}
        />
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TranslationStudio() {
  const [mode, setMode] = useState<Mode>('text');
  const [fromLang, setFromLang] = useState('English');
  const [toLang, setToLang] = useState('Spanish');
  const [apiStatus, setApiStatus] = useState<'checking' | 'ok' | 'error'>('checking');
  const [state, setState] = useState<TranslationState>({
    inputText: '',
    outputText: '',
    transcribedText: '',
    isTranslating: false,
    isSpeaking: false,
    isRecording: false,
    error: null,
    copied: false,
  });

  // Check API connectivity on mount
  useEffect(() => {
    fetch('/api/translate/test')
      .then((r) => r.json())
      .then((d: { hasApiKey?: boolean }) => {
        if (d.hasApiKey) {
          setApiStatus('ok');
        } else {
          setApiStatus('error');
          setState((s) => ({ ...s, error: 'OpenAI API key is not configured. Please add it in Settings.' }));
        }
      })
      .catch(() => {
        setApiStatus('error');
        setState((s) => ({ ...s, error: 'Could not reach the translation API. Please try refreshing.' }));
      });
  }, []);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Swap languages ──────────────────────────────────────────────────────────
  const swapLanguages = () => {
    setFromLang(toLang);
    setToLang(fromLang);
    setState((s) => ({
      ...s,
      inputText: s.outputText,
      outputText: '',
      transcribedText: '',
    }));
  };

  // ── Text translation ────────────────────────────────────────────────────────
  const translateText = useCallback(
    async (text: string, from: string, to: string) => {
      if (!text.trim()) {
        setState((s) => ({ ...s, outputText: '', error: null }));
        return;
      }
      setState((s) => ({ ...s, isTranslating: true, error: null }));
      try {
        const res = await fetch('/api/translate/text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, fromLang: from, toLang: to }),
        });
        const data = (await res.json()) as { translated?: string; error?: string };
        if (!res.ok) throw new Error(data.error ?? 'Translation failed');
        setState((s) => ({ ...s, outputText: data.translated ?? '', isTranslating: false }));
      } catch (err) {
        setState((s) => ({ ...s, isTranslating: false, error: String(err) }));
      }
    },
    []
  );

  // Debounced auto-translate on input change
  const handleInputChange = (text: string) => {
    setState((s) => ({ ...s, inputText: text }));
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      translateText(text, fromLang, toLang);
    }, 600);
  };

  // Re-translate when languages change
  useEffect(() => {
    if (state.inputText.trim()) {
      translateText(state.inputText, fromLang, toLang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromLang, toLang]);

  // ── Voice recording ─────────────────────────────────────────────────────────
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';
      const recorder = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        await submitVoice(blob, mimeType);
      };

      recorder.start(100);
      mediaRecorderRef.current = recorder;
      setState((s) => ({ ...s, isRecording: true, error: null, transcribedText: '', outputText: '' }));
    } catch (err) {
      setState((s) => ({ ...s, error: 'Microphone access denied. Please allow microphone access.' }));
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();
      setState((s) => ({ ...s, isRecording: false }));
    }
  };

  const submitVoice = async (blob: Blob, mimeType: string) => {
    setState((s) => ({ ...s, isTranslating: true, error: null }));
    try {
      const base64 = await blobToBase64(blob);
      const res = await fetch('/api/translate/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audio: base64, fromLang, toLang, mimeType }),
      });
      const data = (await res.json()) as { transcribed?: string; translated?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Voice translation failed');
      setState((s) => ({
        ...s,
        transcribedText: data.transcribed ?? '',
        outputText: data.translated ?? '',
        isTranslating: false,
      }));
    } catch (err) {
      setState((s) => ({ ...s, isTranslating: false, error: String(err) }));
    }
  };

  // ── Text-to-speech ──────────────────────────────────────────────────────────
  const speakText = async (text: string, language: string) => {
    if (!text.trim() || state.isSpeaking) return;
    setState((s) => ({ ...s, isSpeaking: true, error: null }));
    try {
      const res = await fetch('/api/translate/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language }),
      });
      const data = (await res.json()) as { audio?: string; mimeType?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? 'TTS failed');

      const audioSrc = `data:${data.mimeType ?? 'audio/mp3'};base64,${data.audio}`;
      const audio = new Audio(audioSrc);
      audio.onended = () => setState((s) => ({ ...s, isSpeaking: false }));
      audio.onerror = () => setState((s) => ({ ...s, isSpeaking: false, error: 'Audio playback failed' }));
      await audio.play();
    } catch (err) {
      setState((s) => ({ ...s, isSpeaking: false, error: String(err) }));
    }
  };

  // ── Copy to clipboard ───────────────────────────────────────────────────────
  const copyOutput = async () => {
    if (!state.outputText) return;
    await navigator.clipboard.writeText(state.outputText);
    setState((s) => ({ ...s, copied: true }));
    setTimeout(() => setState((s) => ({ ...s, copied: false })), 2000);
  };

  // ── Helpers ─────────────────────────────────────────────────────────────────
  function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1] ?? '');
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  const clearAll = () => {
    setState({
      inputText: '',
      outputText: '',
      transcribedText: '',
      isTranslating: false,
      isSpeaking: false,
      isRecording: false,
      error: null,
      copied: false,
    });
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* API status banner */}
      {apiStatus === 'checking' && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-6 text-sm"
          style={{ background: '#F8FAFF', border: '1px solid #E2E8F7', color: '#6B7A99' }}>
          <Loader2 size={14} className="animate-spin" />
          Connecting to translation service…
        </div>
      )}

      {/* Mode toggle */}
      <div className="flex justify-center mb-8">
        <div
          className="flex p-1 rounded-2xl gap-1"
          style={{ background: '#EDF1FB', border: '1px solid #E2E8F7' }}
        >
          {([
            { id: 'text' as Mode, label: 'Text', icon: <Keyboard size={15} /> },
            { id: 'voice' as Mode, label: 'Voice', icon: <Radio size={15} /> },
          ] as const).map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => { setMode(tab.id); clearAll(); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              style={{
                fontFamily: "'Nunito', sans-serif",
                background: mode === tab.id ? '#fff' : 'transparent',
                color: mode === tab.id ? '#3B6FD4' : '#6B7A99',
                boxShadow: mode === tab.id ? '0 2px 8px rgba(0,0,0,0.07)' : 'none',
              }}
              whileTap={{ scale: 0.97 }}
            >
              {tab.icon}
              {tab.label} Translation
            </motion.button>
          ))}
        </div>
      </div>

      {/* Language bar */}
      <div className="flex items-end gap-4 mb-6 flex-wrap">
        <LangSelector value={fromLang} onChange={setFromLang} label="From" />

        <motion.button
          onClick={swapLanguages}
          whileHover={{ rotate: 180, scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className="flex items-center justify-center w-10 h-10 rounded-xl mb-0.5"
          style={{
            background: 'linear-gradient(135deg, #3B6FD4, #6C9FE8)',
            boxShadow: '0 4px 14px rgba(59,111,212,0.3)',
            flexShrink: 0,
          }}
          title="Swap languages"
        >
          <ArrowLeftRight size={16} color="#fff" strokeWidth={2.5} />
        </motion.button>

        <LangSelector value={toLang} onChange={setToLang} label="To" />

        {(state.inputText || state.outputText || state.transcribedText) && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={clearAll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium ml-auto"
            style={{ background: '#FEF2F2', color: '#EF4444', border: '1px solid #FECACA' }}
          >
            <X size={12} />
            Clear
          </motion.button>
        )}
      </div>

      {/* Error banner */}
      <AnimatePresence>
        {state.error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl mb-5 text-sm"
            style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }}
          >
            <X size={14} />
            {state.error}
            <button onClick={() => setState((s) => ({ ...s, error: null }))} className="ml-auto">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TEXT MODE ── */}
      {mode === 'text' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Input panel */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: '1.5px solid #E2E8F7', background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
          >
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: '1px solid #F1F5F9', background: '#FAFBFF' }}
            >
              <span className="text-xs font-semibold" style={{ color: '#6B7A99', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {LANG_FLAGS[fromLang]} {fromLang}
              </span>
              <button
                onClick={() => speakText(state.inputText, fromLang)}
                disabled={!state.inputText.trim() || state.isSpeaking}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-40"
                style={{ background: '#EDF1FB', color: '#3B6FD4' }}
                title="Listen to input"
              >
                {state.isSpeaking ? <Loader2 size={12} className="animate-spin" /> : <Volume2 size={12} />}
                Listen
              </button>
            </div>
            <div className="relative">
              <textarea
                value={state.inputText}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={`Type in ${fromLang}…`}
                className="w-full resize-none outline-none text-sm leading-relaxed p-4"
                style={{
                  minHeight: 200,
                  fontFamily: "'DM Sans', sans-serif",
                  color: '#111827',
                  background: 'transparent',
                }}
              />
              {state.inputText && (
                <button
                  onClick={() => setState((s) => ({ ...s, inputText: '', outputText: '' }))}
                  className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: '#E2E8F7', color: '#6B7A99' }}
                >
                  <X size={10} />
                </button>
              )}
            </div>
            <div className="px-4 py-2 flex justify-end" style={{ borderTop: '1px solid #F1F5F9' }}>
              <span className="text-xs" style={{ color: '#CBD5E1' }}>
                {state.inputText.length} chars
              </span>
            </div>
          </div>

          {/* Output panel */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: '1.5px solid #E2E8F7', background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
          >
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: '1px solid #F1F5F9', background: '#FAFBFF' }}
            >
              <span className="text-xs font-semibold" style={{ color: '#6B7A99', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {LANG_FLAGS[toLang]} {toLang}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => speakText(state.outputText, toLang)}
                  disabled={!state.outputText.trim() || state.isSpeaking}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-40"
                  style={{ background: '#EDF1FB', color: '#3B6FD4' }}
                  title="Listen to translation"
                >
                  {state.isSpeaking ? <Loader2 size={12} className="animate-spin" /> : <Volume2 size={12} />}
                  Listen
                </button>
                <button
                  onClick={copyOutput}
                  disabled={!state.outputText}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-40"
                  style={{ background: state.copied ? '#ECFDF5' : '#EDF1FB', color: state.copied ? '#10B981' : '#3B6FD4' }}
                  title="Copy translation"
                >
                  {state.copied ? <Check size={12} /> : <Copy size={12} />}
                  {state.copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="p-4" style={{ minHeight: 200 }}>
              <AnimatePresence mode="wait">
                {state.isTranslating ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center gap-3 py-12"
                  >
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 rounded-full"
                          style={{ background: '#3B6FD4' }}
                          animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity }}
                        />
                      ))}
                    </div>
                    <span className="text-xs" style={{ color: '#6B7A99' }}>Translating…</span>
                  </motion.div>
                ) : state.outputText ? (
                  <motion.p
                    key="output"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm leading-relaxed"
                    style={{ color: '#111827', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {state.outputText}
                  </motion.p>
                ) : (
                  <motion.p
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm"
                    style={{ color: '#CBD5E1', fontStyle: 'italic' }}
                  >
                    Translation will appear here…
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}

      {/* ── VOICE MODE ── */}
      {mode === 'voice' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Record panel */}
          <div
            className="rounded-2xl overflow-hidden flex flex-col"
            style={{ border: '1.5px solid #E2E8F7', background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
          >
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: '1px solid #F1F5F9', background: '#FAFBFF' }}
            >
              <span className="text-xs font-semibold" style={{ color: '#6B7A99', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {LANG_FLAGS[fromLang]} Speak in {fromLang}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center gap-6 p-8 flex-1" style={{ minHeight: 240 }}>
              {/* Record button */}
              <motion.button
                onClick={state.isRecording ? stopRecording : startRecording}
                disabled={state.isTranslating}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex items-center justify-center rounded-full"
                style={{
                  width: 80,
                  height: 80,
                  background: state.isRecording
                    ? 'linear-gradient(135deg, #EF4444, #F87171)'
                    : 'linear-gradient(135deg, #3B6FD4, #6C9FE8)',
                  boxShadow: state.isRecording
                    ? '0 0 0 12px rgba(239,68,68,0.15), 0 8px 24px rgba(239,68,68,0.3)'
                    : '0 8px 24px rgba(59,111,212,0.35)',
                }}
              >
                {state.isRecording ? (
                  <MicOff size={28} color="#fff" strokeWidth={2} />
                ) : (
                  <Mic size={28} color="#fff" strokeWidth={2} />
                )}

                {/* Pulse ring when recording */}
                {state.isRecording && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ border: '2px solid rgba(239,68,68,0.5)' }}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </motion.button>

              {/* Waveform */}
              <Waveform active={state.isRecording} />

              <p className="text-sm text-center" style={{ color: '#6B7A99', maxWidth: 220 }}>
                {state.isRecording
                  ? 'Recording… tap to stop'
                  : state.isTranslating
                  ? 'Processing your voice…'
                  : 'Tap the mic and speak'}
              </p>

              {/* Transcription */}
              <AnimatePresence>
                {state.transcribedText && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full px-4 py-3 rounded-xl text-sm"
                    style={{ background: '#EDF1FB', color: '#374151', border: '1px solid #E2E8F7' }}
                  >
                    <span className="text-xs font-semibold block mb-1" style={{ color: '#3B6FD4' }}>
                      You said:
                    </span>
                    {state.transcribedText}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Translation output panel */}
          <div
            className="rounded-2xl overflow-hidden flex flex-col"
            style={{ border: '1.5px solid #E2E8F7', background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
          >
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: '1px solid #F1F5F9', background: '#FAFBFF' }}
            >
              <span className="text-xs font-semibold" style={{ color: '#6B7A99', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {LANG_FLAGS[toLang]} Translation in {toLang}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => speakText(state.outputText, toLang)}
                  disabled={!state.outputText.trim() || state.isSpeaking}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-40"
                  style={{ background: '#EDF1FB', color: '#3B6FD4' }}
                >
                  {state.isSpeaking ? <Loader2 size={12} className="animate-spin" /> : <Volume2 size={12} />}
                  Listen
                </button>
                <button
                  onClick={copyOutput}
                  disabled={!state.outputText}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-40"
                  style={{ background: state.copied ? '#ECFDF5' : '#EDF1FB', color: state.copied ? '#10B981' : '#3B6FD4' }}
                >
                  {state.copied ? <Check size={12} /> : <Copy size={12} />}
                  {state.copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-center" style={{ minHeight: 240 }}>
              <AnimatePresence mode="wait">
                {state.isTranslating ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-4"
                  >
                    <Loader2 size={28} className="animate-spin" style={{ color: '#3B6FD4' }} />
                    <span className="text-sm" style={{ color: '#6B7A99' }}>Translating your voice…</span>
                  </motion.div>
                ) : state.outputText ? (
                  <motion.div
                    key="output"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <p className="text-lg leading-relaxed font-medium" style={{ color: '#111827', fontFamily: "'Nunito', sans-serif" }}>
                      {state.outputText}
                    </p>
                    <motion.button
                      onClick={() => speakText(state.outputText, toLang)}
                      disabled={state.isSpeaking}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
                      style={{
                        background: 'linear-gradient(135deg, #3B6FD4, #6C9FE8)',
                        color: '#fff',
                        boxShadow: '0 4px 14px rgba(59,111,212,0.3)',
                        fontFamily: "'Nunito', sans-serif",
                      }}
                    >
                      {state.isSpeaking ? <Loader2 size={14} className="animate-spin" /> : <Volume2 size={14} />}
                      Play Translation
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-3 text-center"
                  >
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{ background: '#EDF1FB' }}
                    >
                      <Volume2 size={22} style={{ color: '#CBD5E1' }} />
                    </div>
                    <p className="text-sm" style={{ color: '#CBD5E1', fontStyle: 'italic' }}>
                      Your translation will appear here
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}

      {/* Quick example phrases */}
      <div className="mt-6">
        <p className="text-xs font-semibold mb-3 uppercase tracking-widest" style={{ color: '#6B7A99' }}>
          Try these phrases
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            'Hello, how are you?',
            'What is your name?',
            'I love learning languages!',
            'Can you help me?',
            'Good morning!',
          ].map((phrase) => (
            <motion.button
              key={phrase}
              whileHover={{ y: -2, background: '#EDF1FB' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (mode === 'text') {
                  handleInputChange(phrase);
                }
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-medium"
              style={{
                background: '#F8FAFF',
                color: '#374151',
                border: '1px solid #E2E8F7',
                fontFamily: "'DM Sans', sans-serif",
                cursor: mode === 'voice' ? 'default' : 'pointer',
                opacity: mode === 'voice' ? 0.5 : 1,
              }}
            >
              {phrase}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
