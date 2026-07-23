import React from 'react';

export default function DashboardBackground({ children }) {
  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 overflow-x-hidden font-sans w-full">
      {/* Background layer structure: Grid, Noise, Glows */}
      <div className="absolute inset-0 bg-grid-pattern z-0 pointer-events-none opacity-40"></div>
      <div className="absolute inset-0 bg-noise z-0 pointer-events-none opacity-[0.15]"></div>
      
      {/* Dynamic blurred backdrop glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand-blue/5 blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute top-[45%] right-[-15%] w-[45vw] h-[45vw] rounded-full bg-brand-violet/5 blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-500/5 blur-[160px] pointer-events-none z-0"></div>

      <div className="relative z-10 flex min-h-screen w-full">
        {children}
      </div>
    </div>
  );
}
