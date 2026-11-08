import React, { useState } from 'react';
import {
  Trophy,
  Play,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  Flame,
  Award,
  BookOpen,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react';
import {
  ConstructionChallenge,
  ArchipelagoStats,
  SubjectCity,
  SubjectCityId,
  AmbientTimeOfDay,
} from '../types/game';
import { soundEngine } from '../utils/audio';

interface PlatformPlanViewProps {
  challenges: ConstructionChallenge[];
  archipelago: ArchipelagoStats;
  cities: SubjectCity[];
  onSelectChallenge: (challenge: ConstructionChallenge) => void;
  onOpenCity: (cityId: SubjectCityId) => void;
  onStartWonder: () => void;
  timeOfDay?: AmbientTimeOfDay;
  setTimeOfDay?: (t: AmbientTimeOfDay) => void;
  onOpenJournal?: () => void;
  onOpenMentors?: () => void;
  onOpenCertificate?: () => void;
  onOpenMiniGames?: () => void;
  onOpenHomework?: () => void;
  onOpenPassport?: () => void;
  onOpenPrint?: () => void;
  onOpenVideoDemo?: () => void;
  onOpenDuel?: () => void;
  onOpenCases?: () => void;
  onOpenVoice?: () => void;
}

interface WaypointConfig {
  id: string;
  code: string; // D1, D2, ... D8
  name: string;
  subject: string;
  cityId: SubjectCityId;
  challengeId: string;
  x: number; // percentage from left
  y: number; // percentage from top
  rewardBricks: number;
  rewardFlowers: number;
}

const WAYPOINTS: WaypointConfig[] = [
  {
    id: 'wp_1',
    code: 'D1',
    name: 'Bibliothèque des Grands Textes',
    subject: 'Français',
    cityId: 'francais',
    challengeId: 'chal_fr_1',
    x: 61.5,
    y: 69.0,
    rewardBricks: 60,
    rewardFlowers: 30,
  },
  {
    id: 'wp_2',
    code: 'D2',
    name: 'Grande Serre Botanique & Vivant',
    subject: 'Sciences Naturelles',
    cityId: 'sciences',
    challengeId: 'chal_sc_1',
    x: 48.5,
    y: 56.0,
    rewardBricks: 65,
    rewardFlowers: 35,
  },
  {
    id: 'wp_3',
    code: 'D3',
    name: 'Institut de Géométrie Pure',
    subject: 'Mathématiques',
    cityId: 'maths',
    challengeId: 'chal_ma_1',
    x: 26.5,
    y: 62.0,
    rewardBricks: 65,
    rewardFlowers: 30,
  },
  {
    id: 'wp_4',
    code: 'D4',
    name: 'Musée des Civilisations',
    subject: 'Histoire',
    cityId: 'histoire',
    challengeId: 'chal_hi_1',
    x: 37.5,
    y: 44.0,
    rewardBricks: 65,
    rewardFlowers: 30,
  },
  {
    id: 'wp_5',
    code: 'D5',
    name: 'Het Nederlands Paviljoen (Langues)',
    subject: 'Néerlandais & Langues 🇳🇱',
    cityId: 'langues',
    challengeId: 'chal_la_nl',
    x: 61.3,
    y: 38.0,
    rewardBricks: 75,
    rewardFlowers: 35,
  },
  {
    id: 'wp_6',
    code: 'D6',
    name: 'Atelier d’Algorithmique & Code',
    subject: 'Informatique',
    cityId: 'informatique',
    challengeId: 'chal_in_1',
    x: 51.8,
    y: 36.0,
    rewardBricks: 65,
    rewardFlowers: 30,
  },
  {
    id: 'wp_7',
    code: 'D7',
    name: 'Pavillon des Figures de Style',
    subject: 'Français & Éloquence',
    cityId: 'francais',
    challengeId: 'chal_fr_2',
    x: 20.5,
    y: 41.0,
    rewardBricks: 75,
    rewardFlowers: 35,
  },
  {
    id: 'wp_8',
    code: 'D8',
    name: 'Le Palais Céleste des Savoirs',
    subject: 'Merveille Céleste (Sommet)',
    cityId: 'francais',
    challengeId: 'chal_grand_wonder',
    x: 36.0,
    y: 26.0,
    rewardBricks: 250,
    rewardFlowers: 150,
  },
];

export const PlatformPlanView: React.FC<PlatformPlanViewProps> = ({
  challenges,
  archipelago,
  cities,
  onSelectChallenge,
  onOpenCity,
  onStartWonder,
  timeOfDay = 'dusk',
  setTimeOfDay,
  onOpenJournal,
  onOpenMentors,
  onOpenCertificate,
  onOpenMiniGames,
  onOpenHomework,
  onOpenPassport,
  onOpenPrint,
  onOpenVideoDemo,
  onOpenDuel,
  onOpenCases,
  onOpenVoice,
}) => {
  const [hoveredWaypoint, setHoveredWaypoint] = useState<WaypointConfig | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'done'>('all');

  // Overall completion progress
  const completedCount = archipelago.completedChallengeIds.length;
  const totalWaypoints = WAYPOINTS.length;
  const progressPercent = Math.min(
    100,
    Math.round((completedCount / totalWaypoints) * 100)
  );

  // Current active step index along the path
  const currentStepIndex = Math.min(completedCount, WAYPOINTS.length - 1);
  const currentWaypoint = WAYPOINTS[currentStepIndex];

  // Activities list derived from real challenges
  const activitiesList = WAYPOINTS.map((wp) => {
    const isCompleted = archipelago.completedChallengeIds.includes(wp.challengeId);
    const chal = challenges.find((c) => c.id === wp.challengeId);
    return {
      wp,
      chal,
      isCompleted,
    };
  });

  const filteredActivities = activitiesList.filter((act) => {
    if (activeFilter === 'pending') return !act.isCompleted;
    if (activeFilter === 'done') return act.isCompleted;
    return true;
  });

  const handleWaypointClick = (wp: WaypointConfig) => {
    soundEngine.playClick();
    if (wp.challengeId === 'chal_grand_wonder') {
      onStartWonder();
      return;
    }
    const chal = challenges.find((c) => c.id === wp.challengeId);
    if (chal) {
      onSelectChallenge(chal);
    }
  };

  const ambientFilterClass =
    timeOfDay === 'day'
      ? 'brightness-110 saturate-115 hue-rotate-[-5deg]'
      : timeOfDay === 'night'
      ? 'brightness-75 contrast-125 saturate-130 hue-rotate-[15deg]'
      : 'saturate-105 contrast-105';

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-slate-200 dark:border-[#222432] shadow-2xl bg-white dark:bg-[#0C0D12] text-slate-800 dark:text-white select-none font-sans">
      {/* 1. Main Canvas Area with the Visual Map Attachment */}
      <div className="relative w-full min-h-[580px] sm:min-h-[660px] lg:min-h-[720px] overflow-hidden">
        {/* Background Visual Map with dynamic time-of-day filter */}
        <img
          src="/assets/aistudio/image_1dd7a2b3.png"
          alt="Expédition et Rangs Study"
          className={`w-full h-full object-cover object-center filter transition-all duration-700 ${ambientFilterClass}`}
        />

        {/* Top-Left Ambient & Quick Game Modes Bar (CS2 Esports Hub) */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-25 flex flex-wrap items-center gap-2 max-w-[calc(100%-20rem)] pointer-events-auto">
          {/* Ambiance Toggle */}
          <div className="flex items-center gap-1 p-1 bg-[#13151F]/90 backdrop-blur-md rounded-xl border border-[#252838] shadow-lg text-[11px]">
            <button
              onClick={() => {
                soundEngine.playClick();
                setTimeOfDay?.('day');
              }}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 font-bold ${
                timeOfDay === 'day'
                  ? 'bg-emerald-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Ambiance Jour ensoleillé"
            >
              <span>☀️</span>
              <span className="hidden sm:inline">Jour</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                setTimeOfDay?.('dusk');
              }}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 font-bold ${
                timeOfDay === 'dusk'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Ambiance Crépuscule d'arène"
            >
              <span>🌅</span>
              <span className="hidden sm:inline">Crépuscule</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                setTimeOfDay?.('night');
              }}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 font-bold ${
                timeOfDay === 'night'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Ambiance Nuit étoilée"
            >
              <span>🌙</span>
              <span className="hidden sm:inline">Nuit</span>
            </button>
          </div>

          {/* Quick Access: Carnet de Bord */}
          {onOpenJournal && (
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenJournal();
              }}
              className="px-3 py-1.5 rounded-xl bg-[#161824]/90 hover:bg-[#202334] text-slate-200 text-xs font-semibold shadow-lg transition-all flex items-center gap-1.5 border border-[#262A3D] hover:border-emerald-500/50 hover:scale-102"
              title="Ouvrir mon carnet de leçons et d'astuces pour l'école"
            >
              <span>📖</span>
              <span>Carnet Mémo</span>
            </button>
          )}

          {/* Quick Access: Salon des Savantes */}
          {onOpenMentors && (
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenMentors();
              }}
              className="px-3 py-1.5 rounded-xl bg-[#161824]/90 hover:bg-[#202334] text-purple-200 text-xs font-semibold shadow-lg transition-all flex items-center gap-1.5 border border-[#262A3D] hover:border-purple-400/50 hover:scale-102"
              title="Poser des questions à Marie Curie, Ada Lovelace, Hypatie ou Érasme"
            >
              <span>💡</span>
              <span>Mentors</span>
            </button>
          )}

          {/* Quick Access: Vidéo Démo (1 min) */}
          {onOpenVideoDemo && (
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenVideoDemo();
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-950/90 via-[#0d2117] to-teal-950/80 hover:from-emerald-900/90 hover:to-teal-900/80 text-emerald-300 text-xs font-black shadow-lg transition-all flex items-center gap-1.5 border border-emerald-400/60 hover:border-emerald-300 hover:scale-105 shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse"
              title="Lancer la vidéo démo de 1 minute sur l'utilisation de Study"
            >
              <span>🎬</span>
              <span>Vidéo Démo (1 min)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </button>
          )}

          {/* Quick Access: Mini-Jeux Flash 60s */}
          {onOpenMiniGames && (
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenMiniGames();
              }}
              className="px-3 py-1.5 rounded-xl bg-[#0d2117]/90 hover:bg-[#133022] text-emerald-300 text-xs font-bold shadow-lg transition-all flex items-center gap-1.5 border border-emerald-500/40 hover:border-emerald-400 hover:scale-102"
              title="Jouer aux défis express de 60s (L'Oreille Polyglotte, Calcul & Écluses)"
            >
              <span>⚡</span>
              <span>Mini-Jeux</span>
            </button>
          )}

          {/* Quick Access: Duel 1v1 Esport */}
          {onOpenDuel && (
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenDuel();
              }}
              className="px-3 py-1.5 rounded-xl bg-[#161824]/90 hover:bg-[#202334] text-emerald-300 text-xs font-bold shadow-lg transition-all flex items-center gap-1.5 border border-[#262A3D] hover:border-emerald-500/50 hover:scale-102"
              title="Lancer un match Duel 1v1 Esport"
            >
              <span>⚔️</span>
              <span>Duel 1v1</span>
            </button>
          )}

          {/* Quick Access: Caisses & Butin */}
          {onOpenCases && (
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenCases();
              }}
              className="px-3 py-1.5 rounded-xl bg-[#161824]/90 hover:bg-[#202334] text-teal-300 text-xs font-bold shadow-lg transition-all flex items-center gap-1.5 border border-[#262A3D] hover:border-teal-500/50 hover:scale-102"
              title="Ouvrir des caisses de butin avec vos briques dorées"
            >
              <span>🧰</span>
              <span>Caisses CS2</span>
            </button>
          )}

          {/* Quick Access: Défi Vocal Micro */}
          {onOpenVoice && (
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenVoice();
              }}
              className="px-3 py-1.5 rounded-xl bg-[#161824]/90 hover:bg-[#202334] text-cyan-300 text-xs font-bold shadow-lg transition-all flex items-center gap-1.5 border border-[#262A3D] hover:border-cyan-500/50 hover:scale-102"
              title="S'entraîner à la prononciation vocale au micro"
            >
              <span>🎙️</span>
              <span>Micro Vocal</span>
            </button>
          )}

          {/* Quick Access: Devoirs Réels */}
          {onOpenHomework && (
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenHomework();
              }}
              className="px-3 py-1.5 rounded-xl bg-[#161824]/90 hover:bg-[#202334] text-emerald-200 text-xs font-semibold shadow-lg transition-all flex items-center gap-1.5 border border-[#262A3D] hover:border-emerald-500/50 hover:scale-102"
              title="Ouvrir mon agenda des vrais devoirs d'école"
            >
              <span>📝</span>
              <span>Devoirs</span>
            </button>
          )}

          {/* Quick Access: Brevet Officiel */}
          {onOpenCertificate && (
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenCertificate();
              }}
              className="px-3 py-1.5 rounded-xl bg-[#161824]/90 hover:bg-[#202334] text-emerald-200 text-xs font-semibold shadow-lg transition-all flex items-center gap-1.5 border border-[#262A3D] hover:border-emerald-500/50 hover:scale-102"
              title="Voir et imprimer mon Brevet officiel d'Architecte"
            >
              <span>🎓</span>
              <span>Brevet</span>
            </button>
          )}

          {/* Quick Access: Passeport Européen */}
          {onOpenPassport && (
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenPassport();
              }}
              className="px-3 py-1.5 rounded-xl bg-[#161824]/90 hover:bg-[#202334] text-cyan-200 text-xs font-semibold shadow-lg transition-all flex items-center gap-1.5 border border-[#262A3D] hover:border-cyan-400/50 hover:scale-102"
              title="Ouvrir mon Passeport Diplomatique Européen et mes visas de balises"
            >
              <span>🛂</span>
              <span>Passeport</span>
            </button>
          )}

          {/* Quick Access: Fiches de Poche Imprimables */}
          {onOpenPrint && (
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenPrint();
              }}
              className="px-3 py-1.5 rounded-xl bg-[#161824]/90 hover:bg-[#202334] text-sky-200 text-xs font-semibold shadow-lg transition-all flex items-center gap-1.5 border border-[#262A3D] hover:border-sky-400/50 hover:scale-102"
              title="Imprimer mes fiches de révision de poche avec pliage et découpage"
            >
              <span>🖨️</span>
              <span>Fiches Poche</span>
            </button>
          )}
        </div>

        {/* Ambient Dark Gradient Overlays for readability and UI depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0D12]/95 via-transparent to-[#0C0D12]/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C0D12]/75 via-transparent to-[#0C0D12]/85 pointer-events-none" />

        {/* 2. Interactive Waypoints (D1 through D8) positioned precisely over the trail */}
        {WAYPOINTS.map((wp, idx) => {
          const isCompleted = archipelago.completedChallengeIds.includes(wp.challengeId);
          const isCurrent = idx === currentStepIndex && !isCompleted;
          const cityData = cities.find((c) => c.id === wp.cityId);

          return (
            <div
              key={wp.id}
              style={{ left: `${wp.x}%`, top: `${wp.y}%` }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 group"
              onMouseEnter={() => setHoveredWaypoint(wp)}
              onMouseLeave={() => setHoveredWaypoint(null)}
            >
              {/* Waypoint Marker Pin */}
              <button
                onClick={() => handleWaypointClick(wp)}
                className={`relative flex items-center justify-center rounded-full transition-all duration-300 focus:outline-none ${
                  isCompleted
                    ? 'w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.6)] border-2 border-emerald-200 scale-100 hover:scale-115'
                    : isCurrent
                    ? 'w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-300 text-white shadow-[0_0_25px_rgba(16,185,129,0.8)] border-2 border-white scale-105 hover:scale-120 animate-pulse'
                    : 'w-10 h-10 sm:w-11 sm:h-11 bg-slate-900/90 text-white/90 shadow-[0_4px_15px_rgba(0,0,0,0.6)] border-2 border-purple-400/50 hover:border-purple-300 scale-95 hover:scale-110'
                }`}
                title={`${wp.code} : ${wp.name} (${wp.subject})`}
              >
                {/* Pin Inner Label / Icon */}
                <div className="flex flex-col items-center justify-center font-bold">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <span className="font-mono text-xs sm:text-sm tracking-tight drop-shadow-sm">
                      {wp.code}
                    </span>
                  )}
                </div>

                {/* Beacon rings for active current step */}
                {isCurrent && (
                  <span className="absolute -inset-1.5 rounded-full border-2 border-emerald-400/80 animate-ping pointer-events-none" />
                )}
              </button>

              {/* Waypoint Hover Tooltip Card */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 hidden group-hover:flex flex-col w-56 sm:w-64 p-3 rounded-2xl bg-slate-950/95 backdrop-blur-xl border border-purple-500/40 shadow-2xl text-left pointer-events-none z-30 animate-fadeIn">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-purple-300 mb-1">
                  <span>{wp.code} · {wp.subject}</span>
                  {isCompleted ? (
                    <span className="text-emerald-400 flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Fait
                    </span>
                  ) : (
                    <span className="text-emerald-400">À conquérir</span>
                  )}
                </div>

                <div className="text-xs sm:text-sm font-bold text-white leading-tight font-editorial mb-1.5">
                  {wp.name}
                </div>

                <div className="flex items-center justify-between pt-1.5 border-t border-slate-800 text-[11px] font-mono">
                  <span className="text-emerald-300">+{wp.rewardBricks} 🪙</span>
                  <span className="text-pink-300">+{wp.rewardFlowers} 🌸</span>
                  <span className="text-purple-300 font-sans text-[10px]">Cliquer pour jouer</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* 3. The Explorer Marker on the Active Trail Segment */}
        {currentWaypoint && (
          <div
            style={{
              left: `${currentWaypoint.x}%`,
              top: `${Math.max(10, currentWaypoint.y - 8)}%`,
            }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex flex-col items-center"
          >
            {/* Green pointer triangle arrow */}
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-emerald-400 animate-bounce mb-1" />
            <div className="px-2 py-0.5 rounded-full bg-emerald-400/90 text-slate-950 text-[10px] font-bold font-mono shadow-md whitespace-nowrap">
              Étape Actuelle
            </div>
          </div>
        )}

        {/* 4. Bottom-Left: Circular "Battle Pass Ranks" Widget */}
        <div className="absolute bottom-6 left-6 z-20 flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#131520]/95 backdrop-blur-md border border-[#232738] shadow-2xl">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="26"
                className="stroke-[#222533]"
                strokeWidth="5"
                fill="none"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                className="stroke-emerald-400 transition-all duration-1000 ease-out"
                strokeWidth="5"
                strokeDasharray={2 * Math.PI * 26}
                strokeDashoffset={2 * Math.PI * 26 * (1 - progressPercent / 100)}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <span className="absolute text-xs sm:text-sm font-black font-mono text-emerald-400">
              {progressPercent}%
            </span>
          </div>

          <div>
            <div className="text-xs sm:text-sm font-bold text-white tracking-tight leading-tight uppercase font-sans">
              Saison 1 · Rangs du Savoir
            </div>
            <div className="text-[11px] text-emerald-400 font-mono mt-0.5 font-bold">
              {completedCount} / {totalWaypoints} Étapes Débloquées
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Objectif Grand Palais Céleste · 100% réel
            </div>
          </div>
        </div>

        {/* 5. Right Floating Panels (CS2 Case & Challenge Lobby) */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex flex-col gap-3.5 w-72 sm:w-80 max-h-[calc(100%-3rem)] overflow-y-auto no-scrollbar pointer-events-auto">
          {/* Featured Case Quest: Het Nederlands Paviljoen (Replaces sci-fi weather alert) */}
          <div className={`rounded-2xl backdrop-blur-xl border p-3.5 shadow-xl relative overflow-hidden transition-all ${
            archipelago.completedChallengeIds.includes('chal_la_nl')
              ? 'bg-emerald-50/95 dark:bg-[#101915]/95 border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300'
              : 'bg-white/95 dark:bg-gradient-to-r dark:from-[#0d2117]/95 dark:via-[#181a26]/95 dark:to-[#12141e]/95 border-emerald-300 dark:border-emerald-500/50 text-slate-800 dark:text-white'
          }`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  {!archipelago.completedChallengeIds.includes('chal_la_nl') && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  )}
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    archipelago.completedChallengeIds.includes('chal_la_nl')
                      ? 'bg-emerald-400'
                      : 'bg-emerald-400'
                  }`}></span>
                </span>
                <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-900 dark:text-white">
                  {archipelago.completedChallengeIds.includes('chal_la_nl')
                    ? 'Quête Validée · Étape D5'
                    : '🔥 Quête en Vedette · Étape D5'}
                </span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                archipelago.completedChallengeIds.includes('chal_la_nl')
                  ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30'
                  : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40 animate-pulse'
              }`}>
                {archipelago.completedChallengeIds.includes('chal_la_nl') ? 'Drop Obtenu' : 'COVERT · +50 XP'}
              </span>
            </div>

            <p className="text-xs mt-2 leading-relaxed text-slate-700 dark:text-slate-200">
              {archipelago.completedChallengeIds.includes('chal_la_nl') ? (
                <span>
                  <strong className="text-emerald-700 dark:text-emerald-300">Pavillon Néerlandais débloqué :</strong> Les canaux d'Amsterdam sont opérationnels avec Érasme de Rotterdam !
                </span>
              ) : (
                <span>
                  <strong className="text-emerald-600 dark:text-emerald-400">Het Nederlands Paviljoen 🇳🇱 :</strong> Maîtrisez les salutations et politesses néerlandaises pour débloquer le pavillon et +75 🪙 !
                </span>
              )}
            </p>

            {!archipelago.completedChallengeIds.includes('chal_la_nl') && (
              <div className="mt-3 flex items-center justify-between pt-1 border-t border-slate-200 dark:border-[#2A2E42]">
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Multiplicateur XP ×2</span>
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    const dutchChal = challenges.find((c) => c.id === 'chal_la_nl');
                    if (dutchChal) {
                      onSelectChallenge(dutchChal);
                    }
                  }}
                  className="px-3 py-1 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <span>⚔️ Relever le Défi</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Panel 1: Matchs & Chantiers Disponibles (CS2 Lobby) */}
          <div className="rounded-2xl bg-white/95 dark:bg-[#141622]/95 backdrop-blur-xl border border-slate-200 dark:border-[#252838] p-3.5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#222533] pb-2.5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-500" />
                <span>Matchs & Chantiers</span>
              </h3>
              <div className="flex items-center gap-1 text-[10px]">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-2 py-0.5 rounded-md font-mono transition-colors ${
                    activeFilter === 'all'
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Tous
                </button>
                <button
                  onClick={() => setActiveFilter('pending')}
                  className={`px-2 py-0.5 rounded-md font-mono transition-colors ${
                    activeFilter === 'pending'
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  En cours
                </button>
              </div>
            </div>

            {/* Activities Table Columns header */}
            <div className="grid grid-cols-12 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
              <span className="col-span-6">Matière</span>
              <span className="col-span-3 text-center">Étape</span>
              <span className="col-span-3 text-right">Action</span>
            </div>

            {/* Activities List */}
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {filteredActivities.slice(0, 5).map(({ wp, chal, isCompleted }) => {
                const isCovert = wp.code === 'D5' || wp.code === 'D8';
                const isClassified = wp.code === 'D4' || wp.code === 'D6' || wp.code === 'D7';
                return (
                  <div
                    key={wp.id}
                    className={`grid grid-cols-12 items-center p-2 rounded-xl text-xs transition-all ${
                      isCompleted
                        ? 'bg-emerald-50 dark:bg-[#101915] border border-emerald-200 dark:border-emerald-500/25'
                        : 'bg-slate-50 dark:bg-[#181A26] border border-slate-200 dark:border-[#282C40] hover:border-emerald-500/60'
                    }`}
                  >
                    <div className="col-span-6 min-w-0 pr-1">
                      <div className="font-semibold text-slate-900 dark:text-white truncate text-[11px] flex items-center gap-1">
                        <span className={`text-[9px] font-bold font-mono px-1 rounded ${
                          isCovert
                            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                            : isClassified
                            ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300'
                            : 'bg-blue-500/20 text-blue-700 dark:text-blue-300'
                        }`}>
                          {isCovert ? 'VERT' : isClassified ? 'VIOLET' : 'BLEU'}
                        </span>
                        <span className="truncate">{wp.subject}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {wp.name}
                      </div>
                    </div>

                    <div className="col-span-3 text-center font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      {wp.code}
                    </div>

                    <div className="col-span-3 text-right">
                      {isCompleted ? (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Fait
                        </span>
                      ) : (
                        <button
                          onClick={() => handleWaypointClick(wp)}
                          className="px-2.5 py-1 text-[10px] font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all active:scale-95 inline-flex items-center gap-1"
                        >
                          <Play className="w-2.5 h-2.5 fill-current" />
                          <span>Jouer</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Panel 2: Leaderboard des 6 Cités Scolaires */}
          <div className="rounded-2xl bg-white/95 dark:bg-[#141622]/95 backdrop-blur-xl border border-slate-200 dark:border-[#252838] p-3.5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#222533] pb-2.5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-emerald-500" />
                <span>Leaderboard Cités</span>
              </h3>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1 font-bold">
                🔥 {archipelago.streakDays} j. série
              </span>
            </div>

            {/* Profile banner of the student */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#181A26] border border-slate-200 dark:border-[#282C40] text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-sm text-emerald-600 dark:text-emerald-400 font-bold">
                  ⚡
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 dark:text-white truncate text-[11px]">
                    {archipelago.mayorName}
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                    Niveau {archipelago.level} · {archipelago.xp} XP
                  </div>
                </div>
              </div>
              <div className="text-right text-[10px] font-mono">
                <div className="text-emerald-600 dark:text-emerald-400 font-bold">{archipelago.bricks} 🪙</div>
                <div className="text-sky-600 dark:text-cyan-400">{archipelago.flowers} 💎</div>
              </div>
            </div>

            {/* Cities progress list (100% real, based on actual challenges) */}
            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {cities.map((city) => {
                const cityChals = challenges.filter((c) => c.cityId === city.id);
                const cityDone = cityChals.filter((c) =>
                  archipelago.completedChallengeIds.includes(c.id)
                ).length;
                const percent = cityChals.length > 0 ? Math.round((cityDone / cityChals.length) * 100) : 0;
                const isMastered = cityDone > 0 && cityDone === cityChals.length;

                return (
                  <button
                    key={city.id}
                    onClick={() => {
                      soundEngine.playClick();
                      onOpenCity(city.id);
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-[#181A26] dark:hover:bg-[#202334] border border-slate-200 dark:border-[#282C40] hover:border-emerald-500/50 text-left transition-all group flex items-center justify-between gap-2"
                    title={`Ouvrir ${city.name}`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between text-[11px] mb-1.5">
                        <span className="font-semibold text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors truncate">
                          {city.name}
                        </span>
                        <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 shrink-0">
                          {isMastered ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> 100%
                            </span>
                          ) : (
                            `${cityDone}/${cityChals.length}`
                          )}
                        </span>
                      </div>

                      {/* Micro progress bar */}
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-[#0C0D12] rounded-full overflow-hidden border border-slate-300 dark:border-[#222533]">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 6. Quick Interactive Stage Drawer Bar at Bottom */}
      <div className="p-4 sm:p-5 bg-slate-50 dark:bg-[#111218] border-t border-slate-200 dark:border-[#222432] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-lg shadow-sm font-black text-emerald-500 dark:text-emerald-400">
            ⚡
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white tracking-tight uppercase font-sans">
              Arène des Rangs & Quêtes Scolaires
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Sélectionnez une étape (D1 à D8) pour lancer l'entraînement, remporter des pièces et faire progresser vos cités.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {WAYPOINTS.map((wp) => {
            const isCompleted = archipelago.completedChallengeIds.includes(wp.challengeId);
            return (
              <button
                key={wp.id}
                onClick={() => handleWaypointClick(wp)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                  isCompleted
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
                    : 'bg-white dark:bg-[#181A26] border-slate-200 dark:border-[#2A2E42] text-slate-700 dark:text-slate-300 hover:border-emerald-400 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <span>{wp.code}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans font-normal">
                  {wp.subject.split(' ')[0]}
                </span>
                {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
