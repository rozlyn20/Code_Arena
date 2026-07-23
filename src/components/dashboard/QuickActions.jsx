import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiArrowRight, FiTerminal, FiKey } from 'react-icons/fi';

export default function QuickActions() {
  const [roomCode, setRoomCode] = useState('');

  const handleCreateRoom = () => {
    // UI Only
    alert('Creating a new collaborative room...');
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!roomCode.trim()) {
      alert('Please enter a valid room code.');
      return;
    }
    // UI Only
    alert(`Joining room: ${roomCode.toUpperCase()}...`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {/* Action 1: Create Room */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="group p-6 md:p-8 rounded-2xl border border-white/5 bg-zinc-900/30 hover:border-indigo-500/25 hover:bg-zinc-900/40 transition-all duration-300 flex flex-col justify-between text-left relative overflow-hidden backdrop-blur-sm"
      >
        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

        <div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
            <FiTerminal className="text-xl text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2 tracking-tight group-hover:text-indigo-200 transition-colors">
            Start a New Room
          </h3>
          <p className="text-xs md:text-sm text-zinc-400 font-normal leading-relaxed mb-6">
            Generate a private coding session on-demand. Choose your programming runtime, select coding problems, and invite classmates to pair program immediately.
          </p>
        </div>

        <button 
          onClick={handleCreateRoom}
          className="w-full sm:w-auto relative group/btn overflow-hidden rounded-xl bg-gradient-to-r from-brand-blue to-brand-violet p-[1px] active:scale-98 transition-transform"
        >
          <div className="bg-zinc-950 hover:bg-transparent rounded-[11px] px-6 py-3 flex items-center justify-center space-x-2 transition-all duration-300">
            <span className="text-white font-medium text-xs">Create Room</span>
            <FiPlus className="text-white text-sm group-hover/btn:rotate-90 transition-transform duration-300" />
          </div>
        </button>
      </motion.div>

      {/* Action 2: Join Room */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="group p-6 md:p-8 rounded-2xl border border-white/5 bg-zinc-900/30 hover:border-indigo-500/25 hover:bg-zinc-900/40 transition-all duration-300 flex flex-col justify-between text-left relative overflow-hidden backdrop-blur-sm"
      >
        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-violet/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

        <div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
            <FiKey className="text-xl text-purple-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2 tracking-tight group-hover:text-indigo-200 transition-colors">
            Join Active Room
          </h3>
          <p className="text-xs md:text-sm text-zinc-400 font-normal leading-relaxed mb-6">
            Got an invitation code from a peer? Paste it below to jump into their live workspace, collaborate, and share compiler runtime controls.
          </p>
        </div>

        <form onSubmit={handleJoinRoom} className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              placeholder="ENTER ROOM CODE (e.g. A92K)"
              className="flex-grow bg-zinc-950/80 border border-white/5 focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/40 text-xs md:text-sm text-white placeholder-zinc-600 px-4 py-3 rounded-xl focus:outline-none transition-all font-mono tracking-widest uppercase"
            />
            <button 
              type="submit"
              className="flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs rounded-xl px-5 py-3 hover:border-white/20 transition-all duration-300 active:scale-98 shrink-0"
            >
              <span>Join Session</span>
              <FiArrowRight className="text-xs" />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
