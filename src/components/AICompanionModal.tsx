import React, { useState } from 'react';
import { LearnerProfile } from '../types';
import { companionService, GeneratedSong } from '../services/companionService';
import { soundEngine } from '../services/audioSynthesizer';
import { MascotMelody } from './MascotMelody';
import {
  X,
  Send,
  Sparkles,
  Music,
  Volume2,
  Bot,
  Wand2,
  Play,
  RotateCcw,
} from 'lucide-react';

interface AICompanionModalProps {
  learner: LearnerProfile;
  currentSubject?: string;
  onClose: () => void;
  onPlaySong?: (song: any) => void;
}

interface ChatMessage {
  sender: 'learner' | 'melody';
  text: string;
  timestamp: string;
}

export const AICompanionModal: React.FC<AICompanionModalProps> = ({
  learner,
  currentSubject = 'General Exploration',
  onClose,
  onPlaySong,
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'song_creator'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'melody',
      text: `Hello, ${learner.name}! 🎵 I'm Melody, your musical learning buddy! What would you like to explore or sing about today? 🌟`,
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Song Creator state
  const [songTopic, setSongTopic] = useState('Dancing Planets in Space');
  const [songSubject, setSongSubject] = useState('Science');
  const [songStyle, setSongStyle] = useState('Bouncy Hop Beat');
  const [generatedSong, setGeneratedSong] = useState<GeneratedSong | null>(null);
  const [isGeneratingSong, setIsGeneratingSong] = useState(false);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;
    const userMsg = inputText.trim();
    setInputText('');

    const newHistory: ChatMessage[] = [
      ...messages,
      { sender: 'learner', text: userMsg, timestamp: 'Now' },
    ];
    setMessages(newHistory);
    setIsLoading(true);
    soundEngine.playNote('C4', 0.15, 'marimba');

    try {
      const res = await companionService.askMelody({
        message: userMsg,
        learnerName: learner.name,
        learnerAge: learner.age,
        subject: currentSubject,
      });

      setMessages((prev) => [
        ...prev,
        { sender: 'melody', text: res.reply, timestamp: 'Now' },
      ]);
      soundEngine.playCorrectSound();
      if (learner.narrationVoiceEnabled) {
        soundEngine.speakNarration(res.reply);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'melody',
          text: `You are doing fantastic, ${learner.name}! 🎵 Every question makes our musical minds grow brighter! ✨`,
          timestamp: 'Now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSong = async () => {
    if (!songTopic.trim() || isGeneratingSong) return;
    setIsGeneratingSong(true);
    soundEngine.playNote('E4', 0.2, 'chime');

    try {
      const res = await companionService.generateEducationalSong({
        topic: songTopic,
        subject: songSubject,
        style: songStyle,
        learnerName: learner.name,
      });
      setGeneratedSong(res.song);
      soundEngine.playFanfare();
    } catch {
      // Fallback
    } finally {
      setIsGeneratingSong(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-purple-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border-4 border-purple-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-100 via-pink-100 to-amber-100 flex items-center justify-between border-b border-purple-200">
          <div className="flex items-center gap-3">
            <MascotMelody
              size="sm"
              mood="happy"
              outfit={learner.outfit}
              showSpeechBubble={false}
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-fun font-bold text-gray-900 text-lg sm:text-xl">Melody AI Tutor</h3>
                <span className="px-2 py-0.5 bg-purple-200 text-purple-800 text-[10px] font-extrabold rounded-full flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-500" /> Powered by Gemini
                </span>
              </div>
              <p className="text-xs text-purple-700 font-semibold">
                Musical answers, gentle hints & personalized songs for {learner.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/80 text-gray-500 hover:text-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-purple-100 bg-purple-50/50">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-3 text-center text-xs sm:text-sm font-fun font-bold flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'chat'
                ? 'border-purple-600 text-purple-700 bg-white'
                : 'border-transparent text-gray-500 hover:text-purple-600'
            }`}
          >
            <Bot className="w-4 h-4" /> Ask Melody Anything
          </button>
          <button
            onClick={() => setActiveTab('song_creator')}
            className={`flex-1 py-3 text-center text-xs sm:text-sm font-fun font-bold flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'song_creator'
                ? 'border-purple-600 text-purple-700 bg-white'
                : 'border-transparent text-gray-500 hover:text-purple-600'
            }`}
          >
            <Wand2 className="w-4 h-4 text-pink-500" /> AI Song & Rhyme Creator
          </button>
        </div>

        {/* Body Content */}
        {activeTab === 'chat' ? (
          <div className="flex-1 flex flex-col p-4 sm:p-5 overflow-hidden">
            {/* Quick Prompts Chips */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-none">
              {[
                'Why does it rain? 🌧️',
                'How do fractions work? 🍕',
                'Give me a math hint! 💡',
                'What is steady tempo? 🥁',
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => setInputText(chip)}
                  className="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold rounded-full whitespace-nowrap border border-purple-200 transition shrink-0"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2.5 ${
                    msg.sender === 'learner' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {msg.sender === 'melody' ? (
                    <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-sm shrink-0">
                      🎵
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-pink-200 flex items-center justify-center text-sm shrink-0">
                      {learner.avatarEmoji}
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                      msg.sender === 'learner'
                        ? 'bg-purple-600 text-white rounded-tr-none'
                        : 'bg-purple-50 border border-purple-200 text-purple-950 rounded-tl-none'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                    {msg.sender === 'melody' && (
                      <button
                        onClick={() => soundEngine.speakNarration(msg.text)}
                        className="mt-1 text-purple-600 hover:text-purple-800 text-xs inline-flex items-center gap-1 font-semibold"
                      >
                        <Volume2 className="w-3.5 h-3.5" /> Listen
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-xs font-bold text-purple-600 bg-purple-50 px-3 py-2 rounded-xl w-fit animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Melody is composing a musical answer...
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="flex items-center gap-2 pt-2 border-t border-purple-100">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={`Ask Melody a question, ${learner.name}...`}
                className="flex-1 px-4 py-2.5 rounded-2xl border-2 border-purple-200 focus:outline-none focus:border-purple-500 text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                className="p-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-40 text-white rounded-2xl shadow-md transition"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          /* SONG CREATOR TAB */
          <div className="p-5 overflow-y-auto space-y-5 flex-1">
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-2xl border border-pink-200">
              <h4 className="font-fun font-bold text-purple-950 text-base mb-1">
                🎶 Compose an Educational Rhyme with AI
              </h4>
              <p className="text-xs text-purple-700">
                Pick a topic you want to learn about, and Melody will create a personalized educational song!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase block mb-1">
                  What Topic?
                </label>
                <input
                  type="text"
                  value={songTopic}
                  onChange={(e) => setSongTopic(e.target.value)}
                  placeholder="e.g. Solar System, Addition, Bees"
                  className="w-full px-3.5 py-2 rounded-xl border border-purple-200 text-sm font-semibold focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase block mb-1">
                  Subject Category
                </label>
                <select
                  value={songSubject}
                  onChange={(e) => setSongSubject(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-purple-200 text-sm font-semibold focus:outline-none focus:border-purple-500 bg-white"
                >
                  <option value="Science">Science & Nature</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Reading">Reading & Phonics</option>
                  <option value="Life Skills">Life Skills & Manners</option>
                  <option value="Emotions">Feelings & Kindness</option>
                  <option value="Space">Planets & Space</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 uppercase block mb-1">
                Musical Style
              </label>
              <div className="flex flex-wrap gap-2">
                {['Bouncy Hop Beat', 'Gentle Lullaby', 'Marching Drums', 'Robo-Funk'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setSongStyle(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                      songStyle === st
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'bg-white text-gray-700 border-purple-200 hover:bg-purple-50'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateSong}
              disabled={isGeneratingSong || !songTopic.trim()}
              className="w-full py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 disabled:opacity-50 text-white font-fun font-bold rounded-2xl shadow-md flex items-center justify-center gap-2 transition"
            >
              <Sparkles className="w-5 h-5 text-yellow-300" />
              {isGeneratingSong ? 'Composing Your Educational Song...' : 'Generate Musical Rhyme!'}
            </button>

            {/* Generated Song Card */}
            {generatedSong && (
              <div className="bg-gradient-to-tr from-purple-100 via-pink-100 to-amber-100 p-5 rounded-3xl border-2 border-purple-300 shadow-sm space-y-3 animate-float">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎵</span>
                    <div>
                      <h4 className="font-fun font-bold text-lg text-purple-950">
                        {generatedSong.title}
                      </h4>
                      <p className="text-xs text-purple-700 font-semibold">
                        Tempo: {generatedSong.tempoBpm} BPM • {songStyle}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => soundEngine.speakNarration(`${generatedSong.verse}\n${generatedSong.chorus}`)}
                    className="p-2 bg-white rounded-full text-purple-700 hover:bg-purple-200 shadow-sm"
                    title="Read lyrics aloud"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-white/90 p-4 rounded-2xl shadow-inner space-y-2 text-center text-sm font-bold text-purple-900">
                  <p className="text-xs uppercase text-purple-500 font-extrabold tracking-wider">Verse</p>
                  <p className="whitespace-pre-line leading-relaxed">{generatedSong.verse}</p>

                  <p className="text-xs uppercase text-pink-500 font-extrabold tracking-wider pt-2">Chorus</p>
                  <p className="whitespace-pre-line leading-relaxed text-pink-700 font-extrabold">
                    {generatedSong.chorus}
                  </p>
                </div>

                <div className="p-2.5 bg-yellow-50 rounded-xl border border-yellow-200 text-xs text-amber-900 font-semibold flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{generatedSong.educationalTip}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
