import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiPlus } from 'react-icons/fi';

export default function CTA() {
  return (
    <section className="relative py-24 overflow-hidden border-t border-white/5">
      {/* Absolute background decorations */}
      <div className="absolute inset-0 bg-dark-bg z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] rounded-full bg-gradient-to-tr from-brand-blue/10 to-brand-violet/10 blur-[130px] pointer-events-none z-0"></div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-12 md:p-16 rounded-3xl border border-white/10 bg-zinc-900/30 backdrop-blur-xl text-center space-y-8 relative overflow-hidden"
        >
          {/* Subtle glow border */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/25 to-transparent"></div>

          <div className="space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Ready to Ace Your Next <br />
              <span className="bg-gradient-to-r from-brand-blue to-brand-violet bg-clip-text text-transparent">
                Coding Interview?
              </span>
            </h2>
            <p className="text-sm md:text-base text-zinc-400 font-normal leading-relaxed">
              Ditch the boring solo grind. Create a live room in one click, invite your classmates, and start solving DSA questions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="group w-full sm:w-auto relative overflow-hidden rounded-xl bg-gradient-to-r from-brand-blue to-brand-violet p-[1px] active:scale-98 transition-transform duration-150 shadow-lg shadow-indigo-500/10">
              <div className="bg-zinc-950 hover:bg-transparent rounded-[11px] px-8 py-4 flex items-center justify-center space-x-2 transition-all duration-300">
                <span className="text-white font-semibold text-sm">Create Free Room</span>
                <FiPlus className="text-white text-base group-hover:rotate-90 transition-transform duration-300" />
              </div>
            </button>

            <button className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm rounded-xl px-8 py-4 hover:border-white/20 transition-all duration-300 active:scale-98">
              <span>Join Active Room</span>
              <FiArrowRight className="text-sm" />
            </button>
          </div>

          <p className="text-xs text-zinc-500 font-medium">
            No signups required to join rooms • Supported by placements study groups
          </p>
        </motion.div>
      </div>
    </section>
  );
}
