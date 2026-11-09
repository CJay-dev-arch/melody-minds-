/**
 * MELODY MINDS — Where Little Minds Learn Through Music!
 * Main Application Component
 */

import React, { useState, useEffect } from 'react';
import { LearnerProfile, Subject, Song, MiniGame, Lesson, Goal, MascotOutfit } from './types';
import { SUBJECTS, INITIAL_SONGS, MINI_GAMES, BADGES } from './data/curriculumData';
import { DEFAULT_PROFILES } from './data/initialProfiles';
import { analytics } from './services/analytics';
import { soundEngine } from './services/audioSynthesizer';

// Components
import { Navbar } from './components/Navbar';
import { HomeScreen } from './components/HomeScreen';
import { LearnScreen } from './components/LearnScreen';
import { MusicLibraryScreen } from './components/MusicLibraryScreen';
import { RewardsScreen } from './components/RewardsScreen';
import { ParentDashboard } from './components/ParentDashboard';
import { AdminAnalyticsDashboard } from './components/AdminAnalyticsDashboard';
import { MusicPlayer } from './components/MusicPlayer';
import { LessonModal } from './components/LessonModal';
import { MiniGameModal } from './components/MiniGameModal';
import { PlacementAssessmentModal } from './components/PlacementAssessmentModal';
import { ParentGateModal } from './components/ParentGateModal';
import { AICompanionModal } from './components/AICompanionModal';
import { NewProfileModal } from './components/NewProfileModal';

export default function App() {
  // --- Persistent State ---
  const [learners, setLearners] = useState<LearnerProfile[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('melody_minds_profiles_v2');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    return DEFAULT_PROFILES;
  });

  const [currentLearnerId, setCurrentLearnerId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('melody_minds_active_profile_id');
      if (stored) return stored;
    }
    return DEFAULT_PROFILES[0].id;
  });

  // Current active learner
  const currentLearner =
    learners.find((l) => l.id === currentLearnerId) || learners[0] || DEFAULT_PROFILES[0];

  // Save to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('melody_minds_profiles_v2', JSON.stringify(learners));
      localStorage.setItem('melody_minds_active_profile_id', currentLearnerId);
    }
  }, [learners, currentLearnerId]);

  // --- Navigation & View State ---
  const [currentView, setCurrentView] = useState<
    'home' | 'learn' | 'music' | 'rewards' | 'parent_dashboard' | 'admin_analytics'
  >('home');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [isDetailedMode, setIsDetailedMode] = useState(false);

  // --- Music Player State ---
  const [currentSong, setCurrentSong] = useState<Song | null>(INITIAL_SONGS[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  // --- Modals State ---
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeGame, setActiveGame] = useState<MiniGame | null>(null);
  const [assessmentSubject, setAssessmentSubject] = useState<Subject | null>(null);
  const [parentGateTarget, setParentGateTarget] = useState<'parent_dashboard' | 'admin_analytics' | null>(null);
  const [isAICompanionOpen, setIsAICompanionOpen] = useState(false);
  const [isNewProfileOpen, setIsNewProfileOpen] = useState(false);

  // Track page views in anonymous telemetry
  useEffect(() => {
    analytics.trackEvent({
      category: 'platform',
      eventType: 'page_view',
      metadata: { view: currentView, subject: selectedSubjectId },
    });
  }, [currentView, selectedSubjectId]);

  // Audio mute sync
  useEffect(() => {
    soundEngine.setMuted(!currentLearner.soundEnabled);
  }, [currentLearner.soundEnabled]);

  // --- Handlers ---
  const handleSwitchLearner = (id: string) => {
    setCurrentLearnerId(id);
    analytics.trackEvent({
      category: 'platform',
      eventType: 'profile_switch',
      metadata: { profileId: id },
    });
  };

  const handleAddNewLearner = (newProf: LearnerProfile) => {
    setLearners((prev) => [...prev, newProf]);
    setCurrentLearnerId(newProf.id);
  };

  const handleUpdateLearnerSettings = (updated: Partial<LearnerProfile>) => {
    setLearners((prev) =>
      prev.map((lr) => (lr.id === currentLearner.id ? { ...lr, ...updated } : lr))
    );
  };

  const handleUpdateOutfit = (newOutfit: MascotOutfit) => {
    handleUpdateLearnerSettings({ outfit: newOutfit });
  };

  const handleUnlockItem = (itemId: string, cost: number) => {
    setLearners((prev) =>
      prev.map((lr) => {
        if (lr.id === currentLearner.id) {
          return {
            ...lr,
            stars: Math.max(0, lr.stars - cost),
            unlockedItems: [...lr.unlockedItems, itemId],
          };
        }
        return lr;
      })
    );
  };

  const handleAddCustomGoal = (goal: Goal) => {
    setLearners((prev) =>
      prev.map((lr) => {
        if (lr.id === currentLearner.id) {
          return {
            ...lr,
            goals: [...lr.goals, goal],
          };
        }
        return lr;
      })
    );
  };

  const handleCompleteLesson = (lessonId: string, stars: number) => {
    setLearners((prev) =>
      prev.map((lr) => {
        if (lr.id === currentLearner.id) {
          const completed = lr.completedLessonIds.includes(lessonId)
            ? lr.completedLessonIds
            : [...lr.completedLessonIds, lessonId];
          return {
            ...lr,
            stars: lr.stars + stars,
            completedLessonIds: completed,
            timeSpentMinutes: lr.timeSpentMinutes + 5,
          };
        }
        return lr;
      })
    );
  };

  const handleCompleteGame = (gameId: string, stars: number) => {
    setLearners((prev) =>
      prev.map((lr) => {
        if (lr.id === currentLearner.id) {
          const completed = lr.completedGameIds.includes(gameId)
            ? lr.completedGameIds
            : [...lr.completedGameIds, gameId];
          return {
            ...lr,
            stars: lr.stars + stars,
            completedGameIds: completed,
          };
        }
        return lr;
      })
    );
  };

  const handleToggleFavoriteSong = (songId: string) => {
    soundEngine.playCorrectSound();
    const favs = currentLearner.favoriteSongIds;
    const nextFavs = favs.includes(songId)
      ? favs.filter((id) => id !== songId)
      : [...favs, songId];

    handleUpdateLearnerSettings({ favoriteSongIds: nextFavs });
    analytics.trackEvent({
      category: 'music',
      eventType: 'favorite',
      songId,
    });
  };

  // Music Player Controls
  const handlePlaySong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextSong = () => {
    if (!currentSong) return;
    const currentIndex = INITIAL_SONGS.findIndex((s) => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % INITIAL_SONGS.length;
    setCurrentSong(INITIAL_SONGS[nextIndex]);
    setIsPlaying(true);
  };

  const handlePrevSong = () => {
    if (!currentSong) return;
    const currentIndex = INITIAL_SONGS.findIndex((s) => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + INITIAL_SONGS.length) % INITIAL_SONGS.length;
    setCurrentSong(INITIAL_SONGS[prevIndex]);
    setIsPlaying(true);
  };

  const handleParentGateSuccess = () => {
    if (parentGateTarget) {
      setCurrentView(parentGateTarget);
      setParentGateTarget(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9FF] text-[#2D2A4A] flex flex-col selection:bg-pink-200">
      {/* Top Brand Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setSelectedSubjectId(null);
          setCurrentView(view);
        }}
        learners={learners}
        currentLearner={currentLearner}
        onSwitchLearner={handleSwitchLearner}
        onAddNewLearner={() => setIsNewProfileOpen(true)}
        isDetailedMode={isDetailedMode}
        onToggleDetailedMode={() => setIsDetailedMode(!isDetailedMode)}
        onRequestParentGate={(target) => setParentGateTarget(target)}
        onOpenAICompanion={() => setIsAICompanionOpen(true)}
      />

      {/* Main Screen Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-32">
        {currentView === 'home' && (
          <HomeScreen
            learner={currentLearner}
            subjects={SUBJECTS}
            songs={INITIAL_SONGS}
            miniGames={MINI_GAMES}
            onOpenLesson={(les) => setActiveLesson(les)}
            onOpenGame={(g) => setActiveGame(g)}
            onPlaySong={handlePlaySong}
            onNavigate={(v) => setCurrentView(v as any)}
            onSelectSubject={(subId) => {
              setSelectedSubjectId(subId);
              setCurrentView('learn');
            }}
            onOpenAICompanion={() => setIsAICompanionOpen(true)}
          />
        )}

        {currentView === 'learn' && (
          <LearnScreen
            subjects={SUBJECTS}
            selectedSubjectId={selectedSubjectId}
            onSelectSubject={setSelectedSubjectId}
            onOpenLesson={(les) => setActiveLesson(les)}
            onOpenAssessment={(subId) => {
              const sub = SUBJECTS.find((s) => s.id === subId);
              if (sub) setAssessmentSubject(sub);
            }}
            learner={currentLearner}
          />
        )}

        {currentView === 'music' && (
          <MusicLibraryScreen
            songs={INITIAL_SONGS}
            learner={currentLearner}
            onPlaySong={handlePlaySong}
            onToggleFavorite={handleToggleFavoriteSong}
            currentSongId={currentSong?.id}
          />
        )}

        {currentView === 'rewards' && (
          <RewardsScreen
            learner={currentLearner}
            onUpdateOutfit={handleUpdateOutfit}
            onUnlockItem={handleUnlockItem}
          />
        )}

        {currentView === 'parent_dashboard' && (
          <ParentDashboard
            learners={learners}
            currentLearner={currentLearner}
            subjects={SUBJECTS}
            onSelectLearner={handleSwitchLearner}
            onUpdateLearnerSettings={handleUpdateLearnerSettings}
            onAddCustomGoal={handleAddCustomGoal}
            onOpenAnalytics={() => setCurrentView('admin_analytics')}
          />
        )}

        {currentView === 'admin_analytics' && <AdminAnalyticsDashboard />}
      </main>

      {/* Persistent Bottom Floating Audio Player */}
      <MusicPlayer
        currentSong={currentSong}
        playlist={INITIAL_SONGS}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onNext={handleNextSong}
        onPrevious={handlePrevSong}
        onSelectSong={handlePlaySong}
        onToggleFavorite={handleToggleFavoriteSong}
        isFavorite={currentSong ? currentLearner.favoriteSongIds.includes(currentSong.id) : false}
      />

      {/* Interactive Step-by-Step Lesson Modal */}
      {activeLesson && (
        <LessonModal
          lesson={activeLesson}
          learner={currentLearner}
          onClose={() => setActiveLesson(null)}
          onCompleteLesson={handleCompleteLesson}
          onPlaySong={handlePlaySong}
        />
      )}

      {/* Interactive Mini-Game Engine Modal */}
      {activeGame && (
        <MiniGameModal
          game={activeGame}
          learner={currentLearner}
          onClose={() => setActiveGame(null)}
          onComplete={handleCompleteGame}
        />
      )}

      {/* Adaptive Placement Assessment Modal */}
      {assessmentSubject && (
        <PlacementAssessmentModal
          subject={assessmentSubject}
          learner={currentLearner}
          onClose={() => setAssessmentSubject(null)}
          onSaveAssessmentResult={(subId, lvl, sc) => {
            handleCompleteLesson('placement_' + subId, 25);
          }}
        />
      )}

      {/* Parent Gate Math Verification Modal */}
      {parentGateTarget && (
        <ParentGateModal
          targetAreaName={
            parentGateTarget === 'admin_analytics' ? 'Platform Analytics' : 'Parent Dashboard'
          }
          onSuccess={handleParentGateSuccess}
          onCancel={() => setParentGateTarget(null)}
        />
      )}

      {/* AI Companion Modal (Melody Mascot & Rhyme Generator) */}
      {isAICompanionOpen && (
        <AICompanionModal
          learner={currentLearner}
          currentSubject={selectedSubjectId || 'General Discovery'}
          onClose={() => setIsAICompanionOpen(false)}
          onPlaySong={handlePlaySong}
        />
      )}

      {/* New Child Profile Creation Modal */}
      {isNewProfileOpen && (
        <NewProfileModal
          onClose={() => setIsNewProfileOpen(false)}
          onSave={handleAddNewLearner}
        />
      )}
    </div>
  );
}
