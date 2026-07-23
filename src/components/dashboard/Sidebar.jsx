import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiGrid, FiLayers, FiUser, FiSettings, FiLogOut, 
  FiChevronLeft, FiChevronRight, FiTerminal, FiMenu, FiX 
} from 'react-icons/fi';

export default function Sidebar({ activeItem = 'dashboard', onItemClick, onLogout }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiGrid className="text-lg" /> },
    { id: 'rooms', label: 'Rooms', icon: <FiLayers className="text-lg" /> },
    { id: 'profile', label: 'Profile', icon: <FiUser className="text-lg" /> },
    { id: 'settings', label: 'Settings', icon: <FiSettings className="text-lg" /> },
  ];

  const handleItemClick = (id) => {
    if (onItemClick) onItemClick(id);
    setIsMobileOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-zinc-950/40 border-r border-white/5 backdrop-blur-xl py-6 px-4 justify-between h-screen">
      {/* Top Section: Logo & Toggle */}
      <div className="space-y-8">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-2`}>
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-blue to-brand-violet flex items-center justify-center shadow-md">
                <FiTerminal className="text-white text-base" />
              </div>
              <span className="text-base font-bold tracking-tight text-white">
                Code<span className="text-brand-blue">Arena</span>
              </span>
            </div>
          )}
          {isCollapsed && (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-blue to-brand-violet flex items-center justify-center shadow-md">
              <FiTerminal className="text-white text-base" />
            </div>
          )}
          
          {/* Collapse toggle button for Desktop */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col space-y-1.5">
          {menuItems.map((item) => {
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`flex items-center space-x-3.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-blue/10 to-brand-violet/10 border-indigo-500/20 text-white shadow-lg shadow-indigo-500/5'
                    : 'bg-transparent border-transparent text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className={`${isActive ? 'text-indigo-400' : 'text-zinc-400 group-hover:text-white'} transition-colors`}>
                  {item.icon}
                </div>
                {!isCollapsed && <span className="tracking-tight">{item.label}</span>}
                
                {/* Active Indicator Line */}
                {isActive && !isCollapsed && (
                  <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: User & Logout */}
      <div className="space-y-4 pt-6 border-t border-white/5">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3.5 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:bg-rose-500/10 hover:text-rose-400 border border-transparent transition-all duration-200"
        >
          <FiLogOut className="text-lg" />
          {!isCollapsed && <span className="tracking-tight">Logout</span>}
        </button>

        {/* User Profile Summary */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-2 pt-2`}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs uppercase shadow-inner shrink-0">
            R
          </div>
          {!isCollapsed && (
            <div className="text-left overflow-hidden">
              <h5 className="text-xs font-bold text-white tracking-tight truncate">Rose</h5>
              <p className="text-[10px] text-zinc-500 truncate">rose@codearena.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header (when sidebar is collapsed on mobile) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-zinc-950/80 border-b border-white/5 backdrop-blur-md z-40 flex items-center justify-between px-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-blue to-brand-violet flex items-center justify-center">
            <FiTerminal className="text-white text-base" />
          </div>
          <span className="text-base font-bold text-white">Code<span className="text-brand-blue">Arena</span></span>
        </div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 border border-white/5 bg-white/5 rounded-lg text-zinc-400 hover:text-white"
        >
          {isMobileOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
        </button>
      </div>

      {/* Desktop Sidebar container */}
      <div className={`hidden md:block shrink-0 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="fixed top-0 bottom-0 left-0 z-30 transition-all duration-300 h-screen" style={{ width: isCollapsed ? '80px' : '256px' }}>
          {sidebarContent}
        </div>
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            ></motion.div>
            
            {/* Sidebar drawer content */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="md:hidden fixed top-0 bottom-0 left-0 w-64 z-50 h-screen"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
