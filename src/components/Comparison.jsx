import React from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiX, FiLayers } from 'react-icons/fi';

export default function Comparison() {
  const comparisonItems = [
    { feature: 'Individual Practice', leetcode: true, codearena: true },
    { feature: 'Live Collaborations', leetcode: false, codearena: true },
    { feature: 'Live Pair Programming', leetcode: false, codearena: true },
    { feature: 'Mock Interview Modes', leetcode: false, codearena: true },
    { feature: 'AI Hint & Code Review', leetcode: false, codearena: true },
    { feature: 'Shared Whiteboards', leetcode: false, codearena: true },
    { feature: 'Zero Setup & Node Execution', leetcode: true, codearena: true },
  ];

  return (
    <section className="relative py-24 overflow-hidden border-t border-white/5 bg-zinc-950/40">
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-brand-blue/5 blur-[120px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <h2 className="text-xs uppercase tracking-widest font-extrabold text-indigo-400">The Shift</h2>
          <p className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Why CodeArena?
          </p>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Traditional platforms focus on solving problems alone. CodeArena changes the paradigm to recreate the real team dynamics of top engineering companies.
          </p>
        </div>

        {/* Comparison Table / Grid */}
        <div className="max-w-4xl mx-auto overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/20 backdrop-blur-xl">
          <div className="grid grid-cols-3 bg-zinc-900/60 p-6 border-b border-white/10 text-left font-bold text-sm tracking-wide text-zinc-400 uppercase">
            <div>Feature</div>
            <div className="text-center">LeetCode (Solo)</div>
            <div className="text-center bg-gradient-to-r from-brand-blue/10 to-brand-violet/10 text-white border border-indigo-500/20 rounded-lg py-1">CodeArena (Team)</div>
          </div>

          <div className="divide-y divide-white/5">
            {comparisonItems.map((item, index) => (
              <motion.div
                key={item.feature}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="grid grid-cols-3 p-6 items-center text-left text-zinc-300 hover:bg-white/[0.02] transition-colors"
              >
                <div className="text-sm font-semibold text-white">{item.feature}</div>
                
                {/* LeetCode value */}
                <div className="flex justify-center">
                  {item.leetcode ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <FiCheck className="text-emerald-400 text-sm" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                      <FiX className="text-rose-400 text-sm" />
                    </div>
                  )}
                </div>

                {/* CodeArena value */}
                <div className="flex justify-center">
                  {item.codearena ? (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-brand-blue/20 to-brand-violet/20 border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/10">
                      <FiCheck className="text-indigo-400 text-base font-extrabold" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                      <FiX className="text-rose-400 text-base" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
