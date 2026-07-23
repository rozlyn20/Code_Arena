import React from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiFolderPlus } from 'react-icons/fi';

export default function RecentRooms() {
  const handleCreateClick = () => {
    alert('Initializing your first room setup...');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="p-8 md:p-12 rounded-2xl border border-white/5 bg-zinc-900/20 backdrop-blur-sm text-center space-y-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[300px]"
    >
      {/* Decorative inner light beams */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

      {/* Elegant SVG Empty State illustration */}
      <div className="relative mb-2">
        <div className="w-16 h-16 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center shadow-lg relative z-10 text-zinc-600">
          <FiFolderPlus className="text-3xl text-zinc-500 animate-pulse duration-3000" />
        </div>
        {/* Glow rings behind illustration */}
        <div className="absolute inset-0 rounded-2xl bg-indigo-500/5 blur-xl pointer-events-none -z-10"></div>
        <div className="absolute -inset-2 rounded-2xl border border-indigo-500/10 opacity-30 border-dashed pointer-events-none"></div>
      </div>

      <div className="space-y-2 max-w-sm">
        <h3 className="text-sm font-bold text-white tracking-tight">No recent rooms yet</h3>
        <p className="text-xs text-zinc-500 leading-relaxed font-normal">
          Create your first collaborative room to practice coding interviews with friends, or invite peers to dry-run interview solutions.
        </p>
      </div>

      <button
        onClick={handleCreateClick}
        className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs rounded-xl px-4 py-2.5 hover:border-white/20 transition-all duration-200 active:scale-98"
      >
        <FiPlus />
        <span>Create Room</span>
      </button>
    </motion.div>
  );
}
