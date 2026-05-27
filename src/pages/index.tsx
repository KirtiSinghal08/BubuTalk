import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import BubuChat from '@/components/BubuChat';
import { ArrowRight, Check, Star, BookOpen, Mic, Gamepad2, BarChart3, Shield, Globe } from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function RevealOnScroll({ children, delay = 0, className = '' }: {children: React.ReactNode;delay?: number;className?: string;}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}>

      {children}
    </motion.div>);

}

function AnimatedCounter({ target, suffix = '' }: {target: number;suffix?: string;}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 55;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {setCount(target);clearInterval(timer);} else
      setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─── Thin section divider ─────────────────────────────────────────────────────
function Divider() {
  return <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #E2E8F7 30%, #E2E8F7 70%, transparent)' }} />;
}

// ─── Pill label ───────────────────────────────────────────────────────────────
function Pill({ children, color = '#3B6FD4' }: {children: React.ReactNode;color?: string;}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase"
      style={{ background: `${color}12`, color, border: `1px solid ${color}22`, letterSpacing: '0.06em', fontFamily: "'DM Sans', sans-serif" }}>

      {children}
    </span>);

}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HomePage() {

  const features = [
  {
    icon: <BookOpen size={20} strokeWidth={1.8} />,
    title: 'AI Conversations',
    description: 'Real back-and-forth dialogue powered by AI that adapts to your child\'s level, pace, and mood in real time.',
    color: '#3B6FD4'
  },
  {
    icon: <Mic size={20} strokeWidth={1.8} />,
    title: 'Voice & Pronunciation',
    description: 'Instant, gentle feedback on pronunciation. Bubu listens and guides with encouragement, not criticism.',
    color: '#6C9FE8'
  },
  {
    icon: <Gamepad2 size={20} strokeWidth={1.8} />,
    title: 'Mini-Games',
    description: 'Word puzzles, memory matches, and speed challenges that make vocabulary stick without feeling like study.',
    color: '#F06292'
  },
  {
    icon: <BarChart3 size={20} strokeWidth={1.8} />,
    title: 'Progress Tracking',
    description: 'Detailed parent dashboards with weekly reports, streak data, and milestone achievements.',
    color: '#10B981'
  },
  {
    icon: <Globe size={20} strokeWidth={1.8} />,
    title: 'Roleplay Scenarios',
    description: 'Order food in Paris, shop in Tokyo — immersive real-life conversation practice through guided roleplay.',
    color: '#8B5CF6'
  },
  {
    icon: <Shield size={20} strokeWidth={1.8} />,
    title: 'Safe & Secure',
    description: 'COPPA compliant, zero ads, no data selling. A completely safe environment designed for children.',
    color: '#F59E0B'
  }];


  const languages = [
  { code: 'EN', name: 'English' }, { code: 'ES', name: 'Spanish' }, { code: 'FR', name: 'French' },
  { code: 'DE', name: 'German' }, { code: 'JA', name: 'Japanese' }, { code: 'KO', name: 'Korean' },
  { code: 'ZH', name: 'Chinese' }, { code: 'PT', name: 'Portuguese' }, { code: 'IT', name: 'Italian' },
  { code: 'RU', name: 'Russian' }, { code: 'HI', name: 'Hindi' }, { code: 'AR', name: 'Arabic' }];


  const testimonials = [
  {
    quote: 'My daughter asks to practice Spanish every night before bed. BubuTalk is the only app she genuinely wants to use.',
    name: 'Sarah M.',
    role: 'Mother of a 7-year-old',
    initials: 'SM'
  },
  {
    quote: 'I learned 50 French words this week and Bubu made it feel like a game the whole time. I want to keep going every day.',
    name: 'Liam K.',
    role: 'Age 9, Learning French',
    initials: 'LK'
  },
  {
    quote: 'The parent dashboard is exceptional. Full visibility into progress, time spent, and real improvement I can measure.',
    name: 'David R.',
    role: 'Father of an 11-year-old',
    initials: 'DR'
  }];


  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#FAFBFF', overflowX: 'hidden', color: '#111827' }}>
      <title>BubuTalk — Elegant Language Learning for Children</title>
      <meta name="description" content="BubuTalk is an AI-powered language learning platform for children. Conversational, safe, and beautifully designed to build real fluency." />

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>

        {/* Background geometry */}
        <div className="absolute inset-0 pointer-events-none" style={{ overflow: 'hidden' }}>
          {/* Large soft circle top-right */}
          <div style={{
            position: 'absolute', top: '-180px', right: '-180px',
            width: 600, height: 600, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,111,212,0.08) 0%, transparent 70%)'
          }} />
          {/* Soft circle bottom-left */}
          <div style={{
            position: 'absolute', bottom: '-120px', left: '-120px',
            width: 480, height: 480, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(240,98,146,0.07) 0%, transparent 70%)'
          }} />
          {/* Subtle grid */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(circle, #3B6FD415 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            opacity: 0.5
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left: Copy */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mb-7">

                <Pill color="#3B6FD4">learn. Talk. & grow with bubu.</Pill>
              </motion.div>

              <h1
                className="font-bold leading-tight mb-6"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
                  color: '#0D1B2E',
                  letterSpacing: '-0.025em',
                  lineHeight: 1.12
                }}>

                Where Children{' '}
                <span style={{ position: 'relative', display: 'inline-block' }}>
                  <span style={{ color: '#3B6FD4' }}>Discover</span>
                  <svg
                    viewBox="0 0 200 12"
                    style={{ position: 'absolute', bottom: -4, left: 0, width: '100%', height: 10 }}
                    preserveAspectRatio="none">

                    <path d="M2,8 Q50,2 100,8 Q150,14 198,6" stroke="#F06292" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
                {' '}the World Through Language
              </h1>

              <p className="text-lg leading-relaxed mb-10" style={{ color: '#4A5568', maxWidth: 480, fontWeight: 400 }}>
                Meet Bubu — your child's personal AI language companion. Conversational, adaptive, and genuinely engaging across 12+ languages.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <motion.a
                  href="#signup"
                  whileHover={{ y: -2, boxShadow: '0 12px 32px rgba(59,111,212,0.35)' }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl font-semibold text-white text-sm"
                  style={{
                    background: 'linear-gradient(135deg, #3B6FD4, #6C9FE8)',
                    boxShadow: '0 6px 20px rgba(59,111,212,0.28)',
                    fontFamily: "'Nunito', sans-serif"
                  }}>

                  Start Learning Free
                  <ArrowRight size={16} strokeWidth={2.5} />
                </motion.a>
                <motion.a
                  href="#parents"
                  whileHover={{ y: -2, background: '#EDF1FB' }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-semibold text-sm"
                  style={{
                    background: '#fff',
                    color: '#3B6FD4',
                    border: '1.5px solid #E2E8F7',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    fontFamily: "'Nunito', sans-serif"
                  }}>

                  For Parents
                </motion.a>
              </div>

              {/* Stats */}
              <div className="flex gap-8">
                {[
                { value: 500000, suffix: '+', label: 'Young Learners' },
                { value: 12, suffix: '+', label: 'Languages' },
                { value: 98, suffix: '%', label: 'Parent Approval' }].
                map((stat) =>
                <div key={stat.label}>
                    <div
                    className="text-2xl font-bold"
                    style={{ fontFamily: "'Nunito', sans-serif", color: '#0D1B2E', letterSpacing: '-0.02em' }}>

                      <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-xs font-medium mt-0.5" style={{ color: '#6B7A99' }}>{stat.label}</div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Right: Mascot + floating cards */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex items-center justify-center"
              style={{ minHeight: 520 }}>

              {/* Background card glow */}
              <div style={{
                position: 'absolute', inset: '10%',
                background: 'radial-gradient(ellipse, rgba(59,111,212,0.1) 0%, transparent 70%)',
                borderRadius: '50%'
              }} />

              {/* Main mascot card */}
              <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10"
                style={{
                  background: '#fff',
                  borderRadius: 32,
                  padding: '12px 12px 0 12px',
                  boxShadow: '0 24px 80px rgba(59,111,212,0.14), 0 4px 20px rgba(0,0,0,0.06)',
                  border: '1px solid #E2E8F7',
                  width: 280
                }}>

                <img
                  src="/airo-assets/images/pages/home/bubu-your-language-learning-companion"
                  alt="Bubu — your language learning companion"
                  style={{ width: '100%', borderRadius: '20px 20px 0 0', display: 'block', objectFit: 'cover', height: 320, objectPosition: 'top' }} />

                {/* Card footer */}
                <div className="px-4 py-4">
                  <div className="font-bold text-sm" style={{ fontFamily: "'Nunito', sans-serif", color: '#0D1B2E' }}>Bubu</div>
                  <div className="text-xs mt-0.5" style={{ color: '#6B7A99' }}>Your language companion</div>
                  <div className="flex items-center gap-1 mt-2">
                    {[...Array(5)].map((_, i) =>
                    <Star key={i} size={11} fill="#F59E0B" color="#F59E0B" />
                    )}
                    <span className="text-xs ml-1" style={{ color: '#6B7A99' }}>4.9 / 5</span>
                  </div>
                </div>
              </motion.div>

              {/* Floating stat card — top left */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 0.8, type: 'spring', stiffness: 260 }}
                style={{
                  position: 'absolute', top: '8%', left: '0%',
                  background: '#fff',
                  borderRadius: 16,
                  padding: '12px 16px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                  border: '1px solid #E2E8F7',
                  minWidth: 140
                }}>

                <div className="text-xs font-medium mb-1" style={{ color: '#6B7A99' }}>Today's Streak</div>
                <div className="text-xl font-bold" style={{ fontFamily: "'Nunito', sans-serif", color: '#0D1B2E' }}>21 Days</div>
                <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: '#EDF1FB' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #3B6FD4, #6C9FE8)' }}
                    initial={{ width: '0%' }}
                    animate={{ width: '84%' }}
                    transition={{ delay: 1.2, duration: 1, ease: 'easeOut' }} />

                </div>
              </motion.div>

              {/* Floating badge card — bottom right */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 1.1, type: 'spring', stiffness: 260 }}
                style={{
                  position: 'absolute', bottom: '12%', right: '0%',
                  background: 'linear-gradient(135deg, #3B6FD4, #6C9FE8)',
                  borderRadius: 16,
                  padding: '12px 16px',
                  boxShadow: '0 8px 30px rgba(59,111,212,0.3)',
                  minWidth: 150
                }}>

                <div className="text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Words Learned</div>
                <div className="text-xl font-bold text-white" style={{ fontFamily: "'Nunito', sans-serif" }}>
                  <AnimatedCounter target={247} />
                </div>
                <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>This week alone</div>
              </motion.div>

              {/* Language badge — top right */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, type: 'spring', stiffness: 260 }}
                style={{
                  position: 'absolute', top: '20%', right: '2%',
                  background: '#fff',
                  borderRadius: 12,
                  padding: '8px 14px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
                  border: '1px solid #E2E8F7'
                }}>

                <div className="text-xs font-semibold" style={{ color: '#3B6FD4', fontFamily: "'DM Sans', sans-serif" }}>12+ Languages</div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scrolling language strip */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ borderTop: '1px solid #E2E8F7', background: 'rgba(250,251,255,0.9)', backdropFilter: 'blur(12px)', padding: '12px 0' }}>

          <div className="overflow-hidden">
            <motion.div
              className="flex gap-8 whitespace-nowrap"
              animate={{ x: [0, -960] }}
              transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}>

              {[...languages, ...languages, ...languages].map((lang, i) =>
              <span
                key={i}
                className="text-xs font-semibold"
                style={{ color: '#6B7A99', letterSpacing: '0.08em', fontFamily: "'DM Sans', sans-serif" }}>

                  {lang.name}
                </span>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ── FEATURES ──────────────────────────────────────────────────────────── */}
      <section id="features" className="py-28" style={{ background: '#FAFBFF' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <RevealOnScroll className="text-center mb-16">
            <Pill color="#3B6FD4">Platform Features</Pill>
            <h2
              className="mt-5 font-bold"
              style={{ fontFamily: "'Nunito', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#0D1B2E', letterSpacing: '-0.025em' }}>

              Everything a child needs to thrive
            </h2>
            <p className="mt-4 text-base max-w-lg mx-auto" style={{ color: '#6B7A99', lineHeight: 1.7 }}>
              Every feature is crafted to keep children engaged, motivated, and genuinely learning — not just clicking through screens.
            </p>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) =>
            <RevealOnScroll key={f.title} delay={i * 0.08}>
                <motion.div
                whileHover={{ y: -5, boxShadow: '0 16px 48px rgba(59,111,212,0.1)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="p-7 rounded-2xl h-full"
                style={{
                  background: '#fff',
                  border: '1px solid #E2E8F7',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
                }}>

                  <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${f.color}12`, color: f.color }}>

                    {f.icon}
                  </div>
                  <h3
                  className="font-bold text-base mb-2.5"
                  style={{ fontFamily: "'Nunito', sans-serif", color: '#0D1B2E', letterSpacing: '-0.01em' }}>

                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7A99' }}>
                    {f.description}
                  </p>
                </motion.div>
              </RevealOnScroll>
            )}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────────── */}
      <section className="py-28" style={{ background: '#fff' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

            {/* Left: Steps */}
            <RevealOnScroll>
              <Pill color="#3B6FD4">How It Works</Pill>
              <h2
                className="mt-5 font-bold mb-12"
                style={{ fontFamily: "'Nunito', sans-serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: '#0D1B2E', letterSpacing: '-0.025em' }}>

                Three steps to a world of languages
              </h2>

              <div className="flex flex-col gap-0">
                {[
                {
                  num: '01',
                  title: 'Create a Profile',
                  desc: 'Set up your child\'s profile, choose a target language, and meet Bubu — their dedicated language companion.',
                  color: '#3B6FD4'
                },
                {
                  num: '02',
                  title: 'Talk, Play & Explore',
                  desc: 'Daily conversations, mini-games, and immersive roleplay scenarios that make every session feel like an adventure.',
                  color: '#6C9FE8'
                },
                {
                  num: '03',
                  title: 'Watch Them Grow',
                  desc: 'Track vocabulary growth, fluency milestones, and confidence — all visible in the parent dashboard.',
                  color: '#F06292'
                }].
                map((step, i) =>
                <RevealOnScroll key={step.num} delay={i * 0.12}>
                    <div className="flex gap-6 pb-10 relative">
                      {/* Vertical line */}
                      {i < 2 &&
                    <div
                      style={{
                        position: 'absolute', left: 19, top: 44, bottom: 0,
                        width: 1,
                        background: 'linear-gradient(to bottom, #E2E8F7, transparent)'
                      }} />

                    }
                      {/* Number circle */}
                      <div
                      className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm z-10"
                      style={{ background: `${step.color}12`, color: step.color, border: `1.5px solid ${step.color}30`, fontFamily: "'Nunito', sans-serif" }}>

                        {step.num}
                      </div>
                      <div className="pt-1.5">
                        <h3 className="font-bold text-base mb-1.5" style={{ fontFamily: "'Nunito', sans-serif", color: '#0D1B2E' }}>
                          {step.title}
                        </h3>
                        <p className="text-sm leading-relaxed" style={{ color: '#6B7A99' }}>{step.desc}</p>
                      </div>
                    </div>
                  </RevealOnScroll>
                )}
              </div>
            </RevealOnScroll>

            {/* Right: Mascot showcase */}
            <RevealOnScroll delay={0.2}>
              <div className="relative flex items-center justify-center" style={{ minHeight: 480 }}>
                {/* Background glow */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'radial-gradient(ellipse at center, rgba(59,111,212,0.07) 0%, transparent 70%)',
                  borderRadius: 40
                }} />

                {/* Main card */}
                <div
                  style={{
                    background: '#fff',
                    borderRadius: 28,
                    overflow: 'hidden',
                    boxShadow: '0 20px 60px rgba(59,111,212,0.12), 0 4px 16px rgba(0,0,0,0.05)',
                    border: '1px solid #E2E8F7',
                    width: 260,
                    position: 'relative',
                    zIndex: 2
                  }}>

                  <img
                    src="/airo-assets/images/pages/home/bubu-mascot"
                    alt="Bubu mascot"
                    style={{ width: '100%', height: 300, objectFit: 'cover', objectPosition: 'top', display: 'block' }} />

                  <div className="p-5">
                    <div className="text-xs font-semibold mb-2" style={{ color: '#6B7A99', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      Current Lesson
                    </div>
                    <div className="font-bold text-sm mb-3" style={{ fontFamily: "'Nunito', sans-serif", color: '#0D1B2E' }}>
                      Spanish — Greetings
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#EDF1FB' }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg, #3B6FD4, #6C9FE8)' }}
                        initial={{ width: '0%' }}
                        whileInView={{ width: '65%' }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 1.2, ease: 'easeOut' }} />

                    </div>
                    <div className="flex justify-between mt-1.5">
                      <span className="text-xs" style={{ color: '#6B7A99' }}>65% complete</span>
                      <span className="text-xs font-semibold" style={{ color: '#3B6FD4' }}>Level 3</span>
                    </div>
                  </div>
                </div>

                {/* Floating achievement */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute', top: '5%', right: '5%',
                    background: 'linear-gradient(135deg, #3B6FD4, #6C9FE8)',
                    borderRadius: 14,
                    padding: '10px 14px',
                    boxShadow: '0 8px 24px rgba(59,111,212,0.3)',
                    zIndex: 3
                  }}>

                  <div className="text-xs font-medium text-white/70">Achievement</div>
                  <div className="text-sm font-bold text-white mt-0.5" style={{ fontFamily: "'Nunito', sans-serif" }}>Star Learner</div>
                </motion.div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <Divider />

      {/* ── LANGUAGES ─────────────────────────────────────────────────────────── */}
      <section id="languages" className="py-28" style={{ background: '#0D1B2E' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <RevealOnScroll className="text-center mb-16">
            <Pill color="#6C9FE8">Languages</Pill>
            <h2
              className="mt-5 font-bold"
              style={{ fontFamily: "'Nunito', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', letterSpacing: '-0.025em' }}>

              12 languages. One companion.
            </h2>
            <p className="mt-4 text-base max-w-md mx-auto" style={{ color: '#64748B', lineHeight: 1.7 }}>
              From Spanish to Japanese, Bubu speaks your child's language — and teaches them a new one.
            </p>
          </RevealOnScroll>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {languages.map((lang, i) =>
            <RevealOnScroll key={lang.code} delay={i * 0.05}>
                <motion.div
                whileHover={{ y: -4, background: 'rgba(59,111,212,0.15)', borderColor: 'rgba(59,111,212,0.4)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="flex flex-col items-center gap-2 py-5 px-3 rounded-2xl cursor-pointer"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}>

                  <span
                  className="text-sm font-bold"
                  style={{ fontFamily: "'Nunito', sans-serif", color: '#6C9FE8', letterSpacing: '0.04em' }}>

                    {lang.code}
                  </span>
                  <span className="text-xs text-center" style={{ color: '#64748B', fontFamily: "'DM Sans', sans-serif" }}>
                    {lang.name}
                  </span>
                </motion.div>
              </RevealOnScroll>
            )}
          </div>
        </div>
      </section>

      {/* ── PARENTS SECTION ───────────────────────────────────────────────────── */}
      <section id="parents" className="py-28" style={{ background: '#FAFBFF' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

            {/* Left: Dashboard mockup */}
            <RevealOnScroll>
              <div
                className="rounded-3xl overflow-hidden"
                style={{
                  background: '#0D1B2E',
                  boxShadow: '0 24px 80px rgba(13,27,46,0.2)',
                  border: '1px solid rgba(255,255,255,0.06)'
                }}>

                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#EF4444' }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#F59E0B' }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#10B981' }} />
                  <span className="ml-3 text-xs font-medium" style={{ color: '#475569', fontFamily: "'DM Sans', sans-serif" }}>
                    Parent Dashboard — BubuTalk
                  </span>
                </div>

                <div className="p-5">
                  <img
                    src="/airo-assets/images/pages/home/parent-dashboard"
                    alt="Parent and child using BubuTalk"
                    className="w-full rounded-xl object-cover"
                    style={{ height: 220 }} />


                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {[
                    { label: 'Words Learned', value: '247', color: '#6C9FE8' },
                    { label: 'Day Streak', value: '21', color: '#F59E0B' },
                    { label: 'Time Today', value: '18m', color: '#10B981' }].
                    map((stat) =>
                    <div
                      key={stat.label}
                      className="p-3 rounded-xl text-center"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>

                        <div
                        className="text-lg font-bold"
                        style={{ fontFamily: "'Nunito', sans-serif", color: stat.color }}>

                          {stat.value}
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: '#475569', fontFamily: "'DM Sans', sans-serif" }}>
                          {stat.label}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Progress bars */}
                  <div className="mt-4 space-y-3">
                    {[
                    { label: 'Vocabulary', pct: 72, color: '#3B6FD4' },
                    { label: 'Pronunciation', pct: 58, color: '#F06292' },
                    { label: 'Comprehension', pct: 85, color: '#10B981' }].
                    map((bar) =>
                    <div key={bar.label}>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs" style={{ color: '#64748B', fontFamily: "'DM Sans', sans-serif" }}>{bar.label}</span>
                          <span className="text-xs font-semibold" style={{ color: bar.color }}>{bar.pct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <motion.div
                          className="h-full rounded-full"
                          style={{ background: bar.color }}
                          initial={{ width: '0%' }}
                          whileInView={{ width: `${bar.pct}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3, duration: 1.2, ease: 'easeOut' }} />

                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </RevealOnScroll>

            {/* Right: Copy */}
            <RevealOnScroll delay={0.2}>
              <Pill color="#3B6FD4">For Parents</Pill>
              <h2
                className="mt-5 font-bold mb-5"
                style={{ fontFamily: "'Nunito', sans-serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: '#0D1B2E', letterSpacing: '-0.025em' }}>

                Full visibility. Complete peace of mind.
              </h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: '#6B7A99' }}>
                Turn screen time into meaningful learning time. The parent dashboard gives you complete insight into your child's progress, habits, and achievements.
              </p>

              <div className="flex flex-col gap-4 mb-10">
                {[
                { title: 'Weekly Progress Reports', desc: 'Detailed summaries of vocabulary growth, fluency scores, and milestones reached.' },
                { title: 'Screen Time Management', desc: 'Set daily session limits and receive alerts when goals are met.' },
                { title: 'Zero Ads, Zero Data Selling', desc: 'COPPA compliant. Your child\'s data is never shared or monetised.' },
                { title: 'Multi-Child Support', desc: 'Manage multiple children\'s profiles from a single parent account.' }].
                map((item) =>
                <div key={item.title} className="flex gap-3">
                    <div
                    className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                    style={{ background: '#3B6FD412', border: '1px solid #3B6FD430' }}>

                      <Check size={11} color="#3B6FD4" strokeWidth={2.5} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold mb-0.5" style={{ fontFamily: "'Nunito', sans-serif", color: '#0D1B2E' }}>
                        {item.title}
                      </div>
                      <div className="text-sm" style={{ color: '#6B7A99' }}>{item.desc}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-2">
                {['COPPA Compliant', 'Kid Safe Certified', '#1 Kids App 2025', '4.9 / 5 Rating'].map((badge) =>
                <span
                  key={badge}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                  style={{
                    background: '#EDF1FB',
                    color: '#3B6FD4',
                    border: '1px solid #E2E8F7',
                    fontFamily: "'DM Sans', sans-serif"
                  }}>

                    {badge}
                  </span>
                )}
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <Divider />

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────────── */}
      <section className="py-28" style={{ background: '#fff' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <RevealOnScroll className="text-center mb-16">
            <Pill color="#F06292">Testimonials</Pill>
            <h2
              className="mt-5 font-bold"
              style={{ fontFamily: "'Nunito', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#0D1B2E', letterSpacing: '-0.025em' }}>

              Loved by families worldwide
            </h2>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) =>
            <RevealOnScroll key={t.name} delay={i * 0.1}>
                <motion.div
                whileHover={{ y: -5, boxShadow: '0 16px 48px rgba(59,111,212,0.09)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="p-7 rounded-2xl h-full flex flex-col"
                style={{
                  background: '#FAFBFF',
                  border: '1px solid #E2E8F7',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.03)'
                }}>

                  {/* Stars */}
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, j) =>
                  <Star key={j} size={13} fill="#F59E0B" color="#F59E0B" />
                  )}
                  </div>
                  <p className="text-sm leading-relaxed flex-1 mb-6" style={{ color: '#4A5568', fontStyle: 'italic' }}>
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #3B6FD4, #6C9FE8)', color: '#fff', fontFamily: "'Nunito', sans-serif" }}>

                      {t.initials}
                    </div>
                    <div>
                      <div className="text-sm font-semibold" style={{ fontFamily: "'Nunito', sans-serif", color: '#0D1B2E' }}>
                        {t.name}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: '#6B7A99' }}>{t.role}</div>
                    </div>
                  </div>
                </motion.div>
              </RevealOnScroll>
            )}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── PRICING ───────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-28" style={{ background: '#FAFBFF' }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <RevealOnScroll className="text-center mb-16">
            <Pill color="#3B6FD4">Pricing</Pill>
            <h2
              className="mt-5 font-bold"
              style={{ fontFamily: "'Nunito', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#0D1B2E', letterSpacing: '-0.025em' }}>

              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-base" style={{ color: '#6B7A99' }}>
              Start free. Upgrade when you're ready.
            </p>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free */}
            <RevealOnScroll>
              <div
                className="p-8 rounded-2xl h-full"
                style={{ background: '#fff', border: '1px solid #E2E8F7', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>

                <div className="text-sm font-semibold mb-1" style={{ color: '#6B7A99', fontFamily: "'DM Sans', sans-serif" }}>Free</div>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-4xl font-bold" style={{ fontFamily: "'Nunito', sans-serif", color: '#0D1B2E' }}>$0</span>
                  <span className="text-sm mb-1.5" style={{ color: '#6B7A99' }}>/month</span>
                </div>
                <div className="flex flex-col gap-3 mb-8">
                  {['1 language', '10 lessons per month', 'Basic vocabulary games', 'Parent progress summary'].map((item) =>
                  <div key={item} className="flex items-center gap-2.5">
                      <Check size={14} color="#10B981" strokeWidth={2.5} />
                      <span className="text-sm" style={{ color: '#4A5568' }}>{item}</span>
                    </div>
                  )}
                </div>
                <motion.a
                  href="#signup"
                  whileHover={{ y: -2, background: '#EDF1FB' }}
                  whileTap={{ scale: 0.97 }}
                  className="block w-full py-3 rounded-xl text-sm font-semibold text-center"
                  style={{
                    background: '#F4F6FB',
                    color: '#3B6FD4',
                    border: '1.5px solid #E2E8F7',
                    fontFamily: "'Nunito', sans-serif"
                  }}>

                  Get Started Free
                </motion.a>
              </div>
            </RevealOnScroll>

            {/* Premium */}
            <RevealOnScroll delay={0.1}>
              <div
                className="p-8 rounded-2xl h-full relative overflow-hidden"
                style={{
                  background: 'linear-gradient(145deg, #0D1B2E, #1A2F4E)',
                  border: '1px solid rgba(108,159,232,0.2)',
                  boxShadow: '0 16px 48px rgba(13,27,46,0.2)'
                }}>

                {/* Popular badge */}
                <div
                  className="absolute top-5 right-5 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(59,111,212,0.3)', color: '#6C9FE8', border: '1px solid rgba(108,159,232,0.3)', fontFamily: "'DM Sans', sans-serif" }}>

                  Most Popular
                </div>

                <div className="text-sm font-semibold mb-1" style={{ color: '#64748B', fontFamily: "'DM Sans', sans-serif" }}>Premium</div>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-4xl font-bold text-white" style={{ fontFamily: "'Nunito', sans-serif" }}>$9</span>
                  <span className="text-sm mb-1.5" style={{ color: '#64748B' }}>/month</span>
                </div>
                <div className="flex flex-col gap-3 mb-8">
                  {[
                  'All 12+ languages',
                  'Unlimited lessons',
                  'Full AI conversation mode',
                  'Voice & pronunciation coaching',
                  'All mini-games & roleplay',
                  'Detailed parent dashboard',
                  'Multi-child profiles'].
                  map((item) =>
                  <div key={item} className="flex items-center gap-2.5">
                      <Check size={14} color="#6C9FE8" strokeWidth={2.5} />
                      <span className="text-sm" style={{ color: '#94A3B8' }}>{item}</span>
                    </div>
                  )}
                </div>
                <motion.a
                  href="#signup"
                  whileHover={{ y: -2, boxShadow: '0 12px 32px rgba(59,111,212,0.4)' }}
                  whileTap={{ scale: 0.97 }}
                  className="block w-full py-3 rounded-xl text-sm font-semibold text-center text-white"
                  style={{
                    background: 'linear-gradient(135deg, #3B6FD4, #6C9FE8)',
                    boxShadow: '0 6px 20px rgba(59,111,212,0.3)',
                    fontFamily: "'Nunito', sans-serif"
                  }}>

                  Start Free Trial
                </motion.a>
                <p className="text-center text-xs mt-3" style={{ color: '#475569' }}>14-day free trial · No credit card required</p>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────────── */}
      <section className="py-28" style={{ background: '#0D1B2E' }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Mascot */}
            <RevealOnScroll className="flex justify-center">
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: 28,
                  padding: '12px 12px 0 12px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  width: 240,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                }}>

                <img
                  src="/airo-assets/images/pages/home/bubu-mascot-2"
                  alt="Bubu mascot"
                  style={{ width: '100%', borderRadius: '18px 18px 0 0', height: 280, objectFit: 'cover', objectPosition: 'top', display: 'block' }} />

              </motion.div>
            </RevealOnScroll>

            {/* Copy */}
            <RevealOnScroll delay={0.15}>
              <Pill color="#6C9FE8">Get Started</Pill>
              <h2
                className="mt-5 font-bold mb-5"
                style={{ fontFamily: "'Nunito', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', letterSpacing: '-0.025em' }}>

                Ready to meet Bubu?
              </h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: '#64748B' }}>
                Join 500,000+ children already discovering the world through language. Start free today — no credit card required.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.a
                  href="#signup"
                  whileHover={{ y: -2, boxShadow: '0 12px 32px rgba(59,111,212,0.4)' }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl font-semibold text-white text-sm"
                  style={{
                    background: 'linear-gradient(135deg, #3B6FD4, #6C9FE8)',
                    boxShadow: '0 6px 20px rgba(59,111,212,0.28)',
                    fontFamily: "'Nunito', sans-serif"
                  }}>

                  Start Learning Free
                  <ArrowRight size={16} strokeWidth={2.5} />
                </motion.a>
                <motion.a
                  href="#parents"
                  whileHover={{ y: -2, background: 'rgba(255,255,255,0.08)' }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-semibold text-sm"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    color: '#94A3B8',
                    border: '1.5px solid rgba(255,255,255,0.1)',
                    fontFamily: "'Nunito', sans-serif"
                  }}>

                  Learn More
                </motion.a>
              </div>
              <p className="mt-5 text-xs" style={{ color: '#475569' }}>
                Free forever plan available · Cancel anytime · COPPA compliant
              </p>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ── CHATBOT ───────────────────────────────────────────────────────────── */}
      <BubuChat />
    </div>);

}