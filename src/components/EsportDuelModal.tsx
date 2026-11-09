import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Swords,
  Trophy,
  Zap,
  Timer,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Sparkles,
  Volume2,
  RefreshCw,
} from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { speechHelper } from '../utils/speech';
import { useLanguage } from '../utils/i18n';

import { StudyLanguage } from '../types/game';

interface EsportDuelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEarnRewards: (bricks: number, xp: number) => void;
  selectedStudyLanguage?: StudyLanguage;
  onSelectStudyLanguage?: (lang: StudyLanguage) => void;
}

interface DuelQuestion {
  id: string;
  category: string;
  flag: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  langVoice?: string;
  lang?: StudyLanguage | 'math' | 'science';
}

const DUEL_QUESTIONS: DuelQuestion[] = [
  {
    id: 'dq_1',
    category: 'Néerlandais · Woordenschat',
    flag: '🇳🇱',
    question: 'Que signifie « Goedemorgen » en français ?',
    options: ['Bonjour ! (le matin)', 'Bonne nuit', 'S’il vous plaît', 'Au revoir'],
    correctIndex: 0,
    explanation: '« Goedemorgen » est le salut chaleureux du matin en néerlandais.',
    langVoice: 'nl-NL',
    lang: 'nl',
  },
  {
    id: 'dq_2',
    category: 'Maths Blitz · Multiplication',
    flag: '🧮',
    question: 'Combien font 8 × 7 ?',
    options: ['54', '56', '58', '64'],
    correctIndex: 1,
    explanation: '8 × 7 = 56. Une table fondamentale en calcul mental !',
    lang: 'math',
  },
  {
    id: 'dq_3',
    category: 'Néerlandais · Politesse',
    flag: '🇳🇱',
    question: 'Comment dit-on « Merci beaucoup » en néerlandais ?',
    options: ['Alsjeblieft', 'Dank je wel', 'Tot ziens', 'Geen dank'],
    correctIndex: 1,
    explanation: '« Dank je wel » signifie merci beaucoup / je te remercie.',
    langVoice: 'nl-NL',
    lang: 'nl',
  },
  {
    id: 'dq_4',
    category: 'Français · Orthographe',
    flag: '🇫🇷',
    question: 'Complétez : « Les étoiles ont _______ dans le ciel alpin. »',
    options: ['brillé', 'brillés', 'brillées', 'briller'],
    correctIndex: 0,
    explanation: 'Avec l’auxiliaire avoir sans COD placé avant, le participe passé ne s’accorde pas.',
    lang: 'fr',
  },
  {
    id: 'dq_5',
    category: 'Anglais · Vocabulaire',
    flag: '🇬🇧',
    question: 'Que signifie le mot « Bridge » en architecture ?',
    options: ['Une tour', 'Un pont', 'Un tunnel', 'Une forteresse'],
    correctIndex: 1,
    explanation: '« Bridge » désigne un pont qui relie les deux rives d’une cité.',
    langVoice: 'en-US',
    lang: 'en',
  },
  {
    id: 'dq_6',
    category: 'Néerlandais · Couleurs',
    flag: '🇳🇱',
    question: 'Quelle est la traduction de la couleur « Groen » ?',
    options: ['Rouge', 'Bleu', 'Vert', 'Jaune'],
    correctIndex: 2,
    explanation: '« Groen » signifie Vert (comme notre émeraude) !',
    langVoice: 'nl-NL',
    lang: 'nl',
  },
  {
    id: 'dq_es_1',
    category: 'Espagnol · Saludos',
    flag: '🇪🇸',
    question: 'Que signifie « ¡Buenos días! » ?',
    options: ['Bonjour (le matin)', 'Bonne nuit', 'À demain', 'S’il te plaît'],
    correctIndex: 0,
    explanation: '« ¡Buenos días! » est la salutation chaleureuse matinale en espagnol.',
    langVoice: 'es-ES',
    lang: 'es',
  },
  {
    id: 'dq_es_2',
    category: 'Espagnol · Cortesía',
    flag: '🇪🇸',
    question: 'Comment dit-on « S’il vous plaît » en espagnol ?',
    options: ['Por favor', 'Muchas gracias', 'De nada', 'Hasta luego'],
    correctIndex: 0,
    explanation: '« Por favor » est la formule de politesse essentielle.',
    langVoice: 'es-ES',
    lang: 'es',
  },
  {
    id: 'dq_en_2',
    category: 'Anglais · Expressions',
    flag: '🇬🇧',
    question: 'Que signifie « A piece of cake » ?',
    options: ['C’est un jeu d’enfant', 'C’est une part de gâteau', 'C’est très difficile', 'C’est cher'],
    correctIndex: 0,
    explanation: '« A piece of cake » est l’équivalent anglais de « c’est du gâteau ».',
    langVoice: 'en-US',
    lang: 'en',
  },
];

const BOT_RIVALS = [
  { name: 'Valkyrie_NL', rank: 'Maître Émeraude ★', avatar: '🇳🇱', elo: 1420 },
  { name: 'S1mple_Brain', rank: 'Diamant III', avatar: '⚡', elo: 1380 },
  { name: 'MarieCurie_Bot', rank: 'Pionnière Suprême', avatar: '🔬', elo: 1450 },
  { name: 'Hypatia_Speed', rank: 'Grand Maître', avatar: '📐', elo: 1410 },
];

export const EsportDuelModal: React.FC<EsportDuelModalProps> = ({
  isOpen,
  onClose,
  onEarnRewards,
  selectedStudyLanguage = 'nl',
  onSelectStudyLanguage,
}) => {
  const { t } = useLanguage();
  const [gameState, setGameState] = useState<'matchmaking' | 'playing' | 'gameover'>('matchmaking');
  const [selectedRival, setSelectedRival] = useState(BOT_RIVALS[0]);
  const [duelLangFocus, setDuelLangFocus] = useState<StudyLanguage | 'mix'>(selectedStudyLanguage);
  const [currentRound, setCurrentRound] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [timer, setTimer] = useState(10);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [botSelectedOption, setBotSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeQuestions = React.useMemo(() => {
    if (duelLangFocus === 'mix') return DUEL_QUESTIONS;
    const matched = DUEL_QUESTIONS.filter((q) => q.lang === duelLangFocus);
    if (matched.length < 5) {
      const fillers = DUEL_QUESTIONS.filter((q) => q.lang !== duelLangFocus);
      return [...matched, ...fillers].slice(0, 5);
    }
    return matched;
  }, [duelLangFocus]);

  // Lobby setup
  const handleStartDuel = (rival = selectedRival) => {
    setSelectedRival(rival);
    soundEngine.playSuccess();
    setGameState('playing');
    setCurrentRound(0);
    setPlayerScore(0);
    setBotScore(0);
    setTimer(10);
    setSelectedOption(null);
    setBotSelectedOption(null);
    setIsAnswered(false);
  };

  // Round Timer & Bot simulated behavior
  useEffect(() => {
    if (gameState !== 'playing' || isAnswered) return;

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Bot picks after 2 to 4 seconds
    const botThinkingTime = Math.random() * 2500 + 1800;
    const botTimer = setTimeout(() => {
      if (!isAnswered) {
        const currentQ = activeQuestions[currentRound % activeQuestions.length];
        // 80% accuracy for bot
        const botCorrect = Math.random() < 0.82;
        const botPick = botCorrect
          ? currentQ.correctIndex
          : (currentQ.correctIndex + 1) % currentQ.options.length;
        setBotSelectedOption(botPick);
        if (botCorrect) {
          setBotScore((s) => s + 100);
        }
      }
    }, botThinkingTime);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      clearTimeout(botTimer);
    };
  }, [gameState, currentRound, isAnswered, activeQuestions]);

  const handleTimeExpired = () => {
    setIsAnswered(true);
    soundEngine.playError();
    setTimeout(proceedToNextRound, 2000);
  };

  const handleSelectAnswer = (index: number) => {
    if (isAnswered) return;

    const currentQ = activeQuestions[currentRound % activeQuestions.length];
    const isCorrect = index === currentQ.correctIndex;
    setSelectedOption(index);
    setIsAnswered(true);

    if (isCorrect) {
      soundEngine.playSuccess();
      const speedBonus = timer * 10;
      setPlayerScore((s) => s + 100 + speedBonus);
    } else {
      soundEngine.playError();
    }

    setTimeout(proceedToNextRound, 2000);
  };

  const proceedToNextRound = () => {
    if (currentRound >= 4) {
      // 5 rounds complete
      setGameState('gameover');
      const isWinner = playerScore >= botScore;
      if (isWinner) {
        soundEngine.playLevelUp();
        onEarnRewards(35, 120);
      } else {
        soundEngine.playClick();
        onEarnRewards(15, 50);
      }
    } else {
      setCurrentRound((r) => r + 1);
      setTimer(10);
      setSelectedOption(null);
      setBotSelectedOption(null);
      setIsAnswered(false);
    }
  };

  if (!isOpen) return null;

  const currentQ = activeQuestions[currentRound % activeQuestions.length];
  const totalScore = playerScore + botScore || 1;
  const playerPercent = Math.min(90, Math.max(10, (playerScore / totalScore) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn select-none overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl border border-[#232838] bg-[#0d0f19] text-slate-100 shadow-[0_0_60px_rgba(16,185,129,0.3)] overflow-hidden">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-[#111422] border-b border-[#232838] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-300 p-0.5 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              <div className="w-full h-full bg-[#111422] rounded-[10px] flex items-center justify-center text-emerald-400 font-bold">
                <Swords className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-white uppercase tracking-tight font-sans">
                  {t.duel1v1} · Arène Matchmaking
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold">
                  Saison 1 Émeraude
                </span>
              </div>
              <p className="text-xs text-slate-400">
                5 rounds éclairs de rapidité : vocabulaire néerlandais, calcul mental & orthographe.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-[#1A1D2B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 bg-[#090b14]">
          {/* STATE 1: HONEST TRAINING LOBBY */}
          {gameState === 'matchmaking' && (
            <div className="py-6 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  ⚔️
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white uppercase font-sans">
                  Duel 1v1 d'Entraînement Académique
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Affrontez une IA d'entraînement en 5 questions rapides (vocabulaire néerlandais, calculs éclairs, français, anglais).
                </p>
              </div>

              {/* Language Focus Selection */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold px-1 flex items-center justify-between">
                  <span>Choisir la langue d'étude du duel :</span>
                  <span className="text-[10px] text-slate-400 font-normal">5 questions chrono</span>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {[
                    { id: 'nl' as StudyLanguage, label: 'Néerlandais', flag: '🇳🇱' },
                    { id: 'en' as StudyLanguage, label: 'Anglais', flag: '🇬🇧' },
                    { id: 'es' as StudyLanguage, label: 'Espagnol', flag: '🇪🇸' },
                    { id: 'fr' as StudyLanguage, label: 'Français', flag: '🇫🇷' },
                    { id: 'mix' as const, label: 'Mixte Émeraude', flag: '🎲' },
                  ].map((item) => {
                    const isSelected = duelLangFocus === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          soundEngine.playClick();
                          setDuelLangFocus(item.id);
                          if (item.id !== 'mix') {
                            onSelectStudyLanguage?.(item.id);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 border ${
                          isSelected
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-102'
                            : 'bg-[#111422] border-[#222538] text-slate-400 hover:text-white hover:border-emerald-500/50'
                        }`}
                      >
                        <span>{item.flag}</span>
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bot Rival Selection Cards */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold px-1">
                  Sélectionnez votre adversaire d'entraînement :
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {BOT_RIVALS.map((rival) => {
                    const isSelected = selectedRival.name === rival.name;
                    return (
                      <button
                        key={rival.name}
                        onClick={() => {
                          soundEngine.playClick();
                          setSelectedRival(rival);
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-emerald-950/60 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                            : 'bg-[#111422] border-[#222536] hover:border-emerald-500/50 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-2xl shrink-0">{rival.avatar}</span>
                          <div className="min-w-0">
                            <div className="font-bold text-xs truncate text-white">{rival.name}</div>
                            <div className="text-[10px] text-emerald-400 font-mono">{rival.rank}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold shrink-0">
                          {rival.elo} Elo
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Button */}
              <div className="text-center pt-2">
                <button
                  onClick={() => handleStartDuel(selectedRival)}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 text-slate-950 font-black text-sm uppercase tracking-wider rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
                >
                  <Swords className="w-4 h-4" />
                  <span>Lancer le Match contre {selectedRival.name}</span>
                </button>
              </div>
            </div>
          )}

          {/* STATE 2: PLAYING DUEL ROUND */}
          {gameState === 'playing' && (
            <div className="space-y-6">
              {/* Top Tug-Of-War Bar between Player and Bot */}
              <div className="p-4 rounded-2xl bg-[#111422] border border-[#232838] space-y-2.5 shadow-lg">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👩‍🎨</span>
                    <div>
                      <span className="font-bold text-emerald-300">Vous (Architecte)</span>
                      <div className="text-[11px] text-emerald-400 font-bold">{playerScore} pts</div>
                    </div>
                  </div>

                  {/* Round Counter & Timer */}
                  <div className="text-center">
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                      Round {currentRound + 1} / 5
                    </div>
                    <div className="flex items-center justify-center gap-1 text-sm font-black text-white font-mono mt-0.5">
                      <Timer className="w-4 h-4 text-emerald-400 animate-pulse" />
                      <span>{timer}s</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-right">
                    <div>
                      <span className="font-bold text-cyan-300">{selectedRival.name}</span>
                      <div className="text-[11px] text-cyan-400 font-bold">{botScore} pts</div>
                    </div>
                    <span className="text-lg">{selectedRival.avatar}</span>
                  </div>
                </div>

                {/* Tug of war line */}
                <div className="relative w-full h-3 bg-[#0a0c16] rounded-full overflow-hidden border border-slate-800 flex">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                    style={{ width: `${playerPercent}%` }}
                  />
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                    style={{ width: `${100 - playerPercent}%` }}
                  />
                </div>
              </div>

              {/* Question Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#121626] border border-emerald-500/30 space-y-4 shadow-xl">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <span>{currentQ.flag}</span>
                    <span>{currentQ.category}</span>
                  </span>

                  {currentQ.langVoice && (
                    <button
                      onClick={() => speechHelper.speak(currentQ.question, currentQ.langVoice)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-[11px] text-emerald-300 hover:bg-emerald-900/60 transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Écouter</span>
                    </button>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                  {currentQ.question}
                </h3>

                {/* Options 2x2 Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {currentQ.options.map((opt, idx) => {
                    const isPicked = selectedOption === idx;
                    const isCorrect = idx === currentQ.correctIndex;

                    let btnStyle =
                      'bg-[#0a0c18] hover:bg-[#141930] border-slate-800 text-slate-200 hover:border-emerald-500/50';

                    if (isAnswered) {
                      if (isCorrect) {
                        btnStyle =
                          'bg-emerald-950/80 border-emerald-400 text-emerald-200 font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]';
                      } else if (isPicked && !isCorrect) {
                        btnStyle = 'bg-rose-950/80 border-rose-400 text-rose-200 font-bold';
                      } else {
                        btnStyle = 'bg-[#060812] border-slate-900 text-slate-600 opacity-40';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isAnswered}
                        onClick={() => handleSelectAnswer(idx)}
                        className={`p-4 rounded-xl border text-left text-xs font-medium transition-all active:scale-95 flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        {isAnswered && isPicked && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-400" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 leading-relaxed">
                    💡 <strong className="text-white">Explication : </strong>
                    {currentQ.explanation}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STATE 3: GAME OVER / VICTORY SUMMARY */}
          {gameState === 'gameover' && (
            <div className="py-8 text-center space-y-6 animate-fadeIn">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-1 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                {playerScore >= botScore ? '🏆' : '⚔️'}
              </div>

              <div className="space-y-1.5">
                <h3 className="text-2xl font-black text-white uppercase font-sans">
                  {playerScore >= botScore ? 'Victoire Éclatante !' : 'Duel Terminé avec Bravoure'}
                </h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  {playerScore >= botScore
                    ? `Vous avez surpassé ${selectedRival.name} grâce à votre précision et votre rapidité !`
                    : `Belle tentative contre ${selectedRival.name}. Réessayez pour remonter au classement !`}
                </p>
              </div>

              {/* Scoreboard Card */}
              <div className="max-w-sm mx-auto p-4 rounded-2xl bg-[#111424] border border-slate-800 grid grid-cols-2 gap-4 text-center">
                <div className="p-3 rounded-xl bg-[#0a0c18] border border-emerald-500/30">
                  <div className="text-[10px] text-emerald-400 font-mono uppercase font-bold">Votre Score</div>
                  <div className="text-2xl font-black text-emerald-300 font-mono mt-1">{playerScore}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#0a0c18] border border-cyan-500/30">
                  <div className="text-[10px] text-cyan-400 font-mono uppercase font-bold">{selectedRival.name}</div>
                  <div className="text-2xl font-black text-cyan-300 font-mono mt-1">{botScore}</div>
                </div>
              </div>

              {/* Loot Earned */}
              <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-xs font-mono text-emerald-300 max-w-sm mx-auto">
                Récompense : +{playerScore >= botScore ? '35' : '15'} 🧱 briques dorées · +{playerScore >= botScore ? '120' : '50'} XP
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setGameState('matchmaking')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Rejouer un Match</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-[#161a2c] hover:bg-[#20253e] text-slate-300 font-semibold text-xs border border-slate-700 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
