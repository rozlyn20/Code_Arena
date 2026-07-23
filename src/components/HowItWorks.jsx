import React from 'react';
import { motion } from 'framer-motion';
import { FiPlusSquare, FiUserPlus, FiCode } from 'react-icons/fi';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Create a Private Room',
      description: 'Initialize a collaborative coding room with a single click. Select your target programming language (JS, Python, C++, Java) and pick a problem or import a custom prompt.',
      icon: <FiPlusSquare className="text-xl text-brand-blue" />,
    },
    {
      number: '02',
      title: 'Invite Friends & Peers',
      description: 'Copy the secure workspace link and share it with classmates, study partners, or mentors. No registrations or signups required for peers to jump in and start coding.',
      icon: <FiUserPlus className="text-xl text-brand-violet" />,
    },
    {
      number: '03',
      title: 'Solve & Review Together',
      description: 'Work synchronously on the code. Write logic, trace dry runs, execute test cases, and get immediate hints from the AI mentor to ensure your solution is optimized.',
      icon: <FiCode className="text-xl text-emerald-400" />,
    },
  ];

  return (
    <section id="how-it-works" className="relative py-24 overflow-hidden border-t border-white/5">
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[150px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-20">
          <h2 className="text-xs uppercase tracking-widest font-extrabold text-indigo-400">Workflow</h2>
          <p className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            How CodeArena Works
          </p>
          <p className="text-zinc-400 max-w-xl mx-auto">
            From setup to solution in under 60 seconds. Learn the collaborative path to cracking mock interviews.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          {/* Connector Line for Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-brand-blue/30 via-indigo-500/30 to-brand-violet/30 -translate-y-12 z-0"></div>

          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group relative flex flex-col items-center text-center p-8 rounded-2xl bg-zinc-950/40 border border-white/5 hover:border-white/10 transition-all duration-300 z-10"
            >
              {/* Number Bubble */}
              <div className="absolute -top-4 bg-zinc-950 px-4 py-1 rounded-full border border-white/10 text-xs font-mono font-bold text-zinc-500 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-colors">
                STEP {step.number}
              </div>

              {/* Icon Holder */}
              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-105 group-hover:bg-zinc-900 transition-all duration-300 relative">
                {step.icon}
                <div className="absolute inset-0 rounded-full bg-indigo-500/10 blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-white mb-3 tracking-tight group-hover:text-indigo-200 transition-colors">
                {step.title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-normal">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
