import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Mic, MicOff, Volume2 } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  role: 'bubu' | 'user';
  text: string;
  timestamp: Date;
}

// ─── Bubu's scripted responses (no API key needed) ────────────────────────────
const BUBU_RESPONSES: Record<string, string[]> = {
  greet: [
  "Hi there! I'm Bubu, your language learning buddy! What language would you like to explore today?",
  "Hello, friend! Ready to learn something amazing today? I know Spanish, French, Japanese, and more!",
  "Hey! Great to see you! I'm Bubu and I love teaching languages. What shall we learn?"],

  spanish: [
  "Hola! Let's learn Spanish together! Try saying 'Hola, ¿cómo estás?' — it means 'Hello, how are you?'",
  "Spanish is so fun! Did you know 'gracias' means 'thank you'? Can you say it? Gra-ci-as!",
  "Vamos! Let's go! In Spanish, 'amigo' means friend — and you're my amigo!"],

  french: [
  "Bonjour! French is the language of art and adventure! 'Bonjour' means hello — can you say it?",
  "Ooh la la! Let's learn French! 'Merci' means thank you. Mer-ci. Beautiful, right?",
  "French is magnifique — that means magnificent! What French word would you like to learn first?"],

  japanese: [
  "Konnichiwa! That's hello in Japanese! Japan has a beautiful language. Want to learn more?",
  "In Japanese, 'arigatou' means thank you! A-ri-ga-tou. Try saying it slowly!",
  "Sugoi! That means amazing in Japanese — and YOU are amazing for learning! What else shall we explore?"],

  game: [
  "Oh, a game? Let's play! I'll say a word in English and you tell me what language it sounds like. Ready? 'Bonjour!'",
  "Game time! I'm thinking of a Spanish word that means 'sun'. It starts with 'S'... can you guess? It's 'Sol'!",
  "Let's do a quick quiz! How do you say 'hello' in Japanese? Type your answer — I'll wait!"],

  help: [
  "I'm here to help! You can ask me to teach you words in Spanish, French, Japanese, Korean, and more. Or we can play a language game!",
  "Need help? No worries! Just tell me which language you want to learn, and I'll guide you step by step.",
  "I can teach you vocabulary, pronunciation tips, fun phrases, and even play language games with you!"],

  praise: [
  "Wow, you're doing amazing! Keep it up — every word you learn is a superpower!",
  "That's fantastic! You're such a quick learner. Bubu is so proud of you!",
  "Brilliant! You're on your way to becoming a language superstar!"],

  default: [
  "That's interesting! I love chatting with you. Want to learn a fun word in a new language?",
  "Hmm, let me think... How about we learn something new? Pick a language: Spanish, French, or Japanese!",
  "You're so curious — I love that! Ask me anything about languages or let's play a game!",
  "Great question! Learning languages opens up the whole world. What would you like to explore?"]

};

function getBubuResponse(input: string): string {
  const lower = input.toLowerCase();
  let pool: string[];

  if (/\b(hi|hello|hey|hola|bonjour|konnichiwa|howdy|greet)\b/.test(lower)) {
    pool = BUBU_RESPONSES.greet;
  } else if (/\b(spanish|español|spain|hola|gracias)\b/.test(lower)) {
    pool = BUBU_RESPONSES.spanish;
  } else if (/\b(french|français|france|bonjour|merci)\b/.test(lower)) {
    pool = BUBU_RESPONSES.french;
  } else if (/\b(japanese|japan|nihongo|konnichiwa|arigatou|anime)\b/.test(lower)) {
    pool = BUBU_RESPONSES.japanese;
  } else if (/\b(game|play|quiz|challenge|fun)\b/.test(lower)) {
    pool = BUBU_RESPONSES.game;
  } else if (/\b(help|how|what|teach|learn|explain)\b/.test(lower)) {
    pool = BUBU_RESPONSES.help;
  } else if (/\b(great|good|amazing|awesome|thanks|thank|correct|right|yes|wow)\b/.test(lower)) {
    pool = BUBU_RESPONSES.praise;
  } else {
    pool = BUBU_RESPONSES.default;
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) =>
      <motion.div
        key={i}
        className="w-2 h-2 rounded-full"
        style={{ background: '#4A90D9' }}
        animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }} />

      )}
    </div>);

}

// ─── Message Bubble ───────────────────────────────────────────────────────────
function MessageBubble({ message }: {message: Message;}) {
  const isBubu = message.role === 'bubu';
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`flex items-end gap-2.5 ${isBubu ? 'justify-start' : 'justify-end'}`}>

      {isBubu &&
      <div
        className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden border-2"
        style={{ borderColor: '#DDE6F5' }}>

          <img
          src="/airo-assets/images/pages/unknown/bubu-2"
          alt="Bubu"
          className="w-full h-full object-cover object-top" />

        </div>
      }
      <div
        className="max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
        style={
        isBubu ?
        {
          background: '#EEF4FF',
          color: '#1A2340',
          borderBottomLeftRadius: 6,
          fontFamily: "'Nunito', sans-serif"
        } :
        {
          background: 'linear-gradient(135deg, #4A90D9, #7EC8E3)',
          color: '#fff',
          borderBottomRightRadius: 6,
          fontFamily: "'Nunito', sans-serif"
        }
        }>

        {message.text}
      </div>
    </motion.div>);

}

// ─── Quick Reply Chips ────────────────────────────────────────────────────────
const QUICK_REPLIES = [
'Teach me Spanish',
'Teach me French',
'Teach me Japanese',
'Play a game',
'What can you do?'];


// ─── Main Chatbot Component ───────────────────────────────────────────────────
export default function BubuChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
  {
    id: '0',
    role: 'bubu',
    text: "Hi! I'm Bubu, your language learning buddy! Ask me to teach you Spanish, French, Japanese, or let's play a language game!",
    timestamp: new Date()
  }]
  );
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
      setHasNewMessage(false);
    }
  }, [isOpen]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate Bubu thinking
    const delay = 900 + Math.random() * 600;
    setTimeout(() => {
      const responseText = getBubuResponse(text);
      const bubuMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bubu',
        text: responseText,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, bubuMsg]);
      setIsTyping(false);
      if (!isOpen) setHasNewMessage(true);

      // Speak the response
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(responseText);
        utterance.rate = 0.9;
        utterance.pitch = 1.2;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }
    }, delay);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  };

  return (
    <>
      {/* ── Floating Launcher Button ─────────────────────────────────────── */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.08, y: -3 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 pl-2 pr-5 py-2 rounded-full shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #4A90D9, #7EC8E3)',
          boxShadow: '0 8px 32px rgba(74,144,217,0.45)',
          display: isOpen ? 'none' : 'flex'
        }}
        aria-label="Open Bubu Chat">

        {/* Mascot avatar */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-11 h-11 rounded-full overflow-hidden border-2 border-white/40 flex-shrink-0"
          style={{ background: '#fff' }}>

          <img
            src="/airo-assets/images/pages/unknown/bubu"
            alt="Bubu"
            className="w-full h-full object-cover object-top" />

        </motion.div>
        <div className="text-left">
          <div className="text-white font-bold text-sm leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Chat with Bubu
          </div>
          <div className="text-white/80 text-xs" style={{ fontFamily: "'Nunito', sans-serif" }}>
            Your language buddy
          </div>
        </div>
        {/* New message dot */}
        {hasNewMessage &&
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-400 border-2 border-white" />

        }
      </motion.button>

      {/* ── Chat Window ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen &&
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          className="fixed bottom-6 right-6 z-50 flex flex-col overflow-hidden"
          style={{
            width: 380,
            height: 560,
            maxWidth: 'calc(100vw - 24px)',
            maxHeight: 'calc(100vh - 80px)',
            borderRadius: 24,
            background: '#fff',
            boxShadow: '0 24px 80px rgba(74,144,217,0.22), 0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #DDE6F5'
          }}>

            {/* ── Header ─────────────────────────────────────────────────── */}
            <div
            className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #1A2340, #2A3A60)',
              borderBottom: '1px solid rgba(255,255,255,0.08)'
            }}>

              {/* Mascot with speaking animation */}
              <div className="relative flex-shrink-0">
                <motion.div
                animate={isSpeaking ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                transition={{ duration: 0.5, repeat: isSpeaking ? Infinity : 0 }}
                className="w-12 h-12 rounded-full overflow-hidden border-2"
                style={{ borderColor: isSpeaking ? '#7EC8E3' : 'rgba(255,255,255,0.2)' }}>

                  <img
                  src="/airo-assets/images/pages/unknown/bubu-mascot-2"
                  alt="Bubu mascot"
                  className="w-full h-full object-cover object-top" />

                </motion.div>
                {/* Online dot */}
                <div
                className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
                style={{ background: '#34D399', borderColor: '#1A2340' }} />

              </div>

              <div className="flex-1 min-w-0">
                <div className="font-bold text-white text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Bubu
                </div>
                <div className="text-xs flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.55)', fontFamily: "'Nunito', sans-serif" }}>
                  {isSpeaking ?
                <>
                      <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-green-400"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity }} />

                      Speaking...
                    </> :

                <>
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      Your language buddy
                    </>
                }
                </div>
              </div>

              <div className="flex items-center gap-1">
                {isSpeaking &&
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={stopSpeaking}
                className="p-2 rounded-xl transition-colors"
                style={{ color: '#7EC8E3' }}
                title="Stop speaking">

                    <Volume2 size={16} />
                  </motion.button>
              }
                <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl transition-colors"
                style={{ color: 'rgba(255,255,255,0.5)' }}
                onMouseEnter={(e) => {(e.currentTarget as HTMLElement).style.color = '#fff';(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)';}}
                onMouseLeave={(e) => {(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)';(e.currentTarget as HTMLElement).style.background = 'transparent';}}
                aria-label="Close chat">

                  <X size={18} />
                </button>
              </div>
            </div>

            {/* ── Messages ───────────────────────────────────────────────── */}
            <div
            className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
            style={{ background: '#F8FAFF' }}>

              {messages.map((msg) =>
            <MessageBubble key={msg.id} message={msg} />
            )}

              {isTyping &&
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-end gap-2.5">

                  <div
                className="w-8 h-8 rounded-full overflow-hidden border-2 flex-shrink-0"
                style={{ borderColor: '#DDE6F5' }}>

                    <img
                  src="/assets/bubutalk-boy-mascot.png"
                  alt="Bubu"
                  className="w-full h-full object-cover object-top" />

                  </div>
                  <div className="rounded-2xl" style={{ background: '#EEF4FF', borderBottomLeftRadius: 6 }}>
                    <TypingDots />
                  </div>
                </motion.div>
            }
              <div ref={messagesEndRef} />
            </div>

            {/* ── Quick Replies ───────────────────────────────────────────── */}
            {messages.length <= 2 &&
          <div
            className="px-4 py-2 flex gap-2 overflow-x-auto flex-shrink-0"
            style={{ borderTop: '1px solid #EEF4FF', background: '#fff' }}>

                {QUICK_REPLIES.map((reply) =>
            <motion.button
              key={reply}
              whileHover={{ y: -1, background: '#4A90D9', color: '#fff' }}
              whileTap={{ scale: 0.96 }}
              onClick={() => sendMessage(reply)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap"
              style={{
                background: '#EEF4FF',
                color: '#4A90D9',
                border: '1px solid #DDE6F5',
                fontFamily: "'Nunito', sans-serif"
              }}>

                    {reply}
                  </motion.button>
            )}
              </div>
          }

            {/* ── Input Bar ──────────────────────────────────────────────── */}
            <div
            className="px-4 py-3 flex items-center gap-2 flex-shrink-0"
            style={{ borderTop: '1px solid #DDE6F5', background: '#fff' }}>

              <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Bubu anything..."
              className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{
                background: '#F8FAFF',
                border: '1.5px solid #DDE6F5',
                color: '#1A2340',
                fontFamily: "'Nunito', sans-serif"
              }}
              onFocus={(e) => {(e.currentTarget as HTMLElement).style.borderColor = '#4A90D9';(e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 3px rgba(74,144,217,0.1)';}}
              onBlur={(e) => {(e.currentTarget as HTMLElement).style.borderColor = '#DDE6F5';(e.currentTarget as HTMLElement).style.boxShadow = 'none';}} />

              <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.93 }}
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
              style={{
                background: input.trim() ? 'linear-gradient(135deg, #4A90D9, #7EC8E3)' : '#EEF4FF',
                color: input.trim() ? '#fff' : '#94A3B8',
                boxShadow: input.trim() ? '0 4px 12px rgba(74,144,217,0.3)' : 'none'
              }}
              aria-label="Send message">

                <Send size={16} />
              </motion.button>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </>);

}