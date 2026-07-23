import React, { useState } from 'react';
import DashboardBackground from '../../components/dashboard/DashboardBackground';
import Sidebar from '../../components/dashboard/Sidebar';
import Topbar from '../../components/dashboard/Topbar';
import HeroCard from '../../components/dashboard/HeroCard';
import QuickActions from '../../components/dashboard/QuickActions';
import StatsSection from '../../components/dashboard/StatsSection';
import RecentRooms from '../../components/dashboard/RecentRooms';
import ActivityTimeline from '../../components/dashboard/ActivityTimeline';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    // UI Only
    alert('Logging out of CodeArena...');
    // Redirect to Welcome page using standard browser navigation
    window.location.href = '/';
  };

  return (
    <DashboardBackground>
      {/* Sidebar Navigation */}
      <Sidebar 
        activeItem={activeTab} 
        onItemClick={setActiveTab} 
        onLogout={handleLogout} 
      />

      {/* Main Panel Content Container */}
      <div className="flex-grow min-h-screen flex flex-col p-6 md:p-8 lg:p-10 overflow-y-auto max-w-7xl mx-auto w-full pt-20 md:pt-8">
        {/* Topbar Row */}
        <Topbar />

        {/* Dynamic content wrapper based on active sidebar tab */}
        {activeTab === 'dashboard' ? (
          <div className="space-y-8 flex-grow">
            {/* Hero welcome Banner */}
            <HeroCard />

            {/* Quick Actions (Create / Join Session) */}
            <QuickActions />

            {/* DSA stats Section */}
            <StatsSection />

            {/* Grid containing Recent sessions & historical logs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RecentRooms />
              </div>
              <div className="lg:col-span-1">
                <ActivityTimeline />
              </div>
            </div>
          </div>
        ) : (
          /* Mock pages for other tabs */
          <div className="flex-grow border border-white/5 bg-zinc-900/10 rounded-2xl p-8 flex items-center justify-center min-h-[400px] text-zinc-400">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                {activeTab} Page
              </h3>
              <p className="text-xs">
                This is a UI-only workspace view. Complete your placements prep by navigating back to the main dashboard.
              </p>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className="mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-white"
              >
                Go back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardBackground>
  );
}
