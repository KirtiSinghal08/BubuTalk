import { motion } from 'motion/react';
import TranslationStudio from '@/components/TranslationStudio';
import { Languages } from 'lucide-react';

export default function TranslatePage() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#FAFBFF', minHeight: '100vh' }}>
      <title>Translation Studio — BubuTalk</title>
      <meta
        name="description"
        content="Real-time text and voice translation across 12+ languages. Powered by AI for children's language learning."
      />

      {/* Page header */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0D1B2E 0%, #1A2F4E 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Background dots */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(108,159,232,0.12) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />
        {/* Glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '-80px', right: '-80px',
            width: 400, height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,111,212,0.18) 0%, transparent 70%)',
          }}
        />

        <div className="relative max-w-5xl mx-auto px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Pill */}
            <div className="flex items-center gap-2 mb-5">
              <div
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: 'rgba(59,111,212,0.2)',
                  color: '#6C9FE8',
                  border: '1px solid rgba(108,159,232,0.25)',
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                <Languages size={12} />
                AI-Powered
              </div>
            </div>

            <h1
              className="font-bold mb-4"
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                color: '#fff',
                letterSpacing: '-0.025em',
                lineHeight: 1.15,
              }}
            >
              Translation Studio
            </h1>
            <p className="text-base max-w-xl" style={{ color: '#64748B', lineHeight: 1.7 }}>
              Translate text or your voice instantly across 12+ languages. Powered by OpenAI Whisper and GPT-4 — built for young learners.
            </p>

            {/* Feature badges */}
            <div className="flex flex-wrap gap-2 mt-6">
              {[
                'Real-time text translation',
                'Voice-to-translation',
                'Listen to pronunciation',
                '12+ languages',
              ].map((badge) => (
                <span
                  key={badge}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    color: '#94A3B8',
                    border: '1px solid rgba(255,255,255,0.08)',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <TranslationStudio />
        </motion.div>

        {/* Tips section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {[
            {
              title: 'Type to Translate',
              desc: 'Start typing in the text box and your translation appears automatically as you write.',
              color: '#3B6FD4',
              icon: '✏️',
            },
            {
              title: 'Speak to Translate',
              desc: 'Switch to Voice mode, tap the microphone, speak naturally, and hear your translation read aloud.',
              color: '#6C9FE8',
              icon: '🎙️',
            },
            {
              title: 'Listen & Learn',
              desc: 'Hit the Listen button on any translation to hear native-quality pronunciation from our AI voice.',
              color: '#F06292',
              icon: '🔊',
            },
          ].map((tip) => (
            <div
              key={tip.title}
              className="p-5 rounded-2xl"
              style={{
                background: '#fff',
                border: '1px solid #E2E8F7',
                boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-base mb-4"
                style={{ background: `${tip.color}12` }}
              >
                {tip.icon}
              </div>
              <h3
                className="font-bold text-sm mb-1.5"
                style={{ fontFamily: "'Nunito', sans-serif", color: '#0D1B2E' }}
              >
                {tip.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: '#6B7A99' }}>
                {tip.desc}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
