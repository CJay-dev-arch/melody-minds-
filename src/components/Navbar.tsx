import React, { useState } from 'react';
import { LearnerProfile } from '../types';
import { FireMusicalNoteIcon } from './FireNoteStreakIndicator';
import {
  Sparkles,
  Users,
  Volume2,
  VolumeX,
  Shield,
  BarChart3,
  Flame,
  Award,
  BookOpen,
  Music,
  Home,
  Check,
  Plus,
  SlidersHorizontal,
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: any) => void;
  learners: LearnerProfile[];
  currentLearner: LearnerProfile;
  onSwitchLearner: (learnerId: string) => void;
  onAddNewLearner: () => void;
  isDetailedMode: boolean;
  onToggleDetailedMode: () => void;
  onRequestParentGate: (targetView: 'parent_dashboard' | 'admin_analytics') => void;
  onOpenAICompanion: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  learners,
  currentLearner,
  onSwitchLearner,
  onAddNewLearner,
  isDetailedMode,
  onToggleDetailedMode,
  onRequestParentGate,
  onOpenAICompanion,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b-2 border-purple-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Brand Logo & Mascot */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-purple-500 via-pink-400 to-amber-300 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <span className="text-xl sm:text-2xl animate-pulse-subtle">🎵</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-fun font-bold text-lg sm:text-2xl bg-gradient-to-r from-purple-700 via-pink-600 to-amber-600 bg-clip-text text-transparent">
                  MELODY MINDS
                </span>
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-purple-600 hidden sm:block tracking-wide">
                Where Little Minds Learn Through Music!
              </span>
            </div>
          </div>

          {/* Navigation Items (Desktop & Tablet) */}
          <nav className="hidden md:flex items-center gap-1 bg-purple-50/80 p-1.5 rounded-2xl border border-purple-100 text-xs sm:text-sm font-fun font-bold">
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'learn', label: 'Learn (11)', icon: BookOpen },
              { id: 'music', label: 'Music Library', icon: Music },
              { id: 'rewards', label: 'Rewards & Stars', icon: Award },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = currentView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onNavigate(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition ${
                    isActive
                      ? 'bg-white text-purple-700 shadow-sm'
                      : 'text-gray-600 hover:text-purple-700 hover:bg-white/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* AI Melody Button */}
            <button
              onClick={onOpenAICompanion}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white rounded-2xl text-xs sm:text-sm font-fun font-bold shadow-md hover:scale-105 active:scale-95 transition"
              title="Chat with Melody AI tutor"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="hidden sm:inline">Ask Melody</span>
            </button>

            {/* Stars Counter */}
            <div
              onClick={() => onNavigate('rewards')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-2xl cursor-pointer transition"
              title="Your total stars earned"
            >
              <span className="text-base sm:text-lg animate-bounce">⭐</span>
              <span className="font-fun font-bold text-amber-900 text-xs sm:text-sm">
                {currentLearner.stars}
              </span>
            </div>

            {/* Streak fire note badge */}
            <div
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl text-xs font-bold text-orange-800 shadow-sm"
              title="Consecutive daily learning streak"
            >
              <FireMusicalNoteIcon size="sm" />
              <span>{currentLearner.streakDays}d Streak</span>
            </div>

            {/* Mode Toggle: Playful vs Detailed */}
            <button
              onClick={onToggleDetailedMode}
              className={`p-2 rounded-2xl border transition ${
                isDetailedMode
                  ? 'bg-purple-100 border-purple-300 text-purple-800'
                  : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
              title={isDetailedMode ? 'Switch to Simplified Kid Mode' : 'Switch to Detailed Explorer Mode'}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* Learner Profile Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 bg-white hover:bg-purple-50 rounded-2xl border-2 border-purple-200 transition"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-purple-100 flex items-center justify-center text-lg">
                  {currentLearner.avatarEmoji}
                </div>
                <div className="text-left hidden sm:block">
                  <span className="font-fun font-bold text-gray-900 text-xs block leading-tight">
                    {currentLearner.name}
                  </span>
                  <span className="text-[10px] text-gray-500 font-semibold block leading-tight">
                    {currentLearner.gradeLevel}
                  </span>
                </div>
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-3xl shadow-2xl border-2 border-purple-100 p-3 z-50 animate-float">
                  <div className="px-3 py-2 border-b border-gray-100 mb-2">
                    <p className="text-xs font-bold text-gray-400 uppercase">Learner Profiles</p>
                  </div>

                  <div className="space-y-1">
                    {learners.map((lr) => {
                      const isSelected = lr.id === currentLearner.id;
                      return (
                        <button
                          key={lr.id}
                          onClick={() => {
                            onSwitchLearner(lr.id);
                            setProfileDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-2xl transition ${
                            isSelected ? 'bg-purple-50 text-purple-900 font-bold' : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl">{lr.avatarEmoji}</span>
                            <div className="text-left">
                              <span className="text-sm font-fun block">{lr.name}</span>
                              <span className="text-[10px] text-gray-400">{lr.gradeLevel} • {lr.stars} ⭐</span>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-purple-600" />}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => {
                      onAddNewLearner();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full mt-2 p-2 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Child Profile
                  </button>

                  <div className="mt-3 pt-2 border-t border-gray-100 space-y-1">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onRequestParentGate('parent_dashboard');
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-gray-700 hover:text-purple-700 hover:bg-purple-50 rounded-xl flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4 text-purple-600" /> Parent & Teacher Dashboard
                    </button>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onRequestParentGate('admin_analytics');
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-gray-700 hover:text-purple-700 hover:bg-purple-50 rounded-xl flex items-center gap-2"
                    >
                      <BarChart3 className="w-4 h-4 text-indigo-600" /> Platform Analytics (Google Sheets)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden flex items-center justify-around bg-white border-t border-purple-100 py-2 px-2 text-[11px] font-fun font-bold">
        {[
          { id: 'home', label: 'Home', icon: Home },
          { id: 'learn', label: 'Learn', icon: BookOpen },
          { id: 'music', label: 'Music', icon: Music },
          { id: 'rewards', label: 'Rewards', icon: Award },
          { id: 'parent_gate', label: 'Parents', icon: Shield },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'parent_gate') {
                  onRequestParentGate('parent_dashboard');
                } else {
                  onNavigate(item.id);
                }
              }}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
                isActive ? 'text-purple-700 font-extrabold' : 'text-gray-500'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
