import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Coffee,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Flower2,
  Sparkles,
  Heart,
  CheckCircle2,
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface FocusStudioProps {
  onEarnFocusRewards: (bricks: number, flowers: number, xp: number) => void;
}

export const FocusStudio: React.FC<FocusStudioProps> = ({ onEarnFocusRewards }) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(25 * 60);
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isAmbientActive, setIsAmbientActive] = useState(false);
  const [accumulatedFlowers, setAccumulatedFlowers] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Sync ambient sound when global mute is toggled
  useEffect(() => {
    const unsub = soundEngine.subscribeMute((muted) => {
      if (muted) {
        setIsAmbientActive(false);
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    let interval: any = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          // Earn 1 flower every 20 seconds of focused study
          if ((selectedDuration - prev) % 20 === 0) {
            setAccumulatedFlowers((f) => f + 1);
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, selectedDuration]);

  const handleStart = () => {
    soundEngine.playClick();
    setIsActive(true);
    setSessionCompleted(false);
  };

  const handlePause = () => {
    soundEngine.playClick();
    setIsActive(false);
  };

  const handleReset = (duration: number = selectedDuration) => {
    soundEngine.playClick();
    setIsActive(false);
    setTimeLeft(duration);
    setSelectedDuration(duration);
    setAccumulatedFlowers(0);
    setSessionCompleted(false);
  };

  const handleComplete = () => {
    setIsActive(false);
    setSessionCompleted(true);
    soundEngine.playLevelUp();
    if (isAmbientActive) {
      soundEngine.stopAmbientFocus();
      setIsAmbientActive(false);
    }

    const earnedBricks = Math.round(selectedDuration / 60);
    const earnedXp = Math.round(selectedDuration / 30);
    onEarnFocusRewards(earnedBricks, accumulatedFlowers + 15, earnedXp);

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleToggleAmbient = () => {
    const active = soundEngine.toggleAmbientFocus();
    setIsAmbientActive(active);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.round(
    ((selectedDuration - timeLeft) / selectedDuration) * 100
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold font-editorial text-slate-900 dark:text-white">
          L’Atelier de Concentration & Thé
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-purple-200/80 max-w-md mx-auto">
          Installez-vous confortablement avec votre thé préféré. Chaque minute de lecture ou de devoirs nourrit les jardins de votre cité.
        </p>
      </div>

      {/* Preset duration buttons */}
      <div className="flex justify-center items-center gap-2">
        {[
          { label: 'Sprint Doux (15 min)', duration: 15 * 60 },
          { label: 'Pomodoro Cosy (25 min)', duration: 25 * 60 },
          { label: 'Immersion Fleurie (45 min)', duration: 45 * 60 },
        ].map((preset) => (
          <button
            key={preset.duration}
            disabled={isActive}
            onClick={() => handleReset(preset.duration)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-colors ${
              selectedDuration === preset.duration
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md'
                : 'bg-white dark:bg-[#121432] border border-slate-200 dark:border-purple-500/30 text-slate-700 dark:text-purple-200 hover:text-slate-950 dark:hover:text-white hover:border-slate-300 dark:hover:border-purple-400'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Clock Card */}
      <div className="relative rounded-3xl border border-slate-200 dark:border-purple-500/30 bg-white/95 dark:bg-[#0d0e22]/95 p-8 text-center shadow-xl dark:shadow-2xl backdrop-blur-md overflow-hidden">
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative w-56 h-56 flex items-center justify-center my-3">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="112"
                cy="112"
                r="96"
                className="stroke-slate-200 dark:stroke-purple-950/60"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="112"
                cy="112"
                r="96"
                className="stroke-rose-500 dark:stroke-rose-400 transition-all duration-1000 ease-linear"
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 96}
                strokeDashoffset={2 * Math.PI * 96 * (1 - progressPercent / 100)}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center space-y-1">
              <Coffee
                className={`w-6 h-6 text-rose-500 dark:text-rose-400 ${
                  isActive ? 'animate-bounce' : ''
                }`}
              />
              <div className="text-4xl sm:text-5xl font-mono font-bold text-slate-900 dark:text-white tracking-wider tabular-nums">
                {formatTime(timeLeft)}
              </div>
              <div className="text-[11px] text-pink-600 dark:text-pink-300 font-medium">
                {isActive ? 'Concentration en cours ☕' : 'En pause détente'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-600 dark:text-slate-300 font-mono pt-2">
            <div className="flex items-center gap-1.5 text-pink-600 dark:text-pink-400">
              <Flower2 className="w-4 h-4" />
              <span>+{accumulatedFlowers} fleurs écloses</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span>🪙</span>
              <span>+{Math.round(selectedDuration / 60)} pièces à la clé</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mt-6">
            {!isActive ? (
              <button
                onClick={handleStart}
                className="flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 rounded-full shadow-lg transition-transform active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Entrer en Séance</span>
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-semibold text-purple-900 dark:text-purple-200 bg-purple-100 dark:bg-purple-900/60 hover:bg-purple-200 dark:hover:bg-purple-800/70 border border-purple-300 dark:border-purple-500/30 rounded-full transition-colors active:scale-95"
              >
                <Pause className="w-4 h-4 fill-current" />
                <span>Faire une Pause</span>
              </button>
            )}

            <button
              onClick={() => handleReset()}
              className="p-2.5 rounded-full bg-slate-100 dark:bg-[#121432] border border-slate-200 dark:border-purple-500/30 text-slate-600 dark:text-purple-300 hover:text-slate-950 dark:hover:text-white transition-colors"
              title="Réinitialiser le sablier"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handleToggleAmbient}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-full border transition-colors ${
                isAmbientActive
                  ? 'bg-purple-100 dark:bg-purple-900/60 text-purple-900 dark:text-purple-200 border-purple-400'
                  : 'bg-slate-100 dark:bg-[#121432] border-slate-200 dark:border-purple-500/30 text-slate-700 dark:text-purple-200 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              {isAmbientActive ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                  <span>Mélodie Lofi Active</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Ambiance Douce</span>
                </>
              )}
            </button>
          </div>
        </div>

        {sessionCompleted && (
          <div className="mt-6 p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs text-center space-y-1 animate-fadeIn">
            <div className="flex items-center justify-center gap-1.5 font-bold text-emerald-300">
              <CheckCircle2 className="w-4 h-4" />
              <span>Moment de Sérénité Réussi !</span>
            </div>
            <p className="text-slate-300">
              Votre séance d'étude a fleuri. Les briques et les fleurs sont prêtes pour vos constructions !
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
