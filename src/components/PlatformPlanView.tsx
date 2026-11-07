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
    <div className="relative w-full rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl bg-[#05050D] text-white select-none font-sans">
      {/* 1. Main Canvas Area with the Visual Map Attachment */}
      <div className="relative w-full min-h-[580px] sm:min-h-[660px] lg:min-h-[720px] overflow-hidden">
        {/* Background Visual Map with dynamic time-of-day filter */}
        <img
          src="/assets/aistudio/image_1dd7a2b3.png"
          alt="Plan de Progression de la Plateforme StudyQuest"
          className={`w-full h-full object-cover object-center filter transition-all duration-700 ${ambientFilterClass}`}
        />

        {/* Top-Left Ambient & Guide Bar (Outcrowd Resq.io Incident Console) */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-25 flex flex-wrap items-center gap-2 max-w-[calc(100%-20rem)] pointer-events-auto">
          {/* Ambiance Toggle */}
          <div className="flex items-center gap-1 p-1 bg-[#070919]/90 backdrop-blur-md rounded-xl border border-slate-700/80 shadow-lg text-[11px]">
            <button
              onClick={() => {
                soundEngine.playClick();
                setTimeOfDay?.('day');
              }}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 font-semibold ${
                timeOfDay === 'day'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
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
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 font-semibold ${
                timeOfDay === 'dusk'
                  ? 'bg-[#0A26E6] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Ambiance Crépuscule féerique"
            >
              <span>🌅</span>
              <span className="hidden sm:inline">Crépuscule</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                setTimeOfDay?.('night');
              }}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 font-semibold ${
                timeOfDay === 'night'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
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
              className="px-3 py-1.5 rounded-xl bg-[#0b1028]/90 hover:bg-[#121b44] text-blue-200 text-xs font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-1.5 border border-blue-500/30 hover:border-blue-400 hover:scale-102"
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
              className="px-3 py-1.5 rounded-xl bg-[#0b1028]/90 hover:bg-[#121b44] text-indigo-200 text-xs font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-1.5 border border-indigo-500/30 hover:border-indigo-400 hover:scale-102"
              title="Poser des questions à Marie Curie, Ada Lovelace, Hypatie ou George Sand"
            >
              <span>💡</span>
              <span>Grandes Savantes</span>
            </button>
          )}

          {/* Quick Access: Mini-Jeux Flash 60s */}
          {onOpenMiniGames && (
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenMiniGames();
              }}
              className="px-3 py-1.5 rounded-xl bg-[#181308]/90 hover:bg-[#28200d] text-amber-200 text-xs font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-1.5 border border-amber-500/30 hover:border-amber-400 hover:scale-102"
              title="Jouer aux défis express de 60s (Calcul & Mémory)"
            >
              <span>⚡</span>
              <span>Mini-Jeux (60s)</span>
            </button>
          )}

          {/* Quick Access: Devoirs Réels */}
          {onOpenHomework && (
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenHomework();
              }}
              className="px-3 py-1.5 rounded-xl bg-[#081814]/90 hover:bg-[#0e2a23] text-emerald-200 text-xs font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-1.5 border border-emerald-500/30 hover:border-emerald-400 hover:scale-102"
              title="Ouvrir mon agenda des vrais devoirs d'école"
            >
              <span>📝</span>
              <span>Mes Devoirs</span>
            </button>
          )}

          {/* Quick Access: Brevet Officiel */}
          {onOpenCertificate && (
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenCertificate();
              }}
              className="px-3 py-1.5 rounded-xl bg-[#181404]/90 hover:bg-[#282107] text-yellow-200 text-xs font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-1.5 border border-yellow-500/30 hover:border-yellow-400 hover:scale-102"
              title="Voir et imprimer mon Brevet officiel d'Architecte"
            >
              <span>🎓</span>
              <span>Mon Brevet</span>
            </button>
          )}
        </div>

        {/* Ambient Dark Gradient Overlays for readability and UI depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#05050D]/90 via-transparent to-[#05050D]/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0e1c]/70 via-transparent to-[#0d0e1c]/80 pointer-events-none" />

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
                    ? 'w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-rose-500 via-pink-500 to-amber-400 text-white shadow-[0_0_25px_rgba(244,63,94,0.8)] border-2 border-white scale-105 hover:scale-120 animate-pulse'
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
                  <span className="absolute -inset-1.5 rounded-full border-2 border-rose-400/80 animate-ping pointer-events-none" />
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
                    <span className="text-amber-400">À conquérir</span>
                  )}
                </div>

                <div className="text-xs sm:text-sm font-bold text-white leading-tight font-editorial mb-1.5">
                  {wp.name}
                </div>

                <div className="flex items-center justify-between pt-1.5 border-t border-slate-800 text-[11px] font-mono">
                  <span className="text-amber-300">+{wp.rewardBricks} 🧱</span>
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
            {/* Yellow pointer triangle arrow as in reference design */}
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-amber-400 animate-bounce mb-1" />
            <div className="px-2 py-0.5 rounded-full bg-amber-400/90 text-slate-950 text-[10px] font-bold font-mono shadow-md whitespace-nowrap">
              Étape Actuelle
            </div>
          </div>
        )}

        {/* 4. Bottom-Left: Circular "Overall Progress" Telemetry Widget */}
        <div className="absolute bottom-6 left-6 z-20 flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0B0E23]/95 backdrop-blur-md border border-slate-800 shadow-2xl">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="26"
                className="stroke-slate-800"
                strokeWidth="5"
                fill="none"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                className="stroke-[#0A26E6] transition-all duration-1000 ease-out"
                strokeWidth="5"
                strokeDasharray={2 * Math.PI * 26}
                strokeDashoffset={2 * Math.PI * 26 * (1 - progressPercent / 100)}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <span className="absolute text-xs sm:text-sm font-bold font-mono text-white">
              {progressPercent}%
            </span>
          </div>

          <div>
            <div className="text-xs sm:text-sm font-bold text-white tracking-tight leading-tight">
              Progression Opérationnelle
            </div>
            <div className="text-[11px] text-cyan-400 font-mono mt-0.5">
              {completedCount} / {totalWaypoints} secteurs validés
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Objectif sommet Resq · 100% réel
            </div>
          </div>
        </div>

        {/* 5. Right Floating Panels (Stacked side-by-side or column) */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex flex-col gap-4 w-72 sm:w-80 max-h-[calc(100%-3rem)] overflow-y-auto no-scrollbar pointer-events-auto">
          {/* Panel 1: Activities (Activités & Chantiers) */}
          <div className="rounded-2xl bg-[#0B0E23]/95 backdrop-blur-xl border border-slate-800 p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Interventions & Chantiers</span>
              </h3>
              <div className="flex items-center gap-1 text-[10px]">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-2 py-0.5 rounded-md font-mono transition-colors ${
                    activeFilter === 'all'
                      ? 'bg-[#0A26E6] text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Tous
                </button>
                <button
                  onClick={() => setActiveFilter('pending')}
                  className={`px-2 py-0.5 rounded-md font-mono transition-colors ${
                    activeFilter === 'pending'
                      ? 'bg-[#0A26E6] text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  En cours
                </button>
              </div>
            </div>

            {/* Activities Table Columns header */}
            <div className="grid grid-cols-12 text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-1">
              <span className="col-span-6">Discipline</span>
              <span className="col-span-3 text-center">Balise</span>
              <span className="col-span-3 text-right">Action</span>
            </div>

            {/* Activities List */}
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {filteredActivities.slice(0, 5).map(({ wp, chal, isCompleted }) => (
                <div
                  key={wp.id}
                  className={`grid grid-cols-12 items-center p-2 rounded-xl text-xs transition-all ${
                    isCompleted
                      ? 'bg-[#070919] border border-emerald-500/25'
                      : 'bg-[#070919] border border-slate-800/80 hover:border-[#0A26E6]/60'
                  }`}
                >
                  <div className="col-span-6 min-w-0 pr-1">
                    <div className="font-semibold text-white truncate text-[11px]">
                      {wp.subject}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {wp.name}
                    </div>
                  </div>

                  <div className="col-span-3 text-center font-mono text-[11px] font-bold text-cyan-400">
                    {wp.code}
                  </div>

                  <div className="col-span-3 text-right">
                    {isCompleted ? (
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Fait
                      </span>
                    ) : (
                      <button
                        onClick={() => handleWaypointClick(wp)}
                        className="px-2.5 py-1 text-[10px] font-bold text-white bg-[#0A26E6] hover:bg-[#1F3BF5] rounded-lg shadow-[0_0_12px_rgba(10,38,230,0.35)] transition-all active:scale-95 inline-flex items-center gap-1"
                      >
                        <Play className="w-2.5 h-2.5 fill-current" />
                        <span>Start</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Panel 2: Palmarès Réel des 6 Cités Scolaires (Zéro donnée fictive) */}
          <div className="rounded-2xl bg-[#0B0E23]/95 backdrop-blur-xl border border-slate-800 p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Télémétrie des Cités</span>
              </h3>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {archipelago.streakDays} j. série
              </span>
            </div>

            {/* Profile banner of the student */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#070919] border border-slate-800 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#0A26E6]/20 border border-[#0A26E6]/40 flex items-center justify-center text-sm text-cyan-400">
                  ⚡
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-white truncate text-[11px]">
                    {archipelago.mayorName}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Niveau {archipelago.level} · {archipelago.xp} XP
                  </div>
                </div>
              </div>
              <div className="text-right text-[10px] font-mono">
                <div className="text-amber-400 font-bold">{archipelago.bricks} 🧱</div>
                <div className="text-cyan-400">{archipelago.flowers} 🌸</div>
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
                    className="w-full p-2.5 rounded-xl bg-[#070919] hover:bg-[#0E1333] border border-slate-800 hover:border-[#0A26E6]/60 text-left transition-all group flex items-center justify-between gap-2"
                    title={`Ouvrir ${city.name}`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between text-[11px] mb-1.5">
                        <span className="font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">
                          {city.name}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400 shrink-0">
                          {isMastered ? (
                            <span className="text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> 100%
                            </span>
                          ) : (
                            `${cityDone}/${cityChals.length}`
                          )}
                        </span>
                      </div>

                      {/* Micro progress bar */}
                      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-[#0A26E6] to-[#38bdf8] rounded-full transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 6. Quick Interactive Stage Drawer Bar at Bottom */}
      <div className="p-4 sm:p-5 bg-[#070814] border-t border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0A26E6]/15 border border-[#0A26E6]/40 flex items-center justify-center text-lg shadow-sm">
            🏔️
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
              Poste de Progression Alpin & Pédagogique
            </h4>
            <p className="text-[11px] text-slate-400">
              Cliquez sur les balises de télémétrie (D1 à D8) pour résoudre un incident scolaire et édifier vos cités.
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
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all shrink-0 flex items-center gap-1.5 border ${
                  isCompleted
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50'
                    : 'bg-[#0B0E23] border-slate-800 text-slate-300 hover:border-[#0A26E6] hover:text-white'
                }`}
              >
                <span>{wp.code}</span>
                <span className="text-[10px] text-slate-400 font-sans">
                  {wp.subject.split(' ')[0]}
                </span>
                {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
