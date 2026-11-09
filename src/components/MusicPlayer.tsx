import React, { useState, useEffect } from 'react';
import { Song } from '../types';
import { soundEngine } from '../services/audioSynthesizer';
import { analytics } from '../services/analytics';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Heart,
  Repeat,
  Shuffle,
  Maximize2,
  Minimize2,
  Music,
  Sparkles,
} from 'lucide-react';

interface MusicPlayerProps {
  currentSong: Song | null;
  playlist: Song[];
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSelectSong: (song: Song) => void;
  onToggleFavorite: (songId: string) => void;
  isFavorite: boolean;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentSong,
  playlist,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  onToggleFavorite,
  isFavorite,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [activeNotePitch, setActiveNotePitch] = useState<string | null>(null);
  const [progressSec, setProgressSec] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Play audio notes when isPlaying changes or song changes
  useEffect(() => {
    if (!currentSong) return;

    if (isPlaying) {
      analytics.trackEvent({
        category: 'music',
        eventType: 'play',
        songId: currentSong.id,
        subject: currentSong.subjectId,
      });

      // Play song notes via soundEngine
      soundEngine.playSongNotes(
        currentSong.notes,
        (pitch) => {
          setActiveNotePitch(pitch);
          setTimeout(() => setActiveNotePitch(null), 300);
        },
        () => {
          // Song finished
          analytics.trackEvent({
            category: 'music',
            eventType: 'completion',
            songId: currentSong.id,
            completed: true,
          });
          onNext();
        }
      );
    } else {
      soundEngine.stopAll();
    }

    return () => {
      soundEngine.stopAll();
    };
  }, [currentSong?.id, isPlaying]);

  // Progress timer for lyrics and slider
  useEffect(() => {
    if (!isPlaying || !currentSong) return;

    const interval = setInterval(() => {
      setProgressSec((prev) => {
        const nextTime = prev + 0.5;
        // Update karaoke lyrics line
        if (currentSong.lyrics && currentSong.lyrics.length) {
          const matchIdx = currentSong.lyrics.findIndex(
            (l, idx) =>
              nextTime >= l.timeSec &&
              (idx === currentSong.lyrics.length - 1 || nextTime < currentSong.lyrics[idx + 1].timeSec)
          );
          if (matchIdx !== -1) {
            setCurrentLineIndex(matchIdx);
          }
        }
        return nextTime > currentSong.durationSeconds ? 0 : nextTime;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying, currentSong]);

  // Reset progress when song changes
  useEffect(() => {
    setProgressSec(0);
    setCurrentLineIndex(0);
  }, [currentSong?.id]);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEngine.setMuted(nextMuted);
  };

  if (!currentSong) return null;

  return (
    <>
      {/* Floating Bottom Bar Player */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-purple-100 shadow-xl px-4 py-2.5 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Song Info & Artwork */}
          <div className="flex items-center gap-3 min-w-0">
            <div
              onClick={() => setIsExpanded(true)}
              className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${currentSong.albumArtColor} flex items-center justify-center text-2xl shadow-md cursor-pointer hover:scale-105 transition-transform shrink-0 relative`}
            >
              <span>{currentSong.emoji}</span>
              {isPlaying && (
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-yellow-400 rounded-full animate-ping" />
              )}
            </div>

            <div className="min-w-0 cursor-pointer" onClick={() => setIsExpanded(true)}>
              <div className="flex items-center gap-2">
                <h4 className="font-fun font-bold text-gray-900 text-sm sm:text-base truncate">
                  {currentSong.title}
                </h4>
                {activeNotePitch && (
                  <span className="hidden sm:inline-block px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded animate-bounce">
                    {activeNotePitch} 🎵
                  </span>
                )}
              </div>
              <p className="text-xs text-purple-600 font-semibold truncate flex items-center gap-1.5">
                <span>{currentSong.artist}</span>
                <span className="text-gray-300">•</span>
                <span className="capitalize text-gray-500">{currentSong.subjectId}</span>
              </p>
            </div>

            {/* Favorite button */}
            <button
              onClick={() => onToggleFavorite(currentSong.id)}
              className={`p-2 rounded-full transition-transform hover:scale-110 ${
                isFavorite ? 'text-rose-500' : 'text-gray-400 hover:text-rose-400'
              }`}
              title={isFavorite ? 'Favorited' : 'Add to favorites'}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500' : ''}`} />
            </button>
          </div>

          {/* Karaoke Lyrics Preview (Desktop) */}
          <div
            onClick={() => setIsExpanded(true)}
            className="hidden md:flex flex-col items-center flex-1 max-w-md cursor-pointer px-4"
          >
            <div className="text-xs font-bold text-purple-700 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Sing-Along:
            </div>
            <p className="text-sm font-semibold text-gray-800 text-center italic bg-purple-50/80 px-4 py-1 rounded-full truncate w-full border border-purple-100">
              "{currentSong.lyrics[currentLineIndex]?.text || currentSong.description}"
            </p>
          </div>

          {/* Audio Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onPrevious}
              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition"
              title="Previous song"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={onPlayPause}
              className="w-11 h-11 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <button
              onClick={onNext}
              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition"
              title="Next song"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            <button
              onClick={toggleMute}
              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsExpanded(true)}
              className="p-2 text-purple-600 hover:bg-purple-50 rounded-full transition hidden sm:inline-block"
              title="Open full lyrics & player"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mini Progress Bar */}
        <div className="w-full bg-purple-100 h-1.5 rounded-full mt-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300"
            style={{
              width: `${Math.min(100, (progressSec / currentSong.durationSeconds) * 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Expanded Sing-Along Karaoke Full Modal */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-purple-900/90 via-indigo-950/95 to-slate-950 text-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-purple-500/30 overflow-hidden relative animate-float">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 flex items-center justify-between border-b border-purple-500/20">
              <div className="flex items-center gap-2 text-purple-300 text-sm font-bold">
                <Music className="w-4 h-4" />
                <span>MELODY MINDS KARAOKE & MUSIC LAB</span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 rounded-full hover:bg-white/10 text-purple-200 transition"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center text-center">
              {/* Album Art with dancing equalizer */}
              <div
                className={`w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-tr ${currentSong.albumArtColor} flex items-center justify-center text-6xl shadow-2xl relative mb-5 ring-4 ring-purple-400/30`}
              >
                <span>{currentSong.emoji}</span>

                {/* Dancing Equalizer Bars */}
                {isPlaying && (
                  <div className="absolute -bottom-3 flex items-end gap-1.5 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md">
                    <div className="w-1.5 bg-yellow-400 rounded-full animate-bounce h-5" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 bg-pink-400 rounded-full animate-bounce h-7" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 bg-cyan-400 rounded-full animate-bounce h-4" style={{ animationDelay: '300ms' }} />
                    <div className="w-1.5 bg-emerald-400 rounded-full animate-bounce h-6" style={{ animationDelay: '75ms' }} />
                  </div>
                )}
              </div>

              <h3 className="font-fun font-bold text-2xl sm:text-3xl text-white mb-1">
                {currentSong.title}
              </h3>
              <p className="text-purple-300 text-sm mb-6 font-semibold">
                {currentSong.artist} • {currentSong.tempoBpm} BPM • {currentSong.mood}
              </p>

              {/* Karaoke Sing-Along Lyrics Box */}
              <div className="w-full bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 mb-6">
                <div className="text-xs uppercase tracking-wider text-purple-300 font-bold mb-3 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300" /> Sing Along Karaoke Lyrics
                </div>

                <div className="space-y-3 max-h-48 overflow-y-auto px-2">
                  {currentSong.lyrics.map((line, idx) => {
                    const isCurrent = idx === currentLineIndex;
                    return (
                      <p
                        key={idx}
                        className={`text-base sm:text-lg font-bold transition-all duration-300 ${
                          isCurrent
                            ? 'text-yellow-300 scale-105 font-extrabold drop-shadow-[0_0_12px_rgba(253,224,71,0.6)]'
                            : 'text-purple-200/70'
                        }`}
                      >
                        {line.text}
                      </p>
                    );
                  })}
                </div>
              </div>

              {/* Scrubber & Time */}
              <div className="w-full space-y-1 mb-4">
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-400 via-pink-400 to-purple-400 h-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (progressSec / currentSong.durationSeconds) * 100)}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-purple-300 font-semibold px-1">
                  <span>0:{Math.floor(progressSec).toString().padStart(2, '0')}</span>
                  <span>0:{currentSong.durationSeconds.toString().padStart(2, '0')}</span>
                </div>
              </div>

              {/* Large Controls */}
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={() => onToggleFavorite(currentSong.id)}
                  className={`p-3 rounded-full hover:bg-white/10 transition ${
                    isFavorite ? 'text-rose-400' : 'text-purple-300'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isFavorite ? 'fill-rose-400' : ''}`} />
                </button>

                <button
                  onClick={onPrevious}
                  className="p-3 rounded-full hover:bg-white/10 text-white transition hover:scale-110"
                >
                  <SkipBack className="w-7 h-7" />
                </button>

                <button
                  onClick={onPlayPause}
                  className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-500 text-gray-950 flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition"
                >
                  {isPlaying ? <Pause className="w-8 h-8 fill-gray-950" /> : <Play className="w-8 h-8 ml-1 fill-gray-950" />}
                </button>

                <button
                  onClick={onNext}
                  className="p-3 rounded-full hover:bg-white/10 text-white transition hover:scale-110"
                >
                  <SkipForward className="w-7 h-7" />
                </button>

                <button
                  onClick={toggleMute}
                  className="p-3 rounded-full hover:bg-white/10 text-purple-300 transition"
                >
                  {isMuted ? <VolumeX className="w-6 h-6 text-rose-400" /> : <Volume2 className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
