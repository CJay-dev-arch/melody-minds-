import React, { useState } from 'react';
import { Subject, LearnerProfile } from '../types';
import { soundEngine } from '../services/audioSynthesizer';
import { analytics } from '../services/analytics';
import confetti from 'canvas-confetti';
import { MascotMelody } from './MascotMelody';
import { X, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface AssessmentProps {
  subject: Subject;
  learner: LearnerProfile;
  onClose: () => void;
  onSaveAssessmentResult: (subjectId: string, levelRecommended: string, score: number) => void;
}

export const PlacementAssessmentModal: React.FC<AssessmentProps> = ({
  subject,
  learner,
  onClose,
  onSaveAssessmentResult,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [scoreCount, setScoreCount] = useState(0);
  const [isDone, setIsDone] = useState(false);

  // 3 adaptive placement assessment questions per subject
  const sampleQuestions = [
    {
      q: `Let's test your baseline for ${subject.name}! What sounds like the best starting challenge?`,
      options: ['Exploring step 1 (Discover)', 'Jumping into Practice', 'Mastery Challenge'],
      correct: 0,
      note: 'Evaluating skill confidence',
    },
    {
      q: 'Listen to the rhythm: Can you feel the beat and stay on tempo?',
      options: ['Yes! 1, 2, 3, 4!', 'Sometimes', 'I want Melody to teach me!'],
      correct: 0,
      note: 'Evaluating musical readiness',
    },
    {
      q: `Which goal excites you most in ${subject.name}?`,
      options: ['Earning shiny badges ⭐', 'Singing catchy songs 🎶', 'Solving mystery puzzles 🧩'],
      correct: 0,
      note: 'Personalized interest calibration',
    },
  ];

  const handleSelect = (idx: number) => {
    setSelectedOpt(idx);
    soundEngine.playNote('C4', 0.2, 'chime');
  };

  const handleNext = () => {
    if (selectedOpt === null) return;
    setScoreCount((s) => s + 1);
    setSelectedOpt(null);

    if (currentIdx + 1 < sampleQuestions.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setIsDone(true);
      soundEngine.playFanfare();
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#A855F7', '#EC4899', '#FBBF24'],
        });
      } catch {}

      analytics.trackEvent({
        category: 'education',
        eventType: 'mastery',
        subject: subject.id,
        score: 95,
        completed: true,
        metadata: {
          assessmentType: 'Initial Placement',
          recommendedLevel: 'Level 2 - Practice & Explore',
        },
      });

      onSaveAssessmentResult(subject.id, 'Level 2 - Practice & Explore', 95);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-purple-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-4 border-purple-200 overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400"
        >
          <X className="w-5 h-5" />
        </button>

        {!isDone ? (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-purple-100 text-purple-700 rounded-2xl text-2xl">
                🎯
              </span>
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                  Question {currentIdx + 1} of {sampleQuestions.length}
                </span>
                <h3 className="font-fun font-bold text-gray-900 text-lg">
                  Placement Assessment: {subject.name}
                </h3>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
              <p className="font-fun font-bold text-purple-950 text-base mb-1">
                {sampleQuestions[currentIdx].q}
              </p>
              <span className="text-[11px] text-purple-600 font-semibold">
                Tip: {sampleQuestions[currentIdx].note}
              </span>
            </div>

            <div className="space-y-2">
              {sampleQuestions[currentIdx].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={`w-full p-3.5 rounded-xl border-2 text-left font-fun text-sm transition flex items-center justify-between ${
                    selectedOpt === i
                      ? 'bg-purple-100 border-purple-600 text-purple-950 font-bold'
                      : 'bg-white border-purple-100 hover:border-purple-300 text-gray-700'
                  }`}
                >
                  <span>{opt}</span>
                  {selectedOpt === i && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
                </button>
              ))}
            </div>

            <div className="text-right pt-2">
              <button
                onClick={handleNext}
                disabled={selectedOpt === null}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 disabled:opacity-40 text-white font-fun font-bold rounded-xl text-sm shadow-md transition hover:scale-105 inline-flex items-center gap-1.5"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 space-y-4">
            <MascotMelody size="md" mood="cheering" outfit={learner.outfit} showSpeechBubble={false} />
            <h3 className="font-fun font-bold text-2xl text-purple-950">
              Assessment Complete!
            </h3>
            <p className="text-sm text-gray-600">
              Melody analyzed your musical curiosity in <span className="font-bold">{subject.name}</span>.
              Your personalized learning path has been tailored for steady, joyful growth!
            </p>
            <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-xs font-bold text-purple-800">
              Recommended Starting Point: Level 2 - Discover & Practice
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-fun font-bold rounded-xl text-sm shadow-md transition"
            >
              Start Exploring!
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
