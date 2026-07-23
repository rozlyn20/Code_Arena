import React from 'react';
import { FiGithub, FiTerminal, FiMail, FiShield } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-zinc-950/80 py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-start">
          {/* Logo & Description */}
          <div className="md:col-span-6 space-y-4 text-left">
            <a href="#home" className="flex items-center space-x-2 w-fit">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-blue to-brand-violet flex items-center justify-center shadow-md">
                <FiTerminal className="text-white text-lg" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white font-sans">
                Code<span className="text-brand-blue">Arena</span>
              </span>
            </a>
            <p className="text-xs text-zinc-500 max-w-sm font-normal leading-relaxed">
              CodeArena is a collaborative coding interview platform where students practice technical coding interviews together, debug live, and get immediate AI reviews to crack their dream offers.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-6 flex flex-wrap justify-start md:justify-end gap-x-12 gap-y-6">
            <div className="text-left space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Resources</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#features" className="text-zinc-500 hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="text-zinc-500 hover:text-white transition-colors">How it works</a></li>
              </ul>
            </div>

            <div className="text-left space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Product</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors flex items-center space-x-1.5">
                    <FiGithub />
                    <span>GitHub</span>
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-zinc-500 hover:text-white transition-colors flex items-center space-x-1.5">
                    <FiMail />
                    <span>Contact Support</span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="text-left space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Legal</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#privacy" className="text-zinc-500 hover:text-white transition-colors flex items-center space-x-1.5">
                    <FiShield />
                    <span>Privacy Policy</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500">
          <p>© {new Date().getFullYear()} CodeArena. All rights reserved. Created for developers.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
