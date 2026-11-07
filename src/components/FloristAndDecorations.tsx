import React from 'react';
import {
  Flower2,
  Sparkles,
  Heart,
  Droplets,
  Bike,
  Lamp,
  Cat,
  Feather,
  Music,
  Check,
} from 'lucide-react';
import { DecorationItem, ArchipelagoStats } from '../types/game';
import { soundEngine } from '../utils/audio';

interface FloristAndDecorationsProps {
  items: DecorationItem[];
  city: ArchipelagoStats;
  onBuyDecoration: (item: DecorationItem) => void;
}

export const FloristAndDecorations: React.FC<FloristAndDecorationsProps> = ({
  items,
  city,
  onBuyDecoration,
}) => {
  const getItemIcon = (iconName: string) => {
    switch (iconName) {
      case 'Droplets':
        return <Droplets className="w-5 h-5 text-sky-500" />;
      case 'Bike':
        return <Bike className="w-5 h-5 text-emerald-500" />;
      case 'Lamp':
        return <Lamp className="w-5 h-5 text-amber-500" />;
      case 'Cat':
        return <Cat className="w-5 h-5 text-pink-500" />;
      case 'Feather':
        return <Feather className="w-5 h-5 text-indigo-500" />;
      case 'Music':
        return <Music className="w-5 h-5 text-rose-500" />;
      default:
        return <Flower2 className="w-5 h-5 text-rose-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Florist Showcase Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-purple-500/30 bg-gradient-to-r from-[#141638] via-[#0d0e24] to-[#1a1232] p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider">
              <Flower2 className="w-4 h-4 text-pink-400" />
              <span>Fleuriste & Décorations de la Cité</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold font-editorial text-white">
              L’Atelier Botanique & Compagnons
            </h2>

            <p className="text-xs sm:text-sm text-purple-200/80 leading-relaxed max-w-xl">
              Échangez vos fleurs d'inspiration récoltées lors des cours pour installer de ravissantes fontaines, des bicyclettes pastel et adopter de doux compagnons qui augmentent le bonheur de vos citadines.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/80 border border-purple-500/30 text-xs font-mono font-bold text-pink-300 shadow-sm">
                <span>🌸</span>
                <span>{city.flowers} Fleurs en réserve</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/80 border border-amber-500/30 text-xs font-mono font-bold text-amber-300 shadow-sm">
                <span>💎</span>
                <span>{city.gems} Joyaux célestes</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 flex justify-center">
            <div className="w-44 h-44 rounded-2xl overflow-hidden border-2 border-purple-500/40 shadow-xl">
              <img
                src="/src/assets/images/item_city_decorations_1793997414972.jpg"
                alt="Décorations de Cité"
                className="w-full h-full object-cover select-none"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold font-editorial text-white">
          Mobilier Urbain, Faune Douce & Végétation
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => {
            const ownedCount = city.ownedDecorations[item.id] || 0;
            const canAfford =
              city.flowers >= item.costFlowers && city.gems >= item.costGems;

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-purple-500/30 bg-[#0d0e22] p-5 flex flex-col justify-between hover:shadow-purple-900/20 hover:border-pink-400/50 transition-all shadow-lg backdrop-blur-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#121432] border border-purple-500/20 flex items-center justify-center shadow-xs">
                      {getItemIcon(item.icon)}
                    </div>
                    <span className="text-[11px] font-semibold text-pink-300 bg-pink-950/80 px-2.5 py-0.5 rounded-full border border-pink-500/40 flex items-center gap-1">
                      <Heart className="w-3 h-3 fill-pink-400" />
                      <span>+{item.happinessBoost}% Bonheur</span>
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white font-editorial mb-1">
                    {item.name}
                  </h4>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-purple-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-pink-300 font-bold">🌸 {item.costFlowers}</span>
                    {item.costGems > 0 && (
                      <span className="text-amber-300 font-bold">💎 {item.costGems}</span>
                    )}
                  </div>

                  <button
                    disabled={!canAfford}
                    onClick={() => {
                      soundEngine.playSuccess();
                      onBuyDecoration(item);
                    }}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all shadow-md active:scale-95 ${
                      canAfford
                        ? 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    }`}
                  >
                    {ownedCount > 0 ? `Installer (+1) [${ownedCount}]` : 'Acquérir'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
