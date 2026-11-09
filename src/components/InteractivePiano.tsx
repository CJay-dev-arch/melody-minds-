import React, { useState } from 'react';
import { soundEngine } from '../services/audioSynthesizer';
import { Music, Play, RotateCcw, Sparkles } from 'lucide-react';

interface PianoProps {
  onNotePlay?: (note: string) => void;
  highlightNote?: string;
  allowRecording?: boolean;
}

const KEYS = [
  { note: 'C4', label: 'C', solfege: 'Do', color: 'bg-rose-400 hover:bg-rose-500 border-rose-600' },
  { note: 'D4', label: 'D', solfege: 'Re', color: 'bg-orange-400 hover:bg-orange-500 border-orange-600' },
  { note: 'E4', label: 'E', solfege: 'Mi', color: 'bg-amber-400 hover:bg-amber-500 border-amber-600' },
  { note: 'F4', label: 'F', solfege: 'Fa', color: 'bg-emerald-400 hover:bg-emerald-500 border-emerald-600' },
  { note: 'G4', label: 'G', solfege: 'Sol', color: 'bg-teal-400 hover:bg-teal-500 border-teal-600' },
  { note: 'A4', label: 'A', solfege: 'La', color: 'bg-blue-400 hover:bg-blue-500 border-blue-600' },
  { note: 'B4', label: 'B', solfege: 'Ti', color: 'bg-indigo-400 hover:bg-indigo-500 border-indigo-600' },
  { note: 'C5', label: 'C²', solfege: 'Do', color: 'bg-purple-400 hover:bg-purple-500 border-purple-600' },
];

export const InteractivePiano: React.FC<PianoProps> = ({
  onNotePlay,
  highlightNote,
  allowRecording = true,
}) => {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [instrument, setInstrument] = useState<'marimba' | 'piano' | 'chime' | 'synth'>('marimba');
  const [recordedNotes, setRecordedNotes] = useState<string[]>([]);
  const [isPlayingBack, setIsPlayingBack] = useState(false);

  const handleKeyPress = (note: string) => {
    setActiveKey(note);
    soundEngine.playNote(note, 0.5, instrument);
    if (onNotePlay) onNotePlay(note);

    if (allowRecording && recordedNotes.length < 16) {
      setRecordedNotes((prev) => [...prev, note]);
    }

    setTimeout(() => {
      setActiveKey(null);
    }, 250);
  };

  const handlePlayBack = () => {
    if (!recordedNotes.length || isPlayingBack) return;
    setIsPlayingBack(true);
    recordedNotes.forEach((note, idx) => {
      setTimeout(() => {
        setActiveKey(note);
        soundEngine.playNote(note, 0.45, instrument);
        setTimeout(() => setActiveKey(null), 200);
        if (idx === recordedNotes.length - 1) {
          setIsPlayingBack(false);
        }
      }, idx * 350);
    });
  };

  const handleClear = () => {
    setRecordedNotes([]);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-5 border-2 border-purple-100 shadow-md">
      {/* Instrument Picker & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-purple-100 text-purple-700 rounded-xl">
            <Music className="w-5 h-5" />
          </span>
          <div>
            <h4 className="font-fun font-bold text-gray-800 text-base">Xylophone Studio</h4>
            <p className="text-xs text-gray-500">Tap the rainbow keys to play musical notes</p>
          </div>
        </div>

        {/* Instrument selector pills */}
        <div className="flex items-center gap-1.5 bg-purple-50 p-1 rounded-2xl text-xs font-bold text-purple-800">
          {(['marimba', 'piano', 'chime', 'synth'] as const).map((inst) => (
            <button
              key={inst}
              onClick={() => setInstrument(inst)}
              className={`px-3 py-1.5 rounded-xl capitalize transition-all ${
                instrument === inst ? 'bg-white shadow-sm text-purple-700 scale-105' : 'hover:bg-purple-100/50'
              }`}
            >
              {inst}
            </button>
          ))}
        </div>
      </div>

      {/* Piano / Xylophone Keys */}
      <div className="flex justify-between gap-1.5 sm:gap-2.5 h-36 sm:h-44 p-2 bg-gradient-to-b from-purple-100/70 to-pink-100/50 rounded-2xl shadow-inner border border-purple-200">
        {KEYS.map((k) => {
          const isHighlighted = highlightNote === k.note || activeKey === k.note;
          return (
            <button
              key={k.note}
              onClick={() => handleKeyPress(k.note)}
              className={`flex-1 rounded-xl sm:rounded-2xl flex flex-col justify-between items-center py-3 text-white font-fun font-bold transition-all shadow-md active:translate-y-2 border-b-4 ${
                k.color
              } ${isHighlighted ? 'scale-105 -translate-y-1 ring-4 ring-yellow-300 shadow-lg' : ''}`}
            >
              <span className="text-xs sm:text-sm drop-shadow">{k.solfege}</span>
              <div className="w-2.5 h-2.5 rounded-full bg-white/70" />
              <span className="text-sm sm:text-lg tracking-wider drop-shadow">{k.label}</span>
            </button>
          );
        })}
      </div>

      {/* Recording strip */}
      {allowRecording && (
        <div className="mt-4 pt-3 border-t border-purple-100 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-600 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> My Melody:
            </span>
            <div className="flex flex-wrap gap-1 max-w-xs overflow-x-auto py-1">
              {recordedNotes.length === 0 ? (
                <span className="text-xs text-gray-400 italic">Tap any keys above to record...</span>
              ) : (
                recordedNotes.map((n, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-lg font-bold animate-pulse-subtle"
                  >
                    {n}
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayBack}
              disabled={recordedNotes.length === 0 || isPlayingBack}
              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              <Play className="w-3.5 h-3.5" /> Play Melody
            </button>
            <button
              onClick={handleClear}
              disabled={recordedNotes.length === 0}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-gray-600 rounded-xl text-xs font-bold transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
