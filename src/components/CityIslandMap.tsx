import React from 'react';
import {
  Sparkles,
  Users,
  Heart,
  Building2,
  Flame,
  Plus,
  BookOpen,
} from 'lucide-react';
import { Building, ArchipelagoStats, SubjectCity, SubjectCityId } from '../types/game';
import { soundEngine } from '../utils/audio';
import { CityAtlasSelector } from './CityAtlasSelector';

interface CityIslandMapProps {
  archipelago: ArchipelagoStats;
  currentCity: SubjectCity;
  cities: SubjectCity[];
  buildings: Building[];
  onBuildPlot: (building: Building) => void;
  onUpgradeBuilding: (building: Building) => void;
  onStartChallenge: (challengeId: string) => void;
  onOpenAiForge: () => void;
  onOpenFocus: () => void;
  onSelectCity: (cityId: SubjectCityId) => void;
}

export const CityIslandMap: React.FC<CityIslandMapProps> = ({
  archipelago,
  currentCity,
  cities,
  buildings,
  onBuildPlot,
  onUpgradeBuilding,
  onStartChallenge,
  onOpenAiForge,
  onOpenFocus,
  onSelectCity,
}) => {
  const cityBuildings = buildings.filter((b) => b.cityId === currentCity.id);
  const builtBuildings = cityBuildings.filter((b) => b.status === 'built');
  const xpPercentage = Math.min(100, Math.round((archipelago.xp / archipelago.xpToNextLevel) * 100));

  const cityPopulation = archipelago.cityPopulations[currentCity.id] ?? currentCity.population;
  const cityHappiness = archipelago.cityHappiness[currentCity.id] ?? currentCity.happiness;

  return (
    <div className="space-y-8">
      {/* 1. The Atlas Selector: 1 City = 1 Subject */}
      <CityAtlasSelector
        cities={cities}
        currentCityId={currentCity.id}
        buildings={buildings}
        cityPopulations={archipelago.cityPopulations}
        cityHappiness={archipelago.cityHappiness}
        onSelectCity={onSelectCity}
      />

      {/* 2. City Hero Panorama Card for the Active Subject City */}
      <div className="relative rounded-3xl overflow-hidden border border-rose-200/90 bg-gradient-to-b from-rose-50 via-white to-pink-50 shadow-lg">
        {/* Ambient Panorama Image */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img
            src={currentCity.bannerImage}
            alt={currentCity.name}
            className="w-full h-full object-cover object-center scale-102 hover:scale-105 transition-transform duration-1000 select-none"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070712] via-[#070712]/50 to-transparent" />

          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-wrap gap-2">
            <div className="bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-rose-500/40 text-xs font-semibold text-rose-300 shadow-lg flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>{currentCity.name} · {currentCity.subjectTag}</span>
            </div>
          </div>

          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-emerald-500/40 text-xs font-semibold text-emerald-300 shadow-lg flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-emerald-400" />
            <span>{archipelago.streakDays} jours d’apprentissage</span>
          </div>
        </div>

        {/* City Vitality Strip */}
        <div className="p-6 sm:p-8 -mt-12 relative z-10 bg-white/95 dark:bg-[#0d0f22]/95 backdrop-blur-md rounded-2xl mx-4 sm:mx-8 mb-6 border border-slate-200 dark:border-purple-500/30 shadow-xl">
          <div className="mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold font-editorial text-slate-900 dark:text-white">
              {currentCity.name} – {currentCity.tagline}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-purple-200/80 mt-1 leading-relaxed">
              {currentCity.description}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-purple-500/20 text-center pt-2 border-t border-slate-100 dark:border-purple-500/20">
            <div className="pt-2 sm:pt-0">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
                <Users className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                <span>Habitants à {currentCity.name}</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {cityPopulation}
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">+15 par bâtiment</div>
            </div>

            <div className="pt-2 sm:pt-0">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
                <Heart className="w-3.5 h-3.5 text-pink-500 dark:text-pink-400 fill-pink-500" />
                <span>Bonheur Floral</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-pink-600 dark:text-pink-400 tabular-nums">
                {cityHappiness}%
              </div>
              <div className="text-[11px] text-pink-600/80 dark:text-pink-300/80">Atmosphère de Révision</div>
            </div>

            <div className="pt-2 sm:pt-0">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
                <Building2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                <span>Édifices Érigés</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                {builtBuildings.length} / {cityBuildings.length}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Monuments de {currentCity.subject.split(' ')[0]}</div>
            </div>

            <div className="pt-2 sm:pt-0">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                <span>Rang d’Architecte</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-indigo-700 dark:text-indigo-300 tabular-nums">
                Niv. {archipelago.level}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {archipelago.xp} / {archipelago.xpToNextLevel} XP ({xpPercentage}%)
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-purple-500/20">
            <div className="w-full h-2 bg-slate-100 dark:bg-purple-950/60 border border-slate-200 dark:border-purple-500/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 via-emerald-400 to-emerald-300 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${xpPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Interactive City Plots Section for this Subject City */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold font-editorial text-slate-900 dark:text-white">
              Chantiers & Bâtiments de {currentCity.name} ({currentCity.subject})
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-purple-200/80">
              Révisez cette matière pour poser les pierres et admirer vos monuments prendre vie.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenFocus();
              }}
              className="px-3.5 py-2 text-xs font-medium rounded-xl bg-slate-100 dark:bg-[#121432] border border-slate-200 dark:border-purple-500/30 hover:border-purple-400 text-slate-700 dark:text-purple-200 transition-colors shadow-sm"
            >
              🌸 Séance Focus Calme
            </button>
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenAiForge();
              }}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Concevoir avec l’IA</span>
            </button>
          </div>
        </div>

        {/* City Plots Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cityBuildings.map((building) => {
            const isBuilt = building.status === 'built';
            const isUnlocked = building.status === 'unlocked';
            const canAffordBuild =
              archipelago.bricks >= building.costBricks &&
              archipelago.flowers >= building.costFlowers;

            return (
              <div
                key={building.id}
                className={`rounded-2xl border p-5 transition-all duration-200 flex flex-col justify-between shadow-sm hover:shadow-md ${
                  isBuilt
                    ? 'bg-white dark:bg-[#0e1026] border-slate-200 dark:border-purple-500/30 hover:border-pink-400/50'
                    : isUnlocked
                    ? 'bg-rose-50/40 dark:bg-[#141638]/70 border-dashed border-rose-300 dark:border-rose-400/50 hover:bg-rose-50 dark:hover:bg-[#181a44]'
                    : 'bg-slate-50 dark:bg-[#090a16]/60 border-dashed border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                      {building.subject}
                    </span>

                    {isBuilt ? (
                      <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-500/40">
                        Bâti · Niv. {building.level} ★
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-[11px] font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-500/40">
                        Plan Débloqué
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                        Chantier Verrouillé
                      </span>
                    )}
                  </div>

                  <div className="flex items-start gap-3.5 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-100 to-rose-100 dark:from-purple-900/60 dark:to-rose-900/40 border border-slate-200 dark:border-purple-500/30 flex items-center justify-center text-2xl shadow-xs shrink-0">
                      {building.emoji}
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white font-editorial truncate">
                        {building.name}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
                        {building.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-[#121432] p-2.5 rounded-xl border border-slate-200 dark:border-purple-500/20 mb-4">
                    <span className="flex items-center gap-1 text-pink-600 dark:text-pink-400">
                      <Heart className="w-3 h-3 fill-pink-500" />
                      <span>+{building.happinessBonus}% Bonheur</span>
                    </span>
                    <span className="text-slate-300 dark:text-purple-500/40">·</span>
                    <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                      <Users className="w-3 h-3 text-slate-400" />
                      <span>+{building.residentsBonus} citadines</span>
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-purple-500/20 flex items-center justify-between">
                  {isBuilt ? (
                    <>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Rendement : <span className="font-semibold text-rose-600 dark:text-rose-400">+10 fleurs/jour</span>
                      </div>
                      <button
                        onClick={() => {
                          soundEngine.playBrickPlaced();
                          onUpgradeBuilding(building);
                        }}
                        className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/40 dark:hover:bg-purple-800/50 text-purple-800 dark:text-rose-300 border border-purple-300 dark:border-rose-500/30 transition-colors"
                      >
                        Embellir (+1 Niv.)
                      </button>
                    </>
                  ) : isUnlocked ? (
                    <>
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="text-emerald-700 dark:text-emerald-300 font-semibold">🪙 {building.costBricks}</span>
                        <span className="text-pink-700 dark:text-pink-300 font-semibold">💎 {building.costFlowers}</span>
                      </div>
                      <button
                        disabled={!canAffordBuild}
                        onClick={() => {
                          soundEngine.playBrickPlaced();
                          onBuildPlot(building);
                        }}
                        className={`px-4 py-1.5 text-xs font-semibold rounded-xl transition-all shadow-md ${
                          canAffordBuild
                            ? 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white active:scale-95'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        {canAffordBuild ? 'Ériger le Bâtiment' : 'Ressources Manquantes'}
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-xs text-slate-400">
                        Défi requis
                      </span>
                      <button
                        onClick={() => {
                          soundEngine.playClick();
                          onStartChallenge(building.associatedChallengeId);
                        }}
                        className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-purple-700 to-pink-700 hover:from-purple-600 hover:to-pink-600 text-white transition-colors flex items-center gap-1 shadow-md"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Réviser pour Débloquer</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
