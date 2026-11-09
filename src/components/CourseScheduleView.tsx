import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  BookOpen,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Flame,
  Award,
  Volume2,
} from 'lucide-react';
import { Flashcard, SubjectCity, SubjectCityId, StudyLanguage } from '../types/game';
import { soundEngine } from '../utils/audio';
import { speechHelper } from '../utils/speech';

interface CourseScheduleViewProps {
  flashcards: Flashcard[];
  cities: SubjectCity[];
  completedChallengeIds?: string[];
  streakDays?: number;
  selectedStudyLanguage?: StudyLanguage;
  onSelectStudyLanguage?: (lang: StudyLanguage) => void;
  onStartStudy: (cityId: SubjectCityId) => void;
  onOpenPrint?: () => void;
}

export const CourseScheduleView: React.FC<CourseScheduleViewProps> = ({
  flashcards,
  cities,
  completedChallengeIds = [],
  streakDays = 0,
  selectedStudyLanguage = 'nl',
  onSelectStudyLanguage,
  onStartStudy,
  onOpenPrint,
}) => {
  const scheduleDays = React.useMemo(() => {
    const today = new Date();
    return [0, 1, 2, 3, 4].map((offset) => {
      const d = new Date(today);
      d.setDate(today.getDate() + offset);
      let label =
        offset === 0
          ? 'Aujourd’hui'
          : offset === 1
          ? 'Demain'
          : d.toLocaleDateString('fr-FR', { weekday: 'long' });
      label = label.charAt(0).toUpperCase() + label.slice(1);
      const dateStr = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
      return {
        id: `day_${offset}`,
        label,
        date: dateStr,
      };
    });
  }, []);

  const [selectedDay, setSelectedDay] = useState<string>(scheduleDays[0]?.id || 'day_0');
  const [activeFlashcard, setActiveFlashcard] = useState<Flashcard | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedLangFilter, setSelectedLangFilter] = useState<StudyLanguage | 'all'>(selectedStudyLanguage);

  React.useEffect(() => {
    if (selectedStudyLanguage) {
      setSelectedLangFilter(selectedStudyLanguage);
    }
  }, [selectedStudyLanguage]);

  const plannedTasks = [
    {
      id: 'task_nl',
      challengeId: 'chal_la_nl',
      subject: 'Néerlandais (Nederlands) 🇳🇱',
      cityId: 'langues' as SubjectCityId,
      time: '08:30 - 09:00',
      title: 'Vocabulaire fondamental : Salutations (Goedemorgen) & Politesse (Alsjeblieft)',
      buildingGoal: 'Het Nederlands Paviljoen (Pavillon Néerlandais)',
      difficulty: 'Facile',
    },
    {
      id: 'task_1',
      challengeId: 'chal_fr_1',
      subject: 'Français & Grammaire 🇫🇷',
      cityId: 'francais' as SubjectCityId,
      time: '09:15 - 09:45',
      title: 'Révision des accords du participe passé et poésie',
      buildingGoal: 'Bibliothèque des Grands Textes',
      difficulty: 'Facile',
    },
    {
      id: 'task_2',
      challengeId: 'chal_sc_1',
      subject: 'Sciences Naturelles & SVT',
      cityId: 'sciences' as SubjectCityId,
      time: '11:00 - 11:45',
      title: 'Comprendre la photosynthèse et le cycle du carbone',
      buildingGoal: 'Grande Serre Botanique & Vivant',
      difficulty: 'Moyen',
    },
    {
      id: 'task_3',
      challengeId: 'chal_ma_1',
      subject: 'Mathématiques & Géométrie',
      cityId: 'maths' as SubjectCityId,
      time: '14:30 - 15:15',
      title: 'Théorème de Pythagore & triangles rectangles',
      buildingGoal: 'Institut de Géométrie Pure',
      difficulty: 'Moyen',
    },
    {
      id: 'task_4',
      challengeId: 'chal_la_1',
      subject: 'Anglais (English) 🇬🇧',
      cityId: 'langues' as SubjectCityId,
      time: '16:00 - 16:30',
      title: 'Daily expressions & Idioms (A piece of cake)',
      buildingGoal: 'Salon Linguistique International',
      difficulty: 'Facile',
    },
  ];

  const filteredFlashcards =
    selectedLangFilter === 'all'
      ? flashcards
      : flashcards.filter((fc) => fc.language === selectedLangFilter);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-editorial text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-rose-500 dark:text-rose-400" />
            <span>Planning & Calendrier de Révisions</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-purple-200/80 mt-1">
            Organisez vos révisions quotidiennes par matière pour progresser avec régularité sur le plan de la plateforme.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-slate-950/80 px-3.5 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-500/30 shadow-sm">
          <Flame className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          <span>Série d’études : {streakDays > 0 ? `${streakDays} jour${streakDays > 1 ? 's' : ''} actif${streakDays > 1 ? 's' : ''}` : '0 jour actif (prêt à démarrer)'}</span>
        </div>
      </div>

      {/* Week Day Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {scheduleDays.map((d) => (
          <button
            key={d.id}
            onClick={() => {
              soundEngine.playClick();
              setSelectedDay(d.id);
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all shadow-sm flex items-center gap-2 ${
              selectedDay === d.id
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-rose-200 dark:shadow-purple-950/50 scale-102'
                : 'bg-white dark:bg-[#121432] border border-slate-200 dark:border-purple-500/30 text-slate-700 dark:text-purple-200 hover:text-slate-950 dark:hover:text-white hover:border-slate-300 dark:hover:border-purple-400'
            }`}
          >
            <span>{d.label}</span>
            <span className="text-[10px] opacity-75 font-mono">({d.date})</span>
          </button>
        ))}
      </div>

      {/* Grid: Left Schedule Timeline, Right Quick Flashcards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Scheduled Study Blocks */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-base font-bold font-editorial text-slate-900 dark:text-white flex items-center justify-between">
            <span>Sessions au Programme ({plannedTasks.length})</span>
            <span className="text-xs text-slate-500 dark:text-purple-300/70 font-sans">
              Temps estimé : 2h15
            </span>
          </h3>

          <div className="space-y-3">
            {plannedTasks.map((task) => {
              const city = cities.find((c) => c.id === task.cityId);
              const isDone = completedChallengeIds.includes(task.challengeId);

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-2xl border shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-md ${
                    isDone
                      ? 'bg-emerald-50/50 dark:bg-[#0d0e22] border-emerald-300 dark:border-emerald-500/40'
                      : 'bg-white dark:bg-[#0d0e22] border-slate-200 dark:border-purple-500/30 hover:border-pink-300 dark:hover:border-pink-400/50'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#121432] border border-slate-200 dark:border-purple-500/30 flex items-center justify-center text-rose-600 dark:text-rose-300 shrink-0 font-mono text-xs font-bold">
                      {task.time.split(' ')[0]}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${city?.accentBg || 'bg-slate-100 dark:bg-[#121432]'}`}>
                          {task.subject}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                          {task.time}
                        </span>
                        {isDone && (
                          <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Terminé
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {task.title}
                      </h4>

                      <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-0.5">
                        Édifice associé : {task.buildingGoal}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      onStartStudy(task.cityId);
                    }}
                    className={`px-4 py-2 text-xs font-semibold rounded-xl shadow-md transition-transform active:scale-95 shrink-0 flex items-center justify-center gap-1.5 ${
                      isDone
                        ? 'bg-purple-100 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-500/30 text-purple-800 dark:text-rose-300 hover:bg-purple-200 dark:hover:bg-purple-900/60'
                        : 'text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600'
                    }`}
                  >
                    <span>{isDone ? 'Revoir la Leçon' : 'Lancer la Session'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Flashcards Review Guide with Multilingual Support */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Fiches & Woordenlijsten</span>
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-cyan-400 font-mono bg-[#070919] px-2 py-0.5 rounded border border-slate-800">
                {filteredFlashcards.length} fiches
              </span>
              {onOpenPrint && (
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    onOpenPrint();
                  }}
                  className="px-2.5 py-1 text-xs font-semibold text-white bg-[#0A26E6] hover:bg-[#1F3BF5] rounded-lg shadow-[0_0_12px_rgba(10,38,230,0.35)] transition-all flex items-center gap-1 active:scale-95"
                  title="Imprimer les fiches de révision de poche (à plier et découper)"
                >
                  <span>🖨️</span>
                  <span className="hidden sm:inline">Imprimer Fiches</span>
                </button>
              )}
            </div>
          </div>

          {/* Language Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedLangFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                selectedLangFilter === 'all'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-white dark:bg-[#161824] border border-slate-200 dark:border-[#282C40] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => {
                setSelectedLangFilter('nl');
                onSelectStudyLanguage?.('nl');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1 ${
                selectedLangFilter === 'nl'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-white dark:bg-[#161824] border border-slate-200 dark:border-[#282C40] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>🇳🇱</span>
              <span>Néerlandais</span>
            </button>
            <button
              onClick={() => {
                setSelectedLangFilter('en');
                onSelectStudyLanguage?.('en');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1 ${
                selectedLangFilter === 'en'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-white dark:bg-[#161824] border border-slate-200 dark:border-[#282C40] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>🇬🇧</span>
              <span>Anglais</span>
            </button>
            <button
              onClick={() => {
                setSelectedLangFilter('es');
                onSelectStudyLanguage?.('es');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1 ${
                selectedLangFilter === 'es'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-white dark:bg-[#161824] border border-slate-200 dark:border-[#282C40] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>🇪🇸</span>
              <span>Espagnol</span>
            </button>
            <button
              onClick={() => {
                setSelectedLangFilter('fr');
                onSelectStudyLanguage?.('fr');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1 ${
                selectedLangFilter === 'fr'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-white dark:bg-[#161824] border border-slate-200 dark:border-[#282C40] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>🇫🇷</span>
              <span>Français</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#141622] border border-slate-200 dark:border-[#252838] shadow-sm hover:shadow-md space-y-3">
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Sélectionnez une carte pour tester votre mémoire et écouter la prononciation authentique.
            </p>

            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {filteredFlashcards.map((fc) => (
                <div
                  key={fc.id}
                  onClick={() => {
                    soundEngine.playClick();
                    setActiveFlashcard(fc);
                    setShowAnswer(false);
                  }}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-[#181A26] border border-slate-200 dark:border-[#282C40] hover:border-emerald-500/50 shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className="text-sky-600 dark:text-cyan-400 font-semibold uppercase">{fc.subject}</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {fc.language === 'nl'
                        ? '🇳🇱 Nederlands'
                        : fc.language === 'en'
                        ? '🇬🇧 English'
                        : fc.language === 'es'
                        ? '🇪🇸 Español'
                        : '🇫🇷 Français'}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {fc.front}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Modal Flashcard if clicked */}
          {activeFlashcard && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
              <div className="relative w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B0E23] p-6 shadow-2xl space-y-4 text-center">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-sky-600 dark:text-cyan-400 font-bold uppercase">
                    {activeFlashcard.subject}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {activeFlashcard.language === 'nl'
                      ? '🇳🇱 Néerlandais'
                      : activeFlashcard.language === 'en'
                      ? '🇬🇧 Anglais'
                      : activeFlashcard.language === 'es'
                      ? '🇪🇸 Espagnol'
                      : '🇫🇷 Français'}
                  </span>
                </div>

                <div className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                  {activeFlashcard.front}
                </div>

                {/* Pronunciation button for Question */}
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      const voiceLang =
                        activeFlashcard.language === 'nl'
                          ? 'nl-NL'
                          : activeFlashcard.language === 'en'
                          ? 'en-US'
                          : activeFlashcard.language === 'es'
                          ? 'es-ES'
                          : 'fr-FR';
                      speechHelper.speak(activeFlashcard.front, voiceLang);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#070919] border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:border-[#0A26E6] transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
                    <span>Écouter la question</span>
                  </button>
                </div>

                {showAnswer ? (
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-[#070919] border border-emerald-300 dark:border-emerald-500/40 text-xs text-emerald-900 dark:text-emerald-200 font-medium leading-relaxed animate-fadeIn space-y-2">
                    <div>{activeFlashcard.back}</div>

                    {/* Pronunciation button for Answer */}
                    <div className="flex justify-center pt-1">
                      <button
                        onClick={() => {
                          soundEngine.playClick();
                          const voiceLang =
                            activeFlashcard.language === 'nl'
                              ? 'nl-NL'
                              : activeFlashcard.language === 'en'
                              ? 'en-US'
                              : activeFlashcard.language === 'es'
                              ? 'es-ES'
                              : 'fr-FR';
                          speechHelper.speak(activeFlashcard.back, voiceLang);
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-[#0B0E23] border border-emerald-300 dark:border-emerald-500/30 text-[11px] text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-white transition-colors"
                      >
                        <Volume2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span>Écouter la réponse</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      soundEngine.playSuccess();
                      setShowAnswer(true);
                    }}
                    className="w-full py-3 text-xs font-semibold text-slate-800 dark:text-cyan-300 bg-slate-100 dark:bg-[#070919] hover:bg-slate-200 dark:hover:bg-[#0E1333] rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    Retourner la fiche pour voir la réponse ✨
                  </button>
                )}

                <div className="pt-2">
                  <button
                    onClick={() => setActiveFlashcard(null)}
                    className="w-full py-2.5 text-xs font-semibold text-white bg-slate-900 dark:bg-[#0A26E6] hover:bg-slate-800 dark:hover:bg-[#1F3BF5] rounded-xl shadow-md transition-all"
                  >
                    Fermer la Fiche
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
