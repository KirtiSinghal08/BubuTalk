import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function LanguagesPage() {
  const languages = [
    { name: 'Spanish', flag: 'ES', learners: '12M+', color: '#E63946', level: 'Beginner to Advanced' },
    { name: 'French', flag: 'FR', learners: '8M+', color: '#457B9D', level: 'Beginner to Advanced' },
    { name: 'German', flag: 'DE', learners: '5M+', color: '#2D3A3A', level: 'Beginner to Intermediate' },
    { name: 'Japanese', flag: 'JP', learners: '10M+', color: '#BC4749', level: 'Beginner to Advanced' },
    { name: 'Korean', flag: 'KR', learners: '6M+', color: '#3D405B', level: 'Beginner to Intermediate' },
    { name: 'Chinese', flag: 'CN', learners: '15M+', color: '#E07A5F', level: 'Beginner to Advanced' },
    { name: 'Portuguese', flag: 'PT', learners: '4M+', color: '#006400', level: 'Beginner to Intermediate' },
    { name: 'Italian', flag: 'IT', learners: '7M+', color: '#118AB2', level: 'Beginner to Advanced' },
    { name: 'Russian', flag: 'RU', learners: '3M+', color: '#073B4C', level: 'Beginner to Intermediate' },
    { name: 'Hindi', flag: 'IN', learners: '9M+', color: '#FF6B35', level: 'Beginner to Intermediate' },
    { name: 'Arabic', flag: 'SA', learners: '5M+', color: '#6B4226', level: 'Beginner to Intermediate' },
    { name: 'English', flag: 'GB', learners: '20M+', color: '#264653', level: 'Beginner to Advanced' },
  ];

  const benefits = [
    'Native speaker pronunciation',
    'Cultural context and phrases',
    'Age-appropriate vocabulary',
    'Interactive conversation practice',
    'Progress tracking per language',
    'Switch languages anytime',
  ];

  return (
    <div className="min-h-screen" style={{ background: '#FAFBFF', fontFamily: "'DM Sans', sans-serif" }}>
      <title>Languages - BubuTalk</title>

      {/* Header */}
      <header className="sticky top-0 z-40 px-6 py-4 flex items-center gap-4"
        style={{ background: 'rgba(248,250,255,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #DDE6F5' }}>
        <Link to="/" className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
          <ArrowLeft size={18} />
          <span className="text-sm">Home</span>
        </Link>
        <span className="opacity-30">|</span>
        <h1 className="text-lg font-bold" style={{ color: '#1A2340', fontFamily: "'Nunito', sans-serif" }}>
          Languages
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
            Learn Any of
            <br />
            <span style={{ color: '#3B6FD4' }}>12 World Languages</span>
          </h2>
          <p className="text-lg opacity-60 max-w-2xl mx-auto" style={{ color: '#4A5568' }}>
            From Spanish to Japanese, BubuTalk offers comprehensive courses designed specifically for young learners.
          </p>
        </motion.div>

        {/* Languages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {languages.map((lang, i) => (
            <motion.div
              key={lang.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(59,111,212,0.12)' }}
              className="rounded-2xl p-5 bg-white cursor-pointer"
              style={{ border: '1px solid #E5E9F2', transition: 'all 0.3s ease' }}>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
                  style={{ background: lang.color + '20', color: lang.color }}>
                  {lang.flag}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-base" style={{ color: '#1A2340', fontFamily: "'Nunito', sans-serif" }}>
                    {lang.name}
                  </div>
                  <div className="text-xs opacity-50">{lang.learners} learners</div>
                </div>
              </div>
              <div className="text-xs font-medium px-3 py-1.5 rounded-full inline-block"
                style={{ background: '#EDF1FB', color: '#3B6FD4' }}>
                {lang.level}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-3xl p-8 md:p-12 bg-white"
          style={{ border: '1px solid #E5E9F2' }}>
          <h3 className="text-2xl font-bold mb-6 text-center"
            style={{ color: '#1A2340', fontFamily: "'Nunito', sans-serif" }}>
            What Makes Our Language Courses Special
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + i * 0.08 }}
                className="flex items-center gap-3">
                <CheckCircle size={20} color="#22C55E" />
                <span className="text-sm font-medium" style={{ color: '#4A5568' }}>{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-12">
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
              Choose Your Language
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
