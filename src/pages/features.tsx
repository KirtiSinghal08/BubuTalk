import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { MessageSquare, Mic, BookOpen, Trophy, Sparkles, Globe, ArrowLeft } from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    {
      icon: MessageSquare,
      title: 'AI Conversation Partner',
      description: 'Chat with Bubu, your friendly AI language tutor who adapts to your level and provides instant feedback.',
      color: '#3B6FD4',
      bg: '#EDF1FB',
    },
    {
      icon: Mic,
      title: 'Voice Translation',
      description: 'Speak naturally and get instant translations with pronunciation help in 12 languages.',
      color: '#F06292',
      bg: '#FDF0F5',
    },
    {
      icon: BookOpen,
      title: 'Structured Lessons',
      description: 'Follow a proven curriculum with vocabulary, grammar, and interactive quizzes designed for kids.',
      color: '#22C55E',
      bg: '#F0FDF4',
    },
    {
      icon: Trophy,
      title: 'Gamified Learning',
      description: 'Earn XP, level up, maintain streaks, and unlock achievements as you progress through lessons.',
      color: '#FBB924',
      bg: '#FEF9E7',
    },
    {
      icon: Sparkles,
      title: 'Personalized Progress',
      description: 'Track vocabulary mastery, lesson completion, and practice time across all your languages.',
      color: '#9333EA',
      bg: '#F3E8FF',
    },
    {
      icon: Globe,
      title: '12 Languages',
      description: 'Learn Spanish, French, German, Japanese, Korean, Chinese, Portuguese, Italian, Russian, Hindi, Arabic, or English.',
      color: '#06B6D4',
      bg: '#ECFEFF',
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#FAFBFF', fontFamily: "'DM Sans', sans-serif" }}>
      <title>Features - BubuTalk</title>

      {/* Header */}
      <header className="sticky top-0 z-40 px-6 py-4 flex items-center gap-4"
        style={{ background: 'rgba(248,250,255,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #DDE6F5' }}>
        <Link to="/" className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
          <ArrowLeft size={18} />
          <span className="text-sm">Home</span>
        </Link>
        <span className="opacity-30">|</span>
        <h1 className="text-lg font-bold" style={{ color: '#1A2340', fontFamily: "'Nunito', sans-serif" }}>
          Features
        </h1>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: '#1A2340', fontFamily: "'Nunito', sans-serif", lineHeight: 1.2 }}>
            Everything Your Child Needs to
            <br />
            <span style={{ color: '#3B6FD4' }}>Master a New Language</span>
          </h2>
          <p className="text-lg opacity-60 max-w-2xl mx-auto" style={{ color: '#4A5568' }}>
            BubuTalk combines AI-powered conversation, structured lessons, and gamification to make language learning fun and effective.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(59,111,212,0.12)' }}
                className="rounded-2xl p-6 bg-white"
                style={{ border: '1px solid #E5E9F2', transition: 'all 0.3s ease' }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: feature.bg }}>
                  <Icon size={26} color={feature.color} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#1A2340', fontFamily: "'Nunito', sans-serif" }}>
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#6B7A99' }}>
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-16">
          <Link to="/dashboard">
            <motion.button
              whileHover={{ y: -2, boxShadow: '0 12px 30px rgba(59,111,212,0.3)' }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-2xl text-base font-bold text-white"
              style={{
                background: 'linear-gradient(135deg, #3B6FD4, #6C9FE8)',
                fontFamily: "'Nunito', sans-serif",
                boxShadow: '0 6px 20px rgba(59,111,212,0.2)',
              }}>
              Start Learning Now
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
