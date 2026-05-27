import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for trying out BubuTalk',
      features: [
        '1 language',
        '5 lessons per month',
        'Basic vocabulary (100 words)',
        'Text translation',
        'Community support',
      ],
      cta: 'Start Free',
      color: '#6B7A99',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: 'per month',
      description: 'Best for serious learners',
      features: [
        'All 12 languages',
        'Unlimited lessons',
        'Full vocabulary library (5000+ words)',
        'Voice translation & pronunciation',
        'AI conversation with Bubu',
        'Progress tracking & analytics',
        'Downloadable certificates',
        'Priority support',
      ],
      cta: 'Start Pro Trial',
      color: '#3B6FD4',
      popular: true,
    },
    {
      name: 'Family',
      price: '$19.99',
      period: 'per month',
      description: 'For the whole family',
      features: [
        'Everything in Pro',
        'Up to 5 learner profiles',
        'Parent dashboard',
        'Family progress reports',
        'Custom learning paths',
        'Dedicated family support',
      ],
      cta: 'Start Family Trial',
      color: '#22C55E',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#FAFBFF', fontFamily: "'DM Sans', sans-serif" }}>
      <title>Pricing - BubuTalk</title>

      {/* Header */}
      <header className="sticky top-0 z-40 px-6 py-4 flex items-center gap-4"
        style={{ background: 'rgba(248,250,255,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #DDE6F5' }}>
        <Link to="/" className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
          <ArrowLeft size={18} />
          <span className="text-sm">Home</span>
        </Link>
        <span className="opacity-30">|</span>
        <h1 className="text-lg font-bold" style={{ color: '#1A2340', fontFamily: "'Nunito', sans-serif" }}>
          Pricing
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
            Simple, Transparent
            <br />
            <span style={{ color: '#3B6FD4' }}>Pricing for Everyone</span>
          </h2>
          <p className="text-lg opacity-60 max-w-2xl mx-auto" style={{ color: '#4A5568' }}>
            Start free, upgrade anytime. No hidden fees, cancel whenever you want.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -6, boxShadow: plan.popular ? '0 20px 60px rgba(59,111,212,0.25)' : '0 12px 40px rgba(59,111,212,0.12)' }}
              className="rounded-3xl p-8 bg-white relative"
              style={{
                border: plan.popular ? `2px solid ${plan.color}` : '1px solid #E5E9F2',
                transition: 'all 0.3s ease',
              }}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold text-white flex items-center gap-1"
                  style={{ background: 'linear-gradient(135deg, #3B6FD4, #6C9FE8)' }}>
                  <Sparkles size={12} />
                  Most Popular
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2" style={{ color: '#1A2340', fontFamily: "'Nunito', sans-serif" }}>
                  {plan.name}
                </h3>
                <p className="text-sm opacity-60 mb-4" style={{ color: '#6B7A99' }}>
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold" style={{ color: plan.color, fontFamily: "'Nunito', sans-serif" }}>
                    {plan.price}
                  </span>
                  <span className="text-sm opacity-50">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <Check size={18} color={plan.color} className="flex-shrink-0 mt-0.5" />
                    <span style={{ color: '#4A5568' }}>{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ y: -2, boxShadow: `0 8px 25px ${plan.color}40` }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-xl font-bold text-white"
                style={{
                  background: plan.popular
                    ? `linear-gradient(135deg, ${plan.color}, #6C9FE8)`
                    : plan.color,
                  fontFamily: "'Nunito', sans-serif",
                }}>
                {plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* FAQ / Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="rounded-2xl p-8 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(59,111,212,0.08), rgba(108,159,232,0.05))', border: '1px solid rgba(59,111,212,0.15)' }}>
          <h3 className="text-xl font-bold mb-3" style={{ color: '#1A2340', fontFamily: "'Nunito', sans-serif" }}>
            30-Day Money-Back Guarantee
          </h3>
          <p className="text-sm opacity-70 max-w-2xl mx-auto" style={{ color: '#4A5568' }}>
            Not satisfied? Get a full refund within 30 days, no questions asked. We're confident your child will love learning with Bubu.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
