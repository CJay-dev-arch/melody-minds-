import React, { useState, useEffect } from 'react';
import { soundEngine } from '../services/audioSynthesizer';
import { ShieldCheck, X, ArrowRight } from 'lucide-react';

interface ParentGateProps {
  onSuccess: () => void;
  onCancel: () => void;
  targetAreaName?: string;
}

export const ParentGateModal: React.FC<ParentGateProps> = ({
  onSuccess,
  onCancel,
  targetAreaName = 'Adult Dashboard',
}) => {
  const [num1, setNum1] = useState(7);
  const [num2, setNum2] = useState(6);
  const [userAnswer, setUserAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState(false);

  useEffect(() => {
    // Generate random single-digit multiplication
    const n1 = Math.floor(Math.random() * 5) + 4; // 4 to 8
    const n2 = Math.floor(Math.random() * 6) + 3; // 3 to 8
    setNum1(n1);
    setNum2(n2);
  }, []);

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const correct = num1 * num2;
    if (parseInt(userAnswer.trim(), 10) === correct) {
      soundEngine.playCorrectSound();
      onSuccess();
    } else {
      soundEngine.playTryAgainSound();
      setErrorMsg(true);
      setUserAnswer('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border-2 border-purple-100 text-center relative animate-float">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 mx-auto flex items-center justify-center mb-3">
          <ShieldCheck className="w-7 h-7" />
        </div>

        <h3 className="font-fun font-bold text-gray-900 text-xl mb-1">Grown-Ups Only</h3>
        <p className="text-xs text-gray-500 mb-5">
          Please solve this quick challenge to access {targetAreaName}.
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200">
            <span className="text-xs font-bold uppercase text-purple-600 block mb-1">
              Math Challenge
            </span>
            <span className="font-fun font-bold text-2xl text-purple-950">
              {num1} × {num2} = ?
            </span>
          </div>

          <input
            type="number"
            autoFocus
            value={userAnswer}
            onChange={(e) => {
              setUserAnswer(e.target.value);
              setErrorMsg(false);
            }}
            placeholder="Type answer here..."
            className="w-full text-center py-2.5 px-4 rounded-xl border-2 border-purple-200 focus:outline-none focus:border-purple-600 font-bold text-lg"
          />

          {errorMsg && (
            <p className="text-xs font-bold text-rose-500 animate-wiggle">
              Incorrect answer. Please try again!
            </p>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!userAnswer.trim()}
              className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-fun font-bold rounded-xl text-sm shadow-md transition inline-flex items-center justify-center gap-1.5"
            >
              Enter <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
