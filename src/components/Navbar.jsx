import React, { useState, useEffect } from "react";
import { FiMenu, FiX, FiTerminal } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-zinc-950/75 backdrop-blur-md border-b border-white/5 py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-violet flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
            <FiTerminal className="text-white text-xl" />
          </div>

          <span className="text-xl font-bold tracking-tight text-white font-sans group-hover:text-zinc-200 transition-colors">
            Code<span className="text-brand-blue">Arena</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-200"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/login"
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors px-4 py-2"
          >
            Login
          </Link>

          <Link
            to="/roomhub"
            className="relative group overflow-hidden rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 active:scale-95"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-brand-blue to-brand-violet group-hover:opacity-90 transition-opacity"></span>
            <span className="absolute inset-[1px] bg-zinc-950 rounded-[11px] group-hover:bg-zinc-900 transition-colors"></span>
            <span className="relative z-10">Get Started</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-zinc-400 hover:text-white p-2 focus:outline-none"
        >
          {isOpen ? (
            <FiX className="text-2xl" />
          ) : (
            <FiMenu className="text-2xl" />
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-b border-white/5 bg-zinc-950/95 backdrop-blur-lg overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-base font-medium text-zinc-400 hover:text-white transition-colors py-2"
                >
                  {link.name}
                </a>
              ))}

              <div className="pt-4 border-t border-white/5 flex flex-col space-y-3">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center text-zinc-400 hover:text-white py-2 text-base font-medium"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-blue to-brand-violet text-center text-white text-base font-medium active:scale-98 transition-transform"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}