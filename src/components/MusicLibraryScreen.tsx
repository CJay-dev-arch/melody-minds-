import React, { useState } from 'react';
import { Song, LearnerProfile } from '../types';
import { InteractivePiano } from './InteractivePiano';
import { soundEngine } from '../services/audioSynthesizer';
import {
  Music,
  Play,
  Heart,
  Sparkles,
  Search,
  Filter,
  Mic,
  Disc3,
} from 'lucide-react';

interface MusicLibraryProps {
  songs: Song[];
  learner: LearnerProfile;
  onPlaySong: (song: Song) => void;
  onToggleFavorite: (songId: string) => void;
  currentSongId?: string;
}

export const MusicLibraryScreen: React.FC<MusicLibraryProps> = ({
  songs,
  learner,
  onPlaySong,
  onToggleFavorite,
  currentSongId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const categories = [
    { id: 'all', label: 'All Playlists' },
    { id: 'reading', label: 'Alphabet & Phonics' },
    { id: 'mathematics', label: 'Counting & Math' },
    { id: 'science', label: 'Science & Nature' },
    { id: 'stem', label: 'STEM & Coding' },
    { id: 'music', label: 'Rhythm & Melody' },
    { id: 'life_skills', label: 'Manners & Life' },
    { id: 'emotional_intelligence', label: 'Feelings & Calm' },
  ];

  const filteredSongs = songs.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.subjectId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || s.subjectId === selectedCategory;
    const matchesFav = !onlyFavorites || learner.favoriteSongIds.includes(s.id);
    return matchesSearch && matchesCat && matchesFav;
  });

  return (
    <div className="space-y-8 pb-20">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-yellow-300 inline-flex items-center gap-1.5">
            <Disc3 className="w-4 h-4 animate-spin" /> Interactive Music Library
          </span>
          <h1 className="font-fun font-bold text-3xl sm:text-4xl lg:text-5xl drop-shadow-md">
            Educational Melodies & Playlists
          </h1>
          <p className="text-purple-100 text-xs sm:text-sm">
            Stream curriculum songs powered by real Web Audio note synthesis. Sing along with karaoke lyrics!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (songs[0]) onPlaySong(songs[0]);
            }}
            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-purple-950 font-fun font-bold rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition flex items-center gap-2"
          >
            <Play className="w-5 h-5 fill-purple-950" /> Play First Track
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search songs, artists, topics..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border-2 border-purple-100 focus:outline-none focus:border-purple-500 text-sm shadow-sm"
          />
        </div>

        {/* Favorite toggle button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold border flex items-center gap-1.5 transition ${
              onlyFavorites
                ? 'bg-rose-50 border-rose-300 text-rose-700 font-extrabold shadow-sm'
                : 'bg-white border-purple-100 text-gray-600 hover:bg-purple-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${onlyFavorites ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>My Favorites ({learner.favoriteSongIds.length})</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-fun font-bold whitespace-nowrap transition ${
              selectedCategory === c.id
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-purple-100 hover:bg-purple-50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Song Tracks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSongs.map((song) => {
          const isCurrent = currentSongId === song.id;
          const isFav = learner.favoriteSongIds.includes(song.id);

          return (
            <div
              key={song.id}
              className={`p-5 rounded-3xl bg-white border-2 transition shadow-sm hover:shadow-md flex flex-col justify-between ${
                isCurrent ? 'border-purple-500 ring-2 ring-purple-200' : 'border-purple-100 hover:border-purple-300'
              }`}
            >
              <div className="flex items-start gap-4 mb-3">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${song.albumArtColor} flex items-center justify-center text-3xl shadow-md shrink-0 relative`}
                >
                  {song.emoji}
                  {isCurrent && (
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-yellow-400 rounded-full animate-ping" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                      {song.subjectId}
                    </span>
                    <button
                      onClick={() => onToggleFavorite(song.id)}
                      className={`p-1 rounded-full transition hover:scale-110 ${
                        isFav ? 'text-rose-500' : 'text-gray-300 hover:text-rose-400'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
                    </button>
                  </div>
                  <h3 className="font-fun font-bold text-gray-900 text-base truncate mt-1">
                    {song.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-semibold">{song.artist}</p>
                </div>
              </div>

              <p className="text-xs text-gray-600 line-clamp-2 mb-4 leading-relaxed italic">
                "{song.description}"
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-purple-50">
                <span className="text-[11px] font-bold text-purple-600">
                  {song.tempoBpm} BPM • {song.durationSeconds}s
                </span>
                <button
                  onClick={() => onPlaySong(song)}
                  className={`px-4 py-2 rounded-xl text-xs font-fun font-bold flex items-center gap-1.5 transition shadow-sm ${
                    isCurrent
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  {isCurrent ? 'Now Playing' : 'Play Song'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Melody Studio Section */}
      <section className="pt-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-yellow-100 text-yellow-800 rounded-2xl text-xl">🎹</span>
          <div>
            <h2 className="font-fun font-bold text-2xl text-gray-900">
              Interactive Xylophone & Melody Maker
            </h2>
            <p className="text-xs text-gray-500 font-semibold">
              Compose custom tunes or play note-for-note along with your favorite lessons
            </p>
          </div>
        </div>
        <InteractivePiano allowRecording={true} />
      </section>
    </div>
  );
};
