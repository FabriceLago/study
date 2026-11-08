import React from 'react';
import { Award, X, CheckCircle2, Globe, Sparkles, MapPin, ShieldCheck, Compass } from 'lucide-react';
import { ArchipelagoStats, SubjectCity } from '../types/game';
import { soundEngine } from '../utils/audio';

interface EuropeanPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  archipelago: ArchipelagoStats;
  cities: SubjectCity[];
}

interface PassportStamp {
  id: string;
  code: string;
  city: string;
  country: string;
  flag: string;
  subject: string;
  challengeId: string;
  sealEmoji: string;
  inkColor: string;
  inkBorder: string;
  inkBg: string;
  authority: string;
}

const PASSPORT_STAMPS: PassportStamp[] = [
  {
    id: 'stamp_d1',
    code: 'D1',
    city: 'Paris · Sorbonne',
    country: 'France',
    flag: '🇫🇷',
    subject: 'Français & Littérature',
    challengeId: 'chal_fr_1',
    sealEmoji: '🏛️',
    inkColor: 'text-rose-400',
    inkBorder: 'border-rose-500/60',
    inkBg: 'bg-rose-950/20',
    authority: 'Académie des Belles-Lettres',
  },
  {
    id: 'stamp_d2',
    code: 'D2',
    city: 'Kew Gardens · Botanique',
    country: 'Europe des Sciences',
    flag: '🌿',
    subject: 'Sciences Naturelles & SVT',
    challengeId: 'chal_sc_1',
    sealEmoji: '🔬',
    inkColor: 'text-emerald-400',
    inkBorder: 'border-emerald-500/60',
    inkBg: 'bg-emerald-950/20',
    authority: 'Conservatoire Botanique',
  },
  {
    id: 'stamp_d3',
    code: 'D3',
    city: 'Syracuse · Dôme d’Euclide',
    country: 'Ligue Mathématique',
    flag: '📐',
    subject: 'Mathématiques & Géométrie',
    challengeId: 'chal_ma_1',
    sealEmoji: '✨',
    inkColor: 'text-sky-400',
    inkBorder: 'border-sky-500/60',
    inkBg: 'bg-sky-950/20',
    authority: 'Ordre de Pythagore',
  },
  {
    id: 'stamp_d4',
    code: 'D4',
    city: 'Athènes & Rome Antique',
    country: 'Civilisations',
    flag: '🏛️',
    subject: 'Histoire & Citoyenneté',
    challengeId: 'chal_hi_1',
    sealEmoji: '🕊️',
    inkColor: 'text-emerald-400',
    inkBorder: 'border-emerald-500/60',
    inkBg: 'bg-emerald-950/20',
    authority: 'Conseil des Historiens',
  },
  {
    id: 'stamp_d5',
    code: 'D5',
    city: 'Amsterdam · Rotterdam',
    country: 'Pays-Bas',
    flag: '🇳🇱',
    subject: 'Néerlandais & Polyglotte',
    challengeId: 'chal_la_nl',
    sealEmoji: '🌷',
    inkColor: 'text-cyan-400',
    inkBorder: 'border-cyan-500/60',
    inkBg: 'bg-cyan-950/20',
    authority: 'Koninklijke Talenacademie',
  },
  {
    id: 'stamp_d6',
    code: 'D6',
    city: 'Bletchley Park · Ada Hub',
    country: 'Pôle Numérique',
    flag: '💻',
    subject: 'Informatique & Algorithmes',
    challengeId: 'chal_in_1',
    sealEmoji: '⚡',
    inkColor: 'text-teal-400',
    inkBorder: 'border-teal-500/60',
    inkBg: 'bg-teal-950/20',
    authority: 'Institut Lovelace & Turing',
  },
  {
    id: 'stamp_d7',
    code: 'D7',
    city: 'Valldemossa · Récits',
    country: 'Pléiade Européenne',
    flag: '✍️',
    subject: 'Éloquence & Style',
    challengeId: 'chal_fr_2',
    sealEmoji: '🎭',
    inkColor: 'text-purple-400',
    inkBorder: 'border-purple-500/60',
    inkBg: 'bg-purple-950/20',
    authority: 'Cercle George Sand',
  },
  {
    id: 'stamp_d8',
    code: 'D8',
    city: 'Sommet Alpin · 4807m',
    country: 'Palais Céleste',
    flag: '🏔️',
    subject: 'Défi Transversal Suprême',
    challengeId: 'chal_wonder_1',
    sealEmoji: '👑',
    inkColor: 'text-emerald-300',
    inkBorder: 'border-emerald-400/80',
    inkBg: 'bg-emerald-950/30',
    authority: 'Fédération Alpine du Savoir',
  },
];

export const EuropeanPassportModal: React.FC<EuropeanPassportModalProps> = ({
  isOpen,
  onClose,
  archipelago,
  cities,
}) => {
  if (!isOpen) return null;

  const validatedCount = PASSPORT_STAMPS.filter((s) =>
    archipelago.completedChallengeIds.includes(s.challengeId)
  ).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn select-none overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border border-slate-700 bg-[#0B0E23] text-slate-100 shadow-[0_0_50px_rgba(10,38,230,0.25)] overflow-hidden">
        {/* Passport Leather Header Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#070814] via-[#0c102a] to-[#070814] border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-0.5 shadow-md">
              <div className="w-full h-full bg-[#070814] rounded-[10px] flex items-center justify-center text-lg text-emerald-300">
                🛂
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Passeport Diplomatique d'Architecte
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-cyan-300">
                  Union des Cités du Savoir
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Chaque balise franchie sur le sommet alpin appose un visa officiel certifié dans votre passeport.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-[#070919] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Passport Double Page */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-[#05050D] space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Page: Identity & Credentials */}
            <div className="lg:col-span-5 rounded-2xl bg-[#070919] border border-slate-800 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  Page 01 · Signalement
                </span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Officiel & Authentique
                </span>
              </div>

              {/* Photo & Identity details */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-24 rounded-xl border-2 border-slate-700 overflow-hidden bg-[#0B0E23] p-1 shrink-0 relative shadow-inner">
                  <img
                    src={archipelago.avatarUrl || '/assets/images/avatar_girl_architect_1793997414338.jpg'}
                    alt={archipelago.mayorName}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute bottom-1 right-1 text-xs">✨</div>
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Titulaire</div>
                  <div className="text-base font-bold text-white truncate">
                    {archipelago.mayorName}
                  </div>
                  <div className="text-xs text-cyan-300 font-mono">
                    {archipelago.architectTitle || 'Architecte de l’Archipel'}
                  </div>
                  <div className="text-[11px] text-emerald-400 font-mono font-bold">
                    Niveau {archipelago.level} · {archipelago.xp} XP
                  </div>
                </div>
              </div>

              {/* Security Details Grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                <div className="p-2 rounded-lg bg-[#0B0E23] border border-slate-800">
                  <div className="text-slate-500 text-[10px]">Série d'assiduité</div>
                  <div className="text-white font-bold">{archipelago.streakDays} jours 🔥</div>
                </div>
                <div className="p-2 rounded-lg bg-[#0B0E23] border border-slate-800">
                  <div className="text-slate-500 text-[10px]">Visas délivrés</div>
                  <div className="text-cyan-300 font-bold">{validatedCount} / 8 balises</div>
                </div>
                <div className="p-2 rounded-lg bg-[#0B0E23] border border-slate-800">
                  <div className="text-slate-500 text-[10px]">Briques dorées</div>
                  <div className="text-emerald-400 font-bold">{archipelago.bricks} 🧱</div>
                </div>
                <div className="p-2 rounded-lg bg-[#0B0E23] border border-slate-800">
                  <div className="text-slate-500 text-[10px]">Fleurs inspirées</div>
                  <div className="text-pink-400 font-bold">{archipelago.flowers} 🌸</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0B0E23] border border-blue-500/30 text-[11px] text-slate-300 leading-relaxed font-mono">
                « Autorise le titulaire à bâtir et explorer librement l'archipel des 6 cités et les routes alpines d'Europe. »
              </div>
            </div>

            {/* Right Page: Stamps / Visas Collection */}
            <div className="lg:col-span-7 rounded-2xl bg-[#070919] border border-slate-800 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                  Page 02 · Tampons & Visas de Progression
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {validatedCount} homologué(s)
                </span>
              </div>

              {/* Grid of 8 stamps */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PASSPORT_STAMPS.map((stamp) => {
                  const isValidated = archipelago.completedChallengeIds.includes(stamp.challengeId);

                  return (
                    <div
                      key={stamp.id}
                      className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-between text-center min-h-[140px] relative ${
                        isValidated
                          ? `${stamp.inkBg} ${stamp.inkBorder} shadow-lg scale-102`
                          : 'bg-[#0B0E23]/60 border-slate-800/80 opacity-40'
                      }`}
                    >
                      <div className="text-[10px] font-mono font-bold text-slate-400 flex items-center gap-1">
                        <span>{stamp.flag}</span>
                        <span>{stamp.code}</span>
                      </div>

                      {isValidated ? (
                        <div className="space-y-1 my-1">
                          <div className="w-12 h-12 rounded-full border-2 border-dashed mx-auto flex items-center justify-center text-xl shadow-inner animate-fadeIn">
                            {stamp.sealEmoji}
                          </div>
                          <div className={`text-[10px] font-bold font-mono uppercase tracking-wider ${stamp.inkColor}`}>
                            HOMOLOGUÉ
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1 my-1">
                          <div className="w-10 h-10 rounded-full border border-dashed border-slate-700 mx-auto flex items-center justify-center text-slate-600 text-sm">
                            🔒
                          </div>
                          <div className="text-[9px] font-mono text-slate-500 uppercase">
                            En attente
                          </div>
                        </div>
                      )}

                      <div className="w-full pt-1 border-t border-slate-800/60">
                        <div className="text-[10px] font-bold text-white truncate">
                          {stamp.city.split('·')[0]}
                        </div>
                        <div className="text-[9px] text-slate-400 truncate">
                          {stamp.subject.split('&')[0]}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#070814] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="font-mono flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>Passeport international conforme à la convention de Bologne du savoir</span>
          </div>
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="px-5 py-2 bg-[#0A26E6] hover:bg-[#1F3BF5] text-white rounded-xl font-bold shadow-[0_0_15px_rgba(10,38,230,0.35)] transition-all"
          >
            Fermer le Passeport
          </button>
        </div>
      </div>
    </div>
  );
};
