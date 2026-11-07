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
} from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { ArchipelagoStats, SubjectCity } from '../types/game';
import { PlatformTab } from './Sidebar';
import { i18n, SUPPORTED_LANGUAGES, StudyLanguage } from '../utils/i18n';

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
}) => {
  const [currentLang, setCurrentLang] = useState<StudyLanguage>(() => i18n.getLanguage());
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = i18n.subscribe((lang) => {
      setCurrentLang(lang);
    });
    return unsubscribe;
  }, []);

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
    i18n.setLanguage(langCode);
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
    { id: 'plan' as PlatformTab, label: 'Plan de la Plateforme' },
    { id: 'city' as PlatformTab, label: 'Cités Scolaires' },
    { id: 'challenges' as PlatformTab, label: 'Chantiers' },
    { id: 'wonder' as PlatformTab, label: 'Merveille' },
    { id: 'schedule' as PlatformTab, label: 'Planning' },
    { id: 'focus' as PlatformTab, label: 'Focus' },
    { id: 'shop' as PlatformTab, label: 'Boutique' },
  ];

  const happiness = archipelago.cityHappiness[currentCity.id] ?? currentCity.happiness;

  return (
    <header className="sticky top-0 z-40 bg-[#070814]/95 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 py-2.5 shadow-lg text-white select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
        {/* Left: View Title / Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              soundEngine.playClick();
              setCurrentTab('plan');
            }}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0A26E6] via-blue-600 to-cyan-400 p-0.5 shadow-[0_0_15px_rgba(10,38,230,0.4)] shrink-0">
              <div className="w-full h-full bg-[#070814] rounded-[10px] flex items-center justify-center text-sm">
                🏔️
              </div>
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold font-sans tracking-tight text-white block leading-tight">
                {currentTab === 'plan' ? 'Poste de Commandement' : 'StudyQuest'}
              </span>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono tracking-wide mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                <span className="text-emerald-400 font-semibold">Système Opérationnel</span>
                <span className="text-slate-600">·</span>
                <span className="text-blue-400">6 Cités</span>
              </div>
            </div>
          </button>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md items-center">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-blue-400 absolute left-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une épreuve, une notion, un monument..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#0c0f24] border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0A26E6] focus:ring-1 focus:ring-[#0A26E6]/40 transition-all font-sans"
            />
          </div>
        </div>

        {/* Right Zone: Controls, Resources, Mute All, Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Live Resources Bar */}
          <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#0c0f24] border border-slate-800 text-xs font-mono">
            <span className="flex items-center gap-1 text-amber-300 font-semibold" title="Briques d'or">
              <span>🧱</span>
              <span>{archipelago.bricks}</span>
            </span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center gap-1 text-pink-300 font-semibold" title="Fleurs d’inspiration">
              <span>🌸</span>
              <span>{archipelago.flowers}</span>
            </span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center gap-1 text-sky-400" title="Bonheur de la cité actuelle">
              <Heart className="w-3.5 h-3.5 fill-sky-400 text-sky-400" />
              <span>{happiness}%</span>
            </span>
          </div>

          {/* Global 'Mute All' Button */}
          <button
            onClick={handleToggleSound}
            aria-pressed={isMuted}
            aria-label={isMuted ? 'Activer tous les sons' : 'Mute All - Couper tous les sons'}
            title={
              isMuted
                ? 'Sons désactivés (Mode silence actif). Cliquez pour réactiver les sons.'
                : 'Mute All — Couper tous les effets sonores du jeu pour une session silencieuse.'
            }
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs transition-all duration-150 shrink-0 active:scale-95 ${
              isMuted
                ? 'bg-rose-950/80 border-rose-500 text-rose-200 font-semibold shadow-inner hover:bg-rose-900/80'
                : 'bg-[#0c0f24] border-slate-700 text-slate-200 font-medium hover:text-white hover:border-[#0A26E6] hover:bg-[#121838]'
            }`}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span className="text-rose-200">Mute</span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" title="Sourdine active" />
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Audio</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_6px_#34d399]" title="Sons actifs" />
              </>
            )}
          </button>

          {/* Study Language Switcher (Néerlandais 🇳🇱, Français 🇫🇷, Anglais 🇬🇧, Espagnol 🇪🇸) */}
          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => {
                soundEngine.playClick();
                setIsLangMenuOpen((prev) => !prev);
              }}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#0c0f24] hover:bg-[#121838] border border-slate-700/80 hover:border-[#0A26E6] text-xs font-mono transition-all text-slate-200 active:scale-95"
              title="Changer la langue d'apprentissage (Néerlandais, Français, Anglais, Espagnol)"
              aria-label="Sélectionner la langue d'étude"
              aria-expanded={isLangMenuOpen}
            >
              <span className="text-sm">{activeLangInfo.flag}</span>
              <span className="font-bold text-cyan-300">{activeLangInfo.code.toUpperCase()}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangMenuOpen && (
              <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-[#0B0E23] border border-slate-700 shadow-2xl p-2 z-50 space-y-1 backdrop-blur-xl animate-fadeIn">
                <div className="px-2.5 py-1.5 border-b border-slate-800 text-[10px] uppercase font-mono tracking-wider text-cyan-400 flex items-center justify-between">
                  <span>Langues d’Apprentissage</span>
                  <span className="text-slate-500 font-mono">4 langues</span>
                </div>

                {SUPPORTED_LANGUAGES.map((lang) => {
                  const isSelected = lang.code === currentLang;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleSelectLanguage(lang.code)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-all text-left ${
                        isSelected
                          ? 'bg-[#0A26E6] text-white font-semibold shadow-md'
                          : 'hover:bg-[#070919] text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-base shrink-0">{lang.flag}</span>
                        <div className="min-w-0">
                          <div className="leading-tight font-medium truncate">{lang.name}</div>
                          <div className={`text-[10px] truncate ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                            {lang.description}
                          </div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1" />}
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
            className="p-2 rounded-xl bg-[#0c0f24] border border-slate-700/80 hover:border-[#0A26E6] text-slate-300 hover:text-white transition-colors relative"
            title="Notifications d'apprentissage"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#0A26E6] animate-ping" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#0A26E6]" />
          </button>

          {/* Profil de l'élève architecte */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenProfile();
            }}
            className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-[#0c0f24] border border-slate-700/80 hover:border-[#0A26E6] text-xs transition-all shrink-0 group"
            title="Consulter le profil de commandement"
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg overflow-hidden border border-blue-500/50 shrink-0">
              <img
                src={archipelago.avatarUrl || '/assets/images/avatar_girl_architect_1793997414338.jpg'}
                alt={archipelago.mayorName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="hidden lg:block text-left leading-none pr-1">
              <div className="text-[10px] text-slate-400 font-mono">Agent / Élève</div>
              <div className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors mt-0.5">
                {archipelago.mayorName}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Tab Pills */}
      <div className="md:hidden flex items-center justify-between gap-1 overflow-x-auto pt-2 pb-0.5 mt-2 border-t border-slate-800 text-xs">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              soundEngine.playClick();
              setCurrentTab(item.id);
            }}
            className={`px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0 transition-colors ${
              currentTab === item.id
                ? 'bg-[#0A26E6] text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
