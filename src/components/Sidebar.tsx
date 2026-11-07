import React from 'react';
import {
  Compass,
  Building2,
  BookOpen,
  Crown,
  Coffee,
  Sparkles,
  ShoppingBag,
  Layers,
  Calendar,
  MessageSquare,
  Wand2,
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

export type PlatformTab =
  | 'plan'
  | 'city'
  | 'challenges'
  | 'wonder'
  | 'schedule'
  | 'focus'
  | 'shop';

interface SidebarProps {
  currentTab: PlatformTab;
  setCurrentTab: (tab: PlatformTab) => void;
  onOpenAiForge: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenAiForge,
}) => {
  const mainNavItems = [
    {
      id: 'plan' as const,
      label: 'Plan de la Plateforme',
      shortLabel: 'Plan',
      icon: <Compass className="w-5 h-5" />,
      description: 'Expédition & Tableau de bord',
    },
    {
      id: 'city' as const,
      label: 'Cités Scolaires',
      shortLabel: 'Cités',
      icon: <Building2 className="w-5 h-5" />,
      description: 'Archipel des 6 matières',
    },
    {
      id: 'challenges' as const,
      label: 'Chantiers d’Étude',
      shortLabel: 'Chantiers',
      icon: <BookOpen className="w-5 h-5" />,
      description: 'Épreuves & Questions de cours',
    },
    {
      id: 'wonder' as const,
      label: 'Palais des Savoirs',
      shortLabel: 'Merveille',
      icon: <Crown className="w-5 h-5" />,
      description: 'Sommet & Défi Transversal',
    },
    {
      id: 'schedule' as const,
      label: 'Planning de Révisions',
      shortLabel: 'Planning',
      icon: <Calendar className="w-5 h-5" />,
      description: 'Calendrier des devoirs',
    },
    {
      id: 'focus' as const,
      label: 'Studio Focus & Thé',
      shortLabel: 'Focus',
      icon: <Coffee className="w-5 h-5" />,
      description: 'Atelier de concentration cosy',
    },
    {
      id: 'shop' as const,
      label: 'Fleuriste & Ornements',
      shortLabel: 'Boutique',
      icon: <ShoppingBag className="w-5 h-5" />,
      description: 'Décorations & Végétation',
    },
  ];

  return (
    <aside className="w-20 md:w-64 bg-[#070814] border-r border-slate-800/80 flex flex-col justify-between py-5 px-3 shrink-0 z-30 select-none">
      {/* Top Logo / Mountain Command Node */}
      <div className="space-y-6">
        <button
          onClick={() => {
            soundEngine.playClick();
            setCurrentTab('plan');
          }}
          className="w-full flex items-center gap-3 px-2 py-1 text-left group"
        >
          {/* Outcrowd Resq.io electric node emblem */}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0A26E6] via-blue-600 to-cyan-400 p-0.5 shadow-[0_0_20px_rgba(10,38,230,0.45)] shrink-0 transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-[#070814] rounded-[14px] flex items-center justify-center text-lg">
              🏔️
            </div>
          </div>

          <div className="hidden md:block min-w-0">
            <span className="text-base font-bold font-sans text-white tracking-tight leading-none block">
              StudyQuest
            </span>
            <span className="text-[10px] text-blue-400 font-mono tracking-wide block mt-1">
              Command & Learning Hub
            </span>
          </div>
        </button>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {mainNavItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  soundEngine.playClick();
                  setCurrentTab(item.id);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all duration-150 group relative ${
                  isActive
                    ? 'bg-[#0A26E6]/15 text-white font-semibold border-l-4 border-[#0A26E6] shadow-[inset_0_0_15px_rgba(10,38,230,0.15)]'
                    : 'text-slate-400 hover:text-white hover:bg-[#0e122b]'
                }`}
                title={item.label}
              >
                <div
                  className={`transition-colors shrink-0 ${
                    isActive ? 'text-[#38bdf8]' : 'text-slate-400 group-hover:text-blue-400'
                  }`}
                >
                  {item.icon}
                </div>

                <div className="hidden md:block min-w-0 text-left">
                  <span className="truncate block font-medium text-xs">
                    {item.label}
                  </span>
                </div>

                {/* Active indicator dot for compact view */}
                {isActive && (
                  <span className="md:hidden absolute right-2 w-1.5 h-1.5 rounded-full bg-[#0A26E6] shadow-[0_0_8px_#0A26E6]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Action: AI Architect Forge Button */}
      <div className="pt-4 border-t border-slate-800/80 space-y-2">
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenAiForge();
          }}
          className="w-full flex items-center justify-center md:justify-start gap-2.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#0A26E6] via-blue-600 to-[#1d4ed8] hover:from-[#1836f6] hover:to-[#2563eb] text-white text-xs font-semibold shadow-[0_0_20px_rgba(10,38,230,0.35)] border border-blue-400/30 transition-all active:scale-95 group"
          title="Créer un Chantier d'apprentissage personnalisé par IA"
        >
          <Wand2 className="w-4 h-4 shrink-0 transition-transform group-hover:rotate-12" />
          <span className="hidden md:inline font-sans truncate">
            Chantier sur-mesure IA
          </span>
        </button>

        <div className="hidden md:block text-[10px] text-slate-500 text-center font-mono">
          Système 6 Cités Scolaires
        </div>
      </div>
    </aside>
  );
};
