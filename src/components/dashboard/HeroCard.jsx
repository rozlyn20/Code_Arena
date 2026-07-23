import React from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiArrowRight } from 'react-icons/fi';

export default function HeroCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full p-8 md:p-10 rounded-2xl border border-indigo-500/10 bg-gradient-to-r from-zinc-950 via-zinc-900/40 to-zinc-950 text-left relative overflow-hidden shadow-2xl"
    >
      {/* Ambient gradient back-glows inside the card */}
      <div className="absolute top-1/2 right-12 -translate-y-1/2 w-64 h-32 rounded-full bg-gradient-to-tr from-brand-blue/10 to-brand-violet/10 blur-[80px] pointer-events-none z-0"></div>
      
      {/* Top light beam line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>

      <div className="relative z-10 max-w-xl space-y-5">
        <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/25 px-2.5 py-0.5 rounded-full">
          <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">
            AI-Enhanced Practice
          </span>
        </div>

        <h2 className="text-xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
          Ready to ace your next interview?
        </h2>
        
        <p className="text-xs md:text-sm text-zinc-400 font-normal leading-relaxed">
          Stop practicing alone. Invite friends or study peers to pair program, run compiler test cases, and receive Socratic insights from our AI Interview Mentor in real-time.
        </p>

        <div className="flex flex-wrap items-center gap-3.5 pt-2">
          {/* Create Room */}
          <button className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-brand-blue to-brand-violet p-[1px] shadow-lg shadow-brand-blue/5 active:scale-98 transition-transform">
            <div className="bg-zinc-950 hover:bg-transparent rounded-[11px] px-5 py-2.5 flex items-center justify-center space-x-2 transition-all duration-300">
              <span className="text-white font-medium text-xs">Create Room</span>
              <FiPlus className="text-white text-sm group-hover:rotate-90 transition-transform duration-300" />
            </div>
          </button>

          {/* Join Room */}
          <button className="flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs rounded-xl px-5 py-2.5 hover:border-white/20 transition-all duration-300 active:scale-98">
            <span>Join Room</span>
            <FiArrowRight className="text-xs" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
