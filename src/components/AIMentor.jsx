import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCpu, FiMessageSquare, FiTrendingUp, FiAlertTriangle, FiCheck } from 'react-icons/fi';

export default function AIMentor() {
  const [activeTab, setActiveTab] = useState('hint');

  const mentorFeatures = [
    {
      id: 'hint',
      label: 'Socratic Hints',
      icon: <FiMessageSquare className="text-xl" />,
      title: 'Hints instead of solutions',
      description: 'CodeArena AI behaves like a real interviewer. It asks probing questions and points out structural bugs instead of spoiling the code, forcing you to develop actual problem-solving skills.',
      chatResponse: {
        user: "I am stuck on optimization. My nested loops are timing out.",
        ai: "Have you considered storing elements you've already seen? Try looking at a hash map. How could storing the indices reduce the lookups to O(1) time?",
      }
    },
    {
      id: 'complexity',
      label: 'Space-Time Review',
      icon: <FiTrendingUp className="text-xl" />,
      title: 'Real-time Complexity Analysis',
      description: 'Analyze time and space complexity as you write. The AI Mentor runs static code traces and highlights areas where data structures can be optimized.',
      chatResponse: {
        user: "Is my current solution O(N) space?",
        ai: "Yes, since you use a Map storing at most N key-value pairs, the space complexity is O(N). The time complexity is also O(N) because you do a single pass.",
      }
    },
    {
      id: 'edgecases',
      label: 'Edge Case Detection',
      icon: <FiAlertTriangle className="text-xl" />,
      title: 'Spot Boundary Failures',
      description: 'The AI flags common boundary issues—like empty inputs, duplicate arrays, integer overflows, or index out-of-bounds—before they fail your test runs.',
      chatResponse: {
        user: "Can we test this on duplicate elements?",
        ai: "Good catch! If nums contains duplicates (e.g. [3, 3] target 6), your map will store the first index, then fetch it. Ensure your logic handles index duplication.",
      }
    }
  ];

  const currentFeature = mentorFeatures.find((f) => f.id === activeTab) || mentorFeatures[0];

  return (
    <section className="relative py-24 overflow-hidden border-t border-white/5 bg-zinc-950">
      {/* Glow Effects */}
      <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-purple-500/10 blur-[130px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-20">
          <h2 className="text-xs uppercase tracking-widest font-extrabold text-indigo-400">AI Assistance</h2>
          <p className="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-sans">
            Meet your AI Interview Mentor
          </p>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Get personalized hints, complexity checks, and code reviews in real-time, designed to mimic a FANG interviewer.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Feature Navigation Card */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <h3 className="text-2xl font-extrabold text-white tracking-tight">
              {currentFeature.title}
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed font-normal">
              {currentFeature.description}
            </p>

            {/* Interactive Selector Buttons */}
            <div className="flex flex-col space-y-3 pt-6">
              {mentorFeatures.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-4 p-4 rounded-xl border text-left transition-all duration-300 ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-brand-blue/10 to-brand-violet/10 border-indigo-500/30 text-white shadow-lg shadow-indigo-500/5'
                      : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className={`p-2.5 rounded-lg ${activeTab === item.id ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-zinc-400'}`}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold tracking-tight">{item.label}</h4>
                    <p className="text-[11px] text-zinc-500">Interactive live feedback</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: AI Chat Preview Mockup */}
          <div className="lg:col-span-7 w-full flex items-center justify-center">
            <div className="w-full max-w-xl bg-zinc-900/40 rounded-2xl border border-white/5 shadow-2xl shadow-black/60 overflow-hidden relative backdrop-blur-xl">
              {/* Header */}
              <div className="bg-zinc-950 px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                    <FiCpu className="text-indigo-400 text-lg animate-pulse" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-white tracking-tight">AI Interviewer</h4>
                    <p className="text-[10px] text-emerald-400 font-bold flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Connected & Monitoring</span>
                    </p>
                  </div>
                </div>
                <div className="bg-zinc-800 text-[10px] text-zinc-400 font-mono px-2 py-0.5 rounded font-bold uppercase">
                  Workspace
                </div>
              </div>

              {/* Chat Body */}
              <div className="p-6 space-y-6 text-sm font-sans min-h-[250px] flex flex-col justify-end text-left">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* User Prompt */}
                    <div className="flex items-start space-x-3 max-w-[85%]">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-[9px] font-bold text-white shrink-0">
                        R
                      </div>
                      <div className="bg-zinc-800/80 border border-white/5 rounded-2xl rounded-tl-none px-4 py-3 text-zinc-300">
                        <p className="text-[10px] text-zinc-500 font-bold mb-0.5">Rahul (Candidate)</p>
                        <p className="leading-relaxed">{currentFeature.chatResponse.user}</p>
                      </div>
                    </div>

                    {/* AI Response */}
                    <div className="flex items-start space-x-3 max-w-[90%] ml-auto justify-end">
                      <div className="bg-indigo-950/30 border border-indigo-500/25 rounded-2xl rounded-tr-none px-4 py-3 text-zinc-300 relative overflow-hidden">
                        {/* Glow indicator */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none"></div>
                        <p className="text-[10px] text-indigo-400 font-bold mb-0.5 flex items-center space-x-1.5">
                          <span>AI Mentor</span>
                          <span className="bg-indigo-500/10 text-indigo-300 text-[8px] px-1 rounded uppercase tracking-wider">Interviewer</span>
                        </p>
                        <p className="leading-relaxed text-zinc-200">
                          {currentFeature.chatResponse.ai}
                        </p>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shrink-0">
                        <FiCpu className="text-indigo-400 text-xs" />
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Input Area (Mocked) */}
              <div className="bg-zinc-950 px-6 py-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500 font-sans">
                <span className="text-zinc-500">Ask the mentor a question...</span>
                <span className="text-[10px] font-bold bg-white/5 border border-white/10 px-2 py-0.5 rounded text-zinc-400 font-mono">
                  Enter to Ask
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
