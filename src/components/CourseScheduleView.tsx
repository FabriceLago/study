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
} from 'lucide-react';
import { Flashcard, SubjectCity, SubjectCityId } from '../types/game';
import { soundEngine } from '../utils/audio';

interface CourseScheduleViewProps {
  flashcards: Flashcard[];
  cities: SubjectCity[];
  completedChallengeIds?: string[];
  onStartStudy: (cityId: SubjectCityId) => void;
}

export const CourseScheduleView: React.FC<CourseScheduleViewProps> = ({
  flashcards,
  cities,
  completedChallengeIds = [],
  onStartStudy,
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

  const plannedTasks = [
    {
      id: 'task_1',
      challengeId: 'chal_fr_1',
      subject: 'Français & Grammaire',
      cityId: 'francais' as SubjectCityId,
      time: '09:00 - 09:30',
      title: 'Révision des accords du participe passé',
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
      challengeId: 'chal_hi_1',
      subject: 'Histoire & Géographie',
      cityId: 'histoire' as SubjectCityId,
      time: '16:00 - 16:30',
      title: 'Repères de la Révolution française (1789)',
      buildingGoal: 'Musée des Grandes Civilisations',
      difficulty: 'Facile',
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-editorial text-white flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-rose-400" />
            <span>Planning & Calendrier de Révisions</span>
          </h2>
          <p className="text-xs sm:text-sm text-purple-200/80 mt-1">
            Organisez vos révisions quotidiennes par matière pour progresser avec régularité sur le plan de la plateforme.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-orange-300 bg-slate-950/80 px-3.5 py-1.5 rounded-full border border-orange-500/30 shadow-sm">
          <Flame className="w-4 h-4 text-orange-400" />
          <span>Série d’études : 1 jour actif</span>
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
            className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all shadow-md flex items-center gap-2 ${
              selectedDay === d.id
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-purple-950/50 scale-102'
                : 'bg-[#121432] border border-purple-500/30 text-purple-200 hover:text-white hover:border-purple-400'
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
          <h3 className="text-base font-bold font-editorial text-white flex items-center justify-between">
            <span>Sessions au Programme ({plannedTasks.length})</span>
            <span className="text-xs text-purple-300/70 font-sans">
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
                  className={`p-4 rounded-2xl border shadow-lg transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-md ${
                    isDone
                      ? 'bg-[#0d0e22] border-emerald-500/40'
                      : 'bg-[#0d0e22] border-purple-500/30 hover:border-pink-400/50'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#121432] border border-purple-500/30 flex items-center justify-center text-rose-300 shrink-0 font-mono text-xs font-bold">
                      {task.time.split(' ')[0]}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${city?.accentBg || 'bg-[#121432]'}`}>
                          {task.subject}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {task.time}
                        </span>
                        {isDone && (
                          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Terminé
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-white">
                        {task.title}
                      </h4>

                      <p className="text-xs text-rose-400 font-medium mt-0.5">
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
                        ? 'bg-purple-950/60 border border-purple-500/30 text-rose-300 hover:bg-purple-900/60'
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

        {/* Right Column: Flashcards Review Guide */}
        <div className="space-y-4">
          <h3 className="text-base font-bold font-editorial text-white flex items-center justify-between">
            <span>Fiches Clés & Flashcards</span>
            <span className="text-xs text-rose-400 font-mono">
              {flashcards.length} fiches
            </span>
          </h3>

          <div className="p-5 rounded-3xl bg-[#0d0e22] border border-purple-500/30 shadow-xl space-y-4 backdrop-blur-md">
            <p className="text-xs text-purple-200/80 leading-relaxed">
              Tirez une fiche de mémorisation active pour réviser un concept clé avant votre prochaine épreuve.
            </p>

            {flashcards.slice(0, 3).map((fc) => (
              <div
                key={fc.id}
                onClick={() => {
                  soundEngine.playClick();
                  setActiveFlashcard(fc);
                  setShowAnswer(false);
                }}
                className="p-3.5 rounded-2xl bg-[#121432] border border-purple-500/20 hover:border-pink-400/50 shadow-sm transition-all cursor-pointer group"
              >
                <div className="text-[10px] font-bold text-rose-400 uppercase mb-1">
                  {fc.subject}
                </div>
                <div className="text-xs font-semibold text-slate-200 line-clamp-2 group-hover:text-pink-300 transition-colors">
                  {fc.front}
                </div>
              </div>
            ))}
          </div>

          {/* Active Modal Flashcard if clicked */}
          {activeFlashcard && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
              <div className="relative w-full max-w-md rounded-3xl border border-purple-500/40 bg-[#0d0f22] p-6 shadow-2xl space-y-4 text-center">
                <div className="text-xs font-bold text-rose-400 uppercase">
                  {activeFlashcard.subject} · Fiche de Mémorisation
                </div>

                <div className="text-base font-bold text-white font-editorial">
                  {activeFlashcard.front}
                </div>

                {showAnswer ? (
                  <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-200 font-medium leading-relaxed animate-fadeIn">
                    {activeFlashcard.back}
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      soundEngine.playSuccess();
                      setShowAnswer(true);
                    }}
                    className="w-full py-3 text-xs font-semibold text-pink-300 bg-purple-900/50 hover:bg-purple-800/60 rounded-2xl border border-purple-500/30 transition-colors"
                  >
                    Retourner la fiche pour voir la réponse ✨
                  </button>
                )}

                <button
                  onClick={() => setActiveFlashcard(null)}
                  className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 rounded-xl shadow-md"
                >
                  Fermer la Fiche
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
