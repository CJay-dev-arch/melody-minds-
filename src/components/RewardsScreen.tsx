import React, { useState } from 'react';
import { LearnerProfile, Badge } from '../types';
import { BADGES } from '../data/curriculumData';
import { soundEngine } from '../services/audioSynthesizer';
import { MascotMelody } from './MascotMelody';
import confetti from 'canvas-confetti';
import {
  Award,
  Sparkles,
  CheckCircle2,
  Lock,
  Printer,
  Shirt,
  Star,
  Check,
} from 'lucide-react';

interface RewardsProps {
  learner: LearnerProfile;
  onUpdateOutfit: (newOutfit: any) => void;
  onUnlockItem: (itemId: string, cost: number) => void;
}

export const RewardsScreen: React.FC<RewardsProps> = ({
  learner,
  onUpdateOutfit,
  onUnlockItem,
}) => {
  const [activeTab, setActiveTab] = useState<'badges' | 'wardrobe' | 'certificate'>('badges');
  const [selectedSubjectCert, setSelectedSubjectCert] = useState('Mathematics & Rhythm');

  const wardrobeItems = [
    { id: 'item_headphones', type: 'hat', name: 'DJ Headphones', cost: 15, emoji: '🎧', val: 'headphones' },
    { id: 'item_crown', type: 'hat', name: 'Golden Crown', cost: 30, emoji: '👑', val: 'crown' },
    { id: 'item_wizard', type: 'hat', name: 'Wizard Hat', cost: 25, emoji: '🧙‍♂️', val: 'wizard' },
    { id: 'item_flower', type: 'hat', name: 'Sunshine Flower', cost: 10, emoji: '🌸', val: 'flower' },
    { id: 'item_shades', type: 'glasses', name: 'Star Shades', cost: 20, emoji: '⭐', val: 'star_shades' },
    { id: 'item_specs', type: 'glasses', name: 'Round Glasses', cost: 15, emoji: '👓', val: 'round_specs' },
    { id: 'item_wand', type: 'accessory', name: 'Magic Wand', cost: 35, emoji: '🪄', val: 'wand' },
    { id: 'item_sparkles', type: 'accessory', name: 'Fairy Sparkles', cost: 20, emoji: '✨', val: 'sparkles' },
  ];

  const handleEquip = (item: any) => {
    soundEngine.playCorrectSound();
    const current = { ...learner.outfit };
    if (item.type === 'hat') current.hat = current.hat === item.val ? 'none' : item.val;
    if (item.type === 'glasses') current.glasses = current.glasses === item.val ? 'none' : item.val;
    if (item.type === 'accessory') current.accessory = current.accessory === item.val ? 'none' : item.val;
    onUpdateOutfit(current);
  };

  const handleBuy = (item: any) => {
    if (learner.stars < item.cost) {
      soundEngine.playTryAgainSound();
      return;
    }
    soundEngine.playFanfare();
    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch {}
    onUnlockItem(item.id, item.cost);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Rewards Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-400 via-pink-400 to-purple-600 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-yellow-200 inline-flex items-center gap-1.5">
            <Award className="w-4 h-4" /> Gamification & Achievements
          </span>
          <h1 className="font-fun font-bold text-3xl sm:text-4xl lg:text-5xl drop-shadow-md">
            Rewards & Melody’s Wardrobe
          </h1>
          <p className="text-purple-100 text-xs sm:text-sm max-w-lg">
            Earn stars through music lessons and challenges. Unlock shiny badges and dress up Melody!
          </p>
        </div>

        {/* Stars Bank Card */}
        <div className="bg-white/20 backdrop-blur-md p-5 rounded-3xl border border-white/30 text-center shrink-0 min-w-44 shadow-lg animate-float">
          <span className="text-4xl block mb-1">⭐</span>
          <span className="font-fun font-bold text-3xl sm:text-4xl text-white block">
            {learner.stars}
          </span>
          <span className="text-xs uppercase font-extrabold tracking-wider text-yellow-200">
            Total Stars Earned
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-purple-200 bg-white rounded-2xl p-1 shadow-sm font-fun font-bold text-sm">
        <button
          onClick={() => setActiveTab('badges')}
          className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition ${
            activeTab === 'badges' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:text-purple-600'
          }`}
        >
          <Award className="w-4 h-4" /> Badges Showcase ({BADGES.length})
        </button>
        <button
          onClick={() => setActiveTab('wardrobe')}
          className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition ${
            activeTab === 'wardrobe' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:text-purple-600'
          }`}
        >
          <Shirt className="w-4 h-4" /> Mascot Dressing Room
        </button>
        <button
          onClick={() => setActiveTab('certificate')}
          className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition ${
            activeTab === 'certificate' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:text-purple-600'
          }`}
        >
          <Printer className="w-4 h-4" /> Mastery Certificates
        </button>
      </div>

      {/* TAB 1: BADGES SHOWCASE */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BADGES.map((b) => {
            const isUnlocked = learner.stars >= (b.starsRequired || 0);

            return (
              <div
                key={b.id}
                className={`p-5 rounded-3xl border-2 transition shadow-sm text-center flex flex-col items-center justify-between h-56 ${
                  isUnlocked
                    ? 'bg-gradient-to-b from-white to-purple-50/70 border-purple-200 hover:shadow-md'
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                    {b.category}
                  </span>
                  {isUnlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Lock className="w-4 h-4 text-gray-400" />
                  )}
                </div>

                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner my-2 ${
                    isUnlocked ? 'bg-yellow-100 text-yellow-800 animate-pulse-subtle' : 'bg-gray-200 grayscale'
                  }`}
                >
                  {b.icon}
                </div>

                <div>
                  <h3 className="font-fun font-bold text-base text-gray-900 leading-tight">
                    {b.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{b.description}</p>
                </div>

                <div className="mt-2 text-[11px] font-bold text-amber-600">
                  {isUnlocked ? 'Unlocked & Celebrated!' : `Requires ${b.starsRequired} ⭐`}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: MASCOT DRESSING ROOM */}
      {activeTab === 'wardrobe' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Mascot Preview */}
          <div className="bg-gradient-to-b from-purple-100 to-pink-100 rounded-3xl p-6 border-2 border-purple-200 flex flex-col items-center justify-center text-center shadow-inner">
            <h3 className="font-fun font-bold text-xl text-purple-950 mb-2">
              Melody's Style Studio
            </h3>
            <p className="text-xs text-purple-700 mb-6">
              Equip unlocked accessories to personalize your musical buddy
            </p>

            <MascotMelody
              size="lg"
              mood="happy"
              outfit={learner.outfit}
              speechText={`Looking stylish, ${learner.name}! Ready to make more music?`}
              allowVoiceNarration={learner.narrationVoiceEnabled}
            />

            <div className="mt-6 flex flex-wrap gap-2 justify-center text-xs font-bold text-purple-800">
              <span className="px-3 py-1 bg-white rounded-full shadow-sm">
                Hat: {learner.outfit.hat || 'none'}
              </span>
              <span className="px-3 py-1 bg-white rounded-full shadow-sm">
                Glasses: {learner.outfit.glasses || 'none'}
              </span>
              <span className="px-3 py-1 bg-white rounded-full shadow-sm">
                Accessory: {learner.outfit.accessory || 'none'}
              </span>
            </div>
          </div>

          {/* Wardrobe Items Store & Inventory */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-fun font-bold text-xl text-gray-900">
              Collectible Items & Costumes
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {wardrobeItems.map((item) => {
                const isUnlocked = learner.unlockedItems.includes(item.id);
                const isEquipped =
                  (item.type === 'hat' && learner.outfit.hat === item.val) ||
                  (item.type === 'glasses' && learner.outfit.glasses === item.val) ||
                  (item.type === 'accessory' && learner.outfit.accessory === item.val);

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-3 transition shadow-sm ${
                      isEquipped
                        ? 'bg-purple-100 border-purple-500 ring-2 ring-purple-300'
                        : isUnlocked
                        ? 'bg-white border-purple-200 hover:border-purple-300'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{item.emoji}</span>
                      <div>
                        <h4 className="font-fun font-bold text-sm text-gray-900">{item.name}</h4>
                        <span className="text-[10px] uppercase font-bold text-gray-400 capitalize">
                          {item.type}
                        </span>
                      </div>
                    </div>

                    <div>
                      {isUnlocked ? (
                        <button
                          onClick={() => handleEquip(item)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold font-fun transition flex items-center gap-1 ${
                            isEquipped
                              ? 'bg-purple-600 text-white shadow-sm'
                              : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                          }`}
                        >
                          {isEquipped ? <Check className="w-3.5 h-3.5" /> : null}
                          {isEquipped ? 'Equipped' : 'Wear'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBuy(item)}
                          disabled={learner.stars < item.cost}
                          className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-40 text-purple-950 rounded-xl text-xs font-bold font-fun shadow-sm transition flex items-center gap-1"
                        >
                          <Star className="w-3 h-3 fill-purple-950" /> {item.cost}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRINTABLE MASTERY CERTIFICATES */}
      {activeTab === 'certificate' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-fun font-bold text-xl text-gray-900">
                Official Mastery Certificate
              </h3>
              <p className="text-xs text-gray-500">
                Celebrate demonstrated understanding and effort with an official certificate
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-fun font-bold flex items-center gap-1.5 shadow-md"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
          </div>

          {/* Certificate Frame */}
          <div className="p-8 sm:p-12 rounded-3xl bg-white border-8 border-double border-amber-300 shadow-2xl text-center space-y-5 relative overflow-hidden">
            {/* Background seal watermarks */}
            <div className="absolute top-4 left-4 text-4xl opacity-20">🎼</div>
            <div className="absolute bottom-4 right-4 text-4xl opacity-20">🎵</div>

            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-300 to-yellow-500 mx-auto flex items-center justify-center text-3xl shadow-md">
              ⭐
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase font-extrabold tracking-widest text-amber-700">
                Melody Minds Educational Excellence
              </span>
              <h2 className="font-fun font-bold text-3xl sm:text-4xl text-purple-950">
                Certificate of Musical Mastery
              </h2>
            </div>

            <p className="text-sm text-gray-600">This honor is proudly awarded to:</p>

            <div className="py-2 border-b-2 border-amber-300 max-w-sm mx-auto">
              <span className="font-fun font-bold text-3xl sm:text-4xl text-purple-800">
                {learner.name}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-700 max-w-md mx-auto leading-relaxed">
              For demonstrating exceptional dedication, joyful curiosity, and rhythm mastery across
              the <span className="font-bold text-purple-900">{selectedSubjectCert}</span> curriculum!
            </p>

            <div className="pt-6 flex items-center justify-around text-xs text-gray-500 font-bold border-t border-amber-100">
              <div>
                <span className="block text-gray-800">Melody Minds Platform</span>
                <span className="text-[10px] text-purple-600">Verified AI Companion</span>
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-amber-400 bg-amber-50 flex items-center justify-center text-xs font-bold text-amber-800 shadow-inner">
                SEAL
              </div>
              <div>
                <span className="block text-gray-800">Date Issued</span>
                <span className="text-[10px] text-purple-600">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
