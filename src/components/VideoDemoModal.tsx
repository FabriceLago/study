import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Award,
  BookOpen,
  Zap,
  Globe2,
  CheckCircle2,
  Maximize2,
  Minimize2,
  FastForward,
  Compass,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface VideoDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartChallenge?: () => void;
  onOpenMiniGames?: () => void;
  onOpenCertificate?: () => void;
}

interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  startTime: number; // in seconds
  endTime: number; // in seconds
  narrationText: string;
  badge: string;
  color: string;
}

const TOTAL_DURATION = 60; // Exact 1-minute demo (60s)

const CHAPTERS: Chapter[] = [
  {
    id: 1,
    title: '1. L’Archipel des Savoirs & 4 Langues',
    subtitle: 'Français, Néerlandais (Nederlands), Anglais & Espagnol',
    startTime: 0,
    endTime: 15,
    narrationText:
      'Bienvenue sur Study ! Explorez l’archipel des savoirs où chaque matière scolaire devient une cité à bâtir. Choisissez d’étudier en français ou en langues vivantes comme le néerlandais, l’anglais ou l’espagnol.',
    badge: 'ACCUEIL & LANGUES',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 2,
    title: '2. Chantiers d’Édification & Mentors',
    subtitle: 'Questions interactives, Indices, Filtre 50/50 & Pause Thé',
    startTime: 15,
    endTime: 30,
    narrationText:
      'Relevez les défis d’édification ! Chaque bonne réponse ajoute une pierre à votre monument. En cas de doute, faites appel aux mentors pour un indice, un filtre cinquante-cinquante ou une pause thé réparatrice.',
    badge: 'COURS & RÉVISIONS',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 3,
    title: '3. Arène Blitz 60s & Défi Audio',
    subtitle: 'Calcul mental rapide et écoute polyglotte en immersion',
    startTime: 30,
    endTime: 45,
    narrationText:
      'Entrez dans l’arène blitz de 60 secondes ! Multipliez vos points au calcul mental express et développez votre oreille polyglotte grâce à la prononciation audio interactive en néerlandais et langues européennes.',
    badge: 'ARÈNE BLITZ 60S',
    color: 'from-amber-400 to-emerald-500',
  },
  {
    id: 4,
    title: '4. Passeport, Brevet Officiel & Réussite',
    subtitle: 'Visas diplomatiques, suivi de niveau et diplôme imprimable',
    startTime: 45,
    endTime: 60,
    narrationText:
      'Collectionnez vos visas dans le passeport diplomatique d’architecte et imprimez votre brevet officiel d’excellence muni de son sceau. Vous voilà prêt à conquérir le sommet des savoirs !',
    badge: 'DIPLÔME & SUCCÈS',
    color: 'from-emerald-400 to-teal-400',
  },
];

export const VideoDemoModal: React.FC<VideoDemoModalProps> = ({
  isOpen,
  onClose,
  onStartChallenge,
  onOpenMiniGames,
  onOpenCertificate,
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVoiceoverMuted, setIsVoiceoverMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.25 | 1.5>(1);
  const [showCaptions, setShowCaptions] = useState(true);
  const [captionLang, setCaptionLang] = useState<'fr' | 'nl' | 'en'>('fr');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTabVisual, setActiveTabVisual] = useState<'map' | 'chal' | 'blitz' | 'cert'>('map');

  const animationFrameRef = useRef<number | null>(null);
  const lastTickTimeRef = useRef<number>(0);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const currentChapterRef = useRef<number>(-1);

  // Identify current chapter
  const currentChapter =
    CHAPTERS.find((c) => currentTime >= c.startTime && currentTime < c.endTime) ||
    CHAPTERS[CHAPTERS.length - 1];

  // Stop speech synthesis safely
  const stopVoiceover = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      activeUtteranceRef.current = null;
    }
  }, []);

  // Speak narration text for current chapter
  const speakChapterNarration = useCallback(
    (chapter: Chapter) => {
      if (isVoiceoverMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) {
        return;
      }
      stopVoiceover();

      const text =
        captionLang === 'nl'
          ? chapter.id === 1
            ? 'Welkom bij Study! Verken de archipel van kennis en leer in het Frans, Nederlands, Engels en Spaans.'
            : chapter.id === 2
            ? 'Bouw monumenten met interactieve quizzen en vraag hulp aan mentoren.'
            : chapter.id === 3
            ? '60 seconden blitz arena! Snelle wiskunde en audio herkenning.'
            : 'Verzamel diploma stempels en print je officiële brevet!'
          : chapter.id === 1
          ? 'Bienvenue sur Study ! Explorez l’archipel des savoirs et étudiez en français, néerlandais, anglais et espagnol.'
          : chapter.id === 2
          ? 'Édifiez des monuments grâce à vos révisions, avec l’aide des mentors, du 50/50 et de la pause thé.'
          : chapter.id === 3
          ? 'Entrez dans l’arène blitz de 60 secondes : calcul mental et prononciation audio interactive.'
          : 'Validez votre passeport diplomatique et imprimez votre brevet d’excellence officiel !';

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = captionLang === 'nl' ? 'nl-NL' : 'fr-FR';
      utterance.rate = playbackSpeed * 0.95;
      utterance.pitch = 1.05;

      utterance.onend = () => {
        activeUtteranceRef.current = null;
      };

      activeUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [captionLang, isVoiceoverMuted, playbackSpeed, stopVoiceover]
  );

  // Sync active visual tab with chapter
  useEffect(() => {
    if (currentChapter.id === 1) setActiveTabVisual('map');
    else if (currentChapter.id === 2) setActiveTabVisual('chal');
    else if (currentChapter.id === 3) setActiveTabVisual('blitz');
    else if (currentChapter.id === 4) setActiveTabVisual('cert');
  }, [currentChapter.id]);

  // Handle Voiceover trigger when chapter changes
  useEffect(() => {
    if (!isOpen || !isPlaying) {
      stopVoiceover();
      return;
    }

    if (currentChapterRef.current !== currentChapter.id) {
      currentChapterRef.current = currentChapter.id;
      speakChapterNarration(currentChapter);
    }
  }, [currentChapter, isPlaying, isOpen, speakChapterNarration, stopVoiceover]);

  // Main 60-second video playback loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    lastTickTimeRef.current = performance.now();

    const loop = (now: number) => {
      const delta = (now - lastTickTimeRef.current) / 1000;
      lastTickTimeRef.current = now;

      setCurrentTime((prev) => {
        const nextTime = prev + delta * playbackSpeed;
        if (nextTime >= TOTAL_DURATION) {
          setIsPlaying(false);
          stopVoiceover();
          soundEngine.playSuccess();
          return TOTAL_DURATION;
        }
        return nextTime;
      });

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, stopVoiceover]);

  // Auto-play when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentTime(0);
      setIsPlaying(true);
      currentChapterRef.current = -1;
      soundEngine.playClick();
    } else {
      setIsPlaying(false);
      stopVoiceover();
    }
    return () => {
      stopVoiceover();
    };
  }, [isOpen, stopVoiceover]);

  if (!isOpen) return null;

  const handleTogglePlay = () => {
    soundEngine.playClick();
    if (currentTime >= TOTAL_DURATION) {
      setCurrentTime(0);
      currentChapterRef.current = -1;
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
      if (isPlaying) {
        stopVoiceover();
      }
    }
  };

  const handleRestart = () => {
    soundEngine.playClick();
    stopVoiceover();
    setCurrentTime(0);
    currentChapterRef.current = -1;
    setIsPlaying(true);
  };

  const handleSeek = (seconds: number) => {
    soundEngine.playClick();
    stopVoiceover();
    const clamped = Math.max(0, Math.min(TOTAL_DURATION, seconds));
    setCurrentTime(clamped);
    currentChapterRef.current = -1;
  };

  const handleJumpToChapter = (chapter: Chapter) => {
    soundEngine.playClick();
    stopVoiceover();
    setCurrentTime(chapter.startTime);
    currentChapterRef.current = -1;
    if (!isPlaying) setIsPlaying(true);
  };

  // Format mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = (currentTime / TOTAL_DURATION) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl animate-fadeIn select-none overflow-y-auto">
      <div
        className={`relative w-full ${
          isFullscreen ? 'max-w-[98vw] h-[96vh]' : 'max-w-5xl'
        } flex flex-col rounded-3xl border border-[#232838] bg-[#0c0e17] text-slate-100 shadow-[0_0_60px_rgba(16,185,129,0.25)] overflow-hidden transition-all duration-300`}
      >
        {/* Top Video Header */}
        <div className="p-3.5 sm:p-4.5 bg-[#10131f] border-b border-[#232838] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-300 p-0.5 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              <div className="w-full h-full bg-[#12141D] rounded-[10px] flex items-center justify-center text-emerald-400 font-bold">
                🎬
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-black tracking-tight text-white uppercase font-sans">
                  Vidéo Démo (1 Minute) · Découverte de Study
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold">
                  01:00 LIVE TOUR
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Présentation complète : Navigation sur l'Archipel, 4 Langues, Édification, Arène Blitz & Brevet Officiel.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-[#1A1D2B] transition-colors"
              title={isFullscreen ? 'Réduire' : 'Plein écran'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                stopVoiceover();
                onClose();
              }}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-[#1A1D2B] transition-colors"
              title="Fermer la vidéo démo"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Canvas Container (16:9 Esports HUD Display) */}
        <div className="relative flex-1 bg-black overflow-hidden flex flex-col justify-between min-h-[380px] sm:min-h-[460px]">
          {/* Visual Layer: Animated Mock Screens of Study */}
          <div className="absolute inset-0 z-0">
            {/* SCENE 1: Mountain Expedition & Multilingual Archipelago */}
            {activeTabVisual === 'map' && (
              <div className="relative w-full h-full bg-gradient-to-b from-[#090d1f] via-[#0f172a] to-[#060814] p-6 flex flex-col justify-between animate-fadeIn overflow-hidden">
                {/* Background Grid Pattern */}
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 50% 50%, rgba(16,185,129,0.2) 0%, transparent 70%), linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)',
                    backgroundSize: '100% 100%, 40px 40px, 40px 40px',
                  }}
                />

                {/* Top Simulation HUD Bar */}
                <div className="relative z-10 flex items-center justify-between p-3 rounded-2xl bg-[#101424]/90 border border-slate-700/60 shadow-xl backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-mono font-bold text-emerald-300">
                      STUDY · PLAN TACTIQUE DE L'EXPÉDITION
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                      🇳🇱 Néerlandais
                    </span>
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
                      🇬🇧 Anglais
                    </span>
                    <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40">
                      🇪🇸 Espagnol
                    </span>
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                      🇫🇷 Français
                    </span>
                  </div>
                </div>

                {/* Center Visual Mock: Mountain Waypoints with Animated Pulse */}
                <div className="relative z-10 my-auto grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto w-full">
                  {[
                    {
                      step: 'D1',
                      title: 'Français',
                      city: 'Cité des Lettres',
                      icon: '📚',
                      color: 'border-rose-500 text-rose-300',
                    },
                    {
                      step: 'D2',
                      title: 'Sciences & Nature',
                      city: 'Académie Curie',
                      icon: '🔬',
                      color: 'border-cyan-500 text-cyan-300',
                    },
                    {
                      step: 'D3',
                      title: 'Mathématiques',
                      city: 'Cité d’Hypatie',
                      icon: '📐',
                      color: 'border-teal-500 text-teal-300',
                    },
                    {
                      step: 'D5',
                      title: 'Néerlandais (Nederlands)',
                      city: 'Rotterdam · Amsterdam',
                      icon: '🌷',
                      color: 'border-emerald-400 text-emerald-300 ring-2 ring-emerald-400/40 shadow-[0_0_20px_rgba(16,185,129,0.4)]',
                    },
                  ].map((card, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-2xl bg-[#0c1022]/90 border ${card.color} transition-all duration-500 transform hover:scale-105 shadow-xl`}
                    >
                      <div className="text-2xl mb-2">{card.icon}</div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                        {card.step}
                      </div>
                      <div className="text-sm font-bold text-white leading-tight">
                        {card.title}
                      </div>
                      <div className="text-xs text-slate-400 mt-1 truncate">{card.city}</div>
                      <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-emerald-400">
                        <span>+60 🧱</span>
                        <span>Prêt à bâtir</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Simulated Floating Cursor */}
                <div
                  className="absolute z-20 transition-all duration-700 pointer-events-none"
                  style={{
                    left: `${40 + Math.sin(currentTime * 1.5) * 20}%`,
                    top: `${45 + Math.cos(currentTime * 1.2) * 15}%`,
                  }}
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-400/30 border-2 border-emerald-400 flex items-center justify-center animate-ping" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400 -mt-4.5 ml-1.5 shadow-md" />
                </div>
              </div>
            )}

            {/* SCENE 2: Construction Challenge & Mentors */}
            {activeTabVisual === 'chal' && (
              <div className="relative w-full h-full bg-[#080b18] p-6 flex flex-col justify-between animate-fadeIn">
                <div className="relative z-10 flex items-center justify-between p-3 rounded-xl bg-[#0e1428] border border-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🏗️</span>
                    <div>
                      <div className="text-xs font-bold text-white">Chantier : La Grande Bibliothèque</div>
                      <div className="text-[10px] text-cyan-400 font-mono">Étape 2/4 · Français & Grammaire</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-lg border border-emerald-500/40">
                    <span>Chrono : 45s</span>
                  </div>
                </div>

                {/* Simulated Interactive Question Box */}
                <div className="relative z-10 max-w-2xl mx-auto w-full my-auto p-5 rounded-2xl bg-[#0c1122] border border-emerald-500/40 shadow-2xl space-y-4">
                  <div className="text-xs font-mono text-cyan-400">QUESTION D’ÉDIFICATION :</div>
                  <h4 className="text-base sm:text-lg font-bold text-white">
                    « Elles sont (partir) en expédition alpine hier matin. »
                  </h4>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-[#070a14] border border-slate-800 text-xs text-slate-400 opacity-60">
                      A. parti
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-950/80 border-2 border-emerald-400 text-xs text-emerald-200 font-bold flex items-center justify-between shadow-lg">
                      <span>B. parties</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="p-3 rounded-xl bg-[#070a14] border border-slate-800 text-xs text-slate-400 opacity-60">
                      C. partis
                    </div>
                    <div className="p-3 rounded-xl bg-[#070a14] border border-slate-800 text-xs text-slate-400 opacity-60">
                      D. partie
                    </div>
                  </div>

                  {/* Mentor Assist Callout */}
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
                    <div className="flex items-center gap-2">
                      <span>💡</span>
                      <span>Indice Mentor : Avec l'auxiliaire être, on accorde en genre et en nombre !</span>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold">+25 XP 🧱</span>
                  </div>
                </div>
              </div>
            )}

            {/* SCENE 3: 60s Blitz Arcade & Polyglot Listening */}
            {activeTabVisual === 'blitz' && (
              <div className="relative w-full h-full bg-[#070814] p-6 flex flex-col justify-between animate-fadeIn">
                <div className="relative z-10 flex items-center justify-between p-3 rounded-xl bg-[#12162a] border border-emerald-500/30">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-300">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span>CS2 ARCADE · ARÈNE BLITZ 60 SECONDES</span>
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs font-mono">
                    SCORE : 480 PTS
                  </div>
                </div>

                <div className="relative z-10 max-w-xl mx-auto w-full my-auto space-y-4 text-center">
                  <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-500 p-1 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                    <div className="w-full h-full bg-[#070814] rounded-[22px] flex items-center justify-center text-3xl">
                      🎧
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-bold">
                      🇳🇱 Défi Audio Néerlandais
                    </span>
                    <h3 className="text-2xl font-bold text-white tracking-wide mt-1">
                      « Goedemorgen »
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">Prononciation : [xoo-duh-mor-xun]</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                    <div className="p-3.5 rounded-xl bg-emerald-950/80 border-2 border-emerald-400 text-sm font-bold text-emerald-200 shadow-md">
                      Bonjour ! (Matin)
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#0e1226] border border-slate-800 text-sm text-slate-300">
                      S'il vous plaît
                    </div>
                  </div>

                  <div className="text-xs font-mono text-emerald-400">
                    ⚡ Combo x3 actif · Réponse instantanée
                  </div>
                </div>
              </div>
            )}

            {/* SCENE 4: Diplomatic Passport & Graduation Certificate */}
            {activeTabVisual === 'cert' && (
              <div className="relative w-full h-full bg-[#060812] p-6 flex flex-col justify-between animate-fadeIn">
                <div className="relative z-10 flex items-center justify-between p-3 rounded-xl bg-[#0f1428] border border-emerald-500/30">
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-300">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span>PASSEPORT DIPLOMATIQUE & BREVET D'EXCELLENCE</span>
                  </div>
                  <div className="text-xs font-mono text-emerald-400 font-bold">
                    8/8 BALISES VALIDÉES
                  </div>
                </div>

                <div className="relative z-10 max-w-2xl mx-auto w-full my-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Passport Card */}
                  <div className="p-4 rounded-2xl bg-[#0b0e20] border-2 border-emerald-500/50 shadow-xl space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-mono text-emerald-400 font-bold">🛂 PASSEPORT DIPLOMATIQUE</span>
                      <span className="text-xs">✨</span>
                    </div>
                    <div className="space-y-1.5 text-xs text-slate-300">
                      <div>Titulaire : <strong className="text-white">Jeune Bâtisseuse</strong></div>
                      <div>Rang : <span className="text-emerald-300 font-bold">Grande Exploratrice</span></div>
                      <div className="text-[11px] font-mono text-emerald-400">Visas : Amsterdam 🇳🇱 · Paris 🇫🇷 · Oxford 🇬🇧</div>
                    </div>
                  </div>

                  {/* Official Certificate Card */}
                  <div className="p-4 rounded-2xl bg-[#0b0e20] border-2 border-emerald-500/50 shadow-xl space-y-3 text-center">
                    <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                      ACADÉMIE DE STUDY
                    </div>
                    <div className="text-sm font-bold font-editorial text-white">
                      Brevet Officiel d'Architecte
                    </div>
                    <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-xl text-slate-950 font-bold shadow-lg">
                      🏛️
                    </div>
                    <div className="text-[10px] text-emerald-300 font-mono">
                      Prêt à imprimer · Format Diplôme A4
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Subtitles & Closed Captions Bar */}
          {showCaptions && (
            <div className="relative z-20 mx-4 sm:mx-8 mb-3 p-3 rounded-2xl bg-slate-950/90 border border-emerald-500/40 backdrop-blur-md shadow-2xl text-center animate-fadeIn">
              <div className="flex items-center justify-between text-[10px] font-mono mb-1 text-slate-400">
                <span className="text-emerald-400 font-bold uppercase flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {currentChapter.badge}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCaptionLang('fr')}
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      captionLang === 'fr'
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    FR
                  </button>
                  <button
                    onClick={() => setCaptionLang('nl')}
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      captionLang === 'nl'
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    NL
                  </button>
                </div>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-100 leading-snug">
                {captionLang === 'nl'
                  ? currentChapter.id === 1
                    ? 'Welkom bij Study! Verken de archipel van kennis en leer in het Frans, Nederlands (Nederlands), Engels en Spaans.'
                    : currentChapter.id === 2
                    ? 'Bouw monumenten met interactieve quizzen en vraag hulp aan mentoren (50/50, pauze en tips).'
                    : currentChapter.id === 3
                    ? '60 seconden blitz arena: snelle wiskunde en audio herkenning van Nederlandse woorden.'
                    : 'Verzamel diploma stempels in je paspoort en print je officiële brevet van uitmuntendheid!'
                  : currentChapter.narrationText}
              </p>
            </div>
          )}
        </div>

        {/* Video Scrubber & Playback Controls Bar */}
        <div className="p-3.5 sm:p-4 bg-[#0a0c14] border-t border-[#232838] space-y-3 shrink-0">
          {/* Progress Timeline Scrubber */}
          <div className="space-y-1">
            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                handleSeek(pos * TOTAL_DURATION);
              }}
              className="relative w-full h-3 bg-[#161a29] rounded-full overflow-hidden cursor-pointer group"
              title="Cliquer pour naviguer dans la minute"
            >
              {/* Chapter division ticks */}
              <div className="absolute inset-0 flex pointer-events-none">
                <div className="w-1/4 border-r border-slate-700/60" />
                <div className="w-1/4 border-r border-slate-700/60" />
                <div className="w-1/4 border-r border-slate-700/60" />
                <div className="w-1/4" />
              </div>

              {/* Filled progress bar */}
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 transition-all duration-100 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Chapter Pills Row */}
            <div className="grid grid-cols-4 gap-1 sm:gap-2 text-left pt-0.5">
              {CHAPTERS.map((ch) => {
                const isCurrent = currentChapter.id === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => handleJumpToChapter(ch)}
                    className={`p-1.5 sm:p-2 rounded-xl text-left transition-all ${
                      isCurrent
                        ? 'bg-emerald-950/60 border border-emerald-500/50 text-white shadow-sm'
                        : 'bg-[#101422] border border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-[9px] sm:text-[10px] font-mono text-emerald-400 font-bold truncate">
                      {formatTime(ch.startTime)} · {ch.badge}
                    </div>
                    <div className="text-[10px] sm:text-xs font-semibold truncate hidden sm:block">
                      {ch.title.split('. ')[1]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lower Control Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={handleTogglePlay}
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 flex items-center justify-center font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)] active:scale-95 transition-all"
                title={isPlaying ? 'Pause' : 'Lecture'}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>

              <button
                onClick={handleRestart}
                className="p-2.5 rounded-xl bg-[#141828] hover:bg-[#1e233a] text-slate-300 hover:text-white transition-colors"
                title="Recommencer depuis le début"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <div className="text-xs font-mono font-bold text-white px-2">
                <span className="text-emerald-400">{formatTime(currentTime)}</span>
                <span className="text-slate-500"> / 01:00</span>
              </div>
            </div>

            {/* Middle: Audio Narration & Captions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setIsVoiceoverMuted(!isVoiceoverMuted);
                  if (!isVoiceoverMuted) {
                    stopVoiceover();
                  } else {
                    speakChapterNarration(currentChapter);
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                  isVoiceoverMuted
                    ? 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                    : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 font-bold'
                }`}
                title={isVoiceoverMuted ? 'Activer la voix-off française' : 'Couper la voix-off'}
              >
                {isVoiceoverMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>Voix-Off {isVoiceoverMuted ? 'Mute' : 'Active'}</span>
              </button>

              <button
                onClick={() => setShowCaptions(!showCaptions)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                  showCaptions
                    ? 'bg-[#141828] border-slate-700 text-white font-bold'
                    : 'bg-[#101422] border-transparent text-slate-400'
                }`}
                title="Afficher/masquer les sous-titres"
              >
                CC Sous-titres
              </button>

              {/* Speed Button */}
              <button
                onClick={() => {
                  soundEngine.playClick();
                  const nextSpeed = playbackSpeed === 1 ? 1.25 : playbackSpeed === 1.25 ? 1.5 : 1;
                  setPlaybackSpeed(nextSpeed);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-[#141828] hover:bg-[#1e233a] border border-slate-700 text-xs font-mono font-bold text-emerald-400 transition-colors"
                title="Vitesse de lecture"
              >
                {playbackSpeed}x
              </button>
            </div>

            {/* Right: Instant Jump-to-Action CTAs */}
            <div className="flex items-center gap-2">
              {onStartChallenge && (
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    stopVoiceover();
                    onClose();
                    onStartChallenge();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5 hover:opacity-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tester un Chantier</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
