import React, { useState } from 'react';
import { MiniGame, LearnerProfile } from '../types';
import { soundEngine } from '../services/audioSynthesizer';
import { analytics } from '../services/analytics';
import confetti from 'canvas-confetti';
import { MascotMelody } from './MascotMelody';
import { InteractivePiano } from './InteractivePiano';
import { X, Sparkles, HelpCircle, CheckCircle2, RotateCcw } from 'lucide-react';

interface GameModalProps {
  game: MiniGame;
  learner: LearnerProfile;
  onClose: () => void;
  onComplete: (gameId: string, starsEarned: number) => void;
}

export const MiniGameModal: React.FC<GameModalProps> = ({
  game,
  learner,
  onClose,
  onComplete,
}) => {
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [mascotHint, setMascotHint] = useState<string | null>(null);

  // Rhythm game state
  const [currentRhythmStep, setCurrentRhythmStep] = useState(0);
  const [learnerRhythmInput, setLearnerRhythmInput] = useState<string[]>([]);
  const [isDemoPlaying, setIsDemoPlaying] = useState(false);

  // Matching game state
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<{ id: string; type: 'item' | 'match' } | null>(null);

  // Sorting / Counting state
  const [selectedBasket, setSelectedBasket] = useState<number | null>(null);

  const triggerVictory = (stars = 25) => {
    setCompleted(true);
    soundEngine.playFanfare();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#A855F7', '#EC4899', '#FBBF24', '#38BDF8'],
      });
    } catch {}

    analytics.trackEvent({
      category: 'game',
      eventType: 'completion',
      gameId: game.id,
      subject: game.subjectId,
      completed: true,
      score: 100,
      hintsUsed,
      difficulty: game.difficulty,
    });

    onComplete(game.id, stars);
  };

  // --- RHYTHM ECHO LOGIC ---
  const handlePlayRhythmDemo = () => {
    if (isDemoPlaying) return;
    setIsDemoPlaying(true);
    setLearnerRhythmInput([]);
    const sequence = game.gameData.sequences[currentRhythmStep] || ['C4', 'E4'];

    sequence.forEach((note: string, idx: number) => {
      setTimeout(() => {
        soundEngine.playNote(note, 0.45, 'chime');
        if (idx === sequence.length - 1) {
          setIsDemoPlaying(false);
        }
      }, idx * 500);
    });
  };

  const handleRhythmPadClick = (note: string) => {
    if (isDemoPlaying || completed) return;
    soundEngine.playNote(note, 0.4, 'marimba');
    const targetSeq = game.gameData.sequences[currentRhythmStep] || ['C4', 'E4'];
    const nextInput = [...learnerRhythmInput, note];
    setLearnerRhythmInput(nextInput);

    // Check current step
    const currentIndex = nextInput.length - 1;
    if (nextInput[currentIndex] !== targetSeq[currentIndex]) {
      // Mistake
      soundEngine.playTryAgainSound();
      setMascotHint('Oops! Listen to the beat and try that step again!');
      setTimeout(() => setLearnerRhythmInput([]), 500);
      return;
    }

    // Finished sequence
    if (nextInput.length === targetSeq.length) {
      soundEngine.playCorrectSound();
      if (currentRhythmStep + 1 < game.gameData.sequences.length) {
        setMascotHint('Fantastic! Now try this longer rhythm pattern! 🎶');
        setCurrentRhythmStep((prev) => prev + 1);
        setLearnerRhythmInput([]);
      } else {
        triggerVictory(30);
      }
    }
  };

  // --- MATCHING GAME LOGIC ---
  const handleMatchSelect = (item: { id: string; type: 'item' | 'match'; value: string }) => {
    if (completed) return;
    soundEngine.playNote('C4', 0.2, 'chime');

    if (!selectedItem) {
      setSelectedItem({ id: item.id, type: item.type });
    } else {
      if (selectedItem.type !== item.type && selectedItem.id === item.id) {
        // Correct match!
        soundEngine.playCorrectSound();
        const next = [...matchedPairs, item.id];
        setMatchedPairs(next);
        setSelectedItem(null);
        if (next.length === game.gameData.pairs.length) {
          triggerVictory(25);
        }
      } else {
        // Mismatch
        soundEngine.playTryAgainSound();
        setMascotHint('Not quite a pair! Look closely at the clues. 🌟');
        setSelectedItem(null);
      }
    }
  };

  // --- SORTING / BASKET LOGIC ---
  const handleBasketClick = (val: number) => {
    setSelectedBasket(val);
    if (val === game.gameData.targetNumber) {
      soundEngine.playCorrectSound();
      triggerVictory(20);
    } else {
      soundEngine.playTryAgainSound();
      setMascotHint(`Count each star slowly! We are looking for ${game.gameData.targetNumber} stars! ⭐`);
    }
  };

  const handleHintRequest = () => {
    setHintsUsed((h) => h + 1);
    if (game.type === 'rhythm') {
      setMascotHint('Tap the Play Demo button to listen to the tempo notes first!');
    } else if (game.type === 'matching') {
      setMascotHint('Match the emoji friend to where they love to live or play!');
    } else {
      setMascotHint('Count out loud: 1, 2, 3, 4, 5!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-purple-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border-4 border-purple-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-100 via-pink-100 to-amber-100 flex items-center justify-between border-b border-purple-200">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-white rounded-2xl shadow-sm text-2xl">🎮</span>
            <div>
              <h3 className="font-fun font-bold text-gray-900 text-lg sm:text-xl">{game.title}</h3>
              <p className="text-xs text-purple-700 font-semibold">{game.instructions}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/80 text-gray-500 hover:text-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Mascot Helper Banner */}
          <div className="flex items-center gap-4 bg-purple-50 p-3.5 rounded-2xl border border-purple-100">
            <MascotMelody
              size="sm"
              mood={completed ? 'cheering' : 'happy'}
              outfit={learner.outfit}
              showSpeechBubble={false}
            />
            <div className="flex-1">
              <p className="text-xs font-bold text-purple-900">
                {mascotHint || `Let's play and learn through rhythm, ${learner.name}!`}
              </p>
            </div>
            <button
              onClick={handleHintRequest}
              className="px-3 py-1.5 bg-white text-purple-700 hover:bg-purple-100 rounded-xl text-xs font-bold border border-purple-200 shadow-sm flex items-center gap-1 transition"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-500" /> Hint
            </button>
          </div>

          {/* GAME TYPE: RHYTHM ECHO */}
          {game.type === 'rhythm' && (
            <div className="space-y-4 text-center">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-2xl">
                <p className="text-xs font-bold uppercase tracking-wider mb-1">
                  Pattern {currentRhythmStep + 1} of {game.gameData.sequences.length}
                </p>
                <div className="flex items-center justify-center gap-2 my-2">
                  {(game.gameData.sequences[currentRhythmStep] || []).map((note: string, i: number) => {
                    const isLearnerFilled = i < learnerRhythmInput.length;
                    return (
                      <div
                        key={i}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-fun font-bold text-sm transition-all ${
                          isLearnerFilled ? 'bg-yellow-300 text-purple-950 scale-105' : 'bg-white/20 text-white'
                        }`}
                      >
                        {isLearnerFilled ? '✓' : note}
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={handlePlayRhythmDemo}
                  disabled={isDemoPlaying || completed}
                  className="mt-2 px-5 py-2 bg-yellow-400 hover:bg-yellow-300 text-purple-950 font-fun font-bold rounded-xl shadow-md text-sm transition active:scale-95"
                >
                  {isDemoPlaying ? 'Melody is playing...' : '▶ Listen to Melody’s Beat'}
                </button>
              </div>

              {/* Musical Drum Pads */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {[
                  { note: 'C4', label: 'Do (C)', color: 'bg-rose-400 hover:bg-rose-500 border-rose-600' },
                  { note: 'E4', label: 'Mi (E)', color: 'bg-amber-400 hover:bg-amber-500 border-amber-600' },
                  { note: 'G4', label: 'Sol (G)', color: 'bg-teal-400 hover:bg-teal-500 border-teal-600' },
                  { note: 'C5', label: 'High C', color: 'bg-purple-400 hover:bg-purple-500 border-purple-600' },
                ].map((pad) => (
                  <button
                    key={pad.note}
                    onClick={() => handleRhythmPadClick(pad.note)}
                    disabled={isDemoPlaying || completed}
                    className={`h-24 rounded-2xl flex flex-col items-center justify-center text-white font-fun font-bold text-base shadow-md active:scale-95 border-b-4 transition ${pad.color}`}
                  >
                    <span className="text-2xl mb-1">🥁</span>
                    <span>{pad.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* GAME TYPE: MATCHING */}
          {game.type === 'matching' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-500 uppercase">Items</h4>
                {game.gameData.pairs.map((p: any) => {
                  const isMatched = matchedPairs.includes(p.id);
                  const isSelected = selectedItem?.id === p.id && selectedItem?.type === 'item';
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleMatchSelect({ id: p.id, type: 'item', value: p.label })}
                      disabled={isMatched}
                      className={`w-full p-4 rounded-2xl font-fun font-bold text-left transition border-2 flex items-center justify-between ${
                        isMatched
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800 opacity-60'
                          : isSelected
                          ? 'bg-purple-100 border-purple-500 text-purple-900 ring-2 ring-purple-300'
                          : 'bg-white border-purple-100 hover:border-purple-300 text-gray-800 shadow-sm'
                      }`}
                    >
                      <span>{p.label}</span>
                      {isMatched && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-500 uppercase">Matches</h4>
                {game.gameData.pairs.map((p: any) => {
                  const isMatched = matchedPairs.includes(p.id);
                  const isSelected = selectedItem?.id === p.id && selectedItem?.type === 'match';
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleMatchSelect({ id: p.id, type: 'match', value: p.match })}
                      disabled={isMatched}
                      className={`w-full p-4 rounded-2xl font-fun font-bold text-left transition border-2 flex items-center justify-between ${
                        isMatched
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800 opacity-60'
                          : isSelected
                          ? 'bg-purple-100 border-purple-500 text-purple-900 ring-2 ring-purple-300'
                          : 'bg-white border-purple-100 hover:border-purple-300 text-gray-800 shadow-sm'
                      }`}
                    >
                      <span>{p.match}</span>
                      {isMatched && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* GAME TYPE: COUNTING / SORTING */}
          {game.type === 'sorting' && (
            <div className="space-y-6 text-center">
              <div className="bg-amber-50 p-6 rounded-3xl border-2 border-amber-200">
                <p className="font-fun text-xl text-amber-900 mb-4">
                  Count the stars: ⭐ ⭐ ⭐ ⭐ ⭐
                </p>
                <div className="flex justify-center gap-2 text-3xl animate-bounce">
                  <span>⭐</span>
                  <span>⭐</span>
                  <span>⭐</span>
                  <span>⭐</span>
                  <span>⭐</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {game.gameData.options.map((opt: number) => (
                  <button
                    key={opt}
                    onClick={() => handleBasketClick(opt)}
                    className="p-5 bg-white border-2 border-purple-200 hover:border-purple-500 rounded-2xl shadow-sm hover:shadow-md transition text-center group"
                  >
                    <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🧺</div>
                    <span className="font-fun font-bold text-2xl text-purple-900">{opt} Stars</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* GAME TYPE: CREATIVE MELODY LAB */}
          {game.type === 'creative_lab' && (
            <div className="space-y-4">
              <InteractivePiano allowRecording={true} />
              <div className="text-center pt-2">
                <button
                  onClick={() => triggerVictory(35)}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-fun font-bold rounded-2xl shadow-md hover:scale-105 transition"
                >
                  🎉 Save My Original Tune & Collect Stars!
                </button>
              </div>
            </div>
          )}

          {/* Victory Overlay Screen */}
          {completed && (
            <div className="bg-gradient-to-r from-emerald-100 via-teal-100 to-green-100 p-6 rounded-3xl border-2 border-emerald-300 text-center animate-pulse-subtle">
              <div className="text-5xl mb-2">🌟</div>
              <h3 className="font-fun font-bold text-2xl text-emerald-900 mb-1">
                Melodic Mastery Achieved!
              </h3>
              <p className="text-emerald-700 text-sm font-semibold mb-4">
                You played with rhythm, solved the puzzle, and earned +25 Stars! ⭐
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-fun font-bold rounded-2xl shadow-md hover:scale-105 transition"
              >
                Back to Learning
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
