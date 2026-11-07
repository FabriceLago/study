import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Hammer,
  Sparkles,
  HelpCircle,
  Clock,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Coffee,
  Heart,
  Layers,
  Volume2,
} from 'lucide-react';
import { ConstructionChallenge, ArchipelagoStats } from '../types/game';
import { soundEngine } from '../utils/audio';
import { speechHelper } from '../utils/speech';

interface ConstructionSiteViewProps {
  challenge: ConstructionChallenge;
  city: ArchipelagoStats;
  onCompleteChallenge: (results: {
    challengeId: string;
    unlocksBuildingId: string;
    bricksEarned: number;
    flowersEarned: number;
    xpEarned: number;
    correctCount: number;
    totalCount: number;
  }) => void;
  onExit: () => void;
}

export const ConstructionSiteView: React.FC<ConstructionSiteViewProps> = ({
  challenge,
  city,
  onCompleteChallenge,
  onExit,
}) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(35);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [earnedBricks, setEarnedBricks] = useState(0);
  const [siteState, setSiteState] = useState<'BUILDING' | 'INSPECTION_SUCCESS' | 'RETRY'>(
    'BUILDING'
  );

  const currentQ = challenge.questions[currentQIndex];

  // Timer
  useEffect(() => {
    if (siteState !== 'BUILDING' || isAnswered || isTimerPaused) return;

    if (timerSeconds <= 0) {
      handleAnswer(-1);
      return;
    }

    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timerSeconds, isAnswered, siteState, isTimerPaused]);

  const handleAnswer = (index: number) => {
    if (isAnswered || siteState !== 'BUILDING') return;

    setIsAnswered(true);
    setSelectedOption(index);

    const correct = index === currentQ.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      soundEngine.playBrickPlaced();
      setCorrectCount((prev) => prev + 1);
      setEarnedBricks((prev) => prev + currentQ.bricks);
      setProgressPercent(
        Math.round(((currentQIndex + 1) / challenge.questions.length) * 100)
      );
    } else {
      soundEngine.playSoftMiss();
    }
  };

  const handleNext = () => {
    soundEngine.playClick();

    if (currentQIndex >= challenge.questions.length - 1) {
      // Completed all questions
      if (correctCount >= Math.ceil(challenge.questions.length * 0.5)) {
        setSiteState('INSPECTION_SUCCESS');
        soundEngine.playLevelUp();
        confetti({
          particleCount: 100,
          spread: 75,
          origin: { y: 0.6 },
        });
      } else {
        setSiteState('RETRY');
      }
      return;
    }

    setCurrentQIndex((prev) => prev + 1);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setTimerSeconds(35);
    setIsTimerPaused(false);
    setEliminatedOptions([]);
    setShowHint(false);
  };

  const handleUseHint = () => {
    soundEngine.playSuccess();
    setShowHint(true);
  };

  const handleUseFiftyFifty = () => {
    soundEngine.playSuccess();
    const wrong = currentQ.options
      .map((_, i) => i)
      .filter((i) => i !== currentQ.correctIndex);
    setEliminatedOptions(wrong.slice(0, 2));
  };

  const handleUseTeaBreak = () => {
    soundEngine.playSuccess();
    setIsTimerPaused(true);
    setTimerSeconds((s) => s + 20);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-slate-100 font-sans">
      {/* Top Header Card */}
      <div className="flex items-center justify-between p-4 bg-[#0B0E23] rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundEngine.playClick();
              onExit();
            }}
            className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-xl bg-[#070919] border border-slate-700 transition-colors"
          >
            ← Quitter le Chantier
          </button>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <span>Mission d'Édification : {challenge.buildingName}</span>
              {challenge.language === 'nl' && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">
                  🇳🇱 Néerlandais
                </span>
              )}
              {challenge.language === 'en' && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-300">
                  🇬🇧 Anglais
                </span>
              )}
              {challenge.language === 'es' && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-red-300">
                  🇪🇸 Espagnol
                </span>
              )}
            </h3>
            <span className="text-xs text-cyan-400 font-mono">
              Étape {currentQIndex + 1} / {challenge.questions.length} · {challenge.subject}
            </span>
          </div>
        </div>

        {/* Timer */}
        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold border ${
            isTimerPaused
              ? 'bg-[#070919] text-amber-300 border-amber-500/40'
              : timerSeconds <= 8
              ? 'bg-rose-950/80 text-rose-300 border-rose-500/40 animate-pulse'
              : 'bg-[#070919] text-cyan-400 border-slate-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{timerSeconds}s</span>
          {isTimerPaused && <span className="text-[10px] text-amber-400 font-sans">Pause Mentor</span>}
        </div>
      </div>

      {/* Foreman & Construction Progress */}
      <div className="rounded-2xl border border-slate-800 bg-[#0B0E23] p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#070919] border border-slate-700 flex items-center justify-center text-3xl shadow-inner shrink-0">
            {challenge.foreman.avatar}
          </div>

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h4 className="text-sm font-bold text-white tracking-tight">
                {challenge.foreman.name}
              </h4>
              <span className="text-[11px] text-cyan-400 font-mono">
                [{challenge.foreman.role}]
              </span>
            </div>
            <p className="text-xs text-slate-300 italic mt-1 leading-relaxed">
              « {challenge.foreman.dialogue} »
            </p>

            {/* Gauge */}
            <div className="mt-3">
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-400">Progression Opérationnelle</span>
                <span className="text-cyan-400 font-bold tabular-nums">
                  {progressPercent}% achevé
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-[#0A26E6] to-[#38bdf8] transition-all duration-500 shadow-[0_0_12px_rgba(10,38,230,0.6)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Question Stage */}
      {siteState === 'BUILDING' && (
        <div className="bg-[#0B0E23] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2 flex items-center justify-between font-mono">
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-[#0A26E6]" />
                <span>Question d’Édification #{currentQIndex + 1}</span>
              </div>

              <button
                onClick={() => {
                  soundEngine.playClick();
                  const targetVoice =
                    currentQ.language === 'nl'
                      ? 'nl-NL'
                      : currentQ.language === 'en'
                      ? 'en-US'
                      : currentQ.language === 'es'
                      ? 'es-ES'
                      : 'fr-FR';
                  speechHelper.speak(currentQ.question, targetVoice);
                }}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#070919] border border-slate-700 transition-colors flex items-center gap-1.5 text-[11px] font-sans font-medium"
                title="Écouter la question à voix haute"
              >
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <span>Écouter</span>
              </button>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
              {currentQ.question}
            </h3>
          </div>

          {/* Architect Tools Bar */}
          <div className="flex flex-wrap items-center gap-2 p-2.5 bg-[#070919] border border-slate-800 rounded-xl">
            <span className="text-xs text-slate-400 font-mono px-2">Assistance :</span>

            <button
              disabled={isAnswered || showHint}
              onClick={handleUseHint}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
                showHint
                  ? 'bg-[#0A26E6]/20 text-cyan-300 border border-[#0A26E6]/50'
                  : 'bg-[#0B0E23] hover:bg-[#12183c] text-slate-300 border border-slate-800'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>Indice Pédagogique</span>
            </button>

            <button
              disabled={isAnswered || eliminatedOptions.length > 0}
              onClick={handleUseFiftyFifty}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
                eliminatedOptions.length > 0
                  ? 'bg-[#0A26E6]/20 text-cyan-300 border border-[#0A26E6]/50'
                  : 'bg-[#0B0E23] hover:bg-[#12183c] text-slate-300 border border-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Filtre 50/50</span>
            </button>

            <button
              disabled={isAnswered || isTimerPaused}
              onClick={handleUseTeaBreak}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
                isTimerPaused
                  ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40'
                  : 'bg-[#0B0E23] hover:bg-[#12183c] text-slate-300 border border-slate-800'
              }`}
            >
              <Coffee className="w-3.5 h-3.5 text-amber-400" />
              <span>Pause Mentor (+20s)</span>
            </button>
          </div>

          {showHint && (
            <div className="p-3 bg-[#070919] border border-cyan-500/30 rounded-xl text-xs text-cyan-200 leading-relaxed flex items-start gap-2 animate-fadeIn">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Indice de l'architecte : </span>
                {currentQ.hint}
              </div>
            </div>
          )}

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((option, index) => {
              const isEliminated = eliminatedOptions.includes(index);
              const isPicked = selectedOption === index;
              const isCorrectOpt = index === currentQ.correctIndex;

              let style =
                'bg-[#070919] border-slate-800 text-slate-200 hover:border-[#0A26E6] hover:bg-[#0E1438]';

              if (isAnswered) {
                if (isCorrectOpt) {
                  style =
                    'bg-emerald-950/60 border-emerald-400 text-emerald-200 font-semibold shadow-md';
                } else if (isPicked && !isCorrectOpt) {
                  style = 'bg-rose-950/60 border-rose-500 text-rose-200';
                } else {
                  style = 'bg-[#05050D] border-slate-900 text-slate-600 opacity-40';
                }
              } else if (isEliminated) {
                style =
                  'bg-[#05050D] border-slate-900 text-slate-600 line-through opacity-30 cursor-not-allowed';
              }

              return (
                <button
                  key={index}
                  disabled={isAnswered || isEliminated}
                  onClick={() => handleAnswer(index)}
                  className={`p-4 rounded-xl border text-left text-xs sm:text-sm transition-all duration-150 flex items-start gap-3 shadow-sm ${style}`}
                >
                  <span className="w-6 h-6 rounded-md bg-[#0B0E23] text-cyan-400 flex items-center justify-center text-xs font-mono font-bold shrink-0 border border-slate-700">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1 pt-0.5 leading-snug">{option}</span>
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
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100'
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Pierre posée avec brio ! (+{currentQ.bricks} briques)</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-400" />
                      <span>Ajustement nécessaire</span>
                    </>
                  )}
                </span>
                <span className="text-xs font-mono font-semibold text-amber-300">
                  +{isCorrect ? currentQ.xp : 0} XP
                </span>
              </div>

              <div className="flex items-start justify-between gap-2">
                <p className="text-xs leading-relaxed text-slate-200 flex-1">
                  <span className="font-semibold text-white">Enseignement : </span>
                  {currentQ.explanation}
                </p>
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    const targetVoice =
                      currentQ.language === 'nl'
                        ? 'nl-NL'
                        : currentQ.language === 'en'
                        ? 'en-US'
                        : currentQ.language === 'es'
                        ? 'es-ES'
                        : 'fr-FR';
                    speechHelper.speak(currentQ.explanation, targetVoice);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#0B0E23] transition-colors shrink-0"
                  title="Écouter l'explication à voix haute"
                >
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#0A26E6] hover:bg-[#1F3BF5] active:scale-95 transition-all rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(10,38,230,0.35)]"
                >
                  <span>
                    {currentQIndex < challenge.questions.length - 1
                      ? 'Étape suivante'
                      : 'Examiner le Bâtiment Fini'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Success Celebration */}
      {siteState === 'INSPECTION_SUCCESS' && (
        <div className="bg-[#0B0E23] border border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-[#070919] border border-slate-700 flex items-center justify-center text-4xl shadow-inner">
            {challenge.buildingEmoji}
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Inauguration Réussie !
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Vos révisions ont permis d’ériger <strong className="text-white">{challenge.buildingName}</strong>. Votre cité grandit et de nouveaux habitants emménagent !
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto p-4 bg-[#070919] rounded-xl border border-slate-800 text-center">
            <div>
              <div className="text-[11px] text-slate-400">Précision</div>
              <div className="text-base sm:text-lg font-bold font-mono text-emerald-400">
                {correctCount} / {challenge.questions.length}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Briques Dorées</div>
              <div className="text-base sm:text-lg font-bold font-mono text-amber-400">
                +{challenge.rewardBricks + earnedBricks} 🧱
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Fleurs Recueillies</div>
              <div className="text-base sm:text-lg font-bold font-mono text-cyan-400">
                +{challenge.rewardFlowers} 🌸
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={() => {
                soundEngine.playBrickPlaced();
                onCompleteChallenge({
                  challengeId: challenge.id,
                  unlocksBuildingId: challenge.unlocksBuildingId,
                  bricksEarned: challenge.rewardBricks + earnedBricks,
                  flowersEarned: challenge.rewardFlowers,
                  xpEarned: challenge.rewardXp,
                  correctCount,
                  totalCount: challenge.questions.length,
                });
              }}
              className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#0A26E6] hover:bg-[#1F3BF5] rounded-xl shadow-[0_0_20px_rgba(10,38,230,0.35)] transition-transform active:scale-95"
            >
              Ajouter l’Édifice à ma Cité
            </button>
          </div>
        </div>
      )}

      {/* Retry Screen */}
      {siteState === 'RETRY' && (
        <div className="bg-[#0B0E23] border border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-center text-3xl">
            📐
          </div>
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Ajustements recommandés
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              Chaque grande bâtisseuse apprend en réexaminant ses esquisses. Réessayez dès maintenant pour perfectionner vos compétences.
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                soundEngine.playClick();
                setCurrentQIndex(0);
                setSelectedOption(null);
                setIsAnswered(false);
                setCorrectCount(0);
                setProgressPercent(0);
                setTimerSeconds(35);
                setSiteState('BUILDING');
              }}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#0A26E6] hover:bg-[#1F3BF5] rounded-xl shadow-[0_0_15px_rgba(10,38,230,0.35)] flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Recommencer le Chantier</span>
            </button>
            <button
              onClick={onExit}
              className="px-4 py-2.5 text-xs font-medium text-slate-400 hover:text-white"
            >
              Revenir au Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
