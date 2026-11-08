import React, { useState } from 'react';
import {
  User,
  X,
  Award,
  Crown,
  Heart,
  Building2,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { ArchipelagoStats, AchievementBadge } from '../types/game';
import { soundEngine } from '../utils/audio';

interface MayorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  archipelago: ArchipelagoStats;
  badges: AchievementBadge[];
  onUpdateMayorName: (mayorName: string) => void;
  onUpdateTitle?: (title: string) => void;
  onResetArchipelago: () => void;
}

export const MayorProfileModal: React.FC<MayorProfileModalProps> = ({
  isOpen,
  onClose,
  archipelago,
  badges,
  onUpdateMayorName,
  onUpdateTitle,
  onResetArchipelago,
}) => {
  const [mayorName, setMayorName] = useState(archipelago.mayorName);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState(archipelago.architectTitle);

  if (!isOpen) return null;

  const TITLES = [
    'Apprentie Bâtisseuse',
    'Grande Exploratrice des Cimes',
    'Maîtresse des Savoirs',
    'Architecte Émérite',
    'Gardienne des Cités',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (mayorName.trim()) {
      onUpdateMayorName(mayorName.trim());
      setIsEditing(false);
      soundEngine.playSuccess();
    }
  };

  const handleSelectTitle = (t: string) => {
    soundEngine.playClick();
    setSelectedTitle(t);
    onUpdateTitle?.(t);
  };

  const accuracy =
    archipelago.totalAnswered > 0
      ? Math.round((archipelago.totalCorrect / archipelago.totalAnswered) * 100)
      : 100;

  const totalArchipelagoPopulation = Object.values(archipelago.cityPopulations).reduce(
    (acc, cur) => acc + cur,
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-purple-500/40 bg-[#0d0f22] text-slate-100 shadow-[0_0_50px_rgba(244,63,94,0.2)] p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
          <div className="flex items-center gap-2 text-rose-400 font-editorial text-lg font-bold">
            <User className="w-5 h-5 text-rose-400" />
            <span>Mairie & Carnet d'Architecte de l'Archipel</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-purple-900/40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Identity & Portrait */}
        <div className="flex flex-col sm:flex-row items-center gap-5 p-5 rounded-2xl bg-gradient-to-r from-purple-950/70 via-pink-950/40 to-[#12132a] border border-purple-500/30">
          <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-rose-400/60 shadow-lg shrink-0">
            <img
              src={archipelago.avatarUrl || '/src/assets/images/avatar_girl_architect_1793997414338.jpg'}
              alt={archipelago.mayorName}
              className="w-full h-full object-cover select-none"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="min-w-0 flex-1 text-center sm:text-left space-y-1.5">
            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={mayorName}
                    onChange={(e) => setMayorName(e.target.value)}
                    placeholder="Nom de l'architecte"
                    className="px-3 py-1.5 text-xs bg-[#090a18] border border-purple-500/40 rounded-lg text-white focus:outline-none focus:border-rose-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-lg shadow-sm"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-xl font-bold font-editorial text-white">
                    {archipelago.mayorName}
                  </h3>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs text-rose-400 hover:underline font-medium"
                  >
                    Modifier
                  </button>
                </div>
                <div className="text-xs text-pink-300 font-medium">
                  {archipelago.architectTitle} · Niveau {archipelago.level}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs text-slate-400 font-mono">
              <span className="text-emerald-400 font-semibold">Taux de réussite : {accuracy}%</span>
              <span>·</span>
              <span className="text-pink-400 font-semibold">{totalArchipelagoPopulation} citoyennes</span>
              <span>·</span>
              <span className="text-emerald-400 font-semibold">{archipelago.bricks} briques d’or</span>
              <span>·</span>
              <span className="text-rose-400 font-semibold">{archipelago.flowers} fleurs</span>
            </div>
          </div>
        </div>

        {/* Explorer Title Customization */}
        <div className="p-4 rounded-2xl bg-[#12132a] border border-purple-500/30 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-200 font-editorial">
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span>Titre d'Exploratrice de Montagne :</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TITLES.map((t) => (
              <button
                key={t}
                onClick={() => handleSelectTitle(t)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                  selectedTitle === t
                    ? 'bg-rose-500 text-white shadow-md scale-102'
                    : 'bg-[#181938] border border-purple-500/20 text-slate-300 hover:text-white hover:border-purple-400'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Badges and Honors */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold font-editorial text-white flex items-center justify-between">
            <span>Hauts Faits de l'Archipel</span>
            <span className="text-xs text-rose-400 font-mono">
              {archipelago.unlockedBadges.length} / {badges.length}
            </span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {badges.map((b) => {
              const isUnlocked = archipelago.unlockedBadges.includes(b.id);

              return (
                <div
                  key={b.id}
                  className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-colors ${
                    isUnlocked
                      ? 'bg-purple-950/40 border-purple-500/30 shadow-sm'
                      : 'bg-[#0f1026] border-slate-800 opacity-50'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                      isUnlocked
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-slate-900 text-slate-500'
                    }`}
                  >
                    {isUnlocked ? <Award className="w-5 h-5 text-rose-400" /> : <Lock className="w-5 h-5 text-slate-500" />}
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">
                      {b.name}
                    </div>
                    <div className="text-[11px] text-slate-400 leading-tight">
                      {b.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reset & Footer */}
        <div className="pt-4 border-t border-purple-500/20 flex justify-between items-center text-xs text-slate-400">
          <button
            onClick={() => {
              if (confirm('Voulez-vous vraiment réinitialiser tout l’archipel des cités ?')) {
                onResetArchipelago();
                onClose();
              }
            }}
            className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Réinitialiser l'Archipel</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 rounded-xl shadow-md"
          >
            Fermer la Mairie
          </button>
        </div>
      </div>
    </div>
  );
};
