import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

function CountUp({ endValue, suffix = '', duration = 1500 }) {
  const [count, setCount] = useState(0);
  const containerRef = useRef(null);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered) {
          setHasTriggered(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [hasTriggered]);

  useEffect(() => {
    if (!hasTriggered) return;

    let start = 0;
    const end = parseInt(endValue, 10);
    if (isNaN(end)) {
      setCount(endValue);
      return;
    }
    
    const startTime = performance.now();

    const updateCount = (timestamp) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out function
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeProgress * end);
      
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(updateCount);
  }, [hasTriggered, endValue, duration]);

  return (
    <span ref={containerRef} className="font-mono">
      {count}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const statsList = [
    { value: '1000', suffix: '+', label: 'Coding Sessions' },
    { value: '500', suffix: '+', label: 'Students Preparing' },
    { value: '250', suffix: '+', label: 'Interview Rooms' },
    { value: '95', suffix: '%', label: 'Positive Feedback' },
  ];

  return (
    <section className="relative py-20 border-t border-white/5 bg-zinc-950/20">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {statsList.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5 hover:border-white/10 transition-all duration-300 flex flex-col items-center justify-center text-center group"
            >
              <div className="text-3xl md:text-5xl font-extrabold text-white bg-gradient-to-r from-brand-blue to-brand-violet bg-clip-text text-transparent mb-2">
                <CountUp endValue={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-xs md:text-sm font-bold text-zinc-500 uppercase tracking-widest group-hover:text-zinc-400 transition-colors">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
