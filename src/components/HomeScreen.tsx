import React from 'react';
import { LearnerProfile, Subject, Song, MiniGame } from '../types';
import { MascotMelody } from './MascotMelody';
import { InteractivePiano } from './InteractivePiano';
import { FireNoteStreakIndicator, FireMusicalNoteIcon } from './FireNoteStreakIndicator';
import {
  Play,
  Sparkles,
  Flame,
  Award,
  ArrowRight,
  Target,
  CheckCircle2,
  BookOpen,
  Music,
  Compass,
  Cpu,
  Smile,
  Calculator,
} from 'lucide-react';

interface HomeScreenProps {
  learner: LearnerProfile;
  subjects: Subject[];
  songs: Song[];
  miniGames: MiniGame[];
  onOpenLesson: (lesson: any) => void;
  onOpenGame: (game: any) => void;
  onPlaySong: (song: Song) => void;
  onNavigate: (view: string) => void;
  onSelectSubject: (subjectId: string) => void;
  onOpenAICompanion: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  learner,
  subjects,
  songs,
  miniGames,
  onOpenLesson,
  onOpenGame,
  onPlaySong,
  onNavigate,
  onSelectSubject,
  onOpenAICompanion,
}) => {
  const songOfTheDay = songs[0] || null;
  const continueLesson = subjects[0]?.lessons[0] || null;

  // Icon map
  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator': return Calculator;
      case 'BookOpen': return BookOpen;
      case 'Music': return Music;
      case 'Compass': return Compass;
      case 'Cpu': return Cpu;
      case 'Smile': return Smile;
      default: return Sparkles;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Welcome Banner with Mascot Melody */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 text-white p-6 sm:p-8 shadow-xl">
        {/* Decorative background note shapes */}
        <div className="absolute top-2 right-12 text-6xl opacity-10 select-none animate-pulse">🎵</div>
        <div className="absolute bottom-2 left-1/3 text-8xl opacity-10 select-none animate-float">🎶</div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-yellow-300">
              <Sparkles className="w-3.5 h-3.5" /> Where Little Minds Learn Through Music!
            </div>

            <h1 className="font-fun font-bold text-3xl sm:text-4xl lg:text-5xl drop-shadow-md leading-tight">
              Ready to sing and learn, {learner.name}? ✨
            </h1>

            <p className="text-purple-100 text-sm sm:text-base leading-relaxed">
              Every melody unlocks a new adventure! Today's beat is all about exploring rhythm, numbers, and curiosity.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              {continueLesson && (
                <button
                  onClick={() => onOpenLesson(continueLesson)}
                  className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-purple-950 font-fun font-bold rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition flex items-center gap-2"
                >
                  <Play className="w-5 h-5 fill-purple-950" /> Continue Learning
                </button>
              )}
              <button
                onClick={onOpenAICompanion}
                className="px-5 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-fun font-bold rounded-2xl border border-white/30 transition flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" /> Ask Melody AI
              </button>
            </div>
          </div>

          {/* Interactive Mascot with Speech */}
          <div className="shrink-0 flex flex-col items-center">
            <MascotMelody
              size="lg"
              mood="dancing"
              outfit={learner.outfit}
              speechText={`Hi ${learner.name}! Tap me anytime to hear my cheerful note! 🎵`}
              allowVoiceNarration={learner.narrationVoiceEnabled}
              onMascotClick={onOpenAICompanion}
            />
          </div>
        </div>
      </section>

      {/* Visual Learning Streak Indicator with Fire Musical Note Icon */}
      <section>
        <FireNoteStreakIndicator
          streakDays={learner.streakDays}
          learnerName={learner.name}
          onExploreToday={continueLesson ? () => onOpenLesson(continueLesson) : undefined}
        />
      </section>

      {/* Featured Song of the Day & Daily Challenge Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Song of the Day */}
        {songOfTheDay && (
          <div className="bg-white rounded-3xl p-6 border-2 border-purple-100 shadow-sm flex flex-col justify-between relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-pink-100 text-pink-700 font-fun font-bold text-xs rounded-full uppercase flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5" /> Featured Song of the Day
              </span>
              <span className="text-xs font-bold text-purple-600 capitalize">
                {songOfTheDay.subjectId} Beat
              </span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div
                className={`w-20 h-20 rounded-2xl bg-gradient-to-tr ${songOfTheDay.albumArtColor} flex items-center justify-center text-4xl shadow-md group-hover:scale-105 transition-transform shrink-0`}
              >
                {songOfTheDay.emoji}
              </div>
              <div className="min-w-0">
                <h3 className="font-fun font-bold text-xl text-gray-900 truncate">
                  {songOfTheDay.title}
                </h3>
                <p className="text-xs text-gray-500 font-semibold mb-1">
                  By {songOfTheDay.artist} • {songOfTheDay.tempoBpm} BPM
                </p>
                <p className="text-xs text-purple-700 italic line-clamp-2">
                  "{songOfTheDay.description}"
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-purple-50">
              <span className="text-xs font-bold text-gray-500">
                {songOfTheDay.durationSeconds}s Audio Synthesis
              </span>
              <button
                onClick={() => onPlaySong(songOfTheDay)}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-fun font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md hover:scale-105 transition"
              >
                <Play className="w-4 h-4 fill-white" /> Play & Sing Along
              </button>
            </div>
          </div>
        )}

        {/* Daily Learning Challenge & Goals */}
        <div className="bg-white rounded-3xl p-6 border-2 border-purple-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="px-3 py-1 bg-amber-100 text-amber-800 font-fun font-bold text-xs rounded-full uppercase flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-amber-600" /> Daily Goals & Milestones
            </span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl text-xs font-bold text-orange-800 shadow-sm">
              <FireMusicalNoteIcon size="sm" />
              <span>{learner.streakDays} Day Streak!</span>
            </div>
          </div>

          <div className="space-y-2.5 mb-4">
            {learner.goals.slice(0, 3).map((goal) => (
              <div
                key={goal.id}
                className="p-3 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      goal.completed ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span
                    className={`font-semibold truncate ${
                      goal.completed ? 'line-through text-gray-400' : 'text-gray-800'
                    }`}
                  >
                    {goal.title}
                  </span>
                </div>
                <span className="font-bold text-purple-700 shrink-0">
                  {goal.current}/{goal.target} {goal.unit}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-purple-50">
            <span className="text-xs font-bold text-purple-700">Earn +50 Stars on completion!</span>
            <button
              onClick={() => onNavigate('rewards')}
              className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1"
            >
              View All Goals <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Six Featured Learning Categories */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-fun font-bold text-2xl text-gray-900">
              Explore Core Subjects
            </h2>
            <p className="text-xs text-gray-500 font-semibold">
              Tap any category to dive into interactive musical lessons & skill trees
            </p>
          </div>
          <button
            onClick={() => onNavigate('learn')}
            className="text-sm font-fun font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1"
          >
            All 11 Subjects <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {subjects.slice(0, 6).map((sub) => {
            const Icon = getSubjectIcon(sub.icon);
            return (
              <div
                key={sub.id}
                onClick={() => onSelectSubject(sub.id)}
                className={`p-4 rounded-3xl bg-gradient-to-b ${sub.colorGradient} border-2 ${sub.borderColor} cursor-pointer hover:-translate-y-1 hover:shadow-md transition text-center flex flex-col items-center justify-between h-44`}
              >
                <div className="w-12 h-12 rounded-2xl bg-white/90 shadow-sm flex items-center justify-center text-xl mb-2">
                  <Icon className={`w-6 h-6 ${sub.textColor}`} />
                </div>
                <div>
                  <h3 className={`font-fun font-bold text-sm ${sub.textColor} leading-tight mb-1`}>
                    {sub.name}
                  </h3>
                  <p className="text-[10px] text-gray-600 line-clamp-2 leading-snug">
                    {sub.tagline}
                  </p>
                </div>
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${sub.badgeBg}`}>
                  {sub.lessons.length} Tunes
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Musical Playground Widget */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-fun font-bold text-2xl text-gray-900">
              Interactive Melody Playground
            </h2>
            <p className="text-xs text-gray-500 font-semibold">
              Touch the xylophone keys to hear notes or play back your recorded melody
            </p>
          </div>
          <button
            onClick={() => onNavigate('music')}
            className="text-sm font-fun font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1"
          >
            Open Full Music Lab <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <InteractivePiano allowRecording={true} />
      </section>

      {/* Quick Play Mini-Games Bar */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-fun font-bold text-2xl text-gray-900">
              Quick Rhythm & Puzzle Games
            </h2>
            <p className="text-xs text-gray-500 font-semibold">
              Fun musical challenges adapted to your learning level
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {miniGames.slice(0, 3).map((game) => (
            <div
              key={game.id}
              onClick={() => onOpenGame(game)}
              className="bg-white p-5 rounded-3xl border-2 border-purple-100 hover:border-purple-300 shadow-sm hover:shadow-md transition cursor-pointer flex items-center gap-4 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center text-3xl shadow-inner shrink-0 transition">
                {game.type === 'rhythm' ? '🥁' : game.type === 'matching' ? '🧩' : '🎹'}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 block mb-0.5">
                  {game.type} • {game.difficulty}
                </span>
                <h3 className="font-fun font-bold text-gray-900 text-sm truncate group-hover:text-purple-700 transition">
                  {game.title}
                </h3>
                <p className="text-xs text-gray-500 truncate">{game.instructions}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
