import React from 'react';
import {
  Sparkles,
  Users,
  Heart,
  ChevronRight,
  BookHeart,
  Flower2,
  Crown,
  Compass,
  Laptop,
  CheckCircle2,
} from 'lucide-react';
import { SubjectCity, SubjectCityId, Building } from '../types/game';
import { soundEngine } from '../utils/audio';

interface CityAtlasSelectorProps {
  cities: SubjectCity[];
  currentCityId: SubjectCityId;
  buildings: Building[];
  cityPopulations: Record<SubjectCityId, number>;
  cityHappiness: Record<SubjectCityId, number>;
  onSelectCity: (cityId: SubjectCityId) => void;
}

export const CityAtlasSelector: React.FC<CityAtlasSelectorProps> = ({
  cities,
  currentCityId,
  buildings,
  cityPopulations,
  cityHappiness,
  onSelectCity,
}) => {
  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookHeart':
        return <BookHeart className="w-4 h-4 text-rose-500" />;
      case 'Flower2':
        return <Flower2 className="w-4 h-4 text-emerald-500" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-sky-500" />;
      case 'Crown':
        return <Crown className="w-4 h-4 text-amber-500" />;
      case 'Compass':
        return <Compass className="w-4 h-4 text-purple-500" />;
      case 'Laptop':
        return <Laptop className="w-4 h-4 text-teal-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-pink-500" />;
    }
  };

  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-editorial text-white flex items-center gap-2">
            <span>L’Archipel des Cités du Savoir</span>
            <span className="text-xs font-sans font-semibold text-rose-300 bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-500/40">
              1 Ville = 1 Matière
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-purple-200/80">
            Choisissez la cité thématique que vous souhaitez développer et embellir aujourd'hui.
          </p>
        </div>
      </div>

      {/* 6 Subject Cities Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {cities.map((city) => {
          const isCurrent = city.id === currentCityId;
          const cityBuildings = buildings.filter((b) => b.cityId === city.id);
          const builtCount = cityBuildings.filter((b) => b.status === 'built').length;
          const population = cityPopulations[city.id] ?? city.population;
          const happiness = cityHappiness[city.id] ?? city.happiness;

          return (
            <button
              key={city.id}
              onClick={() => {
                soundEngine.playClick();
                onSelectCity(city.id);
              }}
              className={`rounded-2xl border text-left transition-all duration-200 overflow-hidden flex flex-col justify-between group shadow-lg ${
                isCurrent
                  ? 'border-pink-500/80 bg-[#16183e] ring-2 ring-pink-500/40 shadow-purple-950/50 scale-102'
                  : 'border-purple-500/25 bg-[#0d0e22]/90 hover:bg-[#121434] hover:border-purple-400/50'
              }`}
            >
              {/* Mini Thumbnail */}
              <div className="relative h-20 sm:h-24 w-full overflow-hidden">
                <img
                  src={city.bannerImage}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e22] via-black/40 to-transparent" />

                {/* Subject Pill badge */}
                <div className="absolute top-2 left-2 bg-slate-950/85 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-100 border border-purple-500/30 shadow-xs flex items-center gap-1">
                  {getSubjectIcon(city.iconName)}
                  <span className="truncate max-w-[90px]">{city.subject.split(' ')[0]}</span>
                </div>

                {/* Active checkmark */}
                {isCurrent && (
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full p-0.5 shadow-md">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className="absolute bottom-1.5 left-2 right-2 text-white font-bold text-xs truncate drop-shadow-sm font-editorial">
                  {city.name}
                </div>
              </div>

              {/* City quick metrics */}
              <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                <div className="text-[11px] font-semibold text-rose-300 truncate">
                  {city.subject}
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 pt-1 border-t border-purple-500/20">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-400" />
                    <span>{population}</span>
                  </span>
                  <span className="flex items-center gap-1 text-pink-400">
                    <Heart className="w-3 h-3 fill-pink-400/80 text-pink-400" />
                    <span>{happiness}%</span>
                  </span>
                </div>

                <div className="text-[10px] text-slate-400 pt-0.5">
                  {builtCount} / {cityBuildings.length} édifices bâtis
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
