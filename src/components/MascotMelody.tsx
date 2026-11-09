import React, { useState } from 'react';
import { MascotOutfit } from '../types';
import { soundEngine } from '../services/audioSynthesizer';
import { Volume2, Sparkles } from 'lucide-react';

interface MascotProps {
  mood?: 'happy' | 'dancing' | 'thinking' | 'cheering' | 'singing' | 'curious';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  outfit?: MascotOutfit;
  speechText?: string;
  onMascotClick?: () => void;
  showSpeechBubble?: boolean;
  allowVoiceNarration?: boolean;
}

export const MascotMelody: React.FC<MascotProps> = ({
  mood = 'happy',
  size = 'md',
  outfit = {},
  speechText,
  onMascotClick,
  showSpeechBubble = true,
  allowVoiceNarration = true,
}) => {
  const [isWiggling, setIsWiggling] = useState(false);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-52 h-52',
  };

  const handleMascotPress = () => {
    setIsWiggling(true);
    soundEngine.playNote('G4', 0.25, 'chime');
    setTimeout(() => {
      soundEngine.playNote('C5', 0.4, 'chime');
      setIsWiggling(false);
    }, 200);

    if (speechText && allowVoiceNarration) {
      soundEngine.speakNarration(speechText);
    }

    if (onMascotClick) {
      onMascotClick();
    }
  };

  const handleReadAloud = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (speechText) {
      soundEngine.speakNarration(speechText);
    }
  };

  return (
    <div className="relative inline-flex flex-col items-center select-none">
      {/* Optional Speech Bubble */}
      {showSpeechBubble && speechText && (
        <div className="mb-2 max-w-xs md:max-w-md bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border-2 border-purple-200 text-purple-950 text-sm font-semibold relative animate-float flex items-start gap-2">
          <span className="flex-1 leading-snug">{speechText}</span>
          {allowVoiceNarration && (
            <button
              onClick={handleReadAloud}
              title="Read aloud"
              className="p-1 hover:bg-purple-100 rounded-full text-purple-600 transition-colors"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          )}
          {/* Triangle bubble arrow */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white" />
        </div>
      )}

      {/* Mascot Character Interactive Body */}
      <button
        onClick={handleMascotPress}
        className={`relative cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95 ${
          isWiggling ? 'animate-wiggle' : mood === 'dancing' ? 'animate-bounce' : 'animate-float'
        } ${sizeClasses[size]}`}
        aria-label="Melody the musical mascot"
      >
        <svg viewBox="0 0 120 130" className="w-full h-full drop-shadow-md overflow-visible">
          <defs>
            <linearGradient id="melodyBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C084FC" />
              <stop offset="50%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#7E22CE" />
            </linearGradient>
            <linearGradient id="melodyCheekGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDA4AF" />
              <stop offset="100%" stopColor="#FB7185" />
            </linearGradient>
            <radialGradient id="melodyGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FDE047" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FDE047" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Sparkle background halo */}
          <circle cx="60" cy="65" r="50" fill="url(#melodyGlow)" className="animate-pulse-subtle" />

          {/* Musical Note Stem & Flag (Musical Quaver character anatomy) */}
          <path
            d="M 68 85 L 68 25 C 68 25, 88 20, 92 38 C 96 55, 78 50, 78 50"
            fill="none"
            stroke="#7E22CE"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Flag ribbon in pastel pink */}
          <path
            d="M 68 25 C 75 18, 92 20, 88 38 C 84 50, 72 45, 68 45 Z"
            fill="#F472B6"
            opacity="0.9"
          />

          {/* Main Note Head (Melody's smiling face & body) */}
          <ellipse
            cx="48"
            cy="85"
            rx="32"
            ry="26"
            fill="url(#melodyBodyGrad)"
            transform="rotate(-15 48 85)"
            stroke="#6B21A8"
            strokeWidth="3"
          />

          {/* Big Twinkling Eyes */}
          {mood === 'singing' ? (
            // Singing closed curved happy eyes (^_^)
            <g>
              <path d="M 32 80 Q 40 73 48 80" fill="none" stroke="#2E1065" strokeWidth="3" strokeLinecap="round" />
              <path d="M 54 78 Q 62 71 70 78" fill="none" stroke="#2E1065" strokeWidth="3" strokeLinecap="round" />
            </g>
          ) : mood === 'thinking' ? (
            // Thinking upward gaze
            <g>
              <ellipse cx="38" cy="78" rx="6" ry="7" fill="#2E1065" />
              <ellipse cx="60" cy="76" rx="6" ry="7" fill="#2E1065" />
              <circle cx="40" cy="75" r="2.5" fill="#FFFFFF" />
              <circle cx="62" cy="73" r="2.5" fill="#FFFFFF" />
            </g>
          ) : (
            // Big joyful starry eyes
            <g>
              <ellipse cx="38" cy="80" rx="7" ry="8" fill="#2E1065" />
              <ellipse cx="60" cy="78" rx="7" ry="8" fill="#2E1065" />
              {/* Eye sparkle highlights */}
              <circle cx="41" cy="77" r="3" fill="#FFFFFF" />
              <circle cx="36" cy="83" r="1.5" fill="#FFFFFF" />
              <circle cx="63" cy="75" r="3" fill="#FFFFFF" />
              <circle cx="58" cy="81" r="1.5" fill="#FFFFFF" />
            </g>
          )}

          {/* Rosy blush cheeks */}
          <ellipse cx="26" cy="88" rx="5" ry="3.5" fill="url(#melodyCheekGrad)" opacity="0.85" />
          <ellipse cx="70" cy="84" rx="5" ry="3.5" fill="url(#melodyCheekGrad)" opacity="0.85" />

          {/* Cute Mouth */}
          {mood === 'singing' ? (
            // Singing open O mouth
            <circle cx="50" cy="92" r="5" fill="#BE185D" stroke="#500724" strokeWidth="1.5" />
          ) : (
            // Big cheerful smile
            <path
              d="M 40 89 Q 49 98 58 87"
              fill="none"
              stroke="#2E1065"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          )}

          {/* Little tiny musical hands */}
          <circle cx="18" cy="86" r="6" fill="#D8B4FE" stroke="#7E22CE" strokeWidth="2" />
          <circle cx="76" cy="80" r="6" fill="#D8B4FE" stroke="#7E22CE" strokeWidth="2" />

          {/* --- OUTFIT ACCESSORIES --- */}

          {/* DJ Headphones */}
          {outfit.hat === 'headphones' && (
            <g>
              {/* Headphone band */}
              <path
                d="M 22 75 C 20 40, 76 35, 78 70"
                fill="none"
                stroke="#06B6D4"
                strokeWidth="5"
                strokeLinecap="round"
              />
              {/* Left ear pad */}
              <rect x="16" y="68" width="8" height="18" rx="4" fill="#0891B2" stroke="#164E63" strokeWidth="1.5" />
              {/* Right ear pad */}
              <rect x="74" y="64" width="8" height="18" rx="4" fill="#0891B2" stroke="#164E63" strokeWidth="1.5" />
            </g>
          )}

          {/* Golden Crown */}
          {outfit.hat === 'crown' && (
            <g transform="translate(32, 45) scale(0.7)">
              <polygon
                points="0,20 10,0 25,12 40,0 50,20"
                fill="#FBBF24"
                stroke="#D97706"
                strokeWidth="2"
              />
              <circle cx="10" cy="3" r="2.5" fill="#EF4444" />
              <circle cx="25" cy="14" r="2" fill="#3B82F6" />
              <circle cx="40" cy="3" r="2.5" fill="#10B981" />
            </g>
          )}

          {/* Wizard Hat */}
          {outfit.hat === 'wizard' && (
            <g transform="translate(25, 25) scale(0.65)">
              <polygon points="25,0 0,40 50,40" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
              <ellipse cx="25" cy="40" rx="30" ry="8" fill="#1E40AF" />
              <circle cx="25" cy="18" r="3" fill="#FDE047" />
            </g>
          )}

          {/* Cheerful Flower */}
          {outfit.hat === 'flower' && (
            <g transform="translate(62, 55) scale(0.55)">
              <circle cx="15" cy="10" r="7" fill="#F472B6" />
              <circle cx="25" cy="15" r="7" fill="#F472B6" />
              <circle cx="20" cy="25" r="7" fill="#F472B6" />
              <circle cx="10" cy="22" r="7" fill="#F472B6" />
              <circle cx="8" cy="12" r="7" fill="#F472B6" />
              <circle cx="16" cy="17" r="5" fill="#FDE047" />
            </g>
          )}

          {/* Star Sunglasses */}
          {outfit.glasses === 'star_shades' && (
            <g transform="translate(26, 70) scale(0.7)">
              {/* Left Star */}
              <polygon
                points="15,0 18,9 28,9 20,15 23,24 15,18 7,24 10,15 2,9 12,9"
                fill="#F59E0B"
                stroke="#B45309"
                strokeWidth="1.5"
              />
              {/* Bridge */}
              <line x1="28" y1="12" x2="38" y2="12" stroke="#B45309" strokeWidth="2" />
              {/* Right Star */}
              <polygon
                points="48,0 51,9 61,9 53,15 56,24 48,18 40,24 43,15 35,9 45,9"
                fill="#F59E0B"
                stroke="#B45309"
                strokeWidth="1.5"
              />
            </g>
          )}

          {/* Round Glasses */}
          {outfit.glasses === 'round_specs' && (
            <g>
              <circle cx="38" cy="80" r="9" fill="none" stroke="#475569" strokeWidth="2.5" />
              <circle cx="60" cy="78" r="9" fill="none" stroke="#475569" strokeWidth="2.5" />
              <line x1="47" y1="80" x2="51" y2="79" stroke="#475569" strokeWidth="2.5" />
            </g>
          )}

          {/* Sparkles Accessory */}
          {outfit.accessory === 'sparkles' && (
            <g className="animate-pulse">
              <path d="M 85 70 Q 88 75 93 75 Q 88 75 85 80 Q 85 75 80 75 Q 85 75 85 70 Z" fill="#FDE047" />
              <path d="M 12 70 Q 15 73 18 73 Q 15 73 12 76 Q 12 73 9 73 Q 12 73 12 70 Z" fill="#38BDF8" />
            </g>
          )}

          {/* Magic Wand */}
          {outfit.accessory === 'wand' && (
            <g transform="translate(75, 68) rotate(30)">
              <rect x="0" y="0" width="4" height="25" rx="2" fill="#E2E8F0" stroke="#94A3B8" />
              <polygon
                points="2,-6 5,0 10,2 6,6 7,12 2,8 -3,12 -2,6 -6,2 -1,0"
                fill="#FDE047"
                stroke="#CA8A04"
                strokeWidth="1"
              />
            </g>
          )}
        </svg>

        {/* Floating musical note bubbles */}
        <div className="absolute -top-1 -right-1 text-purple-600 text-xs animate-bounce pointer-events-none">
          🎵
        </div>
      </button>
    </div>
  );
};
