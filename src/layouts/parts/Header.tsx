import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Languages, Video, LayoutDashboard, Shield } from 'lucide-react';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 w-full transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(248,250,255,0.95)' : 'rgba(248,250,255,0.8)',
        backdropFilter: 'blur(16px)',
        borderBottom: scrolled ? '1px solid #DDE6F5' : '1px solid transparent',
        boxShadow: scrolled ? '0 2px 20px rgba(74,144,217,0.08)' : 'none'
      }}>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-18" style={{ height: 72 }}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 400 }}>
              <img
                src="/airo-assets/images/pages/unknown/bubu-mascot"
                alt="Bubu mascot"
                className="object-contain"
                style={{ width: 44, height: 44, borderRadius: 12 }} />

            </motion.div>
            <div className="flex flex-col leading-none">
              <span
                className="text-xl font-bold tracking-tight"
                style={{ fontFamily: "'DM Sans', sans-serif", color: '#1A2340', letterSpacing: '-0.02em' }}>

                Bubu<span style={{ color: '#4A90D9' }}>Talk</span>
              </span>
              <span className="text-xs font-medium" style={{ color: '#6B7A99', fontFamily: "'Nunito', sans-serif" }}>
                Learn. Talk. Grow.
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Features */}
            <Link to="/features">
              <motion.span
                whileHover={{ y: -1 }}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  color: location.pathname === '/features' ? '#4A90D9' : '#4A5568',
                  background: location.pathname === '/features' ? '#EEF4FF' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#4A90D9';
                  (e.currentTarget as HTMLElement).style.background = '#EEF4FF';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = location.pathname === '/features' ? '#4A90D9' : '#4A5568';
                  (e.currentTarget as HTMLElement).style.background = location.pathname === '/features' ? '#EEF4FF' : 'transparent';
                }}>
                Features
              </motion.span>
            </Link>
            {/* Dashboard */}
            <Link to="/dashboard">
              <motion.span
                whileHover={{ y: -1 }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  color: location.pathname === '/dashboard' ? '#3B6FD4' : '#4A5568',
                  background: location.pathname === '/dashboard' ? '#EDF1FB' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#3B6FD4';
                  (e.currentTarget as HTMLElement).style.background = '#EEF4FF';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = location.pathname === '/dashboard' ? '#3B6FD4' : '#4A5568';
                  (e.currentTarget as HTMLElement).style.background = location.pathname === '/dashboard' ? '#EDF1FB' : 'transparent';
                }}>
                <LayoutDashboard size={14} />
                Dashboard
              </motion.span>
            </Link>
            {/* Parent Dashboard */}
            <Link to="/parent">
              <motion.span
                whileHover={{ y: -1 }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  color: location.pathname === '/parent' ? '#22C55E' : '#4A5568',
                  background: location.pathname === '/parent' ? '#F0FDF4' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#22C55E';
                  (e.currentTarget as HTMLElement).style.background = '#F0FDF4';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = location.pathname === '/parent' ? '#22C55E' : '#4A5568';
                  (e.currentTarget as HTMLElement).style.background = location.pathname === '/parent' ? '#F0FDF4' : 'transparent';
                }}>
                <Shield size={14} />
                Parents
              </motion.span>
            </Link>
            {/* Languages */}
            <Link to="/languages">
              <motion.span
                whileHover={{ y: -1 }}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  color: location.pathname === '/languages' ? '#4A90D9' : '#4A5568',
                  background: location.pathname === '/languages' ? '#EEF4FF' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#4A90D9';
                  (e.currentTarget as HTMLElement).style.background = '#EEF4FF';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = location.pathname === '/languages' ? '#4A90D9' : '#4A5568';
                  (e.currentTarget as HTMLElement).style.background = location.pathname === '/languages' ? '#EEF4FF' : 'transparent';
                }}>
                Languages
              </motion.span>
            </Link>
            {/* Translate */}
            <Link to="/translate">
              <motion.span
                whileHover={{ y: -1 }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  color: location.pathname === '/translate' ? '#3B6FD4' : '#4A5568',
                  background: location.pathname === '/translate' ? '#EDF1FB' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#3B6FD4';
                  (e.currentTarget as HTMLElement).style.background = '#EEF4FF';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = location.pathname === '/translate' ? '#3B6FD4' : '#4A5568';
                  (e.currentTarget as HTMLElement).style.background = location.pathname === '/translate' ? '#EDF1FB' : 'transparent';
                }}>
                <Languages size={14} />
                Translate
              </motion.span>
            </Link>
            {/* Talk with Bubu */}
            <Link to="/mascot">
              <motion.span
                whileHover={{ y: -1 }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  color: location.pathname === '/mascot' ? '#F06292' : '#4A5568',
                  background: location.pathname === '/mascot' ? '#FDF0F5' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#F06292';
                  (e.currentTarget as HTMLElement).style.background = '#FDF0F5';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = location.pathname === '/mascot' ? '#F06292' : '#4A5568';
                  (e.currentTarget as HTMLElement).style.background = location.pathname === '/mascot' ? '#FDF0F5' : 'transparent';
                }}>
                <Video size={14} />
                Talk with Bubu
              </motion.span>
            </Link>
            {/* Pricing */}
            <Link to="/pricing">
              <motion.span
                whileHover={{ y: -1 }}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  color: location.pathname === '/pricing' ? '#4A90D9' : '#4A5568',
                  background: location.pathname === '/pricing' ? '#EEF4FF' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#4A90D9';
                  (e.currentTarget as HTMLElement).style.background = '#EEF4FF';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = location.pathname === '/pricing' ? '#4A90D9' : '#4A5568';
                  (e.currentTarget as HTMLElement).style.background = location.pathname === '/pricing' ? '#EEF4FF' : 'transparent';
                }}>
                Pricing
              </motion.span>
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/auth">
              <motion.span
                whileHover={{ y: -1 }}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer"
                style={{ fontFamily: "'Nunito', sans-serif", color: '#4A5568' }}
                onMouseEnter={(e) => {(e.currentTarget as HTMLElement).style.color = '#4A90D9';}}
                onMouseLeave={(e) => {(e.currentTarget as HTMLElement).style.color = '#4A5568';}}>
                Sign In
              </motion.span>
            </Link>
            <Link to="/auth">
              <motion.span
                whileHover={{ y: -2, boxShadow: '0 8px 25px rgba(74,144,217,0.35)' }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white cursor-pointer inline-block"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  background: 'linear-gradient(135deg, #4A90D9, #7EC8E3)',
                  boxShadow: '0 4px 15px rgba(74,144,217,0.25)'
                }}>
                Get Started Free
              </motion.span>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2.5 rounded-xl transition-colors"
            style={{ background: '#EEF4FF' }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu">

            {mobileOpen ? <X size={20} color="#4A90D9" /> : <Menu size={20} color="#4A90D9" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen &&
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden border-t"
          style={{ borderColor: '#DDE6F5', background: '#F8FAFF' }}>

            <div className="px-6 py-5 flex flex-col gap-2">
              {/* Features */}
              <Link
                to="/features"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-xl font-semibold text-sm transition-colors"
                style={{ fontFamily: "'Nunito', sans-serif", color: '#1A2340', background: '#EEF4FF' }}>
                Features
              </Link>
              {/* Dashboard */}
              <Link
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm"
                style={{ fontFamily: "'Nunito', sans-serif", color: '#3B6FD4', background: '#EDF1FB' }}>
                <LayoutDashboard size={14} />
                Dashboard
              </Link>
              {/* Parent Dashboard */}
              <Link
                to="/parent"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm"
                style={{ fontFamily: "'Nunito', sans-serif", color: '#22C55E', background: '#F0FDF4' }}>
                <Shield size={14} />
                Parents
              </Link>
              {/* Languages */}
              <Link
                to="/languages"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-xl font-semibold text-sm transition-colors"
                style={{ fontFamily: "'Nunito', sans-serif", color: '#1A2340', background: '#EEF4FF' }}>
                Languages
              </Link>
              {/* Translate */}
              <Link
                to="/translate"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm"
                style={{ fontFamily: "'Nunito', sans-serif", color: '#3B6FD4', background: '#EDF1FB' }}>
                <Languages size={14} />
                Translate
              </Link>
              {/* Talk with Bubu */}
              <Link
                to="/mascot"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm"
                style={{ fontFamily: "'Nunito', sans-serif", color: '#F06292', background: '#FDF0F5' }}>
                <Video size={14} />
                Talk with Bubu
              </Link>
              {/* Pricing */}
              <Link
                to="/pricing"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-xl font-semibold text-sm transition-colors"
                style={{ fontFamily: "'Nunito', sans-serif", color: '#1A2340', background: '#EEF4FF' }}>
                Pricing
              </Link>
              <div className="flex gap-3 mt-2">
                <Link to="/auth" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <div
                    className="px-4 py-3 rounded-xl font-semibold text-sm text-center border"
                    style={{ fontFamily: "'Nunito', sans-serif", color: '#4A90D9', borderColor: '#DDE6F5' }}>
                    Sign In
                  </div>
                </Link>
                <Link to="/auth" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <div
                    className="px-4 py-3 rounded-xl font-bold text-sm text-center text-white"
                    style={{ background: 'linear-gradient(135deg, #4A90D9, #7EC8E3)', fontFamily: "'DM Sans', sans-serif" }}>
                    Get Started
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </header>);

}