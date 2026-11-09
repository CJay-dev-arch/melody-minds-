import React, { useState } from 'react';
import { LearnerProfile } from '../types';
import { soundEngine } from '../services/audioSynthesizer';
import { X, Sparkles, UserPlus } from 'lucide-react';

interface NewProfileModalProps {
  onClose: () => void;
  onSave: (profile: LearnerProfile) => void;
}

const AVATAR_OPTIONS = ['🦁', '🦊', '🐼', '🐨', '🦄', '🐸', '🚀', '⭐', '🦉', '🐯'];
const INTEREST_OPTIONS = ['Music & Singing', 'Numbers & Math', 'Reading & Phonics', 'Animals & Nature', 'Robots & Coding', 'Space & Planets', 'Kindness & Manners'];

export const NewProfileModal: React.FC<NewProfileModalProps> = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState(6);
  const [gradeLevel, setGradeLevel] = useState('Kindergarten');
  const [selectedAvatar, setSelectedAvatar] = useState('🦁');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Music & Singing', 'Animals & Nature']);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    soundEngine.playCorrectSound();
    const newProfile: LearnerProfile = {
      id: 'learner_' + Date.now(),
      anonymousId: 'anon_' + Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      age,
      gradeLevel,
      avatarSeed: name.toLowerCase().trim(),
      avatarEmoji: selectedAvatar,
      interests: selectedInterests,
      stars: 20, // welcome bonus!
      streakDays: 1,
      favoriteSongIds: ['song_abc_groove'],
      unlockedItems: ['item_flower'],
      outfit: {
        hat: 'flower',
        glasses: 'none',
        accessory: 'none',
      },
      completedLessonIds: [],
      completedGameIds: [],
      masteredSkillIds: [],
      goals: [
        { id: 'g_init_1', title: 'Sing your first educational groove', target: 1, current: 0, unit: 'song', completed: false, isDaily: true },
        { id: 'g_init_2', title: 'Tap notes on the xylophone', target: 1, current: 0, unit: 'melody', completed: false, isDaily: true },
      ],
      timeSpentMinutes: 0,
      soundEnabled: true,
      narrationVoiceEnabled: true,
      difficultyMode: 'normal',
    };

    onSave(newProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-purple-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-4 border-purple-200 overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-2xl">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-fun font-bold text-xl text-gray-900">Add New Learner</h3>
            <p className="text-xs text-gray-500">Create a personalized musical learning profile</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase block mb-1">
              Learner's Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Maya, Leo, Zoe"
              className="w-full px-4 py-2.5 rounded-xl border border-purple-200 text-sm font-semibold focus:outline-none focus:border-purple-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-700 uppercase block mb-1">Age</label>
              <input
                type="number"
                min="3"
                max="12"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value, 10) || 5)}
                className="w-full px-4 py-2 rounded-xl border border-purple-200 text-sm font-semibold focus:outline-none focus:border-purple-600"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 uppercase block mb-1">Grade</label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-purple-200 text-sm font-semibold focus:outline-none focus:border-purple-600 bg-white"
              >
                <option value="Preschool">Preschool</option>
                <option value="Pre-K">Pre-K</option>
                <option value="Kindergarten">Kindergarten</option>
                <option value="1st Grade">1st Grade</option>
                <option value="2nd Grade">2nd Grade</option>
                <option value="3rd Grade">3rd Grade</option>
                <option value="4th Grade">4th Grade</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 uppercase block mb-1">
              Choose Avatar
            </label>
            <div className="flex flex-wrap gap-2">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setSelectedAvatar(av)}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition ${
                    selectedAvatar === av
                      ? 'bg-purple-200 ring-2 ring-purple-600 scale-105'
                      : 'bg-purple-50 hover:bg-purple-100'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 uppercase block mb-1">
              Learning Interests
            </label>
            <div className="flex flex-wrap gap-1.5">
              {INTEREST_OPTIONS.map((item) => {
                const isSelected = selectedInterests.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleInterest(item)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      isSelected
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 text-white font-fun font-bold rounded-2xl shadow-md transition"
            >
              🎉 Create Profile & Start Learning
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
