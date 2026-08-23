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
            Real-Time Collaborative Coding for<br />
            <span className="bg-gradient-to-r from-brand-blue via-indigo-400 to-brand-violet bg-clip-text text-transparent">
              Modern Developers
            </span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-lg text-zinc-400 font-normal leading-relaxed max-w-lg"
          >
            Stop practicing in isolation. Create live coding rooms, collaborate with teammates, and solve problems together in real time.
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
<div className="lg:col-span-7 flex items-center justify-center w-full pt-10 lg:pt-0">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="w-full max-w-3xl rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black/40 overflow-hidden"
  >
    {/* Workspace Header */}
    <div className="h-14 bg-zinc-900 border-b border-white/5 px-5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-rose-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
        </div>

        <span className="text-sm font-semibold text-white">
          CodeArena
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-zinc-500">
          Room #A92K
        </span>

        <div className="flex items-center gap-2 text-xs text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </div>
      </div>
    </div>

    {/* Room / Language Bar */}
    <div className="px-5 py-3 bg-zinc-950 border-b border-white/5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2">
          <div className="w-7 h-7 rounded-full bg-indigo-600 border-2 border-zinc-950 flex items-center justify-center text-[10px] font-bold text-white">
            R
          </div>

          <div className="w-7 h-7 rounded-full bg-emerald-600 border-2 border-zinc-950 flex items-center justify-center text-[10px] font-bold text-white">
            S
          </div>
        </div>

        <span className="text-xs text-zinc-400">
          2 developers collaborating
        </span>
      </div>

      <span className="text-xs font-medium text-zinc-400 bg-zinc-900 border border-white/5 px-3 py-1.5 rounded-lg">
        C++
      </span>
    </div>

    {/* Code Area */}
    <div className="p-6 min-h-[320px] font-mono text-sm leading-7 text-left">
      <div className="flex">
        <span className="w-8 text-zinc-700 select-none">1</span>
        <span>
          <span className="text-pink-400">#include</span>{" "}
          <span className="text-emerald-400">&lt;iostream&gt;</span>
        </span>
      </div>

      <div className="flex">
        <span className="w-8 text-zinc-700">2</span>
      </div>

      <div className="flex">
        <span className="w-8 text-zinc-700">3</span>
        <span>
          <span className="text-purple-400">int</span>{" "}
          <span className="text-blue-400">main</span>() {"{"}
        </span>
      </div>

      <div className="flex">
        <span className="w-8 text-zinc-700">4</span>
        <span className="pl-6">
          std::cout &lt;&lt;{" "}
          <span className="text-amber-300">
            "Hello, World!"
          </span>
          ;
        </span>
      </div>

      <div className="flex">
        <span className="w-8 text-zinc-700">5</span>
        <span>
          {"}"}
        </span>
      </div>

      {/* Cursor indicator */}
      <div className="mt-4 ml-14 flex items-center gap-2">
        <span className="w-[2px] h-5 bg-indigo-400 animate-pulse" />
        <span className="text-[10px] text-indigo-400">
          Sarah is editing
        </span>
      </div>
    </div>

    {/* Output */}
    <div className="border-t border-white/5 bg-zinc-900/60">
      <div className="px-5 py-3 flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-400">
          Output
        </span>

        <span className="text-[10px] text-emerald-400">
          ✓ Success · 16 ms
        </span>
      </div>

      <div className="px-5 pb-5">
        <div className="bg-zinc-950 rounded-lg border border-white/5 p-4 font-mono text-xs text-zinc-300 text-left">
          <span className="text-zinc-600">&gt;</span>{" "}
          Hello, World!
        </div>
      </div>
    </div>
  </motion.div>
</div>
      </div>
    </section>
  );
}
