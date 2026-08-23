import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'Is CodeArena free for college students?',
      answer: 'Yes! CodeArena is 100% free for students preparing for campus placements or technical interviews. You can create unlimited public or private rooms, run code, and collaborate without any cost.',
    },
    {
      key: 'invite',
      question: 'Do my classmates need to register to join my room?',
      answer: 'No registration is required for peers joining your room. You can copy the unique workspace link and share it; they can input a nickname and start pair programming with you instantly.',
    },
    {
      question: 'What programming languages are supported in the IDE?',
      answer: 'CodeArena currently supports C++. All languages feature local/remote sandboxed code execution, console output logs, and compiler error reporting.',
    }
  ];

  const toggleFAQ = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <section id="faq" className="relative py-24 overflow-hidden border-t border-white/5 bg-zinc-950/20">
      <div className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] rounded-full bg-brand-blue/5 blur-[120px] pointer-events-none z-0"></div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <h2 className="text-xs uppercase tracking-widest font-extrabold text-indigo-400">Questions</h2>
          <p className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </p>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Got questions about CodeArena rooms, languages, or features? We have answers.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-white/5 bg-zinc-900/30 overflow-hidden hover:border-white/10 transition-colors duration-200"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="text-sm md:text-base font-bold text-white tracking-tight">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-1 rounded bg-white/5 text-zinc-400 border border-white/5"
                  >
                    <FiChevronDown className="text-lg" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 text-xs md:text-sm text-zinc-400 leading-relaxed font-normal border-t border-white/5 pt-4 bg-zinc-950/40 text-left">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
