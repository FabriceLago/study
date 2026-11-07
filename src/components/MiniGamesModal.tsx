import React, { useState, useEffect } from 'react';
import {
  Zap,
  Timer,
  Trophy,
  X,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/audio';

interface MiniGamesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEarnRewards: (bricks: number, flowers: number, xp: number) => void;
}

type MiniGameMode = 'hub' | 'math' | 'memory';

interface MathQuestion {
  question: string;
  options: number[];
  answer: number;
}

interface MemoryCard {
  id: string;
  pairId: number;
  label: string;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MEMORY_PAIRS = [
  { id: 1, fr: 'Chat', en: 'Cat', emoji: '🐱' },
  { id: 2, fr: 'Soleil', en: 'Sun', emoji: '☀️' },
  { id: 3, fr: 'Livre', en: 'Book', emoji: '📖' },
  { id: 4, fr: 'Maison', en: 'House', emoji: '🏡' },
  { id: 5, fr: 'Étoile', en: 'Star', emoji: '⭐' },
  { id: 6, fr: 'Fleur', en: 'Flower', emoji: '🌸' },
];

export const MiniGamesModal: React.FC<MiniGamesModalProps> = ({
  isOpen,
  onClose,
  onEarnRewards,
}) => {
  const [gameMode, setGameMode] = useState<MiniGameMode>('hub');
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  // Math Game State
  const [currentMathQ, setCurrentMathQ] = useState<MathQuestion | null>(null);

  // Memory Game State
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);

  // Generate a kid-friendly math question (tables, doubles, simple additions)
  const generateMathQuestion = (): MathQuestion => {
    const types = ['mult', 'add', 'sub'];
    const type = types[Math.floor(Math.random() * types.length)];

    let q = '';
    let ans = 0;

    if (type === 'mult') {
      const a = Math.floor(Math.random() * 8) + 2; // 2 to 9
      const b = Math.floor(Math.random() * 8) + 2; // 2 to 9
      q = `${a} × ${b}`;
      ans = a * b;
    } else if (type === 'add') {
      const a = Math.floor(Math.random() * 45) + 10;
      const b = Math.floor(Math.random() * 45) + 10;
      q = `${a} + ${b}`;
      ans = a + b;
    } else {
      const a = Math.floor(Math.random() * 50) + 25;
      const b = Math.floor(Math.random() * 20) + 5;
      q = `${a} - ${b}`;
      ans = a - b;
    }

    const wrong1 = ans + (Math.random() > 0.5 ? 2 : -2);
    const wrong2 = ans + (Math.random() > 0.5 ? 5 : -5);
    const wrong3 = ans + 10;

    const options = Array.from(new Set([ans, wrong1, wrong2, wrong3])).slice(0, 4);
    while (options.length < 4) {
      options.push(ans + options.length + 1);
    }
    options.sort(() => Math.random() - 0.5);

    return { question: q, options, answer: ans };
  };

  // Start Math Game
  const startMathGame = () => {
    soundEngine.playSuccess();
    setGameMode('math');
    setTimeLeft(60);
    setScore(0);
    setIsGameOver(false);
    setCurrentMathQ(generateMathQuestion());
  };

  // Start Memory Game
  const startMemoryGame = () => {
    soundEngine.playSuccess();
    setGameMode('memory');
    setTimeLeft(60);
    setScore(0);
    setIsGameOver(false);
    setSelectedCards([]);

    const deck: MemoryCard[] = [];
    MEMORY_PAIRS.forEach((pair) => {
      deck.push({
        id: `${pair.id}_fr`,
        pairId: pair.id,
        label: pair.fr,
        emoji: pair.emoji,
        isFlipped: false,
        isMatched: false,
      });
      deck.push({
        id: `${pair.id}_en`,
        pairId: pair.id,
        label: pair.en,
        emoji: pair.emoji,
        isFlipped: false,
        isMatched: false,
      });
    });

    deck.sort(() => Math.random() - 0.5);
    setCards(deck);
  };

  // Timer countdown
  useEffect(() => {
    if (gameMode === 'hub' || isGameOver) return;

    if (timeLeft <= 0) {
      setIsGameOver(true);
      soundEngine.playLevelUp();
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });

      const earnedBricks = score * 5;
      const earnedFlowers = Math.floor(score * 2.5);
      const earnedXp = score * 15;
      onEarnRewards(earnedBricks, earnedFlowers, earnedXp);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameMode, timeLeft, isGameOver, score, onEarnRewards]);

  // Answer Math
  const handleAnswerMath = (chosen: number) => {
    if (!currentMathQ || isGameOver) return;

    if (chosen === currentMathQ.answer) {
      soundEngine.playSuccess();
      setScore((prev) => prev + 1);
      setCurrentMathQ(generateMathQuestion());
    } else {
      soundEngine.playError();
      setCurrentMathQ(generateMathQuestion());
    }
  };

  // Click Memory Card
  const handleCardClick = (index: number) => {
    if (isGameOver || selectedCards.length >= 2) return;
    const clicked = cards[index];
    if (clicked.isFlipped || clicked.isMatched) return;

    soundEngine.playClick();
    const updatedCards = [...cards];
    updatedCards[index].isFlipped = true;
    setCards(updatedCards);

    const newSelected = [...selectedCards, index];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      const card1 = updatedCards[newSelected[0]];
      const card2 = updatedCards[newSelected[1]];

      if (card1.pairId === card2.pairId) {
        soundEngine.playSuccess();
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) =>
              i === newSelected[0] || i === newSelected[1]
                ? { ...c, isMatched: true }
                : c
            )
          );
          setScore((s) => s + 2);
          setSelectedCards([]);
        }, 400);
      } else {
        soundEngine.playError();
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) =>
              i === newSelected[0] || i === newSelected[1]
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setSelectedCards([]);
        }, 900);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-2xl flex flex-col rounded-3xl border border-purple-500/40 bg-[#0d0e22] text-slate-100 shadow-[0_0_50px_rgba(245,158,11,0.2)] overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-amber-600/90 via-rose-600/90 to-purple-800/90 text-white flex items-center justify-between border-b border-purple-500/20 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-xl shadow-md border border-white/20">
              ⚡
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-editorial leading-tight text-white">
                Mini-Jeux Flash de 60 Secondes
              </h3>
              <p className="text-xs text-amber-200">
                Gagne des briques dorées et des fleurs en t'amusant !
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Game Mode Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-[#090a18]">
          {gameMode === 'hub' && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h4 className="text-base font-bold font-editorial text-white">
                  Choisis ton défi express ! ⏱️
                </h4>
                <p className="text-xs text-purple-300/80">
                  Tu as 60 secondes pour battre ton record personnel.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Game 1: Calcul Express */}
                <div className="p-5 rounded-3xl bg-[#12132a] border border-amber-500/30 hover:border-amber-400/60 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between space-y-4 text-left group">
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-2xl flex items-center justify-center">
                      🧮
                    </div>
                    <h5 className="text-sm font-bold font-editorial text-amber-300">
                      Calcul Express (La Course aux Briques)
                    </h5>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Résous un maximum de calculs mentaux (tables de multiplication et additions) en 1 minute.
                    </p>
                    <div className="text-[11px] font-mono text-amber-400 font-semibold">
                      Récompense : +5 🧱 par bonne réponse
                    </div>
                  </div>

                  <button
                    onClick={startMathGame}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs shadow-md transition-transform active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Lancer le Calcul Express</span>
                  </button>
                </div>

                {/* Game 2: Mémory Anglais */}
                <div className="p-5 rounded-3xl bg-[#12132a] border border-purple-500/30 hover:border-purple-400/60 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between space-y-4 text-left group">
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/30 text-2xl flex items-center justify-center">
                      🇬🇧
                    </div>
                    <h5 className="text-sm font-bold font-editorial text-purple-300">
                      Mémory Anglais-Français
                    </h5>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Retrouve les paires de mots en anglais et en français le plus vite possible.
                    </p>
                    <div className="text-[11px] font-mono text-purple-300 font-semibold">
                      Récompense : +10 🧱 et +5 🌸 par paire
                    </div>
                  </div>

                  <button
                    onClick={startMemoryGame}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xs shadow-md transition-transform active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Lancer le Mémory</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Active Math Game */}
          {gameMode === 'math' && (
            <div className="space-y-5">
              {/* Game Status Bar */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#12132b] border border-amber-500/30 text-xs font-bold">
                <div className="flex items-center gap-1.5 text-amber-300 font-mono">
                  <Timer className="w-4 h-4 text-amber-400" />
                  <span className="text-base">{timeLeft}s</span>
                </div>

                <div className="flex items-center gap-1 text-pink-400 font-mono text-sm">
                  <span>Score : {score}</span>
                </div>

                <button
                  onClick={() => setGameMode('hub')}
                  className="text-slate-400 hover:text-white text-xs underline"
                >
                  Quitter
                </button>
              </div>

              {!isGameOver && currentMathQ && (
                <div className="space-y-5 text-center py-4">
                  <div className="text-4xl sm:text-5xl font-mono font-bold text-amber-300 tracking-wider drop-shadow-md">
                    {currentMathQ.question} = ?
                  </div>

                  <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto pt-2">
                    {currentMathQ.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleAnswerMath(opt)}
                        className="py-4 rounded-2xl bg-[#141634] hover:bg-amber-500/20 border-2 border-amber-500/40 hover:border-amber-400 font-mono text-2xl font-bold text-white shadow-md transition-all active:scale-95"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isGameOver && (
                <div className="text-center space-y-4 py-6 bg-[#12132a] rounded-3xl border border-amber-500/40 p-6 shadow-xl">
                  <div className="text-4xl">🎉</div>
                  <h4 className="text-xl font-bold font-editorial text-amber-300">
                    Temps écoulé ! Superbe partie !
                  </h4>
                  <div className="text-sm text-slate-300">
                    Tu as réussi <strong className="text-white">{score} calculs</strong>.
                  </div>
                  <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold max-w-xs mx-auto">
                    Gagné : +{score * 5} 🧱 Briques · +{score * 15} XP
                  </div>

                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      onClick={startMathGame}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-md"
                    >
                      Rejouer
                    </button>
                    <button
                      onClick={() => setGameMode('hub')}
                      className="px-4 py-2 rounded-xl bg-purple-950/80 border border-purple-500/30 text-purple-200 font-bold text-xs"
                    >
                      Menu des jeux
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Active Memory Game */}
          {gameMode === 'memory' && (
            <div className="space-y-4">
              {/* Game Status Bar */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#12132b] border border-purple-500/30 text-xs font-bold">
                <div className="flex items-center gap-1.5 text-purple-300 font-mono">
                  <Timer className="w-4 h-4 text-purple-400" />
                  <span className="text-base">{timeLeft}s</span>
                </div>

                <div className="flex items-center gap-1 text-pink-400 font-mono text-sm">
                  <span>Paires trouvées : {score / 2} / 6</span>
                </div>

                <button
                  onClick={() => setGameMode('hub')}
                  className="text-slate-400 hover:text-white text-xs underline"
                >
                  Quitter
                </button>
              </div>

              {!isGameOver && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-w-md mx-auto">
                  {cards.map((card, i) => (
                    <button
                      key={card.id}
                      onClick={() => handleCardClick(i)}
                      className={`h-20 rounded-2xl border-2 flex flex-col items-center justify-center p-1 text-center font-bold text-xs transition-all transform ${
                        card.isMatched
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 opacity-60'
                          : card.isFlipped
                          ? 'bg-purple-950/80 border-purple-400 text-purple-100 scale-102 shadow-lg'
                          : 'bg-[#12142e] border-purple-500/20 text-slate-500 hover:border-purple-400/50 hover:bg-[#1a1c3d]'
                      }`}
                    >
                      {card.isFlipped || card.isMatched ? (
                        <>
                          <span className="text-lg">{card.emoji}</span>
                          <span className="text-[11px] font-sans truncate mt-0.5 text-white">
                            {card.label}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg text-purple-400/50">❓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {isGameOver && (
                <div className="text-center space-y-4 py-6 bg-[#12132a] rounded-3xl border border-purple-500/40 p-6 shadow-xl">
                  <div className="text-4xl">🌟</div>
                  <h4 className="text-xl font-bold font-editorial text-purple-300">
                    Défi Mémory terminé !
                  </h4>
                  <div className="text-sm text-slate-300">
                    Tu as trouvé <strong className="text-white">{score / 2} paires</strong> de mots bilingues.
                  </div>
                  <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-purple-200 text-xs font-mono font-bold max-w-xs mx-auto">
                    Gagné : +{score * 5} 🧱 · +{Math.floor(score * 2.5)} 🌸
                  </div>

                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      onClick={startMemoryGame}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs shadow-md"
                    >
                      Rejouer
                    </button>
                    <button
                      onClick={() => setGameMode('hub')}
                      className="px-4 py-2 rounded-xl bg-purple-950/80 border border-purple-500/30 text-purple-200 font-bold text-xs"
                    >
                      Menu des jeux
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
