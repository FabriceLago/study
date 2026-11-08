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
      <div className="relative w-full max-w-3xl flex flex-col rounded-3xl border border-emerald-500/40 bg-[#0c0d1e] text-slate-100 shadow-[0_0_60px_rgba(16,185,129,0.25)] overflow-hidden max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="p-4 bg-gradient-to-r from-emerald-950/90 via-slate-900 to-slate-950 border-b border-emerald-500/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎓</span>
            <span className="text-sm font-bold font-editorial text-emerald-300">
              Brevet Officiel d'Architecte des Savoirs
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-bold text-xs shadow-md transition-colors"
              title="Imprimer ton diplôme officiel"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer mon Brevet</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-emerald-950/40 transition-colors"
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Parchment (Styled for display & printing) */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 flex justify-center bg-[#070815]">
          <div className="w-full max-w-2xl bg-[#0e1026] border-8 border-double border-emerald-500/60 p-6 sm:p-10 rounded-2xl shadow-2xl relative text-center space-y-6">
            {/* Corner Ornaments */}
            <div className="absolute top-2 left-2 text-emerald-400 text-lg">⚜️</div>
            <div className="absolute top-2 right-2 text-emerald-400 text-lg">⚜️</div>
            <div className="absolute bottom-2 left-2 text-emerald-400 text-lg">⚜️</div>
            <div className="absolute bottom-2 right-2 text-emerald-400 text-lg">⚜️</div>

            {/* Header Title */}
            <div className="space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 font-mono">
                République des Savoirs · Académie de Study
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-editorial text-emerald-200 tracking-tight">
                Brevet d’Excellence & de Bâtisseuse
              </h1>
              <p className="text-xs italic text-teal-300/80">
                Décerné en reconnaissance du dévouement scolaire et des cités édifiées
              </p>
            </div>

            {/* Student Name & Level */}
            <div className="py-3 border-y border-emerald-500/30 space-y-1.5">
              <span className="text-xs text-teal-300 block uppercase font-mono tracking-wider">
                Ce diplôme est fièrement accordé à :
              </span>
              <div className="text-2xl sm:text-3xl font-bold font-editorial text-emerald-400 underline decoration-emerald-400 decoration-wavy">
                {archipelago.mayorName || 'Jeune Bâtisseuse'}
              </div>
              <div className="text-xs font-semibold text-emerald-300/90">
                Titre : <span className="text-emerald-200 font-bold">{archipelago.architectTitle}</span> · Niveau {archipelago.level}
              </div>
            </div>

            {/* Accomplishments summary */}
            <div className="text-xs text-slate-300 leading-relaxed max-w-lg mx-auto">
              Pour avoir répondu avec succès aux énigmes de l’expédition, posé{' '}
              <strong className="text-emerald-300">{archipelago.builtBuildingIds.length} monuments</strong> dans
              l’archipel et gravi le sentier de montagne avec persévérance et curiosité.
            </div>

            {/* Subject Mastery Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-left pt-2">
              {cities.map((city) => (
                <div
                  key={city.id}
                  className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-900/80 border border-emerald-500/30 text-xs text-emerald-200"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate font-semibold">{city.subject}</span>
                </div>
              ))}
            </div>

            {/* Seal & Signatures Row */}
            <div className="pt-6 border-t border-emerald-500/30 flex items-center justify-between px-4 text-xs">
              {/* Left Signature */}
              <div className="text-left space-y-1">
                <span className="font-editorial italic font-bold text-emerald-200 text-sm block">
                  Marie Curie
                </span>
                <span className="text-[10px] text-teal-300/80 block">
                  Marraine des Sciences
                </span>
              </div>

              {/* Green Embossed Seal */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-600 text-emerald-950 p-1 flex items-center justify-center shadow-lg border-2 border-emerald-200 rotate-6 shrink-0">
                <div className="w-full h-full rounded-full border border-dashed border-emerald-950/50 flex flex-col items-center justify-center text-center p-1">
                  <span className="text-base sm:text-lg">🏛️</span>
                  <span className="text-[7px] sm:text-[8px] font-bold uppercase font-mono leading-none mt-0.5">
                    Sceau d’Émeraude
                  </span>
                </div>
              </div>

              {/* Right Signature & Date */}
              <div className="text-right space-y-1">
                <span className="font-editorial italic font-bold text-emerald-200 text-sm block">
                  Hypatie d’Alexandrie
                </span>
                <span className="text-[10px] text-teal-300/80 block">
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
