import React from 'react';
import { motion } from 'framer-motion';
import { FiPlusSquare, FiUserPlus, FiCode, FiAward } from 'react-icons/fi';

export default function ActivityTimeline() {
  const activities = [
    {
      id: 1,
      title: 'Created Coding Room',
      detail: 'Room #A92K (JavaScript template)',
      time: '10m ago',
      icon: <FiPlusSquare className="text-blue-400" />,
      circleColor: 'bg-blue-500/10 border-blue-500/30',
    },
    {
      id: 2,
      title: 'Joined Mock Interview',
      detail: 'Partner: Sarah Jenkins (Interview Role: Candidate)',
      time: '2h ago',
      icon: <FiUserPlus className="text-purple-400" />,
      circleColor: 'bg-purple-500/10 border-purple-500/30',
    },
    {
      id: 3,
      title: 'Solved Two Sum',
      detail: 'Completed in O(N) runtime with AI Complexity report',
      time: 'Yesterday',
      icon: <FiCode className="text-emerald-400" />,
      circleColor: 'bg-emerald-500/10 border-emerald-500/30',
    },
    {
      id: 4,
      title: 'Completed Interview Session',
      detail: 'Average score: 9.2/10 (Feedback reviewed)',
      time: '3 days ago',
      icon: <FiAward className="text-amber-400" />,
      circleColor: 'bg-amber-500/10 border-amber-500/30',
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { x: -10, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  return (
    <div className="p-6 md:p-8 rounded-2xl border border-white/5 bg-zinc-900/20 backdrop-blur-sm text-left space-y-6 relative overflow-hidden flex flex-col min-h-[300px]">
      <h3 className="text-sm font-bold text-white tracking-tight">Recent Activity</h3>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative flex flex-col space-y-6 pl-4 border-l border-white/5"
      >
        {activities.map((act) => (
          <motion.div
            key={act.id}
            variants={itemVariants}
            className="relative pl-6"
          >
            {/* Timeline bullet node */}
            <div className={`absolute left-0 top-1.5 -translate-x-[25px] w-4.5 h-4.5 rounded-full border flex items-center justify-center bg-zinc-950 text-[10px] ${act.circleColor} shadow-md`}>
              {act.icon}
            </div>

            {/* Content block */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <h4 className="text-xs font-bold text-white tracking-tight group-hover:text-indigo-300 transition-colors">
                  {act.title}
                </h4>
                <p className="text-[11px] text-zinc-500">
                  {act.detail}
                </p>
              </div>
              <span className="text-[10px] text-zinc-600 font-mono font-medium shrink-0">
                {act.time}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
