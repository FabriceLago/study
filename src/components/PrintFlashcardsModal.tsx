import React, { useState } from 'react';
import { Printer, X, Scissors, BookOpen, Globe, Check, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface PrintFlashcardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PrintableCard {
  id: string;
  lang: 'nl' | 'en' | 'fr' | 'math';
  langLabel: string;
  flag: string;
  front: string;
  pronunciation?: string;
  back: string;
  tip: string;
}

const PRINTABLE_CARDS: PrintableCard[] = [
  // --- NÉERLANDAIS ---
  {
    id: 'p_nl_1',
    lang: 'nl',
    langLabel: 'Néerlandais (Nederlands)',
    flag: '🇳🇱',
    front: 'Goedemorgen',
    pronunciation: '[Ghou-de-mor-khen]',
    back: 'Bonjour ! (Le matin)',
    tip: 'En néerlandais : Goedemorgen le matin, Goedemiddag l’après-midi, Goedenavond le soir.',
  },
  {
    id: 'p_nl_2',
    lang: 'nl',
    langLabel: 'Néerlandais (Nederlands)',
    flag: '🇳🇱',
    front: 'Alsjeblieft / Alstublieft',
    pronunciation: '[Al-sye-blift]',
    back: 'S’il te plaît / Voici !',
    tip: 'Mot magique pour demander poliment ou quand on tend un cahier à un camarade.',
  },
  {
    id: 'p_nl_3',
    lang: 'nl',
    langLabel: 'Néerlandais (Nederlands)',
    flag: '🇳🇱',
    front: 'Dank je wel / Dank u wel',
    pronunciation: '[Dank ye vel]',
    back: 'Merci beaucoup !',
    tip: 'Proche du mot anglais « Thanks » et de l’allemand « Danke ».',
  },
  {
    id: 'p_nl_4',
    lang: 'nl',
    langLabel: 'Néerlandais (Nederlands)',
    flag: '🇳🇱',
    front: 'Hoe gaat het?',
    pronunciation: '[Hou khratt het?]',
    back: 'Comment vas-tu ?',
    tip: 'Réponse classique : « Goed, dank je wel! » (Bien, merci beaucoup !).',
  },
  {
    id: 'p_nl_5',
    lang: 'nl',
    langLabel: 'Néerlandais (Nederlands)',
    flag: '🇳🇱',
    front: 'Het huis & De school',
    pronunciation: '[Het heuys / De skhol]',
    back: 'La maison & L’école',
    tip: 'En néerlandais, les noms ont deux genres : « de » et « het » (neutre).',
  },
  {
    id: 'p_nl_6',
    lang: 'nl',
    langLabel: 'Néerlandais (Nederlands)',
    flag: '🇳🇱',
    front: '1, 2, 3, 4, 5 (Nombres)',
    pronunciation: '[Één, twee, drie, vier, vijf]',
    back: 'Un, Deux, Trois, Quatre, Cinq',
    tip: '1 = één, 2 = twee, 3 = drie, 4 = vier, 5 = vijf, 10 = tien.',
  },

  // --- ANGLAIS ---
  {
    id: 'p_en_1',
    lang: 'en',
    langLabel: 'Anglais (English)',
    flag: '🇬🇧',
    front: 'A piece of cake',
    pronunciation: '[Euh piis ov kéïk]',
    back: 'C’est du gâteau / Très facile',
    tip: 'Expression pour dire qu’un exercice est un vrai jeu d’enfant.',
  },
  {
    id: 'p_en_2',
    lang: 'en',
    langLabel: 'Anglais (English)',
    flag: '🇬🇧',
    front: 'Actually',
    pronunciation: '[Ak-tchou-eu-li]',
    back: 'En réalité / En fait (Faux-ami !)',
    tip: 'Attention : pour dire « actuellement », on dit « currently » !',
  },

  // --- FRANÇAIS & GÉOMÉTRIE ---
  {
    id: 'p_fr_1',
    lang: 'fr',
    langLabel: 'Français & Grammaire',
    flag: '🇫🇷',
    front: 'Accord du participe passé avec « ÊTRE »',
    back: 'Il s’accorde TOUJOURS avec le sujet en genre et en nombre.',
    tip: 'Exemple : « Elles sont parti-es » (féminin pluriel).',
  },
  {
    id: 'p_math_1',
    lang: 'math',
    langLabel: 'Mathématiques & Géométrie',
    flag: '📐',
    front: 'Périmètre & Aire d’un rectangle',
    back: 'Périmètre = 2 × (L + l) | Aire = L × l',
    tip: 'Le périmètre fait le tour (en cm), l’aire remplit la surface (en cm²).',
  },
];

export const PrintFlashcardsModal: React.FC<PrintFlashcardsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'nl' | 'en' | 'fr'>('all');

  if (!isOpen) return null;

  const filtered =
    selectedCategory === 'all'
      ? PRINTABLE_CARDS
      : PRINTABLE_CARDS.filter((c) => (selectedCategory === 'fr' ? c.lang === 'fr' || c.lang === 'math' : c.lang === selectedCategory));

  const handlePrint = () => {
    soundEngine.playSuccess();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn select-none overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border border-slate-700 bg-[#0B0E23] text-slate-100 shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-[#070814] border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0A26E6]/20 border border-[#0A26E6]/50 flex items-center justify-center text-xl text-cyan-300">
              🖨️
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>Fiches Mémos Imprimables & Découpage</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  Prêt pour Impression A4
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Imprimez ces cartes recto-verso prêtes à découper pour réviser sans écran dans les transports ou à l'école.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0A26E6] hover:bg-[#1F3BF5] text-white rounded-xl text-xs font-semibold shadow-[0_0_15px_rgba(10,38,230,0.4)] transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer (PDF)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-[#070919] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="px-5 py-3 bg-[#070919] border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs shrink-0">
          <span className="text-slate-400 font-mono text-[11px] mr-1">Filtrer par langue :</span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-lg font-mono transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#0A26E6] text-white font-semibold'
                : 'bg-[#0B0E23] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Toutes ({PRINTABLE_CARDS.length})
          </button>
          <button
            onClick={() => setSelectedCategory('nl')}
            className={`px-3 py-1 rounded-lg font-mono transition-all flex items-center gap-1.5 ${
              selectedCategory === 'nl'
                ? 'bg-[#0A26E6] text-white font-semibold'
                : 'bg-[#0B0E23] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>🇳🇱</span>
            <span>Néerlandais</span>
          </button>
          <button
            onClick={() => setSelectedCategory('en')}
            className={`px-3 py-1 rounded-lg font-mono transition-all flex items-center gap-1.5 ${
              selectedCategory === 'en'
                ? 'bg-[#0A26E6] text-white font-semibold'
                : 'bg-[#0B0E23] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>🇬🇧</span>
            <span>Anglais</span>
          </button>
          <button
            onClick={() => setSelectedCategory('fr')}
            className={`px-3 py-1 rounded-lg font-mono transition-all flex items-center gap-1.5 ${
              selectedCategory === 'fr'
                ? 'bg-[#0A26E6] text-white font-semibold'
                : 'bg-[#0B0E23] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>🇫🇷</span>
            <span>Français & Maths</span>
          </button>
        </div>

        {/* Cards Preview Grid */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 bg-[#05050D]">
          <div className="flex items-center gap-2 text-xs text-cyan-300 font-mono bg-[#0B0E23] p-3 rounded-xl border border-slate-800">
            <Scissors className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              Instructions : Pliez chaque carte au centre le long de la ligne pointillée, puis collez les deux faces pour former votre fiche de poche recto-verso !
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((card) => (
              <div
                key={card.id}
                className="rounded-2xl border-2 border-dashed border-slate-700 bg-[#0B0E23] p-4 text-left shadow-lg space-y-3 relative group hover:border-[#0A26E6]/60 transition-colors"
              >
                {/* Header Flag & Subject */}
                <div className="flex items-center justify-between text-xs font-mono border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{card.flag}</span>
                    <span className="text-cyan-400 font-semibold">{card.langLabel}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Study Pocket Card</span>
                </div>

                {/* Recto / Verso Split View */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  {/* RECTO */}
                  <div className="p-3 rounded-xl bg-[#070919] border border-slate-800 space-y-1">
                    <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
                      RECTO (Question / Mot)
                    </div>
                    <div className="text-sm font-bold text-white leading-tight">
                      {card.front}
                    </div>
                    {card.pronunciation && (
                      <div className="text-[11px] text-emerald-300 font-mono italic">
                        {card.pronunciation}
                      </div>
                    )}
                  </div>

                  {/* VERSO */}
                  <div className="p-3 rounded-xl bg-[#070919] border border-emerald-500/30 space-y-1">
                    <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
                      VERSO (Sens & Traduction)
                    </div>
                    <div className="text-sm font-semibold text-emerald-200 leading-tight">
                      {card.back}
                    </div>
                  </div>
                </div>

                {/* Pedagogic Tip Footer */}
                <div className="text-[11px] text-slate-400 bg-[#070919] p-2 rounded-lg border border-slate-800/80 leading-relaxed">
                  💡 <strong className="text-slate-200">Astuce mémoire : </strong>{card.tip}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#070814] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="font-mono">
            {filtered.length} fiches sélectionnées pour impression
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0A26E6] hover:bg-[#1F3BF5] text-white rounded-xl font-bold shadow-[0_0_20px_rgba(10,38,230,0.35)] active:scale-95 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Lancer l’impression</span>
          </button>
        </div>
      </div>
    </div>
  );
};
