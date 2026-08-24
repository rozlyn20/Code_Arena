import React from 'react';
import { FiGithub, FiTerminal, FiMail, FiShield } from 'react-icons/fi';

export default function Footer() {
  return (
   <footer className="relative border-t border-white/5 bg-zinc-950/80 py-16 overflow-hidden">
  <div className="max-w-7xl mx-auto px-6 relative z-10">
    <div className="flex flex-col items-center text-center space-y-4">

      {/* Logo */}
      <a
        href="#home"
        className="flex items-center space-x-2"
      >
        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-blue to-brand-violet flex items-center justify-center shadow-md">
          <FiTerminal className="text-white text-lg" />
        </div>

        <span className="text-lg font-bold tracking-tight text-white font-sans">
          Code<span className="text-brand-blue">Arena</span>
        </span>
      </a>

      {/* Description */}
      <p className="text-xs text-zinc-500 max-w-md font-normal leading-relaxed">
        CodeArena is a collaborative coding interview platform where students
        practice technical coding interviews together, debug live, and get
        immediate AI reviews to crack their dream offers.
      </p>

    </div>
  </div>
</footer>

  );
}
