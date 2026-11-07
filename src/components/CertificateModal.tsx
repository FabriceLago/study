import React from 'react';
import { Award, Printer, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { ArchipelagoStats, SubjectCity } from '../types/game';
import { soundEngine } from '../utils/audio';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  archipelago: ArchipelagoStats;
  cities: SubjectCity[];
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  archipelago,
  cities,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    soundEngine.playSuccess();
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-3xl flex flex-col rounded-3xl border border-amber-500/40 bg-[#0c0d1e] text-slate-100 shadow-[0_0_60px_rgba(245,158,11,0.25)] overflow-hidden max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="p-4 bg-gradient-to-r from-amber-950/90 via-purple-950/80 to-slate-950 border-b border-amber-500/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎓</span>
            <span className="text-sm font-bold font-editorial text-amber-300">
              Brevet Officiel d'Architecte des Savoirs
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs shadow-md transition-colors"
              title="Imprimer ton diplôme officiel"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer mon Brevet</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-amber-950/40 transition-colors"
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Parchment (Styled for display & printing) */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 flex justify-center bg-[#070815]">
          <div className="w-full max-w-2xl bg-[#0e1026] border-8 border-double border-amber-500/60 p-6 sm:p-10 rounded-2xl shadow-2xl relative text-center space-y-6">
            {/* Corner Ornaments */}
            <div className="absolute top-2 left-2 text-amber-400 text-lg">⚜️</div>
            <div className="absolute top-2 right-2 text-amber-400 text-lg">⚜️</div>
            <div className="absolute bottom-2 left-2 text-amber-400 text-lg">⚜️</div>
            <div className="absolute bottom-2 right-2 text-amber-400 text-lg">⚜️</div>

            {/* Header Title */}
            <div className="space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-widest text-amber-400 font-mono">
                République des Savoirs · Académie de StudyQuest
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-editorial text-amber-200 tracking-tight">
                Brevet d’Excellence & de Bâtisseuse
              </h1>
              <p className="text-xs italic text-purple-300/80">
                Décerné en reconnaissance du dévouement scolaire et des cités édifiées
              </p>
            </div>

            {/* Student Name & Level */}
            <div className="py-3 border-y border-amber-500/30 space-y-1.5">
              <span className="text-xs text-purple-300 block uppercase font-mono tracking-wider">
                Ce diplôme est fièrement accordé à :
              </span>
              <div className="text-2xl sm:text-3xl font-bold font-editorial text-rose-400 underline decoration-amber-400 decoration-wavy">
                {archipelago.mayorName || 'Jeune Bâtisseuse'}
              </div>
              <div className="text-xs font-semibold text-amber-300/90">
                Titre : <span className="text-amber-200 font-bold">{archipelago.architectTitle}</span> · Niveau {archipelago.level}
              </div>
            </div>

            {/* Accomplishments summary */}
            <div className="text-xs text-slate-300 leading-relaxed max-w-lg mx-auto">
              Pour avoir répondu avec succès aux énigmes de l’expédition, posé{' '}
              <strong className="text-amber-300">{archipelago.builtBuildingIds.length} monuments</strong> dans
              l’archipel et gravi le sentier de montagne avec persévérance et curiosité.
            </div>

            {/* Subject Mastery Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-left pt-2">
              {cities.map((city) => (
                <div
                  key={city.id}
                  className="flex items-center gap-1.5 p-2 rounded-xl bg-purple-950/60 border border-amber-500/30 text-xs text-purple-200"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate font-semibold">{city.subject}</span>
                </div>
              ))}
            </div>

            {/* Seal & Signatures Row */}
            <div className="pt-6 border-t border-amber-500/30 flex items-center justify-between px-4 text-xs">
              {/* Left Signature */}
              <div className="text-left space-y-1">
                <span className="font-editorial italic font-bold text-amber-200 text-sm block">
                  Marie Curie
                </span>
                <span className="text-[10px] text-purple-300/80 block">
                  Marraine des Sciences
                </span>
              </div>

              {/* Golden Embossed Seal */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 text-amber-950 p-1 flex items-center justify-center shadow-lg border-2 border-amber-200 rotate-6 shrink-0">
                <div className="w-full h-full rounded-full border border-dashed border-amber-950/50 flex flex-col items-center justify-center text-center p-1">
                  <span className="text-base sm:text-lg">🏛️</span>
                  <span className="text-[7px] sm:text-[8px] font-bold uppercase font-mono leading-none mt-0.5">
                    Sceau d’Or
                  </span>
                </div>
              </div>

              {/* Right Signature & Date */}
              <div className="text-right space-y-1">
                <span className="font-editorial italic font-bold text-amber-200 text-sm block">
                  Hypatie d’Alexandrie
                </span>
                <span className="text-[10px] text-purple-300/80 block">
                  Délivré le {currentDate}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
