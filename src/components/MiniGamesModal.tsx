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
  Volume2,
  Waves,
  ArrowRight,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/audio';
import { speechHelper } from '../utils/speech';

interface MiniGamesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEarnRewards: (bricks: number, flowers: number, xp: number) => void;
}

type MiniGameMode = 'hub' | 'math' | 'memory' | 'polyglot' | 'locks';

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

interface PolyglotAudioQuestion {
  id: string;
  word: string;
  language: 'nl-NL' | 'en-US' | 'es-ES';
  langLabel: string;
  flag: string;
  options: string[];
  correctIndex: number;
  phonetic: string;
}

const MEMORY_PAIRS = [
  { id: 1, fr: 'Chat', en: 'Cat / Kat (NL)', emoji: '🐱' },
  { id: 2, fr: 'Soleil', en: 'Sun / Zon (NL)', emoji: '☀️' },
  { id: 3, fr: 'Livre', en: 'Book / Boek (NL)', emoji: '📖' },
  { id: 4, fr: 'Maison', en: 'House / Huis (NL)', emoji: '🏡' },
  { id: 5, fr: 'Étoile', en: 'Star / Ster (NL)', emoji: '⭐' },
  { id: 6, fr: 'Fleur', en: 'Flower / Bloem (NL)', emoji: '🌷' },
];

const POLYGLOT_QUESTIONS: PolyglotAudioQuestion[] = [
  {
    id: 'pq_1',
    word: 'Goedemorgen',
    language: 'nl-NL',
    langLabel: 'Néerlandais',
    flag: '🇳🇱',
    options: ['Bonjour (le matin)', 'Bonne nuit', 'Merci beaucoup', 'Au revoir'],
    correctIndex: 0,
    phonetic: 'Ghou-de-mor-khen',
  },
  {
    id: 'pq_2',
    word: 'Alsjeblieft',
    language: 'nl-NL',
    langLabel: 'Néerlandais',
    flag: '🇳🇱',
    options: ['S’il te plaît / Voici', 'Non merci', 'À demain', 'Félicitations'],
    correctIndex: 0,
    phonetic: 'Al-sye-blift',
  },
  {
    id: 'pq_3',
    word: 'Dank je wel',
    language: 'nl-NL',
    langLabel: 'Néerlandais',
    flag: '🇳🇱',
    options: ['Merci beaucoup', 'Comment vas-tu ?', 'Bonne chance', 'Au secours'],
    correctIndex: 0,
    phonetic: 'Dank ye vel',
  },
  {
    id: 'pq_4',
    word: 'Het huis',
    language: 'nl-NL',
    langLabel: 'Néerlandais',
    flag: '🇳🇱',
    options: ['La maison', 'Le bateau', 'Le pont', 'La tulipe'],
    correctIndex: 0,
    phonetic: 'Het heuys',
  },
  {
    id: 'pq_5',
    word: 'A piece of cake',
    language: 'en-US',
    langLabel: 'Anglais',
    flag: '🇬🇧',
    options: ['C’est très facile / Du gâteau', 'Une part de gâteau', 'Un secret', 'C’est trop cher'],
    correctIndex: 0,
    phonetic: 'Euh piis ov kéïk',
  },
  {
    id: 'pq_6',
    word: 'Once in a blue moon',
    language: 'en-US',
    langLabel: 'Anglais',
    flag: '🇬🇧',
    options: ['Très rarement', 'Tous les soirs', 'En été', 'Chaque semaine'],
    correctIndex: 0,
    phonetic: 'Ouans in euh blou moun',
  },
  {
    id: 'pq_7',
    word: '¡Buenos días!',
    language: 'es-ES',
    langLabel: 'Espagnol',
    flag: '🇪🇸',
    options: ['Bonjour', 'Bonsoir', 'Au revoir', 'Pardon'],
    correctIndex: 0,
    phonetic: 'Boué-noss di-ass',
  },
  {
    id: 'pq_8',
    word: 'Hoe gaat het?',
    language: 'nl-NL',
    langLabel: 'Néerlandais',
    flag: '🇳🇱',
    options: ['Comment vas-tu ?', 'Où habites-tu ?', 'Quelle heure est-il ?', 'Comment t’appelles-tu ?'],
    correctIndex: 0,
    phonetic: 'Hou khratt het?',
  },
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

  // Polyglot Audio State
  const [currentPolyQIndex, setCurrentPolyQIndex] = useState(0);

  // Canal Locks State
  const [canalLevel1, setCanalLevel1] = useState(10);
  const [canalLevel2, setCanalLevel2] = useState(4);
  const [canalLevel3, setCanalLevel3] = useState(8);
  const [boatBasin, setBoatBasin] = useState<1 | 2 | 3 | 4>(1); // 4 = exited
  const [locksSolvedCount, setLocksSolvedCount] = useState(0);

  // Generate math question
  const generateMathQuestion = (): MathQuestion => {
    const types = ['mult', 'add', 'sub'];
    const type = types[Math.floor(Math.random() * types.length)];

    let q = '';
    let ans = 0;

    if (type === 'mult') {
      const a = Math.floor(Math.random() * 8) + 2;
      const b = Math.floor(Math.random() * 8) + 2;
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

  // Start Math
  const startMathGame = () => {
    soundEngine.playSuccess();
    setGameMode('math');
    setTimeLeft(60);
    setScore(0);
    setIsGameOver(false);
    setCurrentMathQ(generateMathQuestion());
  };

  // Start Memory
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

  // Start Polyglot Audio
  const startPolyglotGame = () => {
    soundEngine.playSuccess();
    setGameMode('polyglot');
    setTimeLeft(60);
    setScore(0);
    setIsGameOver(false);
    setCurrentPolyQIndex(0);

    const firstQ = POLYGLOT_QUESTIONS[0];
    setTimeout(() => {
      speechHelper.speak(firstQ.word, firstQ.language);
    }, 400);
  };

  // Start Canal Locks
  const startLocksGame = () => {
    soundEngine.playSuccess();
    setGameMode('locks');
    setTimeLeft(60);
    setScore(0);
    setIsGameOver(false);
    setCanalLevel1(10);
    setCanalLevel2(4);
    setCanalLevel3(8);
    setBoatBasin(1);
    setLocksSolvedCount(0);
  };

  // Timer countdown
  useEffect(() => {
    if (gameMode === 'hub' || isGameOver) return;

    if (timeLeft <= 0) {
      setIsGameOver(true);
      soundEngine.playLevelUp();
      confetti({ particleCount: 80, spread: 75, origin: { y: 0.6 } });

      const earnedBricks = score * 6;
      const earnedFlowers = Math.floor(score * 3);
      const earnedXp = score * 20;
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

  // Answer Polyglot Audio
  const handleAnswerPolyglot = (idx: number) => {
    if (isGameOver) return;
    const currentQ = POLYGLOT_QUESTIONS[currentPolyQIndex];
    if (idx === currentQ.correctIndex) {
      soundEngine.playSuccess();
      setScore((prev) => prev + 1);
    } else {
      soundEngine.playError();
    }

    const nextIndex = (currentPolyQIndex + 1) % POLYGLOT_QUESTIONS.length;
    setCurrentPolyQIndex(nextIndex);
    const nextQ = POLYGLOT_QUESTIONS[nextIndex];
    setTimeout(() => {
      speechHelper.speak(nextQ.word, nextQ.language);
    }, 300);
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
          card1.isMatched = true;
          card2.isMatched = true;
          setCards([...updatedCards]);
          setSelectedCards([]);
          setScore((s) => s + 2);
        }, 400);
      } else {
        soundEngine.playSoftMiss();
        setTimeout(() => {
          card1.isFlipped = false;
          card2.isFlipped = false;
          setCards([...updatedCards]);
          setSelectedCards([]);
        }, 900);
      }
    }
  };

  // Canal Locks Actions
  const handleEqualize1and2 = () => {
    soundEngine.playClick();
    const avg = Math.round((canalLevel1 + canalLevel2) / 2);
    setCanalLevel1(avg);
    setCanalLevel2(avg);
  };

  const handleEqualize2and3 = () => {
    soundEngine.playClick();
    const avg = Math.round((canalLevel2 + canalLevel3) / 2);
    setCanalLevel2(avg);
    setCanalLevel3(avg);
  };

  const handleAdvanceBoat = () => {
    if (boatBasin === 1 && canalLevel1 === canalLevel2) {
      soundEngine.playSuccess();
      setBoatBasin(2);
    } else if (boatBasin === 2 && canalLevel2 === canalLevel3) {
      soundEngine.playSuccess();
      setBoatBasin(3);
    } else if (boatBasin === 3) {
      soundEngine.playLevelUp();
      setBoatBasin(4);
      setScore((s) => s + 3);
      setLocksSolvedCount((c) => c + 1);
      // Reset next boat
      setTimeout(() => {
        setBoatBasin(1);
        setCanalLevel1(Math.floor(Math.random() * 6) + 6);
        setCanalLevel2(Math.floor(Math.random() * 5) + 2);
        setCanalLevel3(Math.floor(Math.random() * 6) + 5);
      }, 700);
    } else {
      soundEngine.playError();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn select-none overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl border border-[#262A3D] bg-[#131520] text-slate-100 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#10121A] border-b border-[#222533] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 p-0.5 shadow-md">
              <div className="w-full h-full bg-[#10121A] rounded-[10px] flex items-center justify-center text-lg text-emerald-400 font-black">
                ⚡
              </div>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2 uppercase font-sans">
                <span>Arène Mini-Jeux 60s</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold">
                  CS2 Arcade
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Épreuves rapides : écoute polyglotte, calcul blitz et écluses hydrauliques.
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
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 bg-[#0C0D12]">
          {/* HUB MODE */}
          {gameMode === 'hub' && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h4 className="text-sm font-bold text-white">
                  Choisissez votre épreuve de 60 secondes :
                </h4>
                <p className="text-xs text-slate-400">
                  Chaque bonne réponse rapporte des briques dorées 🧱 et de l’expérience XP pour vos cités.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Game 1: L'Oreille Polyglotte (Nouveau !) */}
                <div className="p-4 rounded-2xl bg-[#161824] border border-[#262A3D] hover:border-emerald-500/50 shadow-xl transition-all flex flex-col justify-between space-y-3 text-left group">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">👂</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold">
                        🇳🇱 🇬🇧 🇪🇸 Audio
                      </span>
                    </div>
                    <h5 className="text-sm font-bold text-white tracking-tight">
                      L’Oreille Polyglotte (Audio 60s)
                    </h5>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Écoutez les mots prononcés en néerlandais, anglais ou espagnol et trouvez leur sens en un éclair.
                    </p>
                    <div className="text-[11px] font-mono text-emerald-400 font-semibold">
                      Récompense : +6 🪙 & +20 XP par mot
                    </div>
                  </div>

                  <button
                    onClick={startPolyglotGame}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Lancer le Défi Audio</span>
                  </button>
                </div>

                {/* Game 2: Calcul Express */}
                <div className="p-4 rounded-2xl bg-[#161824] border border-[#262A3D] hover:border-emerald-500/50 shadow-xl transition-all flex flex-col justify-between space-y-3 text-left group">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">🧮</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold">
                        Maths & Logique
                      </span>
                    </div>
                    <h5 className="text-sm font-bold text-white tracking-tight">
                      Calcul Express (Tables & Rapide)
                    </h5>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Multiplications et additions mentales rapides pour remporter des briques dorées.
                    </p>
                    <div className="text-[11px] font-mono text-emerald-400 font-semibold">
                      Récompense : +5 🪙 par calcul
                    </div>
                  </div>

                  <button
                    onClick={startMathGame}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Lancer Calcul Express</span>
                  </button>
                </div>

                {/* Game 3: Les Écluses d'Amsterdam (Nouveau !) */}
                <div className="p-4 rounded-2xl bg-[#161824] border border-[#262A3D] hover:border-cyan-500/50 shadow-xl transition-all flex flex-col justify-between space-y-3 text-left group">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">💧</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold">
                        🇳🇱 Hydraulique & Sciences
                      </span>
                    </div>
                    <h5 className="text-sm font-bold text-white tracking-tight">
                      Les Écluses d’Amsterdam
                    </h5>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Équilibrez les niveaux d'eau des canaux avec les vannes pour faire traverser la péniche marchande.
                    </p>
                    <div className="text-[11px] font-mono text-cyan-400 font-semibold">
                      Récompense : +18 🪙 par péniche sauvée
                    </div>
                  </div>

                  <button
                    onClick={startLocksGame}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Ouvrir les Écluses</span>
                  </button>
                </div>

                {/* Game 4: Mémory Multilingue */}
                <div className="p-4 rounded-2xl bg-[#161824] border border-[#282C40] hover:border-purple-500/50 shadow-xl transition-all flex flex-col justify-between space-y-3 text-left group">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">🃏</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30 font-bold">
                        Vocabulaire
                      </span>
                    </div>
                    <h5 className="text-sm font-bold text-white tracking-tight">
                      Mémory Bilingue & Mots Clés
                    </h5>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Retrouvez les paires de cartes et le vocabulaire néerlandais/anglais avant le gong.
                    </p>
                    <div className="text-[11px] font-mono text-purple-300 font-semibold">
                      Récompense : +10 🪙 et +5 💎
                    </div>
                  </div>

                  <button
                    onClick={startMemoryGame}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Lancer le Mémory</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ACTIVE POLYGLOT AUDIO GAME */}
          {gameMode === 'polyglot' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#070919] border border-slate-800 text-xs font-mono font-bold">
                <div className="flex items-center gap-2 text-cyan-300">
                  <Timer className="w-4 h-4 text-cyan-400" />
                  <span className="text-base">{timeLeft}s</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-300">
                  <Flame className="w-4 h-4 text-emerald-400" />
                  <span>Score : {score}</span>
                </div>
                <button
                  onClick={() => setGameMode('hub')}
                  className="text-slate-400 hover:text-white underline text-xs"
                >
                  Quitter
                </button>
              </div>

              {!isGameOver && (
                <div className="space-y-5 text-center py-2">
                  {(() => {
                    const currentQ = POLYGLOT_QUESTIONS[currentPolyQIndex];
                    return (
                      <>
                        <div className="p-5 rounded-2xl bg-[#070919] border border-cyan-500/40 space-y-3 max-w-md mx-auto shadow-xl">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-cyan-400">{currentQ.flag} {currentQ.langLabel}</span>
                            <span className="text-slate-500">Écoute attentivement</span>
                          </div>

                          <button
                            onClick={() => speechHelper.speak(currentQ.word, currentQ.language)}
                            className="w-20 h-20 mx-auto rounded-2xl bg-[#0A26E6] hover:bg-[#1F3BF5] text-white flex items-center justify-center shadow-[0_0_20px_rgba(10,38,230,0.5)] transition-all active:scale-95 group"
                            title="Réécouter la prononciation"
                          >
                            <Volume2 className="w-8 h-8 group-hover:scale-110 transition-transform" />
                          </button>

                          <div>
                            <div className="text-xl font-bold text-white tracking-wide">
                              « {currentQ.word} »
                            </div>
                            <div className="text-xs text-emerald-300 font-mono italic">
                              Prononciation : {currentQ.phonetic}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto pt-1">
                          {currentQ.options.map((opt, i) => (
                            <button
                              key={i}
                              onClick={() => handleAnswerPolyglot(i)}
                              className="p-3.5 rounded-xl bg-[#070919] hover:bg-[#0E1438] border border-slate-800 hover:border-[#0A26E6] text-xs sm:text-sm font-semibold text-slate-200 hover:text-white transition-all shadow-md active:scale-95 text-left"
                            >
                              <span className="font-mono text-cyan-400 mr-2">
                                {String.fromCharCode(65 + i)}.
                              </span>
                              <span>{opt}</span>
                            </button>
                          ))}
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {isGameOver && (
                <div className="text-center space-y-4 py-6 bg-[#070919] rounded-2xl border border-cyan-500/40 p-6 shadow-xl">
                  <div className="text-4xl">👂✨</div>
                  <h4 className="text-xl font-bold text-white">
                    Oreille Polyglotte en or !
                  </h4>
                  <div className="text-sm text-slate-300">
                    Tu as identifié <strong className="text-cyan-300">{score} mots polyglottes</strong> en 1 minute.
                  </div>
                  <div className="p-3 rounded-xl bg-[#0B0E23] border border-slate-800 text-cyan-300 text-xs font-mono font-bold max-w-xs mx-auto">
                    Gagné : +{score * 6} 🧱 · +{score * 20} XP
                  </div>

                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      onClick={startPolyglotGame}
                      className="px-4 py-2 rounded-xl bg-[#0A26E6] hover:bg-[#1F3BF5] text-white font-bold text-xs"
                    >
                      Rejouer
                    </button>
                    <button
                      onClick={() => setGameMode('hub')}
                      className="px-4 py-2 rounded-xl bg-[#0B0E23] border border-slate-800 text-slate-300 hover:text-white font-bold text-xs"
                    >
                      Menu des jeux
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ACTIVE CANAL LOCKS GAME */}
          {gameMode === 'locks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#070919] border border-slate-800 text-xs font-mono font-bold">
                <div className="flex items-center gap-2 text-blue-300">
                  <Timer className="w-4 h-4 text-blue-400" />
                  <span className="text-base">{timeLeft}s</span>
                </div>
                <div className="flex items-center gap-1.5 text-cyan-300">
                  <span>Péniches traversées : {locksSolvedCount}</span>
                </div>
                <button
                  onClick={() => setGameMode('hub')}
                  className="text-slate-400 hover:text-white underline text-xs"
                >
                  Quitter
                </button>
              </div>

              {!isGameOver && (
                <div className="space-y-5 text-center py-2 max-w-md mx-auto">
                  <div className="text-xs text-slate-400">
                    Objectif : Équilibrez les niveaux d’eau (mètres) pour ouvrir les sas et faire avancer la péniche ⛵ vers le port maritime !
                  </div>

                  {/* Canal 3 Basins Diagram */}
                  <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#070919] border border-slate-800">
                    {/* Basin 1 */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-mono text-cyan-400 font-bold">
                        Bassin Amstel
                      </div>
                      <div className="h-28 bg-slate-900 rounded-xl relative flex flex-col justify-end p-1 border border-slate-800 overflow-hidden">
                        <div
                          className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-lg transition-all duration-300"
                          style={{ height: `${canalLevel1 * 8}%` }}
                        />
                        {boatBasin === 1 && (
                          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-2xl animate-bounce">
                            ⛵
                          </div>
                        )}
                      </div>
                      <div className="text-xs font-mono text-white font-bold">{canalLevel1}m</div>
                    </div>

                    {/* Basin 2 */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-mono text-cyan-400 font-bold">
                        Bassin Central
                      </div>
                      <div className="h-28 bg-slate-900 rounded-xl relative flex flex-col justify-end p-1 border border-slate-800 overflow-hidden">
                        <div
                          className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-lg transition-all duration-300"
                          style={{ height: `${canalLevel2 * 8}%` }}
                        />
                        {boatBasin === 2 && (
                          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-2xl animate-bounce">
                            ⛵
                          </div>
                        )}
                      </div>
                      <div className="text-xs font-mono text-white font-bold">{canalLevel2}m</div>
                    </div>

                    {/* Basin 3 */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-mono text-cyan-400 font-bold">
                        Port Maritime (IJ)
                      </div>
                      <div className="h-28 bg-slate-900 rounded-xl relative flex flex-col justify-end p-1 border border-slate-800 overflow-hidden">
                        <div
                          className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-lg transition-all duration-300"
                          style={{ height: `${canalLevel3 * 8}%` }}
                        />
                        {boatBasin === 3 && (
                          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-2xl animate-bounce">
                            ⛵
                          </div>
                        )}
                      </div>
                      <div className="text-xs font-mono text-white font-bold">{canalLevel3}m</div>
                    </div>
                  </div>

                  {/* Valves Controls */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleEqualize1and2}
                      className="p-2.5 rounded-xl bg-[#070919] hover:bg-[#0E1438] border border-cyan-500/40 text-xs font-mono text-cyan-300 hover:text-white transition-all"
                    >
                      🌊 Vanne 1-2 (Égaliser)
                    </button>
                    <button
                      onClick={handleEqualize2and3}
                      className="p-2.5 rounded-xl bg-[#070919] hover:bg-[#0E1438] border border-cyan-500/40 text-xs font-mono text-cyan-300 hover:text-white transition-all"
                    >
                      🌊 Vanne 2-3 (Égaliser)
                    </button>
                  </div>

                  <button
                    onClick={handleAdvanceBoat}
                    className="w-full py-3 bg-[#0A26E6] hover:bg-[#1F3BF5] text-white rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(10,38,230,0.4)] transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <span>Faire Avancer la Péniche ⛵</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {isGameOver && (
                <div className="text-center space-y-4 py-6 bg-[#070919] rounded-2xl border border-blue-500/40 p-6 shadow-xl">
                  <div className="text-4xl">⛵🌊</div>
                  <h4 className="text-xl font-bold text-white">
                    Ingénieur Hydraulique Hors Pair !
                  </h4>
                  <div className="text-sm text-slate-300">
                    Tu as fait traverser <strong className="text-cyan-300">{locksSolvedCount} péniches</strong> à travers les écluses d’Amsterdam.
                  </div>
                  <div className="p-3 rounded-xl bg-[#0B0E23] border border-slate-800 text-cyan-300 text-xs font-mono font-bold max-w-xs mx-auto">
                    Gagné : +{locksSolvedCount * 18} 🧱 · +{locksSolvedCount * 40} XP
                  </div>

                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      onClick={startLocksGame}
                      className="px-4 py-2 rounded-xl bg-[#0A26E6] hover:bg-[#1F3BF5] text-white font-bold text-xs"
                    >
                      Rejouer
                    </button>
                    <button
                      onClick={() => setGameMode('hub')}
                      className="px-4 py-2 rounded-xl bg-[#0B0E23] border border-slate-800 text-slate-300 hover:text-white font-bold text-xs"
                    >
                      Menu des jeux
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ACTIVE MATH GAME */}
          {gameMode === 'math' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#070919] border border-slate-800 text-xs font-mono font-bold">
                <div className="flex items-center gap-1.5 text-emerald-300">
                  <Timer className="w-4 h-4 text-emerald-400" />
                  <span className="text-base">{timeLeft}s</span>
                </div>
                <div className="flex items-center gap-1 text-pink-400">
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
                  <div className="text-4xl sm:text-5xl font-mono font-bold text-emerald-300 tracking-wider drop-shadow-md">
                    {currentMathQ.question} = ?
                  </div>

                  <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto pt-2">
                    {currentMathQ.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleAnswerMath(opt)}
                        className="py-4 rounded-xl bg-[#070919] hover:bg-[#0E1438] border-2 border-emerald-500/40 hover:border-emerald-400 font-mono text-2xl font-bold text-white shadow-md transition-all active:scale-95"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isGameOver && (
                <div className="text-center space-y-4 py-6 bg-[#070919] rounded-2xl border border-emerald-500/40 p-6 shadow-xl">
                  <div className="text-4xl">🎉</div>
                  <h4 className="text-xl font-bold text-emerald-300">
                    Temps écoulé ! Superbe partie !
                  </h4>
                  <div className="text-sm text-slate-300">
                    Tu as résolu <strong className="text-white">{score} calculs</strong>.
                  </div>
                  <div className="p-3 rounded-xl bg-[#0B0E23] border border-slate-800 text-emerald-300 text-xs font-mono font-bold max-w-xs mx-auto">
                    Gagné : +{score * 5} 🧱 · +{score * 15} XP
                  </div>

                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      onClick={startMathGame}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs"
                    >
                      Rejouer
                    </button>
                    <button
                      onClick={() => setGameMode('hub')}
                      className="px-4 py-2 rounded-xl bg-[#0B0E23] border border-slate-800 text-slate-300 hover:text-white font-bold text-xs"
                    >
                      Menu des jeux
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ACTIVE MEMORY GAME */}
          {gameMode === 'memory' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#070919] border border-slate-800 text-xs font-mono font-bold">
                <div className="flex items-center gap-1.5 text-purple-300">
                  <Timer className="w-4 h-4 text-purple-400" />
                  <span className="text-base">{timeLeft}s</span>
                </div>
                <div className="flex items-center gap-1 text-pink-400">
                  <span>Paires : {score / 2} / 6</span>
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
                      className={`h-20 rounded-xl border-2 flex flex-col items-center justify-center p-1 text-center font-bold text-xs transition-all transform ${
                        card.isMatched
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 opacity-60'
                          : card.isFlipped
                          ? 'bg-[#0A26E6]/30 border-blue-400 text-white scale-102 shadow-lg'
                          : 'bg-[#070919] border-slate-800 text-slate-500 hover:border-[#0A26E6]/60 hover:bg-[#0E1438]'
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
                        <span className="text-lg text-slate-600">❓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {isGameOver && (
                <div className="text-center space-y-4 py-6 bg-[#070919] rounded-2xl border border-purple-500/40 p-6 shadow-xl">
                  <div className="text-4xl">🌟</div>
                  <h4 className="text-xl font-bold text-purple-300">
                    Défi Mémory terminé !
                  </h4>
                  <div className="text-sm text-slate-300">
                    Tu as trouvé <strong className="text-white">{score / 2} paires</strong> bilingues.
                  </div>
                  <div className="p-3 rounded-xl bg-[#0B0E23] border border-slate-800 text-purple-200 text-xs font-mono font-bold max-w-xs mx-auto">
                    Gagné : +{score * 5} 🧱 · +{Math.floor(score * 2.5)} 🌸
                  </div>

                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      onClick={startMemoryGame}
                      className="px-4 py-2 rounded-xl bg-[#0A26E6] hover:bg-[#1F3BF5] text-white font-bold text-xs"
                    >
                      Rejouer
                    </button>
                    <button
                      onClick={() => setGameMode('hub')}
                      className="px-4 py-2 rounded-xl bg-[#0B0E23] border border-slate-800 text-slate-300 hover:text-white font-bold text-xs"
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
