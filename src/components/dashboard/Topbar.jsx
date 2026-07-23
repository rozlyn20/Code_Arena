import React from 'react';
import { FiBell, FiSearch, FiGlobe } from 'react-icons/fi';

export default function Topbar() {
  return (
    <header className="w-full flex items-center justify-between pb-6 border-b border-white/5 mb-8 pt-4 md:pt-0">
      {/* Left side: Greetings */}
      <div className="text-left space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
          Welcome back 👋
        </h1>
        <p className="text-xs md:text-sm text-zinc-400 font-normal">
          Ready for your next coding session?
        </p>
      </div>

      {/* Right side: Search, Notifications, Avatar */}
      <div className="flex items-center space-x-4">
        {/* Mock Search (SaaS style) */}
        <div className="hidden lg:flex items-center space-x-2 bg-white/5 border border-white/5 hover:border-white/10 rounded-xl px-3 py-2 text-zinc-400 hover:text-zinc-300 cursor-pointer w-60 transition-colors">
          <FiSearch className="text-sm shrink-0" />
          <span className="text-xs text-zinc-500 text-left flex-grow">Search dashboard...</span>
          <span className="text-[9px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-zinc-500 font-mono">⌘K</span>
        </div>

        {/* Server status indicator (UI only) */}
        <div className="hidden sm:flex items-center space-x-2 bg-white/5 border border-white/5 px-3 py-1.5 rounded-xl text-xs text-zinc-400 font-medium">
          <FiGlobe className="text-zinc-500" />
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Asia West</span>
        </div>

        {/* Notification Button */}
        <button className="relative p-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
          <FiBell className="text-base" />
          {/* Pulsing indicator */}
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
          </span>
        </button>

        {/* Profile Avatar */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs uppercase shadow-inner cursor-pointer hover:opacity-90 transition-opacity">
          R
        </div>
      </div>
    </header>
  );
}
