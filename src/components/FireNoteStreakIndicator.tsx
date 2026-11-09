import React, { useState } from 'react';
import { soundEngine } from '../services/audioSynthesizer';
import confetti from 'canvas-confetti';
import { Sparkles, Calendar, Zap, Award, ChevronRight } from 'lucide-react';

interface FireNoteStreakProps {
  streakDays: number;
  learnerName: string;
  onExploreToday?: () => void;
  className?: string;
  variant?: 'banner' | 'card' | 'compact';
}

/**
 * Custom Fire Musical Note SVG Icon
 * Blends a vibrant leaping flame with an eighth musical note!
 */
export const FireMusicalNoteIcon: React.FC<{
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
}> = ({ size = 'md', animated = true, className = '' }) => {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${sizeMap[size]} ${
        animated ? 'animate-pulse-subtle' : ''
      } ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full overflow-visible drop-shadow-[0_4px_12px_rgba(249,115,22,0.45)]"
      >
        <defs>
          {/* Outer Flame Gradient */}
          <linearGradient id="fireOuterGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="45%" stopColor="#EA580C" />
            <stop offset="80%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#FBBF24" />
          </linearGradient>

          {/* Inner Flame Core Gradient */}
          <linearGradient id="fireInnerGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="50%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#FEF08A" />
          </linearGradient>

          {/* Musical Note Golden Silhouette */}
          <linearGradient id="noteGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="40%" stopColor="#FEF08A" />
            <stop offset="100%" stopColor="#FDE047" />
          </linearGradient>

          {/* Ember glow filter */}
          <filter id="flameGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Leaping Flame Body */}
        <path
          d="M 50 5 
             C 53 18, 62 26, 68 34 
             C 75 43, 85 54, 85 70 
             C 85 86, 70 96, 50 96 
             C 30 96, 15 86, 15 70 
             C 15 54, 26 44, 32 35 
             C 34 44, 39 49, 44 48 
             C 41 38, 43 24, 50 5 Z"
          fill="url(#fireOuterGrad)"
        />

        {/* Secondary Inner Flame Tongue */}
        <path
          d="M 50 25 
             C 53 35, 60 41, 64 48 
             C 70 56, 75 64, 75 75 
             C 75 87, 63 93, 50 93 
             C 37 93, 25 87, 25 75 
             C 25 64, 33 55, 38 48 
             C 40 54, 43 57, 47 57 
             C 44 47, 46 36, 50 25 Z"
          fill="url(#fireInnerGrad)"
        />

        {/* Musical Note (Quaver) embedded at the burning core of the flame */}
        {/* Note Stem & Fiery Flag */}
        <g filter="url(#flameGlow)">
          {/* Note Stem */}
          <path
            d="M 56 73 L 56 38"
            stroke="url(#noteGoldGrad)"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Musical Flag styled as an upward flick of flame */}
          <path
            d="M 56 38 C 65 34, 73 38, 71 52 C 67 47, 62 46, 56 48 Z"
            fill="url(#noteGoldGrad)"
          />

          {/* Musical Note Head (solid ellipse tilted with musical bounce) */}
          <ellipse
            cx="44"
            cy="75"
            rx="12"
            ry="9"
            transform="rotate(-22 44 75)"
            fill="url(#noteGoldGrad)"
            stroke="#EA580C"
            strokeWidth="1.5"
          />

          {/* Inner hot white flame spark highlight in note head */}
          <ellipse
            cx="43"
            cy="74"
            rx="6"
            ry="3.5"
            transform="rotate(-22 43 74)"
            fill="#FFFFFF"
            opacity="0.9"
          />
        </g>

        {/* Little dancing ember sparks */}
        <circle cx="28" cy="30" r="2" fill="#FEF08A" className="animate-ping" style={{ animationDuration: '2s' }} />
        <circle cx="72" cy="22" r="2.5" fill="#FDE047" className="animate-ping" style={{ animationDuration: '1.7s' }} />
        <circle cx="50" cy="2" r="1.5" fill="#FFFFFF" />
      </svg>
    </div>
  );
};

export const FireNoteStreakIndicator: React.FC<FireNoteStreakProps> = ({
  streakDays,
  learnerName,
  onExploreToday,
  className = '',
  variant = 'card',
}) => {
  const [celebrated, setCelebrated] = useState(false);

  // Calculate streak milestones (e.g. 3, 7, 14, 30 days)
  const nextMilestone = streakDays < 3 ? 3 : streakDays < 7 ? 7 : streakDays < 14 ? 14 : 30;
  const progressPercent = Math.min(100, Math.round((streakDays / nextMilestone) * 100));

  // 7-day week schedule representation
  const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  // Calculate which days are completed up to streakDays (assuming 7-day cyclical view with today active)
  const todayIndex = 4; // Friday in display cycle

  const handleCelebrateStreak = () => {
    soundEngine.playFanfare();
    setCelebrated(true);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#F97316', '#EF4444', '#FBBF24', '#A855F7'],
      });
    } catch {}
    setTimeout(() => setCelebrated(false), 2500);
  };

  // Compact Variant (e.g. for small headers or widgets)
  if (variant === 'compact') {
    return (
      <div
        onClick={handleCelebrateStreak}
        className={`inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-orange-200 rounded-2xl cursor-pointer hover:scale-105 active:scale-95 transition shadow-sm ${className}`}
        title={`${streakDays} consecutive days learning streak!`}
      >
        <FireMusicalNoteIcon size="sm" />
        <div className="flex items-baseline gap-1">
          <span className="font-fun font-bold text-base sm:text-lg text-orange-950 leading-none">
            {streakDays}
          </span>
          <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">
            Day Streak
          </span>
        </div>
      </div>
    );
  }

  // Banner / Main Card Variant on Home Screen
  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 text-white p-6 sm:p-7 shadow-xl border-2 border-orange-300/40 ${className}`}
    >
      {/* Decorative fiery musical note background silhouettes */}
      <div className="absolute -right-4 -bottom-6 opacity-15 pointer-events-none transform rotate-12">
        <FireMusicalNoteIcon size="xl" animated={false} />
      </div>
      <div className="absolute left-1/3 -top-6 text-7xl opacity-10 pointer-events-none animate-float">
        🎶
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Side: Fire Note Icon + Streak Counter */}
        <div className="flex items-center gap-4 sm:gap-5 w-full md:w-auto">
          {/* Large Fire Note Icon Button */}
          <button
            onClick={handleCelebrateStreak}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center p-3 shadow-2xl hover:scale-105 active:scale-95 transition-transform shrink-0 relative group"
            title="Tap to celebrate your daily rhythm streak!"
          >
            <FireMusicalNoteIcon size="lg" />
            <div className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-orange-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow uppercase tracking-wider animate-bounce">
              Hot!
            </div>
          </button>

          {/* Streak Headings */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-white/25 backdrop-blur-md rounded-full text-[11px] font-extrabold uppercase tracking-wider text-yellow-200 inline-flex items-center gap-1">
                <Zap className="w-3 h-3 text-yellow-300 fill-yellow-300" /> Daily Rhythm Streak
              </span>
              {celebrated && (
                <span className="text-xs font-black text-yellow-300 animate-wiggle">
                  🎉 Blazing Bright!
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-fun font-bold text-4xl sm:text-5xl text-white drop-shadow-md">
                {streakDays}
              </span>
              <span className="font-fun font-bold text-xl sm:text-2xl text-yellow-100">
                Days In A Row!
              </span>
            </div>

            <p className="text-xs sm:text-sm text-orange-100 font-semibold line-clamp-1 mt-0.5">
              {streakDays >= 7
                ? `Incredible dedication, ${learnerName}! Your musical rhythm is unstoppable! 🌟`
                : `Keep the beat alive, ${learnerName}! Practice today to protect your flame! 🔥`}
            </p>
          </div>
        </div>

        {/* Center / Right: 7-Day Rhythm Circles & Milestone Progress */}
        <div className="w-full md:w-auto flex-1 max-w-md bg-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/20 space-y-3">
          {/* Weekday Circles */}
          <div className="flex items-center justify-between gap-1.5">
            {dayNames.map((day, idx) => {
              // Active completed day if within streak window
              const isPastCompleted = idx < todayIndex && idx >= todayIndex - streakDays;
              const isToday = idx === todayIndex;

              return (
                <div key={idx} className="flex flex-col items-center gap-1 flex-1">
                  <span className="text-[10px] font-bold text-orange-200 uppercase">{day}</span>
                  <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-bold text-xs transition-transform ${
                      isToday
                        ? 'bg-yellow-400 text-orange-950 ring-2 ring-white shadow-md scale-105'
                        : isPastCompleted
                        ? 'bg-white/30 text-white'
                        : 'bg-white/10 text-white/50 border border-white/10'
                    }`}
                  >
                    {isToday ? (
                      <FireMusicalNoteIcon size="sm" />
                    ) : isPastCompleted ? (
                      <span className="text-sm">🎵</span>
                    ) : (
                      <span>•</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Milestone Progress Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-yellow-100">
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-yellow-300" /> Next Milestone: {nextMilestone} Days
              </span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full bg-black/30 h-2 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-yellow-300 to-amber-200 h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${Math.max(8, progressPercent)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
