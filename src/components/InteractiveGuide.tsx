import React, { useState } from 'react';
import {
  Compass,
  X,
  Sparkles,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  BookOpen,
  Building2,
  Trophy,
  Coffee,
  Heart,
  Lightbulb,
} from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { SubjectCityId } from '../types/game';

interface InteractiveGuideProps {
  onStartQuest: (challengeId: string) => void;
  onOpenCity: (cityId: SubjectCityId) => void;
  onOpenJournal: () => void;
  onOpenMentors: () => void;
}

export const InteractiveGuide: React.FC<InteractiveGuideProps> = ({
  onStartQuest,
  onOpenCity,
  onOpenJournal,
  onOpenMentors,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: 'Bienvenue sur Study ! 🏔️',
      badge: 'Guide des 10 ans',
      emoji: '🌸',
      description:
        'Ici, tu apprends tes leçons d’école en bâtissant des cités magnifiques et en gravissant une montagne d’aventures !',
      tips: [
        'Chaque étape sur le sentier (D1 à D8) correspond à une matière d’école.',
        'Réponds aux énigmes pour récolter des briques dorées 🧱 et des fleurs 🌸.',
        'Utilise tes briques pour construire de superbes monuments !',
      ],
      actionLabel: 'Découvrir la suite',
      action: () => setCurrentStep(1),
    },
    {
      title: '1. Gravis le Sentier du Savoir 🗺️',
      badge: 'Étape 1 sur 4',
      emoji: '🧭',
      description:
        'Le grand plan de montagne te montre ton chemin de la vallée jusqu’au sommet du Palais Céleste des Savoirs.',
      tips: [
        'Clique sur les pastilles D1, D2, D3 pour lancer les épreuves.',
        'D1 commence par le Français, D2 par les Sciences de la nature, D3 par les Maths !',
        'Tu as des indices doux si tu as un doute sur une question.',
      ],
      actionLabel: 'Comment bâtir ?',
      action: () => setCurrentStep(2),
    },
    {
      title: '2. Bâtis tes Cités Scolaires 🏛️',
      badge: 'Étape 2 sur 4',
      emoji: '🧱',
      description:
        'Chaque matière a sa propre ville à embellir : Français, Sciences, Maths, Histoire, Langues et Informatique.',
      tips: [
        'Dans l’onglet « Cités », choisis une parcelle pour poser les fondations d’un monument.',
        'Chaque bâtiment attire de nouvelles citoyennes et rend ta ville heureuse !',
        'Tu peux aussi ajouter des fontaines fleuries et des bancs romantiques.',
      ],
      actionLabel: 'Voir le carnet',
      action: () => setCurrentStep(3),
    },
    {
      title: '3. Ton Carnet & Tes Grandes Mentores 📖',
      badge: 'Étape 3 sur 4',
      emoji: '✨',
      description:
        'Tu as un véritable carnet de bord pour réviser avant tes contrôles et poser des questions aux pionnières de l’Histoire !',
      tips: [
        'Consulte les règles clés résumées dans ton « Carnet de Bord ».',
        'Parle à Marie Curie (sciences), Ada Lovelace (code) ou George Sand (français).',
        'Active le bouton « Mute All » si tu souhaites étudier dans le silence complet.',
      ],
      actionLabel: 'C’est parti !',
      action: () => setIsOpen(false),
    },
  ];

  const activeContent = tutorialSteps[currentStep];

  return (
    <>
      {/* Floating Friendly Guide Trigger Button (always accessible at bottom right) */}
      <button
        onClick={() => {
          soundEngine.playClick();
          setIsOpen(true);
        }}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white font-bold text-xs sm:text-sm shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 border-2 border-white/80 group"
        title="Ouvrir le guide pas à pas et la mission du jour"
        aria-label="Guide pas à pas"
      >
        <span className="text-lg group-hover:rotate-12 transition-transform">👩‍🎨</span>
        <span className="font-editorial">Guide des Savoirs</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
      </button>

      {/* Guide Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl rounded-3xl border border-purple-500/40 bg-[#101229]/95 text-slate-100 shadow-[0_0_50px_rgba(168,85,247,0.2)] p-6 sm:p-7 space-y-5 overflow-hidden">
            {/* Top Ribbon & Close */}
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activeContent.emoji}</span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block font-mono">
                    {activeContent.badge}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold font-editorial text-white leading-tight">
                    {activeContent.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-purple-900/40 transition-colors"
                title="Fermer le guide"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Daily Mission Highlight Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/70 via-pink-950/40 to-slate-900/80 border border-rose-500/30 shadow-lg space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-300 font-editorial">
                  <Sparkles className="w-4 h-4 text-rose-400" />
                  <span>Ta Mission du Jour (Spéciale 10 ans)</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                  +60 🧱 & +30 🌸
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Relève l’épreuve <strong className="text-white">D1 : Les Accords du Participe Passé</strong> en Français pour poser la première pierre de ta <strong className="text-white">Bibliothèque des Grands Textes</strong> !
              </p>

              <div className="pt-1 flex gap-2">
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setIsOpen(false);
                    onStartQuest('chal_fr_1');
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-bold shadow-md transition-transform active:scale-95 flex items-center gap-1.5"
                >
                  <span>Lancer l’épreuve D1 maintenant</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Description & Simple Bullet Tips */}
            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-purple-200 leading-relaxed">
                {activeContent.description}
              </p>

              <div className="space-y-2">
                {activeContent.tips.map((tip, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/20 text-xs text-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step navigation & Quick actions */}
            <div className="pt-3 border-t border-purple-500/20 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                {tutorialSteps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentStep(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      currentStep === i
                        ? 'w-6 bg-rose-500'
                        : 'bg-slate-700 hover:bg-rose-400'
                    }`}
                    title={`Étape ${i + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                {currentStep > 0 && (
                  <button
                    onClick={() => setCurrentStep((prev) => prev - 1)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Précédent
                  </button>
                )}

                <button
                  onClick={activeContent.action}
                  className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 rounded-xl shadow-md transition-transform active:scale-95 flex items-center gap-1.5"
                >
                  <span>{activeContent.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
