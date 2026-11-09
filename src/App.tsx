import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CITIES_BY_SUBJECT,
  INITIAL_BUILDINGS,
  INITIAL_CHALLENGES,
  GRAND_WONDER_CHALLENGE,
  DECORATION_ITEMS,
  INITIAL_FLASHCARDS,
  ACHIEVEMENT_BADGES,
  DEFAULT_ARCHIPELAGO_STATS,
} from './data/initialData';
import {
  ArchipelagoStats,
  SubjectCityId,
  Building,
  ConstructionChallenge,
  DecorationItem,
  Flashcard,
  AmbientTimeOfDay,
  StudyLanguage,
} from './types/game';
import { Sidebar, PlatformTab } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { PlatformPlanView } from './components/PlatformPlanView';
import { CityIslandMap } from './components/CityIslandMap';
import { ConstructionSiteView } from './components/ConstructionSiteView';
import { GrandWonderView } from './components/GrandWonderView';
import { CourseScheduleView } from './components/CourseScheduleView';
import { FocusStudio } from './components/FocusStudio';
import { FloristAndDecorations } from './components/FloristAndDecorations';
import { ChallengesHub } from './components/ChallengesHub';
import { AiDistrictModal } from './components/AiDistrictModal';
import { MayorProfileModal } from './components/MayorProfileModal';
import { InteractiveGuide } from './components/InteractiveGuide';
import { ArchitectJournalModal } from './components/ArchitectJournalModal';
import { MentorsModal } from './components/MentorsModal';
import { CompanionWidget } from './components/CompanionWidget';
import { CertificateModal } from './components/CertificateModal';
import { MiniGamesModal } from './components/MiniGamesModal';
import { HomeworkPlannerModal } from './components/HomeworkPlannerModal';
import { EuropeanPassportModal } from './components/EuropeanPassportModal';
import { PrintFlashcardsModal } from './components/PrintFlashcardsModal';
import { VideoDemoModal } from './components/VideoDemoModal';
import { EsportDuelModal } from './components/EsportDuelModal';
import { Cs2CaseOpeningModal } from './components/Cs2CaseOpeningModal';
import { VoiceChallengeModal } from './components/VoiceChallengeModal';
import { soundEngine } from './utils/audio';

export default function App() {
  const [archipelago, setArchipelago] = useState<ArchipelagoStats>(() => {
    try {
      const saved = localStorage.getItem('studyquest_v3_archipelago');
      if (saved) {
        const parsed: ArchipelagoStats = JSON.parse(saved);
        // Purge fictional name 'Lina' if present
        if (parsed.mayorName === 'Lina') {
          parsed.mayorName = 'Élève';
        }
        // Purge fictional starter balances if no real challenges were completed
        if (parsed.completedChallengeIds?.length === 0) {
          if (parsed.bricks === 70) parsed.bricks = 0;
          if (parsed.flowers === 45) parsed.flowers = 0;
          if (parsed.gems === 2) parsed.gems = 0;
          if (parsed.streakDays === 1) parsed.streakDays = 0;
        }
        return parsed;
      }
    } catch {}
    return DEFAULT_ARCHIPELAGO_STATS;
  });

  const [buildings, setBuildings] = useState<Building[]>(() => {
    try {
      const saved = localStorage.getItem('studyquest_v3_buildings');
      if (saved) {
        const parsed: Building[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map((b) => b.id));
        const merged = [...parsed];
        for (const b of INITIAL_BUILDINGS) {
          if (!existingIds.has(b.id)) {
            merged.push(b);
          }
        }
        return merged;
      }
    } catch {}
    return INITIAL_BUILDINGS;
  });

  const [challenges, setChallenges] = useState<ConstructionChallenge[]>(() => {
    try {
      const saved = localStorage.getItem('studyquest_v3_challenges');
      if (saved) {
        const parsed: ConstructionChallenge[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map((c) => c.id));
        const merged = [...parsed];
        for (const c of INITIAL_CHALLENGES) {
          if (!existingIds.has(c.id)) {
            merged.push(c);
          }
        }
        return merged;
      }
    } catch {}
    return INITIAL_CHALLENGES;
  });

  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => {
    try {
      const saved = localStorage.getItem('studyquest_v3_flashcards');
      if (saved) {
        const parsed: Flashcard[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map((fc) => fc.id));
        const merged = [...parsed];
        for (const fc of INITIAL_FLASHCARDS) {
          if (!existingIds.has(fc.id)) {
            merged.push(fc);
          }
        }
        return merged;
      }
    } catch {}
    return INITIAL_FLASHCARDS;
  });

  const [currentTab, setCurrentTab] = useState<PlatformTab>('plan');
  const [activeChallenge, setActiveChallenge] = useState<ConstructionChallenge | null>(null);
  const [isAiForgeOpen, setIsAiForgeOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isMentorsOpen, setIsMentorsOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isMiniGamesOpen, setIsMiniGamesOpen] = useState(false);
  const [isHomeworkOpen, setIsHomeworkOpen] = useState(false);
  const [isPassportOpen, setIsPassportOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [isVideoDemoOpen, setIsVideoDemoOpen] = useState(false);
  const [isDuelOpen, setIsDuelOpen] = useState(false);
  const [isCasesOpen, setIsCasesOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [studyLanguage, setStudyLanguage] = useState<StudyLanguage>(() => {
    try {
      const saved = localStorage.getItem('study_target_language');
      if (saved === 'nl' || saved === 'en' || saved === 'es' || saved === 'fr') return saved;
    } catch {}
    return 'nl';
  });

  const handleSelectStudyLanguage = (lang: StudyLanguage) => {
    setStudyLanguage(lang);
    try {
      localStorage.setItem('study_target_language', lang);
    } catch {}
  };

  const [timeOfDay, setTimeOfDay] = useState<AmbientTimeOfDay>('dusk');
  const [isMuted, setIsMuted] = useState(() => soundEngine.isMuted());
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('study_theme');
      if (saved === 'light' || saved === 'dark') return saved;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
    } catch {}
    return 'dark';
  });

  // Synchronize documentElement theme class and localStorage
  useEffect(() => {
    try {
      localStorage.setItem('study_theme', theme);
    } catch {}
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    soundEngine.playClick();
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Synchronize audio engine mute state
  useEffect(() => {
    const unsubscribe = soundEngine.subscribeMute((muted) => {
      setIsMuted(muted);
    });
    return unsubscribe;
  }, []);

  // Persistence
  useEffect(() => {
    try {
      localStorage.setItem('studyquest_v3_archipelago', JSON.stringify(archipelago));
    } catch {}
  }, [archipelago]);

  useEffect(() => {
    try {
      localStorage.setItem('studyquest_v3_buildings', JSON.stringify(buildings));
    } catch {}
  }, [buildings]);

  useEffect(() => {
    try {
      localStorage.setItem('studyquest_v3_challenges', JSON.stringify(challenges));
    } catch {}
  }, [challenges]);

  useEffect(() => {
    try {
      localStorage.setItem('studyquest_v3_flashcards', JSON.stringify(flashcards));
    } catch {}
  }, [flashcards]);

  // Derived current city based on archipelago.currentCityId
  const currentCity =
    CITIES_BY_SUBJECT.find((c) => c.id === archipelago.currentCityId) ||
    CITIES_BY_SUBJECT[0];

  // Check badges
  const checkBadges = (updated: ArchipelagoStats) => {
    const badges = [...updated.unlockedBadges];

    if (updated.builtBuildingIds.length >= 1 && !badges.includes('badge_first_stone')) {
      badges.push('badge_first_stone');
    }
    const builtCities = new Set(
      buildings
        .filter((b) => b.status === 'built')
        .map((b) => b.cityId)
    );
    if (builtCities.size >= 3 && !badges.includes('badge_archipelago_explorer')) {
      badges.push('badge_archipelago_explorer');
    }
    if (updated.flowers >= 150 && !badges.includes('badge_flower_master')) {
      badges.push('badge_flower_master');
    }
    if (updated.wondersCompleted >= 1 && !badges.includes('badge_wonder_builder')) {
      badges.push('badge_wonder_builder');
    }

    if (badges.length > updated.unlockedBadges.length) {
      updated.unlockedBadges = badges;
    }
  };

  // Add XP and level-up check
  const addArchipelagoXp = (amount: number, newBricks: number = 0, newFlowers: number = 0) => {
    setArchipelago((prev) => {
      let nextXp = prev.xp + amount;
      let nextBricks = prev.bricks + newBricks;
      let nextFlowers = prev.flowers + newFlowers;
      let nextLevel = prev.level;
      let nextXpToNext = prev.xpToNextLevel;
      let leveledUp = false;

      while (nextXp >= nextXpToNext) {
        nextXp -= nextXpToNext;
        nextLevel += 1;
        nextXpToNext = Math.round(nextXpToNext * 1.35);
        leveledUp = true;
      }

      if (leveledUp) {
        soundEngine.playLevelUp();
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      }

      const updated: ArchipelagoStats = {
        ...prev,
        level: nextLevel,
        xp: nextXp,
        xpToNextLevel: nextXpToNext,
        bricks: nextBricks,
        flowers: nextFlowers,
      };

      checkBadges(updated);
      return updated;
    });
  };

  // Switch active subject city
  const handleSelectCity = (cityId: SubjectCityId) => {
    setArchipelago((prev) => ({
      ...prev,
      currentCityId: cityId,
    }));
  };

  // Complete a construction challenge
  const handleCompleteChallenge = (results: {
    challengeId: string;
    unlocksBuildingId: string;
    bricksEarned: number;
    flowersEarned: number;
    xpEarned: number;
    correctCount: number;
    totalCount: number;
  }) => {
    // Unlock the associated building for construction
    setBuildings((prev) =>
      prev.map((b) =>
        b.id === results.unlocksBuildingId || b.associatedChallengeId === results.challengeId
          ? { ...b, status: b.status === 'locked' ? 'unlocked' : b.status }
          : b
      )
    );

    // Update Archipelago Stats
    setArchipelago((prev) => {
      const completedIds = Array.from(
        new Set([...prev.completedChallengeIds, results.challengeId])
      );
      const isFlawless = results.correctCount === results.totalCount;
      const newBadges = [...prev.unlockedBadges];
      if (isFlawless && !newBadges.includes('badge_flawless_blueprint')) {
        newBadges.push('badge_flawless_blueprint');
      }

      const updated: ArchipelagoStats = {
        ...prev,
        completedChallengeIds: completedIds,
        totalAnswered: prev.totalAnswered + results.totalCount,
        totalCorrect: prev.totalCorrect + results.correctCount,
        unlockedBadges: newBadges,
      };

      return updated;
    });

    addArchipelagoXp(results.xpEarned, results.bricksEarned, results.flowersEarned);
    setActiveChallenge(null);
  };

  // Build a plot on the city island
  const handleBuildPlot = (building: Building) => {
    if (archipelago.bricks < building.costBricks || archipelago.flowers < building.costFlowers) return;

    soundEngine.playBrickPlaced();
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 },
    });

    setBuildings((prev) =>
      prev.map((b) => (b.id === building.id ? { ...b, status: 'built' } : b))
    );

    setArchipelago((prev) => {
      const targetCityId = building.cityId;
      const currentPop = prev.cityPopulations[targetCityId] ?? 0;
      const currentHap = prev.cityHappiness[targetCityId] ?? 100;

      const updated: ArchipelagoStats = {
        ...prev,
        bricks: prev.bricks - building.costBricks,
        flowers: prev.flowers - building.costFlowers,
        cityPopulations: {
          ...prev.cityPopulations,
          [targetCityId]: currentPop + building.residentsBonus,
        },
        cityHappiness: {
          ...prev.cityHappiness,
          [targetCityId]: Math.min(100, currentHap + building.happinessBonus),
        },
        builtBuildingIds: Array.from(new Set([...prev.builtBuildingIds, building.id])),
      };
      checkBadges(updated);
      return updated;
    });
  };

  // Upgrade an existing building
  const handleUpgradeBuilding = (building: Building) => {
    const upgradeCost = building.costBricks * building.level;
    if (archipelago.bricks < upgradeCost) {
      alert(`Il vous faut ${upgradeCost} briques dorées pour embellir ce bâtiment.`);
      return;
    }

    soundEngine.playLevelUp();
    setBuildings((prev) =>
      prev.map((b) =>
        b.id === building.id ? { ...b, level: Math.min(b.maxLevel, b.level + 1) } : b
      )
    );

    setArchipelago((prev) => {
      const targetCityId = building.cityId;
      const currentPop = prev.cityPopulations[targetCityId] ?? 0;
      const currentHap = prev.cityHappiness[targetCityId] ?? 100;

      return {
        ...prev,
        bricks: prev.bricks - upgradeCost,
        cityPopulations: {
          ...prev.cityPopulations,
          [targetCityId]: currentPop + 30,
        },
        cityHappiness: {
          ...prev.cityHappiness,
          [targetCityId]: Math.min(100, currentHap + 5),
        },
      };
    });
  };

  // Complete Grand Wonder
  const handleCompleteWonder = (results: {
    bricksEarned: number;
    flowersEarned: number;
    xpEarned: number;
    correctCount: number;
    totalCount: number;
  }) => {
    setArchipelago((prev) => {
      const boostedPopulations = { ...prev.cityPopulations };
      const boostedHappiness = { ...prev.cityHappiness };
      for (const city of CITIES_BY_SUBJECT) {
        boostedPopulations[city.id] = (boostedPopulations[city.id] || 0) + 50;
        boostedHappiness[city.id] = 100;
      }

      const updated: ArchipelagoStats = {
        ...prev,
        wondersCompleted: prev.wondersCompleted + 1,
        cityPopulations: boostedPopulations,
        cityHappiness: boostedHappiness,
        totalAnswered: prev.totalAnswered + results.totalCount,
        totalCorrect: prev.totalCorrect + results.correctCount,
      };
      checkBadges(updated);
      return updated;
    });

    addArchipelagoXp(results.xpEarned, results.bricksEarned, results.flowersEarned);
    setCurrentTab('plan');
  };

  // Earn Focus Rewards
  const handleEarnFocusRewards = (bricks: number, flowers: number, xp: number) => {
    setArchipelago((prev) => {
      const newBadges = [...prev.unlockedBadges];
      if (!newBadges.includes('badge_cozy_focus')) {
        newBadges.push('badge_cozy_focus');
      }
      return {
        ...prev,
        unlockedBadges: newBadges,
      };
    });
    addArchipelagoXp(xp, bricks, flowers);
  };

  // Buy Decoration
  const handleBuyDecoration = (item: DecorationItem) => {
    if (archipelago.flowers < item.costFlowers || archipelago.gems < item.costGems) return;

    soundEngine.playSuccess();
    setArchipelago((prev) => {
      const owned = { ...prev.ownedDecorations };
      owned[item.id] = (owned[item.id] || 0) + 1;

      const currentHap = prev.cityHappiness[prev.currentCityId] ?? 100;

      return {
        ...prev,
        flowers: prev.flowers - item.costFlowers,
        gems: prev.gems - item.costGems,
        cityHappiness: {
          ...prev.cityHappiness,
          [prev.currentCityId]: Math.min(100, currentHap + item.happinessBoost),
        },
        ownedDecorations: owned,
      };
    });
  };

  // Create AI Challenge & Building
  const handleChallengeCreated = (newChal: ConstructionChallenge) => {
    setChallenges((prev) => [newChal, ...prev]);

    const newBuilding: Building = {
      id: newChal.unlocksBuildingId,
      cityId: newChal.cityId,
      name: newChal.buildingName,
      subject: newChal.subject,
      level: 1,
      maxLevel: 3,
      emoji: newChal.buildingEmoji || '🏛️',
      description: `Bâtiment personnalisé conçu par IA pour réviser : ${newChal.subject}`,
      costBricks: 70,
      costFlowers: 35,
      happinessBonus: 15,
      residentsBonus: 50,
      status: 'unlocked',
      gridSlot: buildings.filter((b) => b.cityId === newChal.cityId).length,
      associatedChallengeId: newChal.id,
    };

    setBuildings((prev) => [...prev, newBuilding]);
    setActiveChallenge(newChal);
  };

  // Reset Progress
  const handleResetArchipelago = () => {
    setArchipelago(DEFAULT_ARCHIPELAGO_STATS);
    setBuildings(INITIAL_BUILDINGS);
    setChallenges(INITIAL_CHALLENGES);
    setFlashcards(INITIAL_FLASHCARDS);
    setActiveChallenge(null);
    setCurrentTab('plan');
    try {
      localStorage.removeItem('studyquest_v3_archipelago');
      localStorage.removeItem('studyquest_v3_buildings');
      localStorage.removeItem('studyquest_v3_challenges');
      localStorage.removeItem('studyquest_v3_flashcards');
      localStorage.removeItem('studyquest_homework_list');
      localStorage.removeItem('study_skins_inventory');
      localStorage.removeItem('studycity_archipelago_stats');
      localStorage.removeItem('studycity_buildings_v2');
      localStorage.removeItem('studycity_challenges_v2');
      localStorage.removeItem('studycity_flashcards_v2');
    } catch {}
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0C0D12] text-slate-800 dark:text-[#EFF0F4] flex flex-row selection:bg-emerald-500/30 selection:text-white font-sans transition-colors duration-200">
      {/* 1. Left Vertical Sidebar (matching reference design) */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setActiveChallenge(null);
          setCurrentTab(tab);
        }}
        onOpenAiForge={() => setIsAiForgeOpen(true)}
        onOpenDuel={() => setIsDuelOpen(true)}
        onOpenCases={() => setIsCasesOpen(true)}
        onOpenVoice={() => setIsVoiceOpen(true)}
      />

      {/* 2. Main Body Container with Top Header and Dynamic Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Header Bar */}
        <Navbar
          currentTab={currentTab}
          setCurrentTab={(tab) => {
            setActiveChallenge(null);
            setCurrentTab(tab);
          }}
          archipelago={archipelago}
          currentCity={currentCity}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenAiForge={() => setIsAiForgeOpen(true)}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenVideoDemo={() => setIsVideoDemoOpen(true)}
          onOpenDuel={() => setIsDuelOpen(true)}
          onOpenCases={() => setIsCasesOpen(true)}
          onOpenVoice={() => setIsVoiceOpen(true)}
          selectedStudyLanguage={studyLanguage}
          onSelectStudyLanguage={handleSelectStudyLanguage}
        />

        {/* Dynamic Main Workspace View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Active Construction Challenge View */}
          {activeChallenge ? (
            <ConstructionSiteView
              challenge={activeChallenge}
              city={archipelago}
              onCompleteChallenge={handleCompleteChallenge}
              onExit={() => setActiveChallenge(null)}
            />
          ) : (
            <>
              {/* Tab 1: Plan de la Plateforme (The Main Mountain Expedition Map from the image) */}
              {currentTab === 'plan' && (
                <PlatformPlanView
                  challenges={challenges}
                  archipelago={archipelago}
                  cities={CITIES_BY_SUBJECT}
                  onSelectChallenge={(chal) => setActiveChallenge(chal)}
                  onOpenCity={(cityId) => {
                    handleSelectCity(cityId);
                    setCurrentTab('city');
                  }}
                  onStartWonder={() => setCurrentTab('wonder')}
                  timeOfDay={timeOfDay}
                  setTimeOfDay={setTimeOfDay}
                  onOpenJournal={() => setIsJournalOpen(true)}
                  onOpenMentors={() => setIsMentorsOpen(true)}
                  onOpenCertificate={() => setIsCertificateOpen(true)}
                  onOpenMiniGames={() => setIsMiniGamesOpen(true)}
                  onOpenHomework={() => setIsHomeworkOpen(true)}
                  onOpenPassport={() => setIsPassportOpen(true)}
                  onOpenPrint={() => setIsPrintOpen(true)}
                  onOpenVideoDemo={() => setIsVideoDemoOpen(true)}
                  onOpenDuel={() => setIsDuelOpen(true)}
                  onOpenCases={() => setIsCasesOpen(true)}
                  onOpenVoice={() => setIsVoiceOpen(true)}
                />
              )}

              {/* Tab 2: Cités Scolaires (Subject City Builder View) */}
              {currentTab === 'city' && (
                <div className="space-y-6">
                  <CityIslandMap
                    archipelago={archipelago}
                    currentCity={currentCity}
                    cities={CITIES_BY_SUBJECT}
                    buildings={buildings}
                    onBuildPlot={handleBuildPlot}
                    onUpgradeBuilding={handleUpgradeBuilding}
                    onStartChallenge={(chalId) => {
                      const chal = challenges.find((c) => c.id === chalId);
                      if (chal) {
                        setActiveChallenge(chal);
                      } else {
                        setCurrentTab('challenges');
                      }
                    }}
                    onOpenAiForge={() => setIsAiForgeOpen(true)}
                    onOpenFocus={() => setCurrentTab('focus')}
                    onSelectCity={handleSelectCity}
                  />
                </div>
              )}

              {/* Tab 3: Chantiers d'Étude */}
              {currentTab === 'challenges' && (
                <ChallengesHub
                  challenges={challenges}
                  cities={CITIES_BY_SUBJECT}
                  archipelago={archipelago}
                  selectedStudyLanguage={studyLanguage}
                  onSelectStudyLanguage={handleSelectStudyLanguage}
                  onSelectChallenge={(chal) => setActiveChallenge(chal)}
                  onOpenAiForge={() => setIsAiForgeOpen(true)}
                />
              )}

              {/* Tab 4: Grand Wonder (Palais Céleste des Savoirs) */}
              {currentTab === 'wonder' && (
                <GrandWonderView
                  wonderChallenge={GRAND_WONDER_CHALLENGE}
                  city={archipelago}
                  onCompleteWonder={handleCompleteWonder}
                  onExit={() => setCurrentTab('plan')}
                />
              )}

              {/* Tab 5: Course Schedule & Review Guide */}
              {currentTab === 'schedule' && (
                <CourseScheduleView
                  flashcards={flashcards}
                  cities={CITIES_BY_SUBJECT}
                  completedChallengeIds={archipelago.completedChallengeIds}
                  streakDays={archipelago.streakDays}
                  selectedStudyLanguage={studyLanguage}
                  onSelectStudyLanguage={handleSelectStudyLanguage}
                  onStartStudy={(cityId) => {
                    handleSelectCity(cityId);
                    setCurrentTab('city');
                  }}
                  onOpenPrint={() => setIsPrintOpen(true)}
                />
              )}

              {/* Tab 6: Focus Studio & Thé */}
              {currentTab === 'focus' && (
                <FocusStudio onEarnFocusRewards={handleEarnFocusRewards} />
              )}

              {/* Tab 7: Florist & Decorations */}
              {currentTab === 'shop' && (
                <FloristAndDecorations
                  items={DECORATION_ITEMS}
                  city={archipelago}
                  onBuyDecoration={handleBuyDecoration}
                />
              )}
            </>
          )}
        </main>

        {/* Global Footer in CS2 Esports style */}
        <footer className="border-t border-[#222533] bg-[#10121A] px-4 py-4 text-center text-xs text-slate-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-black text-white tracking-tight">STUDY</span>
              <span className="text-emerald-400 font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 font-bold uppercase">
                Esports & Academy
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">Saison 1 : Expédition des Rangs</span>
            </div>

            <div className="flex items-center gap-2.5 text-slate-400 font-medium flex-wrap justify-center text-[11px] font-mono">
              <span className="text-emerald-400">🇳🇱 Néerlandais</span>
              <span className="text-slate-700">·</span>
              <span className="text-cyan-400">Français</span>
              <span className="text-slate-700">·</span>
              <span className="text-emerald-400">Sciences</span>
              <span className="text-slate-700">·</span>
              <span className="text-blue-400">Maths</span>
              <span className="text-slate-700">·</span>
              <span className="text-purple-400">Histoire</span>
              <span className="text-slate-700">·</span>
              <span className="text-teal-400">Code</span>
            </div>

            <div className="font-mono text-[10px] text-emerald-400 flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Saison 1 Active</span>
            </div>
          </div>
        </footer>
      </div>

      {/* AI Building Challenge Modal */}
      <AiDistrictModal
        isOpen={isAiForgeOpen}
        onClose={() => setIsAiForgeOpen(false)}
        onChallengeCreated={handleChallengeCreated}
      />

      {/* Mayor Profile Modal */}
      <MayorProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        archipelago={archipelago}
        badges={ACHIEVEMENT_BADGES}
        onUpdateMayorName={(mayor) =>
          setArchipelago((prev) => ({ ...prev, mayorName: mayor }))
        }
        onUpdateTitle={(title) =>
          setArchipelago((prev) => ({ ...prev, architectTitle: title }))
        }
        onResetArchipelago={handleResetArchipelago}
      />

      {/* Architect Illustrated Journal Modal */}
      <ArchitectJournalModal
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
        cities={CITIES_BY_SUBJECT}
        buildings={buildings}
      />

      {/* Historical Mentors Modal */}
      <MentorsModal
        isOpen={isMentorsOpen}
        onClose={() => setIsMentorsOpen(false)}
      />

      {/* Kid-Friendly Interactive Guide & Daily Mission for 10-year olds */}
      <InteractiveGuide
        onStartQuest={(challengeId) => {
          const chal = challenges.find((c) => c.id === challengeId);
          if (chal) {
            setActiveChallenge(chal);
          }
        }}
        onOpenCity={(cityId) => {
          handleSelectCity(cityId);
          setCurrentTab('city');
        }}
        onOpenJournal={() => setIsJournalOpen(true)}
        onOpenMentors={() => setIsMentorsOpen(true)}
      />

      {/* Interactive Animal Companion Widget */}
      <CompanionWidget
        flowers={archipelago.flowers}
        onFeedCompanion={(cost) => {
          if (archipelago.flowers < cost) return false;
          setArchipelago((prev) => ({
            ...prev,
            flowers: prev.flowers - cost,
          }));
          return true;
        }}
      />

      {/* Official Graduation Certificate Modal */}
      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        archipelago={archipelago}
        cities={CITIES_BY_SUBJECT}
      />

      {/* Flash 60-Second Mini Games Modal */}
      <MiniGamesModal
        isOpen={isMiniGamesOpen}
        onClose={() => setIsMiniGamesOpen(false)}
        onEarnRewards={(bricks, flowers, xp) => {
          addArchipelagoXp(xp, bricks, flowers);
        }}
      />

      {/* Real Homework Planner Modal */}
      <HomeworkPlannerModal
        isOpen={isHomeworkOpen}
        onClose={() => setIsHomeworkOpen(false)}
        cities={CITIES_BY_SUBJECT}
        onCompleteHomeworkBonus={(bricks) => {
          addArchipelagoXp(30, bricks, 5);
        }}
      />

      {/* European Diplomatic Passport Modal */}
      <EuropeanPassportModal
        isOpen={isPassportOpen}
        onClose={() => setIsPassportOpen(false)}
        archipelago={archipelago}
        cities={CITIES_BY_SUBJECT}
      />

      {/* Printable Pocket Flashcards Sheet Modal */}
      <PrintFlashcardsModal
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
      />

      {/* 1-Minute Live Demo Video Tour Modal */}
      <VideoDemoModal
        isOpen={isVideoDemoOpen}
        onClose={() => setIsVideoDemoOpen(false)}
        onStartChallenge={() => {
          if (challenges.length > 0) {
            setActiveChallenge(challenges[0]);
          }
        }}
        onOpenMiniGames={() => setIsMiniGamesOpen(true)}
        onOpenCertificate={() => setIsCertificateOpen(true)}
      />

      {/* Esport Duel 1v1 Modal */}
      <EsportDuelModal
        isOpen={isDuelOpen}
        onClose={() => setIsDuelOpen(false)}
        selectedStudyLanguage={studyLanguage}
        onSelectStudyLanguage={handleSelectStudyLanguage}
        onEarnRewards={(bricks, xp) => {
          addArchipelagoXp(xp, bricks, 10);
        }}
      />

      {/* CS2 Case Opening & Skins Modal */}
      <Cs2CaseOpeningModal
        isOpen={isCasesOpen}
        onClose={() => setIsCasesOpen(false)}
        bricks={archipelago.bricks}
        onSpendBricks={(amount) => {
          if (archipelago.bricks < amount) return false;
          setArchipelago((prev) => ({
            ...prev,
            bricks: prev.bricks - amount,
          }));
          return true;
        }}
      />

      {/* Voice Challenge & Speech Recognition Modal */}
      <VoiceChallengeModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        selectedStudyLanguage={studyLanguage}
        onSelectStudyLanguage={handleSelectStudyLanguage}
        onEarnRewards={(bricks, xp) => {
          addArchipelagoXp(xp, bricks, 10);
        }}
      />
    </div>
  );
}
