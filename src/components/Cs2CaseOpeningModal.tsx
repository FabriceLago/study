import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  Package,
  Award,
  CheckCircle2,
  Lock,
  Gift,
  Zap,
} from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { useLanguage } from '../utils/i18n';

interface Cs2CaseOpeningModalProps {
  isOpen: boolean;
  onClose: () => void;
  bricks: number;
  onSpendBricks: (amount: number) => boolean;
}

export interface CosmeticSkin {
  id: string;
  name: string;
  type: 'badge' | 'title' | 'cursor' | 'monument' | 'special';
  rarity: 'mil-spec' | 'restricted' | 'classified' | 'covert' | 'special';
  emoji: string;
  color: string;
  borderColor: string;
  description: string;
}

const SKINS_COLLECTION: CosmeticSkin[] = [
  {
    id: 'skin_badge_bronze',
    name: 'Badge Vétéran d’Amsterdam',
    type: 'badge',
    rarity: 'mil-spec',
    emoji: '🌷',
    color: 'bg-blue-950/70 text-blue-300',
    borderColor: 'border-blue-500/50',
    description: 'Emblème officiel de l’Académie polyglotte des Pays-Bas.',
  },
  {
    id: 'skin_badge_math',
    name: 'Insigne Calculateur Éclair',
    type: 'badge',
    rarity: 'mil-spec',
    emoji: '⚡',
    color: 'bg-blue-950/70 text-blue-300',
    borderColor: 'border-blue-500/50',
    description: 'Démontre une rapidité sans faille lors des tables de multiplication.',
  },
  {
    id: 'skin_cursor_laser',
    name: 'Curseur Laser Émeraude',
    type: 'cursor',
    rarity: 'restricted',
    emoji: '✨',
    color: 'bg-purple-950/70 text-purple-300',
    borderColor: 'border-purple-500/50',
    description: 'Une aura verte émeraude qui étincelle sous chaque clic.',
  },
  {
    id: 'skin_title_polyglot',
    name: 'Titre : Maître Polyglotte',
    type: 'title',
    rarity: 'classified',
    emoji: '🌐',
    color: 'bg-pink-950/70 text-pink-300',
    borderColor: 'border-pink-500/50',
    description: 'Titre prestigieux accordé aux étudiants maîtrisant les 4 langues.',
  },
  {
    id: 'skin_monument_doppler',
    name: 'Palais Céleste Doppler Émeraude',
    type: 'monument',
    rarity: 'covert',
    emoji: '🏛️',
    color: 'bg-rose-950/70 text-rose-300',
    borderColor: 'border-rose-500/60',
    description: 'Un habillage néon légendaire pour votre Merveille Alpin.',
  },
  {
    id: 'skin_special_phoenix',
    name: '★ Compagnon Phénix des Savoirs',
    type: 'special',
    rarity: 'special',
    emoji: '🦅',
    color: 'bg-amber-950/80 text-amber-300',
    borderColor: 'border-amber-400',
    description: 'L’oiseau mythique qui renaît à chaque révision parfaite !',
  },
];

const CASE_PRICE = 20; // 20 bricks per open

export const Cs2CaseOpeningModal: React.FC<Cs2CaseOpeningModalProps> = ({
  isOpen,
  onClose,
  bricks,
  onSpendBricks,
}) => {
  const { t } = useLanguage();
  const [isSpinning, setIsSpinning] = useState(false);
  const [reelItems, setReelItems] = useState<CosmeticSkin[]>([]);
  const [wonSkin, setWonSkin] = useState<CosmeticSkin | null>(null);
  const [inventory, setInventory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('study_skins_inventory');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const reelRef = useRef<HTMLDivElement>(null);

  // Generate randomized reel items for the animation
  const generateReel = () => {
    const list: CosmeticSkin[] = [];
    for (let i = 0; i < 50; i++) {
      const rand = Math.random();
      let picked: CosmeticSkin;
      if (rand < 0.05) picked = SKINS_COLLECTION[5]; // 5% Special
      else if (rand < 0.15) picked = SKINS_COLLECTION[4]; // 10% Covert
      else if (rand < 0.35) picked = SKINS_COLLECTION[3]; // 20% Classified
      else if (rand < 0.65) picked = SKINS_COLLECTION[2]; // 30% Restricted
      else picked = SKINS_COLLECTION[Math.floor(Math.random() * 2)]; // 35% Mil-spec
      list.push(picked);
    }
    return list;
  };

  const handleOpenCase = () => {
    if (bricks < CASE_PRICE || isSpinning) return;

    const success = onSpendBricks(CASE_PRICE);
    if (!success) return;

    soundEngine.playClick();
    setIsSpinning(true);
    setWonSkin(null);

    const newReel = generateReel();
    setReelItems(newReel);

    // Chosen winning item is item at index 40
    const winner = newReel[40];

    // Scroll reel
    if (reelRef.current) {
      reelRef.current.style.transition = 'none';
      reelRef.current.style.transform = 'translateX(0px)';

      setTimeout(() => {
        if (reelRef.current) {
          reelRef.current.style.transition = 'transform 4.5s cubic-bezier(0.12, 0.8, 0.1, 1)';
          // Each card is ~140px wide with gap
          const itemWidth = 148;
          const targetOffset = -(40 * itemWidth - 180 + Math.random() * 40);
          reelRef.current.style.transform = `translateX(${targetOffset}px)`;
        }
      }, 50);
    }

    setTimeout(() => {
      setIsSpinning(false);
      setWonSkin(winner);
      soundEngine.playSuccess();
      setInventory((prev) => {
        if (!prev.includes(winner.id)) {
          const updated = [...prev, winner.id];
          try {
            localStorage.setItem('study_skins_inventory', JSON.stringify(updated));
          } catch {}
          return updated;
        }
        return prev;
      });
    }, 4800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn select-none overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl border border-[#232838] bg-[#0c0d15] text-slate-100 shadow-[0_0_60px_rgba(16,185,129,0.25)] overflow-hidden">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-[#10121d] border-b border-[#232838] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-300 p-0.5 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              <div className="w-full h-full bg-[#10121d] rounded-[10px] flex items-center justify-center text-emerald-400 font-bold">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-white uppercase tracking-tight font-sans">
                  {t.caseOpening} · Caisses de Saison 1
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold">
                  CS2 STYLE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Ouvrez des butins rares grâce à vos briques dorées gagnées lors des devoirs et cours.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-xl">
              Solde : {bricks} 🧱
            </div>

            <button
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-[#1A1D2B] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 bg-[#080910] space-y-6">
          {/* Active Case Banner */}
          <div className="p-5 rounded-2xl bg-[#0f111e] border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-400 p-0.5 shadow-lg shrink-0">
                <div className="w-full h-full bg-[#0a0c16] rounded-[14px] flex items-center justify-center text-3xl">
                  🎁
                </div>
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Caisse Émeraude d’Amsterdam (Saison 1)</h4>
                <p className="text-xs text-slate-400 max-w-md">
                  Contient des badges néerlandais, des auras de curseur laser, des titres d'architecte et un compagnon phénix mythique.
                </p>
              </div>
            </div>

            <button
              disabled={bricks < CASE_PRICE || isSpinning}
              onClick={handleOpenCase}
              className={`px-5 py-3 rounded-xl font-bold text-xs shadow-lg transition-all active:scale-95 flex items-center gap-2 shrink-0 ${
                bricks >= CASE_PRICE && !isSpinning
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Ouvrir la Caisse ({CASE_PRICE} 🧱)</span>
            </button>
          </div>

          {/* Reel Unboxing Animation Area */}
          <div className="relative p-4 rounded-2xl bg-[#0b0c16] border border-[#232838] overflow-hidden shadow-2xl">
            {/* Center Pointer Arrow */}
            <div className="absolute top-0 bottom-0 left-1/2 -ml-1 w-2 z-20 pointer-events-none flex flex-col justify-between items-center">
              <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[10px] border-l-transparent border-r-transparent border-t-emerald-400" />
              <div className="w-0.5 h-full bg-emerald-400/80 shadow-[0_0_10px_#10B981]" />
              <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[10px] border-l-transparent border-r-transparent border-b-emerald-400" />
            </div>

            {/* Horizontal Roller */}
            <div className="overflow-hidden py-4">
              <div ref={reelRef} className="flex gap-2">
                {(reelItems.length > 0 ? reelItems : SKINS_COLLECTION).map((skin, i) => (
                  <div
                    key={i}
                    className={`w-36 h-40 shrink-0 rounded-xl border p-3 flex flex-col items-center justify-between text-center transition-all bg-[#0e1020] ${skin.borderColor}`}
                  >
                    <div className="text-3xl my-auto">{skin.emoji}</div>
                    <div className="w-full">
                      <div className="text-[11px] font-bold text-white truncate">{skin.name}</div>
                      <div className={`text-[9px] font-mono uppercase font-bold mt-0.5 ${skin.color.split(' ')[1]}`}>
                        {skin.rarity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Won Skin Celebration Card */}
          {wonSkin && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0d1624] via-[#0b1b1c] to-[#0d1624] border-2 border-emerald-400 text-center space-y-4 shadow-[0_0_40px_rgba(16,185,129,0.3)] animate-fadeIn">
              <div className="text-5xl">{wonSkin.emoji}</div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  NOUVEAU BUTIN OBTENU !
                </span>
                <h3 className="text-xl font-bold text-white">{wonSkin.name}</h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">{wonSkin.description}</p>
              </div>

              <div className="flex items-center justify-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Rareté : {wonSkin.rarity.toUpperCase()}
                </span>
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ajouté à votre inventaire
                </span>
              </div>
            </div>
          )}

          {/* Possible Loot Showcase */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 uppercase font-bold">Contenu potentiel de la caisse</span>
              <span className="text-emerald-400 font-bold">{inventory.length} / {SKINS_COLLECTION.length} Débloqués</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {SKINS_COLLECTION.map((s) => {
                const isOwned = inventory.includes(s.id);
                return (
                  <div
                    key={s.id}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                      isOwned
                        ? 'bg-[#101426] border-emerald-500/40 shadow-sm'
                        : 'bg-[#0a0c16] border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="text-2xl">{s.emoji}</div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white truncate">{s.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{s.description}</div>
                    </div>
                    {isOwned ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
