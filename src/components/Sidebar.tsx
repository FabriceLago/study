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
  Swords,
  Package,
  Mic,
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

import { i18n, StudyLanguage, useLanguage } from '../utils/i18n';

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
  onOpenDuel?: () => void;
  onOpenCases?: () => void;
  onOpenVoice?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenAiForge,
  onOpenDuel,
  onOpenCases,
  onOpenVoice,
}) => {
  const { lang, t } = useLanguage();

  const mainNavItems = [
    {
      id: 'plan' as const,
      label: t.tabPlan,
      shortLabel: 'Plan',
      icon: <Compass className="w-5 h-5" />,
      description: 'Expédition & Sommet',
    },
    {
      id: 'city' as const,
      label: t.tabCity,
      shortLabel: 'Cités',
      icon: <Building2 className="w-5 h-5" />,
      description: 'Archipel des 6 matières',
    },
    {
      id: 'challenges' as const,
      label: t.tabChallenges,
      shortLabel: 'Chantiers',
      icon: <BookOpen className="w-5 h-5" />,
      description: 'Épreuves & Questions',
    },
    {
      id: 'wonder' as const,
      label: t.tabWonder,
      shortLabel: 'Merveille',
      icon: <Crown className="w-5 h-5" />,
      description: 'Sommet & Défi Transversal',
    },
    {
      id: 'schedule' as const,
      label: t.tabSchedule,
      shortLabel: 'Planning',
      icon: <Calendar className="w-5 h-5" />,
      description: 'Calendrier des devoirs',
    },
    {
      id: 'focus' as const,
      label: t.tabFocus,
      shortLabel: 'Focus',
      icon: <Coffee className="w-5 h-5" />,
      description: 'Atelier de concentration cosy',
    },
    {
      id: 'shop' as const,
      label: t.tabShop,
      shortLabel: 'Boutique',
      icon: <ShoppingBag className="w-5 h-5" />,
      description: 'Décorations & Végétation',
    },
  ];

  return (
    <aside className="w-20 md:w-64 bg-white dark:bg-[#111218] border-r border-slate-200 dark:border-[#222432] flex flex-col justify-between py-5 px-3 shrink-0 z-30 select-none transition-colors duration-200">
      {/* Top Logo / CS2 Esports Emblem */}
      <div className="space-y-6">
        <button
          onClick={() => {
            soundEngine.playClick();
            setCurrentTab('plan');
          }}
          className="w-full flex items-center gap-3 px-2 py-1 text-left group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-300 p-0.5 shadow-[0_0_18px_rgba(16,185,129,0.35)] shrink-0 transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-[#111218] rounded-[14px] flex items-center justify-center text-lg font-black text-emerald-400">
              ⚡
            </div>
          </div>

          <div className="hidden md:block min-w-0">
            <span className="text-base font-black font-sans text-slate-900 dark:text-white tracking-tight leading-none block group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
              STUDY
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono tracking-wider uppercase block mt-1">
              Esports & Academy
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
                    ? 'bg-emerald-50 dark:bg-[#12221b] text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#161822]'
                }`}
                title={item.label}
              >
                <div
                  className={`transition-colors shrink-0 ${
                    isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-300'
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
                  <span className="md:hidden absolute right-2 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Esport Links */}
        <div className="pt-3 border-t border-slate-200 dark:border-[#222432] space-y-1">
          {onOpenDuel && (
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenDuel();
              }}
              className="w-full flex items-center justify-center md:justify-start gap-2.5 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-[#181a24] text-xs font-semibold transition-all group"
              title={t.duel1v1}
            >
              <Swords className="w-4 h-4 text-emerald-500 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline truncate">{t.duel1v1}</span>
            </button>
          )}

          {onOpenCases && (
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenCases();
              }}
              className="w-full flex items-center justify-center md:justify-start gap-2.5 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-[#181a24] text-xs font-semibold transition-all group"
              title={t.caseOpening}
            >
              <Package className="w-4 h-4 text-teal-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline truncate">{t.caseOpening}</span>
            </button>
          )}

          {onOpenVoice && (
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenVoice();
              }}
              className="w-full flex items-center justify-center md:justify-start gap-2.5 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-[#181a24] text-xs font-semibold transition-all group"
              title={t.voiceChallenge}
            >
              <Mic className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline truncate">{t.voiceChallenge}</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Action: AI Architect Forge Button */}
      <div className="pt-4 border-t border-slate-200 dark:border-[#222432] space-y-2">
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenAiForge();
          }}
          className="w-full flex items-center justify-center md:justify-start gap-2.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold shadow-[0_0_18px_rgba(16,185,129,0.3)] transition-all active:scale-95 group"
          title="Créer un Chantier d'apprentissage personnalisé par IA"
        >
          <Wand2 className="w-4 h-4 shrink-0 transition-transform group-hover:rotate-12" />
          <span className="hidden md:inline font-sans truncate">
            Chantier sur-mesure IA
          </span>
        </button>

        <div className="hidden md:block text-[10px] text-slate-500 dark:text-slate-400 text-center font-mono">
          Saison 1 · 6 Cités du Savoir
        </div>
      </div>
    </aside>
  );
};
