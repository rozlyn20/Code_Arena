import React from 'react';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Rahul Sharma',
      role: 'IIT Delhi, Incoming SDE Intern at Amazon',
      quote: 'I finally stopped solving LeetCode alone. Collaborating on CodeArena with classmates has completely shifted how we prepare for placements. Coding and talking through dry-runs together built real confidence.',
      gradient: 'from-amber-400 to-orange-500',
    },
    {
      name: 'Ananya Patel',
      role: 'IIT Bombay, Incoming SWE at Google',
      quote: 'The mock interviews made me much more confident before Google interviews. Having peer coding live with an AI mentor flagging edge cases is exactly what the traditional coding websites are missing.',
      gradient: 'from-teal-400 to-emerald-500',
    },
    {
      name: 'Kevin D\'Souza',
      role: 'NIT Trichy, Computer Science Student',
      quote: 'The AI hints helped without spoiling the solution. It asks the right questions to push your thinking instead of dumping code. Our placements study group uses CodeArena rooms every single night.',
      gradient: 'from-indigo-400 to-brand-blue',
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section className="relative py-24 overflow-hidden border-t border-white/5 bg-zinc-950/40">
      {/* Background Ornaments */}
      <div className="absolute bottom-12 right-12 w-[350px] h-[350px] rounded-full bg-brand-violet/5 blur-[120px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-20">
          <h2 className="text-xs uppercase tracking-widest font-extrabold text-indigo-400">Success Stories</h2>
          <p className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Hear from crack candidates
          </p>
          <p className="text-zinc-400 max-w-xl mx-auto">
            See how students are using CodeArena to prep together and ace their technical placement reviews.
          </p>
        </div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              className="group p-8 rounded-2xl border border-white/5 bg-zinc-900/40 text-left flex flex-col justify-between hover:border-indigo-500/25 transition-all duration-300 relative overflow-hidden backdrop-blur-sm"
            >
              {/* Subtle gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent group-hover:via-indigo-500/30 transition-all duration-300"></div>

              {/* Stars */}
              <div className="flex items-center space-x-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="text-amber-400 fill-current text-sm" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-zinc-300 text-sm leading-relaxed mb-8 italic">
                "{t.quote}"
              </p>

              {/* Avatar & Author Info */}
              <div className="flex items-center space-x-4 border-t border-white/5 pt-6 mt-auto">
                {/* Gradient Circle Avatar */}
                <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${t.gradient} flex items-center justify-center text-white font-bold text-xs uppercase shadow-inner shrink-0`}>
                  {t.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="space-y-0.5 text-left">
                  <h4 className="text-sm font-bold text-white tracking-tight">{t.name}</h4>
                  <p className="text-[11px] text-zinc-500 font-medium">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
