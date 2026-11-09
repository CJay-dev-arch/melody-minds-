import React, { useState } from 'react';
import { LearnerProfile, Subject, Goal } from '../types';
import {
  Shield,
  Users,
  Target,
  Settings,
  Sparkles,
  TrendingUp,
  Clock,
  Award,
  CheckCircle2,
  Plus,
  Volume2,
  Sliders,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

interface ParentDashboardProps {
  learners: LearnerProfile[];
  currentLearner: LearnerProfile;
  subjects: Subject[];
  onSelectLearner: (id: string) => void;
  onUpdateLearnerSettings: (updated: Partial<LearnerProfile>) => void;
  onAddCustomGoal: (goal: Goal) => void;
  onOpenAnalytics: () => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  learners,
  currentLearner,
  subjects,
  onSelectLearner,
  onUpdateLearnerSettings,
  onAddCustomGoal,
  onOpenAnalytics,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'insights' | 'goals' | 'settings'>('overview');
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState(3);
  const [newGoalUnit, setNewGoalUnit] = useState('lessons');

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;

    const goal: Goal = {
      id: 'g_custom_' + Date.now(),
      title: newGoalTitle.trim(),
      target: newGoalTarget,
      current: 0,
      unit: newGoalUnit,
      completed: false,
      isDaily: false,
      parentCreated: true,
    };
    onAddCustomGoal(goal);
    setNewGoalTitle('');
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-700 via-purple-700 to-slate-800 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-yellow-300">
              <Shield className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase font-extrabold tracking-wider text-purple-200">
              Parent & Educator Portal
            </span>
          </div>
          <h1 className="font-fun font-bold text-3xl sm:text-4xl">
            Parent & Teacher Dashboard
          </h1>
          <p className="text-purple-200 text-xs sm:text-sm max-w-xl">
            Monitor real skill development, create custom goals, configure accessibility preferences, and review learning time.
          </p>
        </div>

        {/* Learner Switcher Pill */}
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20">
          {learners.map((lr) => (
            <button
              key={lr.id}
              onClick={() => onSelectLearner(lr.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                lr.id === currentLearner.id
                  ? 'bg-white text-purple-900 shadow-sm'
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              <span>{lr.avatarEmoji}</span>
              <span>{lr.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-purple-200 bg-white rounded-2xl p-1 shadow-sm font-fun font-bold text-sm">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition ${
            activeTab === 'overview' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:text-purple-600'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> Learner Overview
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition ${
            activeTab === 'insights' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:text-purple-600'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" /> Educational Insights
        </button>
        <button
          onClick={() => setActiveTab('goals')}
          className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition ${
            activeTab === 'goals' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:text-purple-600'
          }`}
        >
          <Target className="w-4 h-4" /> Custom Goals ({currentLearner.goals.length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition ${
            activeTab === 'settings' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:text-purple-600'
          }`}
        >
          <Settings className="w-4 h-4" /> App Controls & Voice
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border-2 border-purple-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-gray-500 font-semibold block">Time Spent Learning</span>
                <span className="font-fun font-bold text-2xl text-gray-900">
                  {currentLearner.timeSpentMinutes} mins
                </span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border-2 border-purple-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-gray-500 font-semibold block">Stars Accumulated</span>
                <span className="font-fun font-bold text-2xl text-amber-700">
                  {currentLearner.stars} ⭐
                </span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border-2 border-purple-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-gray-500 font-semibold block">Lessons Completed</span>
                <span className="font-fun font-bold text-2xl text-emerald-700">
                  {currentLearner.completedLessonIds.length} Lessons
                </span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border-2 border-purple-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-700 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-gray-500 font-semibold block">Skills Mastered</span>
                <span className="font-fun font-bold text-2xl text-pink-700">
                  {currentLearner.masteredSkillIds.length} Skills
                </span>
              </div>
            </div>
          </div>

          {/* Subject Mastery Progress Bars */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-purple-100 shadow-sm space-y-4">
            <h3 className="font-fun font-bold text-xl text-gray-900">
              Curriculum Mastery by Subject
            </h3>

            <div className="space-y-4">
              {subjects.slice(0, 6).map((sub) => {
                const masteredCount = sub.skills.filter((sk) =>
                  currentLearner.masteredSkillIds.includes(sk.id)
                ).length;
                const percentage = Math.round((masteredCount / sub.skills.length) * 100);

                return (
                  <div key={sub.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-gray-800">{sub.name}</span>
                      <span className="text-purple-700">
                        {masteredCount}/{sub.skills.length} Milestones ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(10, percentage)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INSIGHTS */}
      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-emerald-50 rounded-3xl p-6 border-2 border-emerald-200 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-fun font-bold text-lg">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Key Strengths
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed">
              Based on rhythm consistency and quiz accuracy:
            </p>
            <ul className="space-y-2 text-xs font-semibold text-emerald-800">
              <li className="flex items-center gap-2">
                <span>🌟</span> High auditory rhythm retention in counting beats
              </li>
              <li className="flex items-center gap-2">
                <span>🌟</span> Excellent phonemic recognition in rhyming songs
              </li>
              <li className="flex items-center gap-2">
                <span>🌟</span> Consistently engages with empathy and kindness lessons
              </li>
            </ul>
          </div>

          <div className="bg-amber-50 rounded-3xl p-6 border-2 border-amber-200 space-y-3">
            <div className="flex items-center gap-2 text-amber-800 font-fun font-bold text-lg">
              <Sparkles className="w-5 h-5 text-amber-600" /> Recommended Reinforcement
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              Melody suggests reinforcing these areas with catchy rhymes:
            </p>
            <ul className="space-y-2 text-xs font-semibold text-amber-800">
              <li className="flex items-center gap-2">
                <span>🎯</span> Multi-step sequencing in STEM logic challenges
              </li>
              <li className="flex items-center gap-2">
                <span>🎯</span> Exploring geometric shapes and patterns with tempo
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOM GOALS */}
      {activeTab === 'goals' && (
        <div className="space-y-6">
          {/* Create Goal Form */}
          <div className="bg-white rounded-3xl p-6 border-2 border-purple-100 shadow-sm">
            <h3 className="font-fun font-bold text-lg text-gray-900 mb-3">
              Create a Custom Educational Goal
            </h3>
            <form onSubmit={handleCreateGoal} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  placeholder="e.g. Master skip counting by 2s"
                  className="w-full px-4 py-2.5 rounded-xl border border-purple-200 text-sm font-semibold focus:outline-none focus:border-purple-600"
                />
              </div>
              <div>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={newGoalTarget}
                  onChange={(e) => setNewGoalTarget(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-4 py-2.5 rounded-xl border border-purple-200 text-sm font-semibold focus:outline-none focus:border-purple-600"
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={!newGoalTitle.trim()}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-fun font-bold rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Goal
                </button>
              </div>
            </form>
          </div>

          {/* Goals List */}
          <div className="space-y-3">
            {currentLearner.goals.map((g) => (
              <div
                key={g.id}
                className="p-4 rounded-2xl bg-white border border-purple-100 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{g.completed ? '✅' : '🎯'}</span>
                  <div>
                    <h4 className="font-fun font-bold text-sm text-gray-900">{g.title}</h4>
                    <span className="text-[11px] text-gray-500 font-semibold">
                      {g.isDaily ? 'Daily Challenge' : 'Weekly Milestone'}{' '}
                      {g.parentCreated && '• Assigned by Parent'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-fun font-bold text-purple-700 text-sm">
                    {g.current} / {g.target} {g.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SETTINGS & CONTROLS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-purple-100 shadow-sm space-y-6">
          <h3 className="font-fun font-bold text-xl text-gray-900">
            Child-Safe Accessibility & Audio Preferences
          </h3>

          <div className="space-y-4 max-w-xl">
            {/* Audio Synthesis Toggle */}
            <div className="flex items-center justify-between p-4 bg-purple-50/60 rounded-2xl border border-purple-100">
              <div>
                <h4 className="font-fun font-bold text-sm text-gray-900">Sound Effects & Synthesizer</h4>
                <p className="text-xs text-gray-500">Play musical notes and feedback chimes</p>
              </div>
              <input
                type="checkbox"
                checked={currentLearner.soundEnabled}
                onChange={(e) => onUpdateLearnerSettings({ soundEnabled: e.target.checked })}
                className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
              />
            </div>

            {/* Voice Narration Toggle */}
            <div className="flex items-center justify-between p-4 bg-purple-50/60 rounded-2xl border border-purple-100">
              <div>
                <h4 className="font-fun font-bold text-sm text-gray-900">Voice Read-Aloud Narration</h4>
                <p className="text-xs text-gray-500">
                  Melody reads questions and concepts aloud for emerging readers
                </p>
              </div>
              <input
                type="checkbox"
                checked={currentLearner.narrationVoiceEnabled}
                onChange={(e) => onUpdateLearnerSettings({ narrationVoiceEnabled: e.target.checked })}
                className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
              />
            </div>

            {/* Difficulty Mode */}
            <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-2">
              <h4 className="font-fun font-bold text-sm text-gray-900">Adaptive Difficulty Mode</h4>
              <div className="flex gap-2">
                {(['easy', 'normal', 'challenge'] as const).map((dm) => (
                  <button
                    key={dm}
                    onClick={() => onUpdateLearnerSettings({ difficultyMode: dm })}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition ${
                      currentLearner.difficultyMode === dm
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-white text-gray-600 border border-purple-200 hover:bg-purple-100'
                    }`}
                  >
                    {dm}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
