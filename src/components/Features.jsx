import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiTerminal, FiZap, FiCpu, FiUsers, FiCheckSquare, FiLayers,
  FiUserPlus, FiClock, FiMessageCircle, FiMonitor, FiShare2, FiAward 
} from 'react-icons/fi';

export default function Features() {
  const coreFeatures = [
    {
      title: 'Pair Programming',
      description: 'Write, debug, and execute code together in real-time. Share cursor locations, active files, and terminal execution simultaneously.',
      icon: <FiTerminal className="text-2xl text-blue-400" />,
      color: 'from-blue-500/10 to-indigo-500/10 hover:border-blue-500/30',
      glow: 'group-hover:bg-blue-500/5',
    },
    {
      title: 'Real-time Collaboration',
      description: 'Zero-latency live editor sync. Backed by custom Operational Transformation (OT) engines to prevent collision and merge conflicts.',
      icon: <FiZap className="text-2xl text-amber-400" />,
      color: 'from-amber-500/10 to-orange-500/10 hover:border-amber-500/30',
      glow: 'group-hover:bg-amber-500/5',
    },
    // {
    //   title: 'AI Mentor',
    //   description: 'An expert LLM coder directly inside the room. Asks guiding questions, points out edge cases, and provides complexity reviews without spoiling answers.',
    //   icon: <FiCpu className="text-2xl text-purple-400" />,
    //   color: 'from-purple-500/10 to-pink-500/10 hover:border-purple-500/30',
    //   glow: 'group-hover:bg-purple-500/5',
    // },
    // {
    //   title: 'Mock Interviews',
    //   description: 'Role-play as interviewer and candidate. Use standard pre-built placement templates, rubrics, and direct live assessment forms.',
    //   icon: <FiUsers className="text-2xl text-emerald-400" />,
    //   color: 'from-emerald-500/10 to-teal-500/10 hover:border-emerald-500/30',
    //   glow: 'group-hover:bg-emerald-500/5',
    // },
    // {
    //   title: 'AI Code Review',
    //   description: 'Get deep reports on your code logic right inside the console. Analyze space-time complexity, syntax errors, and dry-run coverage.',
    //   icon: <FiCheckSquare className="text-2xl text-cyan-400" />,
    //   color: 'from-cyan-500/10 to-blue-500/10 hover:border-cyan-500/30',
    //   glow: 'group-hover:bg-cyan-500/5',
    // },
    {
      title: 'Interview Rooms',
      description: 'Instant sandbox environments configured in seconds. Setup language runtimes, coding prompts.',
      icon: <FiLayers className="text-2xl text-rose-400" />,
      color: 'from-rose-500/10 to-violet-500/10 hover:border-rose-500/30',
      glow: 'group-hover:bg-rose-500/5',
    },
  ];

  const placementFeatures = [
    {
      title: 'Practice with Friends',
      description: 'Ditch the solo grind. Form rooms with study groups and tackle tough algorithms collectively.',
      icon: <FiUserPlus className="text-xl text-indigo-400" />,
    },
    {
      title: 'Collaborative Problem Solving',
      description: 'Brainstorm edge cases on a synchronized digital canvas and whiteboard before writing any code.',
      icon: <FiShare2 className="text-xl text-indigo-400" />,
    },
    {
      title: 'Interview Confidence',
      description: 'Build muscle memory by talking through your solutions out loud with peers until it feels like second nature.',
      icon: <FiAward className="text-xl text-indigo-400" />,
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
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
    <div id="features" className="relative py-24 overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full bg-brand-blue/5 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/3 left-0 w-[400px] h-[400px] rounded-full bg-brand-violet/5 blur-[120px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-32">
        {/* Core Features Section */}
        <div className="space-y-16">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-xs uppercase tracking-widest font-extrabold text-indigo-400">Core Features</h2>
            <p className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              A complete workspace for collaborative interview prep.
            </p>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Everything you need to practice, communicate, and review coding concepts inside a single browser tab.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {coreFeatures.map((feat) => (
              <motion.div
                key={feat.title}
                variants={cardVariants}
                whileHover={{ y: -6 }}
                className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/40 p-8 text-left transition-all duration-300 ${feat.color}`}
              >
                {/* Glow layer */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${feat.glow}`}></div>
                
                {/* Icon wrapper */}
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                  {feat.icon}
                </div>

                <h3 className="text-lg font-bold text-white mb-3 tracking-tight group-hover:text-indigo-200 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed font-normal">
                  {feat.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Built for Placement Season Section */}
        <div className="space-y-16">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-xs uppercase tracking-widest font-extrabold text-indigo-400">Tailored Prep</h2>
            <p className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Built for Placement Season
            </p>
            <p className="text-zinc-400 max-w-xl mx-auto">
              College placement seasons are highly competitive. CodeArena gives you a structure that matches actual coding assessments.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {placementFeatures.map((item) => (
              <motion.div
                key={item.title}
                variants={cardVariants}
                whileHover={{ y: -4 }}
                className="group p-6 rounded-2xl border border-white/5 bg-zinc-950/40 text-left hover:border-indigo-500/20 hover:bg-zinc-900/30 transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 group-hover:bg-indigo-500/20 transition-colors">
                    {item.icon}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white tracking-tight group-hover:text-indigo-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
