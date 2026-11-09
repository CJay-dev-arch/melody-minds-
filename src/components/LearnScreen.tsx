import React, { useState } from 'react';
import { Subject, Lesson, LearnerProfile } from '../types';
import {
  BookOpen,
  Calculator,
  Compass,
  Cpu,
  Music,
  Smile,
  Sparkles,
  Award,
  HeartHandshake,
  Globe,
  PenTool,
  CheckCircle2,
  Lock,
  Play,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface LearnScreenProps {
  subjects: Subject[];
  selectedSubjectId: string | null;
  onSelectSubject: (id: string | null) => void;
  onOpenLesson: (lesson: Lesson) => void;
  onOpenAssessment: (subjectId: string) => void;
  learner: LearnerProfile;
}

export const LearnScreen: React.FC<LearnScreenProps> = ({
  subjects,
  selectedSubjectId,
  onSelectSubject,
  onOpenLesson,
  onOpenAssessment,
  learner,
}) => {
  const [filterStage, setFilterStage] = useState<string>('all');

  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId) || null;

  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator': return Calculator;
      case 'BookOpen': return BookOpen;
      case 'PenTool': return PenTool;
      case 'Compass': return Compass;
      case 'Cpu': return Cpu;
      case 'Music': return Music;
      case 'Sparkles': return Sparkles;
      case 'HeartHandshake': return HeartHandshake;
      case 'Smile': return Smile;
      case 'Globe': return Globe;
      case 'Award': return Award;
      default: return BookOpen;
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* If a subject is selected, show its deep learning environment & skill tree */}
      {selectedSubject ? (
        <div className="space-y-8 animate-float">
          {/* Subject Header Banner */}
          <div
            className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-r ${selectedSubject.colorGradient} border-2 ${selectedSubject.borderColor} shadow-sm`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center text-3xl">
                  {React.createElement(getSubjectIcon(selectedSubject.icon), {
                    className: `w-8 h-8 ${selectedSubject.textColor}`,
                  })}
                </div>
                <div>
                  <button
                    onClick={() => onSelectSubject(null)}
                    className="text-xs font-bold text-gray-500 hover:text-gray-800 mb-1 flex items-center gap-1"
                  >
                    ← All 11 Subjects
                  </button>
                  <h1 className={`font-fun font-bold text-3xl sm:text-4xl ${selectedSubject.textColor}`}>
                    {selectedSubject.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-700 font-semibold max-w-xl">
                    {selectedSubject.description}
                  </p>
                </div>
              </div>

              {/* Placement Assessment Button */}
              <button
                onClick={() => onOpenAssessment(selectedSubject.id)}
                className="px-5 py-2.5 bg-white hover:bg-purple-50 text-purple-800 font-fun font-bold rounded-2xl shadow-sm border border-purple-200 text-xs sm:text-sm flex items-center gap-2 transition hover:scale-105 shrink-0"
              >
                <Sparkles className="w-4 h-4 text-amber-500" /> Placement Assessment
              </button>
            </div>
          </div>

          {/* Interactive Skill Tree Progression Map */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-purple-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-fun font-bold text-2xl text-gray-900">
                  Educational Skill Tree
                </h2>
                <p className="text-xs text-gray-500 font-semibold">
                  Progress through Discover → Learn → Practice → Demonstrate → Master → Expand
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
              {selectedSubject.skills.map((skill, index) => {
                const isMastered = learner.masteredSkillIds.includes(skill.id) || skill.status === 'mastered';
                const isUnlocked = skill.status !== 'locked';

                return (
                  <div
                    key={skill.id}
                    className={`p-4 rounded-2xl border-2 transition relative flex flex-col justify-between ${
                      isMastered
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                        : isUnlocked
                        ? 'bg-purple-50/70 border-purple-200 text-purple-950 hover:border-purple-400'
                        : 'bg-gray-50 border-gray-200 text-gray-400 opacity-70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{skill.icon}</span>
                      {isMastered ? (
                        <span className="px-2 py-0.5 bg-emerald-200 text-emerald-800 text-[10px] font-extrabold rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Mastered
                        </span>
                      ) : isUnlocked ? (
                        <span className="px-2 py-0.5 bg-purple-200 text-purple-800 text-[10px] font-extrabold rounded-full">
                          {skill.stage}
                        </span>
                      ) : (
                        <Lock className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-fun font-bold text-sm leading-snug mb-1">{skill.title}</h4>
                      <p className="text-[11px] text-gray-600 line-clamp-2">{skill.description}</p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-purple-100/60 text-[10px] font-bold text-purple-700">
                      Step {index + 1} of {selectedSubject.skills.length}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lessons List in Subject */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-purple-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-fun font-bold text-2xl text-gray-900">
                  Interactive Musical Lessons
                </h2>
                <p className="text-xs text-gray-500 font-semibold">
                  Sing, practice, and earn stars for completing interactive learning journeys
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedSubject.lessons.map((les) => {
                const isCompleted = learner.completedLessonIds.includes(les.id);
                return (
                  <div
                    key={les.id}
                    className={`p-5 rounded-3xl border-2 transition shadow-sm hover:shadow-md flex flex-col justify-between ${
                      isCompleted ? 'bg-purple-50/60 border-purple-200' : 'bg-white border-purple-100 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-200 to-pink-200 flex items-center justify-center text-2xl shrink-0">
                          {les.song.emoji}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                              {les.stage}
                            </span>
                            <span className="text-xs font-bold text-gray-400">{les.ageRecommendation}</span>
                          </div>
                          <h3 className="font-fun font-bold text-base text-gray-900 leading-snug">
                            {les.title}
                          </h3>
                        </div>
                      </div>

                      {isCompleted && (
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-1 shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Done
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-600 mb-4 line-clamp-2">{les.shortDesc}</p>

                    <div className="flex items-center justify-between pt-3 border-t border-purple-100">
                      <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                        ⭐ +{les.starsReward} Stars
                      </span>
                      <button
                        onClick={() => onOpenLesson(les)}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-fun font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition hover:scale-105"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        {isCompleted ? 'Play Again' : 'Start Lesson'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Full 11 Subjects Catalog Browser */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-fun font-bold text-3xl sm:text-4xl text-gray-900">
                11 Core Educational Subjects
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-semibold">
                Explore comprehensive curriculum with dedicated musical environments
              </p>
            </div>

            {/* Stage filter pills */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-purple-100 text-xs font-bold text-purple-800 shadow-sm overflow-x-auto">
              <span className="px-2 text-gray-400 flex items-center gap-1 text-[11px]">
                <Filter className="w-3 h-3" /> Filter:
              </span>
              {['all', 'Discover', 'Learn', 'Practice'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStage(st)}
                  className={`px-3 py-1.5 rounded-xl capitalize transition ${
                    filterStage === st
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'hover:bg-purple-50 text-gray-600'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {subjects.map((sub) => {
              const Icon = getSubjectIcon(sub.icon);
              return (
                <div
                  key={sub.id}
                  onClick={() => onSelectSubject(sub.id)}
                  className={`p-6 rounded-3xl bg-gradient-to-br ${sub.colorGradient} border-2 ${sub.borderColor} shadow-sm hover:shadow-lg transition cursor-pointer hover:-translate-y-1 flex flex-col justify-between h-64 group`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-14 h-14 rounded-2xl bg-white/90 shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Icon className={`w-7 h-7 ${sub.textColor}`} />
                      </div>
                      <span className={`text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full ${sub.badgeBg}`}>
                        {sub.lessons.length} Musical Lessons
                      </span>
                    </div>

                    <h3 className={`font-fun font-bold text-xl ${sub.textColor} mb-1`}>
                      {sub.name}
                    </h3>
                    <p className="text-xs text-gray-700 font-bold mb-2 leading-tight">
                      "{sub.tagline}"
                    </p>
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {sub.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-purple-200/50">
                    <span className="text-xs font-bold text-purple-700">
                      {sub.skills.length} Milestones in Tree
                    </span>
                    <span className="font-fun font-bold text-xs text-purple-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Open Subject <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
