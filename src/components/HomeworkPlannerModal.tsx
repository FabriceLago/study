import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  X,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { HomeworkItem, SubjectCityId, SubjectCity } from '../types/game';
import { soundEngine } from '../utils/audio';

interface HomeworkPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  cities: SubjectCity[];
  onCompleteHomeworkBonus: (bricks: number) => void;
}

const DEFAULT_HOMEWORK: HomeworkItem[] = [];

export const HomeworkPlannerModal: React.FC<HomeworkPlannerModalProps> = ({
  isOpen,
  onClose,
  cities,
  onCompleteHomeworkBonus,
}) => {
  const [homeworkList, setHomeworkList] = useState<HomeworkItem[]>(() => {
    try {
      const saved = localStorage.getItem('studyquest_homework_list');
      if (saved) {
        const parsed: HomeworkItem[] = JSON.parse(saved);
        // Clean out any previously saved mock IDs (hw_1 through hw_5)
        const cleaned = parsed.filter((item) => !item.id.startsWith('hw_'));
        return cleaned;
      }
    } catch {}
    return DEFAULT_HOMEWORK;
  });

  const [activeDay, setActiveDay] = useState<
    'Tous' | 'Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi' | 'Weekend'
  >('Tous');

  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState<SubjectCityId>('francais');
  const [newDay, setNewDay] = useState<
    'Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi' | 'Weekend'
  >('Lundi');

  if (!isOpen) return null;

  const saveList = (updated: HomeworkItem[]) => {
    setHomeworkList(updated);
    try {
      localStorage.setItem('studyquest_homework_list', JSON.stringify(updated));
    } catch {}
  };

  const handleToggleDone = (id: string) => {
    const item = homeworkList.find((h) => h.id === id);
    if (!item) return;

    const nextState = !item.done;
    if (nextState) {
      soundEngine.playSuccess();
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
      onCompleteHomeworkBonus(item.rewardBricks);
    } else {
      soundEngine.playClick();
    }

    const updated = homeworkList.map((h) =>
      h.id === id ? { ...h, done: nextState } : h
    );
    saveList(updated);
  };

  const handleAddHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    soundEngine.playSuccess();
    const newItem: HomeworkItem = {
      id: `hw_${Date.now()}`,
      title: newTitle.trim(),
      subjectId: newSubject,
      day: newDay,
      done: false,
      rewardBricks: 20,
    };

    saveList([newItem, ...homeworkList]);
    setNewTitle('');
  };

  const handleDelete = (id: string) => {
    soundEngine.playClick();
    const updated = homeworkList.filter((h) => h.id !== id);
    saveList(updated);
  };

  const filtered =
    activeDay === 'Tous'
      ? homeworkList
      : homeworkList.filter((h) => h.day === activeDay);

  const daysList: ('Tous' | 'Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi' | 'Weekend')[] = [
    'Tous',
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Weekend',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-3xl flex flex-col rounded-3xl border border-purple-500/40 bg-[#0d0f22] text-slate-100 shadow-[0_0_50px_rgba(168,85,247,0.2)] overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-purple-950/90 via-pink-950/70 to-slate-950 text-white flex items-center justify-between border-b border-purple-500/20 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-900/60 border border-purple-400/40 backdrop-blur-md flex items-center justify-center text-xl shadow-md">
              📝
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-editorial leading-tight text-white">
                Agenda des Vrais Devoirs de l'École
              </h3>
              <p className="text-xs text-rose-300">
                Note tes devoirs de la semaine et gagne +20 🧱 briques pour chaque tâche validée !
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-purple-900/40 transition-colors"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Days Filter Row */}
        <div className="px-4 py-2.5 bg-[#0a0a18] border-b border-purple-500/20 flex items-center gap-1.5 overflow-x-auto shrink-0 text-xs font-semibold">
          {daysList.map((day) => (
            <button
              key={day}
              onClick={() => {
                soundEngine.playClick();
                setActiveDay(day);
              }}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                activeDay === day
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-purple-950/40 border border-purple-500/20 text-slate-400 hover:text-white hover:bg-purple-900/40'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Homework list area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-[#080916]">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-500 space-y-2">
              <span className="text-4xl">🎉</span>
              <p className="text-sm font-semibold text-slate-300">Aucun devoir noté pour ce jour !</p>
              <p className="text-xs text-slate-500">Ajoute tes leçons ci-dessous pour ne rien oublier.</p>
            </div>
          ) : (
            filtered.map((item) => {
              const city = cities.find((c) => c.id === item.subjectId);
              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    item.done
                      ? 'bg-emerald-950/20 border-emerald-500/30 opacity-70'
                      : 'bg-[#12132a] border-purple-500/30 hover:border-purple-400/50 shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => handleToggleDone(item.id)}
                      className="text-rose-400 hover:scale-115 transition-transform shrink-0"
                      title={item.done ? 'Marquer comme non fait' : 'Valider ce devoir'}
                    >
                      {item.done ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-950/60" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-600 hover:text-rose-400" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-950/80 text-rose-300 border border-purple-500/30">
                          {item.day}
                        </span>
                        <span className="text-[10px] font-semibold text-purple-300/70">
                          {city?.subject || 'École'}
                        </span>
                      </div>
                      <div
                        className={`text-xs sm:text-sm font-bold leading-snug truncate ${
                          item.done ? 'line-through text-slate-500' : 'text-white'
                        }`}
                      >
                        {item.title}
                      </div>
                      {item.details && (
                        <div className="text-[11px] text-purple-300/60 truncate mt-0.5">
                          {item.details}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-mono font-bold text-emerald-300 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      +{item.rewardBricks} 🧱
                    </span>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-950/40 transition-colors"
                      title="Supprimer ce devoir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Add Homework Input Bar */}
        <form
          onSubmit={handleAddHomework}
          className="p-3 bg-[#0a0a18] border-t border-purple-500/20 flex flex-col sm:flex-row items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Ex : Réviser la poésie pour vendredi, faire les 4 opérations..."
            className="flex-1 w-full px-3.5 py-2 text-xs bg-[#12132a] border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-rose-400 placeholder:text-slate-500"
          />

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value as SubjectCityId)}
              className="px-2.5 py-2 text-xs bg-[#12132a] border border-purple-500/30 rounded-xl text-purple-200 focus:outline-none"
            >
              {cities.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#0f1026] text-white">
                  {c.subject}
                </option>
              ))}
            </select>

            <select
              value={newDay}
              onChange={(e) =>
                setNewDay(
                  e.target.value as
                    | 'Lundi'
                    | 'Mardi'
                    | 'Mercredi'
                    | 'Jeudi'
                    | 'Vendredi'
                    | 'Weekend'
                )
              }
              className="px-2.5 py-2 text-xs bg-[#12132a] border border-purple-500/30 rounded-xl text-purple-200 focus:outline-none"
            >
              <option value="Lundi" className="bg-[#0f1026] text-white">Lundi</option>
              <option value="Mardi" className="bg-[#0f1026] text-white">Mardi</option>
              <option value="Mercredi" className="bg-[#0f1026] text-white">Mercredi</option>
              <option value="Jeudi" className="bg-[#0f1026] text-white">Jeudi</option>
              <option value="Vendredi" className="bg-[#0f1026] text-white">Vendredi</option>
              <option value="Weekend" className="bg-[#0f1026] text-white">Weekend</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs shadow-md transition-colors shrink-0 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
