import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Crown,
  Sparkles,
  HelpCircle,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Heart,
  RotateCcw,
  Volume2,
} from 'lucide-react';
import { ConstructionChallenge, ArchipelagoStats } from '../types/game';
import { soundEngine } from '../utils/audio';
import { speechHelper } from '../utils/speech';

interface GrandWonderViewProps {
  wonderChallenge: ConstructionChallenge;
  city: ArchipelagoStats;
  onCompleteWonder: (results: {
    bricksEarned: number;
    flowersEarned: number;
    xpEarned: number;
    correctCount: number;
    totalCount: number;
  }) => void;
  onExit: () => void;
}

export const GrandWonderView: React.FC<GrandWonderViewProps> = ({
  wonderChallenge,
  city,
  onCompleteWonder,
  onExit,
}) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wonderState, setWonderState] = useState<'BUILDING' | 'TRIUMPH'>('BUILDING');

  const currentQ = wonderChallenge.questions[currentQIndex];
  const progressPercent = Math.round(
    ((currentQIndex + (isAnswered && isCorrect ? 1 : 0)) /
      wonderChallenge.questions.length) *
      100
  );

  const handleAnswer = (index: number) => {
    if (isAnswered || wonderState !== 'BUILDING') return;

    setIsAnswered(true);
    setSelectedOption(index);

    const correct = index === currentQ.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      soundEngine.playBrickPlaced();
      setCorrectCount((prev) => prev + 1);
    } else {
      soundEngine.playSoftMiss();
    }
  };

  const handleNext = () => {
    soundEngine.playClick();
    if (currentQIndex >= wonderChallenge.questions.length - 1) {
      setWonderState('TRIUMPH');
      soundEngine.playLevelUp();
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 },
      });
      return;
    }

    setCurrentQIndex((prev) => prev + 1);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Grand Wonder Showcase Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-purple-500/30 bg-gradient-to-b from-[#141638] via-[#0d0e24] to-[#12132a] p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5 flex justify-center">
            <div className="w-56 h-56 rounded-2xl overflow-hidden border-2 border-purple-400/40 shadow-xl relative group">
              <img
                src="/src/assets/images/landmark_grand_wonder_1793997415060.jpg"
                alt="Le Palais Céleste des Savoirs"
                className="w-full h-full object-cover select-none"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-300 border border-emerald-500/30 shadow-xs flex items-center gap-1">
                <Crown className="w-3 h-3 text-emerald-400" />
                <span>Merveille Céleste</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 space-y-3 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Chantier d’Excellence Impériale</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold font-editorial text-white">
              {wonderChallenge.buildingName}
            </h2>

            <p className="text-xs sm:text-sm text-purple-200/80 leading-relaxed">
              {wonderChallenge.description}
            </p>

            {/* Wonder Assembly Progress */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400 font-medium">Édification Céleste</span>
                <span className="text-emerald-300 font-bold tabular-nums">
                  {progressPercent}% complet
                </span>
              </div>
              <div className="w-full h-3 bg-slate-950/60 border border-emerald-500/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 via-emerald-400 to-emerald-300 transition-all duration-500 shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wonder Construction Step */}
      {wonderState === 'BUILDING' && (
        <div className="bg-[#0d0e24]/90 border border-purple-500/30 rounded-2xl p-6 shadow-xl space-y-6 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-purple-300 uppercase">
              Pierre Fondatrice n°{currentQIndex + 1} / {wonderChallenge.questions.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  speechHelper.speak(currentQ.question);
                }}
                className="p-1 rounded-lg text-slate-300 hover:text-purple-300 hover:bg-purple-900/40 transition-colors flex items-center gap-1 text-[11px] font-sans font-medium"
                title="Écouter la question à voix haute"
              >
                <Volume2 className="w-4 h-4 text-purple-400" />
                <span>Écouter</span>
              </button>
              <span className="text-emerald-300 font-mono">
                +{currentQ.bricks} 🧱
              </span>
            </div>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((option, index) => {
              const isPicked = selectedOption === index;
              const isCorrectOpt = index === currentQ.correctIndex;

              let style =
                'bg-[#121432] border-purple-500/25 text-slate-200 hover:border-purple-400/60 hover:bg-[#181a42]';

              if (isAnswered) {
                if (isCorrectOpt) {
                  style =
                    'bg-emerald-950/80 border-emerald-400 text-emerald-200 font-semibold shadow-xs';
                } else if (isPicked && !isCorrectOpt) {
                  style = 'bg-rose-950/80 border-rose-400 text-rose-200';
                } else {
                  style = 'bg-[#0b0c1e] border-slate-800 text-slate-500 opacity-50';
                }
              }

              return (
                <button
                  key={index}
                  disabled={isAnswered}
                  onClick={() => handleAnswer(index)}
                  className={`p-4 rounded-xl border text-left text-xs sm:text-sm transition-all duration-150 flex items-start gap-3 shadow-xs ${style}`}
                >
                  <span className="w-6 h-6 rounded-md bg-purple-900/60 text-purple-200 border border-purple-500/30 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1 pt-0.5">{option}</span>
                  {isAnswered && isCorrectOpt && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {isAnswered && isPicked && !isCorrectOpt && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Callout */}
          {isAnswered && (
            <div
              className={`p-4 rounded-xl border space-y-2 animate-fadeIn ${
                isCorrect
                  ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-100'
                  : 'bg-purple-950/70 border-purple-500/50 text-purple-100'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold uppercase">
                <span>
                  {isCorrect ? 'Arc de lumière assemblé !' : 'Pierre d’apprentissage'}
                </span>
                <span className="font-mono">+{isCorrect ? currentQ.xp : 0} XP</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-200">
                <span className="font-semibold text-white">Savoir Céleste : </span>
                {currentQ.explanation}
              </p>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 active:scale-95 transition-all rounded-xl flex items-center gap-1.5 shadow-md"
                >
                  <span>
                    {currentQIndex < wonderChallenge.questions.length - 1
                      ? 'Étape suivante'
                      : 'Célébrer la Merveille'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Triumph View */}
      {wonderState === 'TRIUMPH' && (
        <div className="bg-[#0d0e24] border-2 border-purple-500/40 rounded-3xl p-8 text-center space-y-6 shadow-2xl backdrop-blur-md">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-purple-900/50 border border-purple-400/40 flex items-center justify-center text-4xl shadow-inner">
            👑
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-bold font-editorial text-white">
              Le Palais Céleste Brille sur le Monde !
            </h3>
            <p className="text-xs sm:text-sm text-purple-200/80 max-w-md mx-auto leading-relaxed">
              Félicitations Mairesse ! Votre persévérance a donné naissance à la plus grande merveille éducative. La Cité est au sommet de son éclat.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto p-4 bg-[#121432] rounded-2xl border border-purple-500/20 text-center">
            <div>
              <div className="text-[11px] text-slate-400">Précision</div>
              <div className="text-base sm:text-lg font-bold font-mono text-purple-300">
                {correctCount} / {wonderChallenge.questions.length}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Briques Dorées</div>
              <div className="text-base sm:text-lg font-bold font-mono text-emerald-300">
                +{wonderChallenge.rewardBricks} 🧱
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Fleurs Recueillies</div>
              <div className="text-base sm:text-lg font-bold font-mono text-teal-300">
                +{wonderChallenge.rewardFlowers} 🌸
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={() => {
                soundEngine.playLevelUp();
                onCompleteWonder({
                  bricksEarned: wonderChallenge.rewardBricks,
                  flowersEarned: wonderChallenge.rewardFlowers,
                  xpEarned: wonderChallenge.rewardXp,
                  correctCount,
                  totalCount: wonderChallenge.questions.length,
                });
              }}
              className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-teal-600 via-emerald-600 to-emerald-500 hover:opacity-90 rounded-xl shadow-lg transition-transform active:scale-95"
            >
              Inscrire la Merveille dans les Annales
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
