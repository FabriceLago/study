import React, { useState } from 'react';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { ConstructionChallenge, SubjectCity, ArchipelagoStats, SubjectCityId } from '../types/game';
import { soundEngine } from '../utils/audio';

interface ChallengesHubProps {
  challenges: ConstructionChallenge[];
  cities: SubjectCity[];
  archipelago: ArchipelagoStats;
  onSelectChallenge: (challenge: ConstructionChallenge) => void;
  onOpenAiForge: () => void;
}

export const ChallengesHub: React.FC<ChallengesHubProps> = ({
  challenges,
  cities,
  archipelago,
  onSelectChallenge,
  onOpenAiForge,
}) => {
  const [selectedCityId, setSelectedCityId] = useState<SubjectCityId | 'all'>('all');

  const filtered =
    selectedCityId === 'all'
      ? challenges
      : challenges.filter((c) => c.cityId === selectedCityId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0B0E23] border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400">
              Resq Incident Command · Résolution Active
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Centre d'Interventions & Chantiers
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Chaque épreuve résout une anomalie pédagogique et active le déploiement d'un nouveau monument sur vos 6 cités.
          </p>
        </div>

        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenAiForge();
          }}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#0A26E6] hover:bg-[#1F3BF5] rounded-xl shadow-[0_0_20px_rgba(10,38,230,0.35)] transition-all shrink-0 active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-cyan-300" />
          <span>Créer un Chantier Personnalisé</span>
        </button>
      </div>

      {/* Subject City Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => {
            soundEngine.playClick();
            setSelectedCityId('all');
          }}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all border ${
            selectedCityId === 'all'
              ? 'bg-[#0A26E6] border-[#0A26E6] text-white shadow-sm'
              : 'bg-[#0B0E23] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
          }`}
        >
          Toutes les Cités ({challenges.length})
        </button>

        {cities.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              soundEngine.playClick();
              setSelectedCityId(c.id);
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all flex items-center gap-2 border ${
              selectedCityId === c.id
                ? 'bg-[#0A26E6] border-[#0A26E6] text-white shadow-sm'
                : 'bg-[#0B0E23] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            <span>{c.name}</span>
            <span className="text-[10px] font-mono opacity-80">({c.subject.split(' ')[0]})</span>
          </button>
        ))}
      </div>

      {/* Challenges List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((chal, index) => {
          const isCompleted = archipelago.completedChallengeIds.includes(chal.id);
          const cityInfo = cities.find((c) => c.id === chal.cityId);
          const priority = index % 3 === 0 ? 'P1 - Haute' : index % 3 === 1 ? 'P2 - Normale' : 'P3 - Guide';

          return (
            <div
              key={chal.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all shadow-xl ${
                isCompleted
                  ? 'bg-[#070919] border-emerald-500/30'
                  : 'bg-[#0B0E23] border-slate-800 hover:border-[#0A26E6]/60 hover:shadow-[0_0_25px_rgba(10,38,230,0.15)]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#070919] border border-slate-700 text-slate-300">
                      {priority}
                    </span>
                    {cityInfo && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#0A26E6]/15 border border-[#0A26E6]/30 text-cyan-300">
                        {cityInfo.name}
                      </span>
                    )}
                    {chal.language === 'nl' && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                        🇳🇱 Néerlandais
                      </span>
                    )}
                    {chal.language === 'en' && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/30 text-blue-300">
                        🇬🇧 Anglais
                      </span>
                    )}
                    {chal.language === 'es' && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-red-500/10 border border-red-500/30 text-red-300">
                        🇪🇸 Espagnol
                      </span>
                    )}
                  </div>

                  {isCompleted ? (
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded-lg border border-emerald-500/40 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>RÉSOLU</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-slate-400 bg-[#070919] px-2 py-0.5 rounded border border-slate-800">
                      {chal.questions.length} questions
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white tracking-tight mb-1.5">
                  {chal.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {chal.description}
                </p>

                {/* Building preview info */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#070919] border border-slate-800 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#0B0E23] border border-slate-800 flex items-center justify-center text-xl shrink-0">
                    {chal.buildingEmoji}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">
                      Déploie : {chal.buildingName}
                    </div>
                    <div className="text-[11px] text-cyan-400 truncate">
                      Mentor : {chal.foreman.name}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3.5 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-emerald-400 font-bold">+{chal.rewardBricks} 🧱</span>
                  <span className="text-cyan-400 font-bold">+{chal.rewardFlowers} 🌸</span>
                  <span className="text-indigo-300 font-bold">+{chal.rewardXp} XP</span>
                </div>

                <button
                  onClick={() => {
                    soundEngine.playClick();
                    onSelectChallenge(chal);
                  }}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all shadow-md flex items-center gap-1.5 active:scale-95 ${
                    isCompleted
                      ? 'bg-[#070919] hover:bg-[#0E1333] text-slate-200 border border-slate-700 hover:border-[#0A26E6]'
                      : 'bg-[#0A26E6] hover:bg-[#1F3BF5] text-white shadow-[0_0_15px_rgba(10,38,230,0.3)]'
                  }`}
                >
                  <span>{isCompleted ? 'Réexaminer' : 'Intervenir'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
