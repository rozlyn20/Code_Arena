import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";
import { FiPlus, FiArrowRight, FiUsers, FiPlay, FiCpu, FiMessageSquare, FiTerminal } from 'react-icons/fi';

export default function Hero() {
  const containerRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    // Max 5 degrees tilt
    const rX = -(mouseY / (height / 2)) * 5;
    const rY = (mouseX / (width / 2)) * 5;
    
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  // Variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section id="home" className="relative min-h-screen pt-32 pb-20 flex items-center overflow-hidden">
      {/* Background Gradients & Noise */}
      <div className="absolute inset-0 bg-dark-bg bg-grid-pattern z-0"></div>
      <div className="absolute inset-0 bg-noise z-0 opacity-40"></div>
      
      {/* Blurred Accent Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-brand-blue/15 blur-[120px] pointer-events-none z-0 animate-pulse duration-[8s]"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[450px] h-[450px] rounded-full bg-brand-violet/15 blur-[150px] pointer-events-none z-0 animate-pulse duration-[12s]"></div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
        {/* Left Column: Headline and CTAs */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-5 flex flex-col justify-center space-y-8 text-left"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full w-fit">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-xs font-semibold text-indigo-300 tracking-wide uppercase">
              Placements 2026 Special
            </span>
          </motion.div>

          <motion.h1 
            variants={itemVariants} 
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] font-sans"
          >
            Where Coding Interviews Become <br />
            <span className="bg-gradient-to-r from-brand-blue via-indigo-400 to-brand-violet bg-clip-text text-transparent">
              Team Sports.
            </span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-lg text-zinc-400 font-normal leading-relaxed max-w-lg"
          >
            Stop practicing in isolation. Host live collaborative mock interviews with classmates, get instant AI mentor feedback, and debug together in real-time.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
          >
            <Link to="roomhub">
            <button className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-brand-blue to-brand-violet p-[1px] shadow-lg shadow-brand-blue/10 active:scale-98 transition-transform duration-150">
              <div className="bg-zinc-950 hover:bg-transparent rounded-[11px] px-6 py-3.5 flex items-center justify-center space-x-2 transition-all duration-300">
                <span className="text-white font-medium text-sm">Create Room</span>
                <FiPlus className="text-white text-base group-hover:rotate-90 transition-transform duration-300" />
              </div>
            </button>
            </Link>
            <Link to="roomhub">
            <button className="flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-sm rounded-xl px-6 py-3.5 hover:border-white/20 transition-all duration-300 active:scale-98">
              <span>Join Room</span>
              <FiArrowRight className="text-sm" />
            </button>
            </Link>
          </motion.div>

          <motion.p 
            variants={itemVariants}
            className="text-xs text-zinc-500 font-medium"
          >
            Free forever for students &nbsp;•&nbsp; No registration required to join
          </motion.p>
        </motion.div>

        {/* Right Column: Interactive Product Preview Workspace */}
        <div className="lg:col-span-7 flex items-center justify-center relative w-full pt-10 lg:pt-0">
          {/* Floating Element 1: Developers Online */}
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -top-4 -left-6 z-20 glass-panel rounded-xl px-4 py-2.5 flex items-center space-x-2.5 shadow-xl shadow-black/40 border-indigo-500/20"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-semibold text-white">3 Developers Online</span>
            <div className="flex -space-x-1.5 ml-1">
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 border border-zinc-950 flex items-center justify-center text-[8px] font-bold text-white">R</div>
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 border border-zinc-950 flex items-center justify-center text-[8px] font-bold text-white">S</div>
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-brand-blue to-purple-600 border border-zinc-950 flex items-center justify-center text-[8px] font-bold text-white">AI</div>
            </div>
          </motion.div>

          {/* Floating Element 2: AI Review Ready */}
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-12 -right-4 z-20 glass-panel rounded-xl px-4 py-3 flex items-center space-x-3 shadow-xl shadow-black/40 border-purple-500/20"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center">
              <FiCpu className="text-purple-400 text-sm animate-spin duration-3000" />
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Optimization Suggestion</p>
              <p className="text-xs font-bold text-white">AI Review Ready</p>
            </div>
          </motion.div>

          {/* Floating Element 3: Runtime Specs */}
          <motion.div 
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-6 -left-6 z-20 glass-panel rounded-xl px-3.5 py-2 flex items-center space-x-2 shadow-xl shadow-black/40"
          >
            <span className="text-[10px] font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">✓ Success</span>
            <span className="text-xs text-zinc-400 font-medium border-l border-white/10 pl-2">16 ms</span>
            <span className="text-xs text-zinc-500 font-medium">Room #A92K</span>
          </motion.div>

          {/* Main IDE Window Mockup */}
          <motion.div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
              transition: 'transform 0.1s ease-out',
            }}
            className="w-full max-w-2xl bg-zinc-950/80 rounded-2xl border border-white/10 shadow-2xl shadow-black/80 overflow-hidden relative"
          >
            {/* Header / Tab bar */}
            <div className="h-11 bg-zinc-900/60 border-b border-white/5 px-4 flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              </div>
              <div className="flex items-center space-x-2 bg-zinc-950/80 border border-white/5 px-3 py-1 rounded-lg text-xs text-zinc-400 font-mono">
                <FiTerminal className="text-zinc-500" />
                <span>two_sum.js</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] text-zinc-500 font-bold bg-zinc-800 px-2 py-0.5 rounded uppercase">JavaScript</span>
                <div className="h-5 w-[1px] bg-white/5"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
              </div>
            </div>

            {/* Code Editor Area */}
            <div className="p-5 font-mono text-[13px] md:text-sm text-zinc-300 leading-relaxed text-left min-h-[320px] relative overflow-hidden select-none">
              {/* Code Line 1 */}
              <div className="flex space-x-4">
                <span className="w-6 text-zinc-600 text-right text-xs pt-0.5">1</span>
                <span>
                  <span className="text-pink-400">function</span>{' '}
                  <span className="text-brand-blue">twoSum</span>(nums, target) &#123;
                </span>
              </div>

              {/* Code Line 2 */}
              <div className="flex space-x-4">
                <span className="w-6 text-zinc-600 text-right text-xs pt-0.5">2</span>
                <span className="pl-4 text-zinc-500">// Store indices in map for O(1) lookup</span>
              </div>

              {/* Code Line 3 */}
              <div className="flex space-x-4">
                <span className="w-6 text-zinc-600 text-right text-xs pt-0.5">3</span>
                <span>
                  <span className="pl-4 text-pink-400">const</span> map ={' '}
                  <span className="text-amber-300">new</span>{' '}
                  <span className="text-teal-400">Map</span>();
                </span>
              </div>

              {/* Code Line 4 */}
              <div className="flex space-x-4">
                <span className="w-6 text-zinc-600 text-right text-xs pt-0.5">4</span>
                <span>
                  <span className="pl-4 text-pink-400">for</span> (
                  <span className="text-pink-400">let</span> i ={' '}
                  <span className="text-purple-400">0</span>; i &lt; nums.length; i++) &#123;
                </span>
              </div>

              {/* Code Line 5 */}
              <div className="flex space-x-4">
                <span className="w-6 text-zinc-600 text-right text-xs pt-0.5">5</span>
                <span>
                  <span className="pl-8 text-pink-400">const</span> complement = target - nums[i];
                </span>
              </div>

              {/* Code Line 6 - Live Typing Cursor 1 */}
              <div className="flex space-x-4 relative">
                <span className="w-6 text-zinc-600 text-right text-xs pt-0.5">6</span>
                <span className="pl-8">
                  <span className="text-pink-400">if</span> (map.<span className="text-teal-400">has</span>(complement)) &#123;
                  {/* Sarah Custom Cursor */}
                  <span className="inline-block w-[2px] h-4 bg-brand-violet ml-0.5 animate-pulse relative">
                    <span className="absolute left-0 bottom-4 bg-brand-violet text-white text-[9px] font-bold px-1 py-0.5 rounded-md whitespace-nowrap opacity-90 scale-95 origin-bottom-left shadow-lg shadow-purple-500/20">
                      Sarah
                    </span>
                  </span>
                </span>
              </div>

              {/* Code Line 7 - Live Typing Cursor 2 */}
              <div className="flex space-x-4">
                <span className="w-6 text-zinc-600 text-right text-xs pt-0.5">7</span>
                <span className="pl-12">
                  <span className="text-pink-400">return</span> [map.<span className="text-teal-400">get</span>(complement), i];
                  {/* Rahul Custom Cursor */}
                  <span className="inline-block w-[2px] h-4 bg-brand-blue ml-0.5 animate-pulse relative">
                    <span className="absolute left-0 bottom-4 bg-brand-blue text-white text-[9px] font-bold px-1 py-0.5 rounded-md whitespace-nowrap opacity-90 scale-95 origin-bottom-left shadow-lg shadow-blue-500/20">
                      Rahul typing
                    </span>
                  </span>
                </span>
              </div>

              {/* Code Line 8 */}
              <div className="flex space-x-4">
                <span className="w-6 text-zinc-600 text-right text-xs pt-0.5">8</span>
                <span className="pl-8">&#125;</span>
              </div>

              {/* Code Line 9 */}
              <div className="flex space-x-4">
                <span className="w-6 text-zinc-600 text-right text-xs pt-0.5">9</span>
                <span className="pl-8">map.<span className="text-teal-400">set</span>(nums[i], i);</span>
              </div>

              {/* Code Line 10 */}
              <div className="flex space-x-4">
                <span className="w-6 text-zinc-600 text-right text-xs pt-0.5">10</span>
                <span className="pl-4">&#125;</span>
              </div>

              {/* Floating Collaborative Action popup: "Rahul joined the room" */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute top-4 right-4 bg-zinc-900/90 backdrop-blur border border-white/10 px-3 py-1.5 rounded-lg flex items-center space-x-2 shadow-lg"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span className="text-[11px] text-zinc-300 font-sans font-medium">Rahul joined the room</span>
              </motion.div>

              {/* Embedded AI Mentor Hint Box inside Editor */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 0.6 }}
                className="mt-6 mx-2 bg-indigo-950/30 border border-indigo-500/20 rounded-xl p-4 flex items-start space-x-3.5 shadow-inner"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0">
                  <FiCpu className="text-indigo-400 text-base" />
                </div>
                <div className="space-y-1 font-sans text-left">
                  <h4 className="text-xs font-bold text-indigo-300 flex items-center space-x-2">
                    <span>AI Interview Mentor</span>
                    <span className="text-[9px] bg-indigo-500/20 text-indigo-200 px-1 rounded uppercase tracking-wider font-bold">Feedback</span>
                  </h4>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Great choice using a <code className="text-[11px] text-indigo-200 bg-indigo-950/50 px-1 py-0.5 rounded border border-indigo-500/10">Map</code>! This solution has a runtime of <span className="font-semibold text-emerald-400">O(N)</span> and space complexity of <span className="font-semibold text-amber-400">O(N)</span>. Would you like me to analyze edge cases (like empty arrays or duplicates)?
                  </p>
                  <div className="flex space-x-3 pt-2">
                    <button className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors">Analyze Edge Cases</button>
                    <button className="text-[10px] font-bold text-zinc-500 hover:text-zinc-400 transition-colors">Dismiss</button>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Live activity indicator bar */}
            <div className="bg-zinc-950 px-5 py-2.5 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500 font-sans">
              <div className="flex items-center space-x-2">
                <FiUsers />
                <span className="font-medium text-zinc-400">3 users in room</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-brand-blue animate-pulse"></div>
                <span className="font-medium text-zinc-400">Live share active</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
