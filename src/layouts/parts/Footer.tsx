import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const languages = [
{ flag: 'EN', name: 'English' }, { flag: 'ES', name: 'Spanish' }, { flag: 'FR', name: 'French' },
{ flag: 'DE', name: 'German' }, { flag: 'JA', name: 'Japanese' }, { flag: 'KO', name: 'Korean' },
{ flag: 'ZH', name: 'Chinese' }, { flag: 'PT', name: 'Portuguese' }, { flag: 'IT', name: 'Italian' },
{ flag: 'RU', name: 'Russian' }, { flag: 'HI', name: 'Hindi' }, { flag: 'AR', name: 'Arabic' }];


const footerLinks = {
  Product: ['Features', 'Languages', 'Mini-Games', 'Roleplay'],
  Parents: ['Parent Dashboard', 'Safety', 'Progress Reports', 'Pricing'],
  Company: ['About Us', 'Blog', 'Careers', 'Press'],
  Support: ['Help Center', 'Contact Us', 'Privacy Policy', 'Terms']
};

export default function Footer() {
  return (
    <footer style={{ background: '#0D1B2E', color: '#94A3B8' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-8">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <img
                src="/airo-assets/images/pages/unknown/bubu-mascot-3"
                alt="Bubu mascot"
                className="object-contain"
                style={{ width: 40, height: 40, borderRadius: 10 }} />

              <span className="text-xl font-bold" style={{ fontFamily: "'DM Sans', sans-serif", color: '#fff', letterSpacing: '-0.02em' }}>
                Bubu<span style={{ color: '#7EC8E3' }}>Talk</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ fontFamily: "'Nunito', sans-serif", color: '#64748B', maxWidth: 260 }}>
              Talk, learn, and grow with Bubu. Making language learning magical for every child, one conversation at a time.
            </p>
            {/* Social */}
            <div className="flex gap-2">
              {['X', 'f', 'in', 'YT'].map((icon, i) =>
              <motion.a
                key={i}
                href="#"
                whileHover={{ y: -2, color: '#7EC8E3' }}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)', color: '#64748B', border: '1px solid rgba(255,255,255,0.08)' }}>

                  {icon}
                </motion.a>
              )}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) =>
          <div key={category}>
              <h4 className="font-bold text-xs mb-4 uppercase tracking-widest" style={{ fontFamily: "'DM Sans', sans-serif", color: '#7EC8E3' }}>
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) =>
              <li key={link}>
                    <a
                  href="#"
                  className="text-sm transition-colors duration-200 hover:text-white"
                  style={{ fontFamily: "'Nunito', sans-serif", color: '#64748B' }}>

                      {link}
                    </a>
                  </li>
              )}
              </ul>
            </div>
          )}
        </div>

        {/* Language badges */}
        <div className="py-6 border-t border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <p className="text-xs text-center mb-4 font-semibold uppercase tracking-widest" style={{ color: '#475569', fontFamily: "'DM Sans', sans-serif" }}>
            Available in 12+ Languages
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {languages.map((lang, i) =>
            <motion.span
              key={i}
              whileHover={{ y: -2, background: 'rgba(126,200,227,0.15)', color: '#7EC8E3' }}
              className="px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', color: '#64748B', border: '1px solid rgba(255,255,255,0.06)', fontFamily: "'DM Sans', sans-serif" }}
              title={lang.name}>

                {lang.flag}
              </motion.span>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ fontFamily: "'Nunito', sans-serif", color: '#475569' }}>
            © 2026 BubuTalk. All rights reserved. Made with care for curious kids everywhere.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-lg font-semibold" style={{ background: 'rgba(16,185,129,0.1)', color: '#34D399', fontFamily: "'DM Sans', sans-serif", border: '1px solid rgba(16,185,129,0.15)' }}>
              COPPA Compliant
            </span>
            <span className="text-xs px-3 py-1 rounded-lg font-semibold" style={{ background: 'rgba(126,200,227,0.1)', color: '#7EC8E3', fontFamily: "'DM Sans', sans-serif", border: '1px solid rgba(126,200,227,0.15)' }}>
              Kid Safe Certified
            </span>
          </div>
        </div>
      </div>
    </footer>);

}