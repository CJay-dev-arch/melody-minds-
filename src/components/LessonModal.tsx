import React, { useState } from 'react';
import { Lesson, LearnerProfile } from '../types';
import { soundEngine } from '../services/audioSynthesizer';
import { analytics } from '../services/analytics';
import confetti from 'canvas-confetti';
import { MascotMelody } from './MascotMelody';
import {
  X,
  Volume2,
  Sparkles,
  Play,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

interface LessonModalProps {
  lesson: Lesson;
  learner: LearnerProfile;
  onClose: () => void;
  onCompleteLesson: (lessonId: string, stars: number) => void;
  onPlaySong: (song: any) => void;
}

export const LessonModal: React.FC<LessonModalProps> = ({
  lesson,
  learner,
  onClose,
  onCompleteLesson,
  onPlaySong,
}) => {
  const [currentStep, setCurrentStep] = useState<'discover' | 'learn_song' | 'quiz' | 'victory'>('discover');
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [hintsRevealed, setHintsRevealed] = useState(false);
  const [attempts, setAttempts] = useState(1);

  const currentQuestion = lesson.questions[quizIndex];

  const handleReadAloud = (text: string) => {
    soundEngine.speakNarration(text, learner.narrationVoiceEnabled);
  };

  const handleOptionSelect = (index: number) => {
    if (showExplanation) return;
    setSelectedOption(index);
    setShowExplanation(true);

    const isCorrect = index === currentQuestion.correctIndex;
    if (isCorrect) {
      soundEngine.playCorrectSound();
    } else {
      soundEngine.playTryAgainSound();
      setAttempts((a) => a + 1);
    }

    analytics.trackEvent({
      category: 'education',
      eventType: 'quiz_response',
      subject: lesson.subjectId,
      lessonId: lesson.id,
      score: isCorrect ? 100 : 0,
      attempts,
      hintsUsed: hintsRevealed ? 1 : 0,
    });
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    setHintsRevealed(false);

    if (quizIndex + 1 < lesson.questions.length) {
      setQuizIndex((prev) => prev + 1);
    } else {
      // Completed all questions!
      setCurrentStep('victory');
      soundEngine.playFanfare();
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#A855F7', '#EC4899', '#FBBF24', '#38BDF8'],
        });
      } catch {}

      analytics.trackEvent({
        category: 'education',
        eventType: 'lesson_completed',
        subject: lesson.subjectId,
        lessonId: lesson.id,
        completed: true,
        durationSeconds: 120,
      });

      onCompleteLesson(lesson.id, lesson.starsReward);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-purple-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border-4 border-purple-200 overflow-hidden">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-100 via-pink-100 to-amber-100 flex items-center justify-between border-b border-purple-200">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-white rounded-2xl shadow-sm text-2xl">
              {lesson.song.emoji}
            </span>
            <div>
              <span className="px-2.5 py-0.5 bg-purple-200/80 text-purple-800 text-xs font-bold rounded-full uppercase">
                {lesson.stage} • {lesson.ageRecommendation}
              </span>
              <h3 className="font-fun font-bold text-gray-900 text-lg sm:text-xl">{lesson.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/80 text-gray-500 hover:text-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progression Steps Tabs */}
        <div className="flex items-center justify-around bg-purple-50/60 p-2 border-b border-purple-100 text-xs font-bold">
          {[
            { id: 'discover', label: '1. Discover' },
            { id: 'learn_song', label: '2. Sing & Learn' },
            { id: 'quiz', label: '3. Practice Beat' },
            { id: 'victory', label: '4. Master' },
          ].map((tab) => (
            <div
              key={tab.id}
              className={`px-3 py-1 rounded-xl transition ${
                currentStep === tab.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-purple-700/60'
              }`}
            >
              {tab.label}
            </div>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: DISCOVER */}
          {currentStep === 'discover' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-5 bg-purple-50 p-5 rounded-3xl border border-purple-100">
                <MascotMelody
                  size="md"
                  mood="cheering"
                  outfit={learner.outfit}
                  speechText={`Welcome to ${lesson.title}! Let's make this concept dance!`}
                  allowVoiceNarration={learner.narrationVoiceEnabled}
                />
                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-fun font-bold text-purple-950 text-xl">The Big Idea</h4>
                    <button
                      onClick={() => handleReadAloud(lesson.conceptIntro)}
                      className="p-1.5 hover:bg-purple-200 text-purple-700 rounded-xl transition"
                      title="Read aloud"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{lesson.conceptIntro}</p>

                  <div className="mt-3 p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-2 text-xs text-amber-900 font-semibold">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{lesson.educationalTip}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <button
                  onClick={() => setCurrentStep('learn_song')}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-fun font-bold rounded-2xl shadow-md hover:scale-105 transition inline-flex items-center gap-2"
                >
                  Next: Hear the Song! <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: LEARN WITH SONG */}
          {currentStep === 'learn_song' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-tr from-purple-100 via-pink-50 to-amber-50 p-6 rounded-3xl border-2 border-purple-200 text-center">
                <div className="text-5xl mb-2">{lesson.song.emoji}</div>
                <h4 className="font-fun font-bold text-2xl text-purple-950 mb-1">
                  {lesson.song.title}
                </h4>
                <p className="text-xs text-purple-700 font-semibold mb-4">
                  By {lesson.song.artist} • {lesson.song.mood}
                </p>

                <div className="max-w-md mx-auto bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-inner border border-purple-100 space-y-2 mb-6">
                  {lesson.song.lyrics.map((l, i) => (
                    <p key={i} className="text-sm sm:text-base font-bold text-purple-900">
                      {l.text}
                    </p>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      onPlaySong(lesson.song);
                    }}
                    className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-purple-950 font-fun font-bold rounded-2xl shadow-md flex items-center gap-2 transition hover:scale-105"
                  >
                    <Play className="w-5 h-5 fill-purple-950" /> Play Song in Audio Player
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep('discover')}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl text-sm transition"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep('quiz')}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-fun font-bold rounded-2xl shadow-md hover:scale-105 transition inline-flex items-center gap-2"
                >
                  Let's Practice! <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PRACTICE QUIZ */}
          {currentStep === 'quiz' && currentQuestion && (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs font-bold text-purple-700 bg-purple-50 px-4 py-2 rounded-xl">
                <span>
                  Question {quizIndex + 1} of {lesson.questions.length}
                </span>
                <button
                  onClick={() => setHintsRevealed(true)}
                  className="flex items-center gap-1 text-amber-600 hover:text-amber-700"
                >
                  <HelpCircle className="w-4 h-4" /> Melody's Hint
                </button>
              </div>

              <div className="p-4 bg-white border-2 border-purple-100 rounded-3xl shadow-sm">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <h4 className="font-fun font-bold text-lg text-gray-900 leading-snug">
                    {currentQuestion.prompt}
                  </h4>
                  <button
                    onClick={() => handleReadAloud(currentQuestion.prompt)}
                    className="p-1.5 hover:bg-purple-100 text-purple-600 rounded-xl shrink-0"
                    title="Read question"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {hintsRevealed && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-semibold text-amber-900 flex items-start gap-2 animate-float">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{currentQuestion.hint}</span>
                  </div>
                )}

                {/* Option Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentQuestion.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQuestion.correctIndex;

                    let btnStyle = 'bg-white border-purple-200 hover:border-purple-400 text-gray-800';
                    if (showExplanation) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                      } else if (isSelected) {
                        btnStyle = 'bg-rose-50 border-rose-400 text-rose-800';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionSelect(idx)}
                        disabled={showExplanation && isCorrect}
                        className={`p-4 rounded-2xl border-2 text-left font-fun text-sm sm:text-base transition shadow-sm flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {showExplanation && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {showExplanation && (
                  <div className="mt-4 p-4 rounded-2xl bg-purple-50 border border-purple-200 text-xs sm:text-sm text-purple-950 font-semibold space-y-2 animate-float">
                    <p>{currentQuestion.explanation}</p>
                    {selectedOption === currentQuestion.correctIndex ? (
                      <div className="text-right">
                        <button
                          onClick={handleNextQuestion}
                          className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-fun font-bold rounded-xl shadow-sm text-xs inline-flex items-center gap-1.5"
                        >
                          Continue <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-right">
                        <button
                          onClick={() => {
                            setSelectedOption(null);
                            setShowExplanation(false);
                          }}
                          className="px-4 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold rounded-xl text-xs inline-flex items-center gap-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Try Again
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: VICTORY & REWARDS */}
          {currentStep === 'victory' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-4xl shadow-inner animate-bounce">
                ⭐
              </div>
              <h3 className="font-fun font-bold text-3xl text-purple-950">
                Lesson Mastered!
              </h3>
              <p className="text-gray-600 text-sm max-w-md mx-auto">
                Amazing work, {learner.name}! You explored the music, answered the challenge, and earned{' '}
                <span className="font-bold text-purple-700">+{lesson.starsReward} Stars</span>!
              </p>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={onClose}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-fun font-bold rounded-2xl shadow-lg hover:scale-105 transition"
                >
                  Collect Stars & Return Home
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
