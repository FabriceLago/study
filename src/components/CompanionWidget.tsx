import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Volume2, X, ChevronRight, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CompanionPet } from '../types/game';
import { soundEngine } from '../utils/audio';
import { speechHelper } from '../utils/speech';

interface CompanionWidgetProps {
  flowers: number;
  onFeedCompanion: (flowerCost: number) => boolean;
  onAddBricks?: (amount: number) => void;
}

const AVAILABLE_COMPANIONS: CompanionPet[] = [
  {
    id: 'lumina_fox',
    name: 'Lumina',
    species: 'Renarde des Cimes',
    emoji: '🦊',
    affection: 85,
    favoriteSubject: 'Sciences & Nature',
    advice: [
      'Prends une grande inspiration ! Une question difficile devient plus facile quand on la lit mot par mot.',
      'Savais-tu que les arbres communiquent entre eux par leurs racines ? La nature est magique !',
      'N’oublie pas de boire une gorgée d’eau, ça donne plein d’énergie à tes neurones.',
      'Chaque brique que tu poses rend notre cité plus belle et joyeuse !',
      'Si un problème de maths te bloque, dessine-le sur un brouillon !',
    ],
  },
  {
    id: 'athena_owl',
    name: 'Athéna',
    species: 'Chouette Savante',
    emoji: '🦉',
    affection: 70,
    favoriteSubject: 'Histoire & Français',
    advice: [
      'Lire un livre chaque soir, c’est voyager gratuitement dans le temps et l’espace.',
      'Les plus grands savants ont tous fait des milliers d’erreurs avant de réussir. Continue !',
      'Pour retenir un mot d’anglais difficile, invente une petite rime amusante.',
      'Le calme et la patience sont les meilleurs outils d’une architecte en herbe.',
    ],
  },
  {
    id: 'luna_wolf',
    name: 'Luna',
    species: 'Louve Protectrice',
    emoji: '🐺',
    affection: 60,
    favoriteSubject: 'Géométrie & Logique',
    advice: [
      'Tu as le courage d’une cheffe de meute ! N’aie jamais peur d’essayer.',
      'Un triangle équilatéral a ses trois côtés parfaitement égaux, comme une amitié solide !',
      'Regarde le sommet de la montagne là-haut : tu t’en approches à chaque bonne réponse !',
    ],
  },
];

export const CompanionWidget: React.FC<CompanionWidgetProps> = ({
  flowers,
  onFeedCompanion,
}) => {
  const [selectedCompanionIndex, setSelectedCompanionIndex] = useState(0);
  const [currentAdviceIndex, setCurrentAdviceIndex] = useState(0);
  const [isBubbleOpen, setIsBubbleOpen] = useState(false);
  const [affection, setAffection] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('studyquest_companion_affection');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { lumina_fox: 85, athena_owl: 70, luna_wolf: 60 };
  });

  const pet = AVAILABLE_COMPANIONS[selectedCompanionIndex];
  const petAffection = affection[pet.id] || pet.affection;
  const currentAdvice = pet.advice[currentAdviceIndex % pet.advice.length];

  const handleFeed = () => {
    if (flowers < 5) {
      soundEngine.playError();
      return;
    }

    const success = onFeedCompanion(5);
    if (!success) return;

    soundEngine.playSuccess();
    confetti({
      particleCount: 40,
      spread: 45,
      origin: { x: 0.1, y: 0.8 },
      colors: ['#f43f5e', '#ec4899', '#fbbf24'],
    });

    setAffection((prev) => {
      const nextAffection = Math.min(100, (prev[pet.id] || 60) + 10);
      const updated = { ...prev, [pet.id]: nextAffection };
      try {
        localStorage.setItem('studyquest_companion_affection', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Advance advice
    setCurrentAdviceIndex((prev) => prev + 1);
  };

  const handleNextAdvice = () => {
    soundEngine.playClick();
    setCurrentAdviceIndex((prev) => (prev + 1) % pet.advice.length);
  };

  const handleSpeakAdvice = () => {
    soundEngine.playClick();
    speechHelper.speak(`${pet.name} te dit : ${currentAdvice}`);
  };

  const handleSwitchCompanion = () => {
    soundEngine.playClick();
    setSelectedCompanionIndex((prev) => (prev + 1) % AVAILABLE_COMPANIONS.length);
    setCurrentAdviceIndex(0);
  };

  return (
    <div className="fixed bottom-5 left-5 z-40 select-none">
      {/* Speech Bubble */}
      {isBubbleOpen && (
        <div className="mb-3 w-72 sm:w-80 p-4 rounded-3xl bg-[#10122b]/95 text-slate-100 border border-purple-500/40 shadow-[0_0_40px_rgba(244,63,94,0.25)] backdrop-blur-xl relative animate-fadeIn">
          {/* Close button */}
          <button
            onClick={() => setIsBubbleOpen(false)}
            className="absolute top-2.5 right-2.5 text-slate-400 hover:text-white p-1"
            title="Réduire la bulle"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Pet Info Header */}
          <div className="flex items-center justify-between border-b border-purple-500/20 pb-2 mb-2 pr-6">
            <div className="flex items-center gap-2">
              <span className="text-xl">{pet.emoji}</span>
              <div>
                <h4 className="text-xs font-bold font-editorial text-white leading-none">
                  {pet.name}
                </h4>
                <span className="text-[10px] text-pink-400 font-medium font-sans">
                  {pet.species}
                </span>
              </div>
            </div>

            {/* Affection Level */}
            <div className="flex items-center gap-1 text-[11px] font-bold text-rose-300 bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-500/30">
              <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
              <span>{petAffection}%</span>
            </div>
          </div>

          {/* Dialogue Message */}
          <p className="text-xs text-purple-100 leading-relaxed italic bg-purple-950/50 p-2.5 rounded-2xl border border-purple-500/20">
            « {currentAdvice} »
          </p>

          {/* Bubble Actions */}
          <div className="mt-3 pt-2 border-t border-purple-500/20 flex items-center justify-between gap-1 text-xs">
            <div className="flex items-center gap-1.5">
              {/* Speak Audio */}
              <button
                onClick={handleSpeakAdvice}
                className="p-1.5 rounded-xl bg-purple-950/60 hover:bg-rose-900/40 text-purple-300 hover:text-white border border-purple-500/20 transition-colors"
                title="Écouter à voix haute"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>

              {/* Next Tip */}
              <button
                onClick={handleNextAdvice}
                className="px-2 py-1 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border border-purple-500/20 text-[10px] font-bold flex items-center gap-0.5"
                title="Autre conseil"
              >
                <span>Autre</span>
                <ChevronRight className="w-3 h-3" />
              </button>

              {/* Switch Animal */}
              <button
                onClick={handleSwitchCompanion}
                className="p-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-500/20 transition-colors"
                title="Changer de compagnon animal"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Feed with 5 flowers */}
            <button
              onClick={handleFeed}
              disabled={flowers < 5}
              className={`px-3 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1 shadow-md transition-transform active:scale-95 ${
                flowers >= 5
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white'
                  : 'bg-slate-900/60 text-slate-500 border border-slate-800 cursor-not-allowed'
              }`}
              title="Donner 5 fleurs pour cajoler ton compagnon"
            >
              <span>Nourrir</span>
              <span className="font-mono text-[10px]">(5 🌸)</span>
            </button>
          </div>

          {/* Triangle bubble pointer */}
          <div className="absolute -bottom-2 left-6 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-[#10122b]" />
        </div>
      )}

      {/* Floating Pet Avatar Button */}
      <button
        onClick={() => {
          soundEngine.playClick();
          setIsBubbleOpen((prev) => !prev);
        }}
        className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-pink-500 text-slate-950 font-bold shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all border-2 border-white group"
        title="Ouvrir les conseils de ton animal compagnon"
      >
        <span className="text-2xl group-hover:scale-120 group-hover:rotate-6 transition-transform">
          {pet.emoji}
        </span>
        <div className="hidden sm:flex flex-col text-left leading-none pr-1">
          <span className="text-xs font-bold font-editorial text-white drop-shadow-xs">
            {pet.name}
          </span>
          <span className="text-[10px] text-amber-100 font-sans font-medium">
            Compagnon ({petAffection}%)
          </span>
        </div>
      </button>
    </div>
  );
};
