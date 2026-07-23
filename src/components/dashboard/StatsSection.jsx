import React from 'react';
import { motion } from 'framer-motion';
import { FiLayers, FiActivity, FiClock, FiCheckSquare } from 'react-icons/fi';

export default function StatsSection() {
  const stats = [
    {
      label: 'Rooms Created',
      value: '12',
      change: '+2 this week',
      icon: <FiLayers className="text-blue-400" />,
    },
    {
      label: 'Coding Sessions',
      value: '28',
      change: '+6 this week',
      icon: <FiActivity className="text-amber-400" />,
    },
    {
      label: 'Practice Hours',
      value: '42.5',
      change: '12 hrs from AI Review',
      icon: <FiClock className="text-purple-400" />,
    },
    {
      label: 'Problems Solved',
      value: '18',
      change: '90% correct submissions',
      icon: <FiCheckSquare className="text-emerald-400" />,
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full"
    >
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.label}
          variants={cardVariants}
          whileHover={{ y: -3 }}
          className="group p-5 rounded-2xl border border-white/5 bg-zinc-900/30 hover:border-white/10 transition-all duration-300 flex flex-col justify-between text-left backdrop-blur-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider group-hover:text-zinc-400 transition-colors">
              {stat.label}
            </span>
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-sm group-hover:bg-zinc-800 transition-colors">
              {stat.icon}
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <h3 className="text-2xl md:text-3xl font-mono font-extrabold text-white tracking-tight">
              {stat.value}
            </h3>
            <p className="text-[10px] text-zinc-500 font-medium">
              {stat.change}
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
