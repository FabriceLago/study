import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  User,
  Heart,
  Search,
  Bell,
  Compass,
  Globe,
  ChevronDown,
  Check,
  Sun,
  Moon,
  Film,
  Swords,
  Package,
  Mic,
} from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { ArchipelagoStats, SubjectCity } from '../types/game';
import { PlatformTab } from './Sidebar';
import { i18n, SUPPORTED_LANGUAGES, StudyLanguage, useLanguage } from '../utils/i18n';

interface NavbarProps {
  currentTab: PlatformTab;
  setCurrentTab: (tab: PlatformTab) => void;
  archipelago: ArchipelagoStats;
  currentCity: SubjectCity;
  onOpenProfile: () => void;
  onOpenAiForge: () => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onOpenVideoDemo?: () => void;
  onOpenDuel?: () => void;
  onOpenCases?: () => void;
  onOpenVoice?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  archipelago,
  currentCity,
  onOpenProfile,
  onOpenAiForge,
  isMuted,
  setIsMuted,
  searchQuery,
  setSearchQuery,
  theme = 'dark',
  onToggleTheme,
  onOpenVideoDemo,
  onOpenDuel,
  onOpenCases,
  onOpenVoice,
}) => {
  const { lang: currentLang, t, setLanguage: handleSetLang } = useLanguage();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    if (isLangMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isLangMenuOpen]);

  const activeLangInfo = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  const handleSelectLanguage = (langCode: StudyLanguage) => {
    soundEngine.playClick();
    handleSetLang(langCode);
    setIsLangMenuOpen(false);
  };
  const handleToggleSound = () => {
    if (!isMuted) {
      soundEngine.playClick();
    }
    const newState = soundEngine.toggleMute();
    setIsMuted(newState);
  };

  const navItems = [
    { id: 'plan' as PlatformTab, label: t.tabPlan },
    { id: 'city' as PlatformTab, label: t.tabCity },
    { id: 'challenges' as PlatformTab, label: t.tabChallenges },
    { id: 'wonder' as PlatformTab, label: t.tabWonder },
    { id: 'schedule' as PlatformTab, label: t.tabSchedule },
    { id: 'focus' as PlatformTab, label: t.tabFocus },
    { id: 'shop' as PlatformTab, label: t.tabShop },
  ];

  const happiness = archipelago.cityHappiness[currentCity.id] ?? currentCity.happiness;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#10121A]/95 backdrop-blur-xl border-b border-slate-200 dark:border-[#232738] px-3 sm:px-6 py-2.5 shadow-sm dark:shadow-2xl text-slate-800 dark:text-white select-none transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
        {/* Left: Brand Logo in CS2 Esports Typography */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              soundEngine.playClick();
              setCurrentTab('plan');
            }}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-300 p-0.5 shadow-[0_0_18px_rgba(16,185,129,0.4)] shrink-0 transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-[#12141D] rounded-[10px] flex items-center justify-center text-sm font-black text-emerald-400">
                ⚡
              </div>
            </div>
            <div>
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white block leading-none font-sans group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                STUDY
              </span>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-wider uppercase mt-1">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Esports & Academy</span>
                <span className="text-slate-400 dark:text-slate-600">·</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-semibold">Saison 1</span>
              </div>
            </div>
          </button>
        </div>

        {/* Center: CS2 Live Drops Ticker / Recent Student Victories */}
        <div className="hidden lg:flex flex-1 max-w-xl items-center overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#161824] border border-slate-200 dark:border-[#262A3D] text-[11px] font-mono w-full transition-colors">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider shrink-0 text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <span>🔥</span>
              <span>Live Drops</span>
            </span>
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar whitespace-nowrap text-xs">
              <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[10px] px-1 rounded bg-emerald-400/15">VERT</span>
                <span>Het Nederlands Paviljoen</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">+75 🪙</span>
              </span>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300">
                <span className="text-purple-600 dark:text-purple-400 font-bold text-[10px] px-1 rounded bg-purple-400/15">VIOLET</span>
                <span>Écluses d'Amsterdam</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-semibold">+35 🪙</span>
              </span>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-[10px] px-1 rounded bg-blue-400/15">BLEU</span>
                <span>L'Oreille Polyglotte</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">+50 XP</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Zone: CS2 Gamer HUD (Coins, Gems, Level Bar, Audio, Theme Toggle, Language, Profile) */}
        <div className="flex items-center gap-2 sm:gap-2 shrink-0">
          {/* Currency HUD: Briques (Coins) & Fleurs (Gems) */}
          <div className="flex items-center gap-2 p-1 sm:px-3 sm:py-1 rounded-xl bg-slate-100 dark:bg-[#161824] border border-slate-200 dark:border-[#262A3D] text-xs font-mono transition-colors">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold" title="Pièces et briques (Coins)">
              <span>🪙</span>
              <span>{archipelago.bricks}</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="flex items-center gap-1 text-pink-600 dark:text-pink-400 font-bold" title="Fleurs d'inspiration (Gems)">
              <span>💎</span>
              <span>{archipelago.flowers}</span>
            </span>
          </div>

          {/* Level / XP Progress Pill */}
          <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-[#161824] border border-slate-200 dark:border-[#262A3D] text-xs font-mono transition-colors">
            <span className="font-black text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 px-1.5 py-0.5 rounded text-[10px] border border-emerald-500/30">
              LVL {archipelago.level}
            </span>
            <div className="flex flex-col gap-0.5 w-16">
              <div className="flex justify-between text-[9px] text-slate-500 dark:text-slate-400 font-mono">
                <span>XP</span>
                <span>{archipelago.xp}/{archipelago.xpToNextLevel}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-[#0C0D12] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 transition-all duration-300"
                  style={{
                    width: `${Math.min(100, Math.round((archipelago.xp / archipelago.xpToNextLevel) * 100))}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Audio Mute Button */}
          <button
            onClick={handleToggleSound}
            aria-pressed={isMuted}
            aria-label={isMuted ? 'Activer tous les sons' : 'Couper tous les sons'}
            title={
              isMuted
                ? 'Sons désactivés. Cliquez pour réactiver les sons.'
                : 'Couper tous les effets sonores du jeu.'
            }
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs transition-all shrink-0 active:scale-95 ${
              isMuted
                ? 'bg-rose-100 dark:bg-rose-950/80 border-rose-300 dark:border-rose-500/60 text-rose-700 dark:text-rose-300 font-semibold'
                : 'bg-slate-100 dark:bg-[#161824] border-slate-200 dark:border-[#262A3D] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-emerald-500/60'
            }`}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400 shrink-0" />
                <span className="hidden sm:inline">Mute</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span className="hidden sm:inline">Audio</span>
              </>
            )}
          </button>

          {/* Theme Switcher: Mode Clair ☀️ / Mode Sombre 🌙 */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
              title={theme === 'dark' ? 'Activer le Mode Clair ☀️' : 'Activer le Mode Sombre 🌙'}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs transition-all shrink-0 active:scale-95 bg-slate-100 dark:bg-[#161824] border-slate-200 dark:border-[#262A3D] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-emerald-500/60 shadow-sm"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="hidden sm:inline">Clair</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="hidden sm:inline">Sombre</span>
                </>
              )}
            </button>
          )}

          {/* Esport Duel 1v1 Button */}
          {onOpenDuel && (
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenDuel();
              }}
              aria-label={t.duel1v1}
              title="Lancer un match Duel 1v1 Esport"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs transition-all shrink-0 active:scale-95 bg-slate-100 dark:bg-[#161824] hover:bg-slate-200 dark:hover:bg-[#202434] border-slate-200 dark:border-[#262A3D] hover:border-emerald-500/50 text-slate-700 dark:text-slate-300 font-bold shadow-xs"
            >
              <Swords className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
              <span className="hidden lg:inline">{t.duel1v1}</span>
            </button>
          )}

          {/* CS2 Cases Button */}
          {onOpenCases && (
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenCases();
              }}
              aria-label={t.caseOpening}
              title="Ouvrir des caisses de butin avec vos briques dorées"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs transition-all shrink-0 active:scale-95 bg-slate-100 dark:bg-[#161824] hover:bg-slate-200 dark:hover:bg-[#202434] border-slate-200 dark:border-[#262A3D] hover:border-emerald-500/50 text-slate-700 dark:text-slate-300 font-bold shadow-xs"
            >
              <Package className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
              <span className="hidden lg:inline">{t.caseOpening}</span>
            </button>
          )}

          {/* Voice Challenge Button */}
          {onOpenVoice && (
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenVoice();
              }}
              aria-label={t.voiceChallenge}
              title="Tester la prononciation vocale au micro"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs transition-all shrink-0 active:scale-95 bg-slate-100 dark:bg-[#161824] hover:bg-slate-200 dark:hover:bg-[#202434] border-slate-200 dark:border-[#262A3D] hover:border-emerald-500/50 text-slate-700 dark:text-slate-300 font-bold shadow-xs"
            >
              <Mic className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
              <span className="hidden xl:inline">{t.voiceChallenge}</span>
            </button>
          )}

          {/* 1-Minute Live Demo Video Tour */}
          {onOpenVideoDemo && (
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenVideoDemo();
              }}
              aria-label="Lancer la vidéo démo de 1 minute sur l'utilisation"
              title="Regarder la vidéo démo de 1 minute sur l'utilisation de Study"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs transition-all shrink-0 active:scale-95 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-500/50 text-emerald-800 dark:text-emerald-300 font-bold hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] shadow-xs"
            >
              <Film className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="hidden sm:inline">Démo 1 min</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse hidden sm:inline" />
            </button>
          )}

          {/* Multilingual Switcher (Néerlandais 🇳🇱, Français 🇫🇷, Anglais 🇬🇧, Espagnol 🇪🇸) */}
          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => {
                soundEngine.playClick();
                setIsLangMenuOpen((prev) => !prev);
              }}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#161824] hover:bg-slate-200 dark:hover:bg-[#202434] border border-slate-200 dark:border-[#262A3D] hover:border-emerald-500/50 text-xs font-mono transition-all text-slate-700 dark:text-slate-200 active:scale-95"
              title="Changer la langue d'apprentissage"
              aria-label="Sélectionner la langue d'étude"
              aria-expanded={isLangMenuOpen}
            >
              <span className="text-sm">{activeLangInfo.flag}</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{activeLangInfo.code.toUpperCase()}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-400 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangMenuOpen && (
              <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-[#161824] border border-slate-200 dark:border-[#2E334B] shadow-2xl p-2 z-50 space-y-1 backdrop-blur-xl animate-fadeIn">
                <div className="px-2.5 py-1.5 border-b border-slate-200 dark:border-[#262A3D] text-[10px] uppercase font-mono tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
                  <span>Langues d’Apprentissage</span>
                  <span className="text-slate-400 dark:text-slate-500 font-mono">4 langues</span>
                </div>

                {SUPPORTED_LANGUAGES.map((lang) => {
                  const isSelected = lang.code === currentLang;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleSelectLanguage(lang.code)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-all text-left ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                          : 'hover:bg-slate-100 dark:hover:bg-[#1E2130] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-base shrink-0">{lang.flag}</span>
                        <div className="min-w-0">
                          <div className="leading-tight font-medium truncate">{lang.name}</div>
                          <div className={`text-[10px] truncate ${isSelected ? 'text-slate-900 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                            {lang.description}
                          </div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-slate-950 shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Notification Bell */}
          <button
            onClick={() => {
              soundEngine.playClick();
            }}
            className="p-2 rounded-xl bg-slate-100 dark:bg-[#161824] border border-slate-200 dark:border-[#262A3D] hover:border-emerald-500/50 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors relative"
            title="Notifications d'apprentissage"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
          </button>

          {/* Player Profile with CS2 Rank Border */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenProfile();
            }}
            className="flex items-center gap-2 p-1 sm:px-2 sm:py-1 rounded-xl bg-slate-100 dark:bg-[#161824] border border-slate-200 dark:border-[#262A3D] hover:border-emerald-500/50 text-xs transition-all shrink-0 group"
            title="Consulter mon profil de joueur"
          >
            <div className="w-7 h-7 rounded-lg overflow-hidden border border-emerald-500/60 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.25)]">
              <img
                src={archipelago.avatarUrl || '/assets/images/avatar_girl_architect_1793997414338.jpg'}
                alt={archipelago.mayorName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="hidden lg:block text-left leading-none pr-1">
              <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-mono uppercase font-bold tracking-wider">Joueur / Élève</div>
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors mt-0.5 truncate max-w-[90px]">
                {archipelago.mayorName}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Tab Pills */}
      <div className="md:hidden flex items-center justify-between gap-1 overflow-x-auto pt-2 pb-0.5 mt-2 border-t border-slate-200 dark:border-[#232738] text-xs">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              soundEngine.playClick();
              setCurrentTab(item.id);
            }}
            className={`px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0 transition-colors ${
              currentTab === item.id
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
