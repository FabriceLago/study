import React, { useState } from 'react';
import {
  Sparkles,
  X,
  MessageSquare,
  Send,
  HelpCircle,
  Lightbulb,
  Heart,
  BookOpen,
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface MentorsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Mentor {
  id: string;
  name: string;
  role: string;
  subject: string;
  avatar: string;
  color: string;
  greeting: string;
  presetQuestions: {
    q: string;
    answer: string;
  }[];
}

const MENTORS: Mentor[] = [
  {
    id: 'marie_curie',
    name: 'Marie Curie',
    role: 'Double Prix Nobel (Physique & Chimie)',
    subject: 'Sciences Naturelles & SVT',
    avatar: '🔬',
    color: 'from-emerald-500 to-teal-700',
    greeting:
      '« Bonjour jeune chercheuse ! Dans la vie, rien n’est à craindre, tout est à comprendre. Quelle découverte scientifique veux-tu explorer aujourd’hui ? »',
    presetQuestions: [
      {
        q: 'Pourquoi les feuilles des arbres sont-elles vertes ?',
        answer:
          'Les feuilles contiennent un pigment végétal magique appelé la chlorophylle. C’est elle qui capte l’énergie de la lumière du soleil pour transformer le gaz carbonique et l’eau en sucre nourrissant pour la plante !',
      },
      {
        q: 'Comment faire une vraie expérience scientifique à la maison ?',
        answer:
          'La clé d’un bon scientifique, c’est d’observer, de noter ses hypothèses dans un carnet, et de tester une seule chose à la fois sans jamais avoir peur d’une erreur. Une erreur est toujours une leçon précieuse !',
      },
      {
        q: 'C’est quoi les atomes et les molécules ?',
        answer:
          'Les atomes sont comme les petites briques de Lego fondamentales de tout l’univers. Quand plusieurs atomes se tiennent la main, ils forment une molécule, comme la molécule d’eau H₂O (deux atomes d’hydrogène et un d’oxygène) !',
      },
    ],
  },
  {
    id: 'hypatie',
    name: 'Hypatie d’Alexandrie',
    role: 'Mathématicienne & Astronome',
    subject: 'Mathématiques & Géométrie',
    avatar: '📐',
    color: 'from-sky-500 to-blue-700',
    greeting:
      '« Bienvenue sous la voûte des nombres ! Les mathématiques sont comme les étoiles : lumineuses, calmes et ordonnées. Quelle énigme de calcul t’intrigue ? »',
    presetQuestions: [
      {
        q: 'Comment ne plus avoir peur des maths et des problèmes ?',
        answer:
          'Vois chaque problème de maths comme une enquête policière ! Lis bien l’énoncé, souligne les indices (les nombres connus) et cherche ce que l’on te demande de trouver. Fais un petit dessin si besoin, cela rend tout limpide !',
      },
      {
        q: 'À quoi sert le théorème de Pythagore dans la vraie vie ?',
        answer:
          'Les bâtisseurs et les charpentiers l’utilisent depuis l’Antiquité pour vérifier que les murs de leurs maisons forment un angle droit parfait de 90°. Si 3² + 4² = 5², alors ton angle droit est parfait et ta maison tiendra debout des siècles !',
      },
      {
        q: 'Pourquoi le nombre Pi (π) est-il si célèbre ?',
        answer:
          'Pi vaut environ 3,14159... C’est le rapport magique : peu importe la taille d’un cercle (une pièce de monnaie ou une planète géante), le tour du cercle fait toujours un peu plus de 3 fois son diamètre !',
      },
    ],
  },
  {
    id: 'ada_lovelace',
    name: 'Ada Lovelace',
    role: 'Pionnière de l’Algorithmique & du Code',
    subject: 'Informatique & Technologie',
    avatar: '💻',
    color: 'from-teal-500 to-cyan-700',
    greeting:
      '« Hello jeune créatrice ! En 1843, j’ai écrit le tout premier programme informatique. Le code est comme un pinceau magique pour donner vie à tes idées. »',
    presetQuestions: [
      {
        q: 'Est-ce que les filles peuvent être de grandes développeuses ?',
        answer:
          'Absolument ! J’ai été la première de l’Histoire, et tant de pionnières comme Grace Hopper ou Margaret Hamilton ont envoyé des humains sur la Lune avec leur code. La logique, la créativité et la patience sont tes plus grands super-pouvoirs !',
      },
      {
        q: 'C’est quoi un algorithme avec des mots simples ?',
        answer:
          'C’est exactement comme une recette de crêpes ! Étape 1 : verser la farine. Étape 2 : casser les œufs. Étape 3 : tant qu’il y a des grumeaux, fouetter. Si l’ordinateur suit les étapes dans le bon ordre, le résultat est parfait !',
      },
      {
        q: 'Comment fonctionne la mémoire d’un ordinateur ?',
        answer:
          'L’ordinateur ne comprend que des 0 et des 1 (appelés des bits). C’est comme des milliards de minuscules ampoules qui s’allument et s’éteignent à la vitesse de l’éclair pour afficher tes couleurs et tes jeux !',
      },
    ],
  },
  {
    id: 'george_sand',
    name: 'George Sand',
    role: 'Romancière & Femme de Lettres',
    subject: 'Français & Poésie',
    avatar: '✍️',
    color: 'from-rose-500 to-pink-700',
    greeting:
      '« Chère amie des livres, la langue française est un trésor d’émotions et de liberté. Écrire, c’est peindre le monde avec des mots. »',
    presetQuestions: [
      {
        q: 'Comment inventer une histoire passionnante ?',
        answer:
          'Choisis une héroïne qui te ressemble, donne-lui un rêve très fort, et place sur son chemin un petit obstacle à surmonter. C’est la persévérance de ton héroïne qui rendra ton récit captivant !',
      },
      {
        q: 'Une astuce simple pour ne plus hésiter sur les accords ?',
        answer:
          'Chuchote la phrase à voix haute ! En remplaçant par un verbe du 3e groupe (comme « prendre » ou « mettre »), ton oreille te donnera souvent la réponse : « la lettre que j’ai prise » donc « la lettre que j’ai écrite » !',
      },
      {
        q: 'Pourquoi lire des livres aide à mieux parler ?',
        answer:
          'Chaque livre t’offre de nouveaux mots comme des joyaux pour ta boîte à outils secrète. Plus tu as de mots, plus tu arrives à exprimer exactement ce que tu ressens avec finesse et élégance.',
      },
    ],
  },
  {
    id: 'erasme_rotterdam',
    name: 'Erasmus van Rotterdam',
    role: 'Grand Humaniste, Polyglotte & Éducateur',
    subject: 'Langues & Néerlandais (Nederlands)',
    avatar: '🌷',
    color: 'from-emerald-500 to-teal-700',
    greeting:
      '« Welkom, jonge ontdekker ! Né à Rotterdam, j’ai voyagé dans toute l’Europe en parlant néerlandais, français, anglais et latin. Apprendre les langues, c’est bâtir des ponts d’amitié entre les peuples ! »',
    presetQuestions: [
      {
        q: 'Pourquoi apprendre le néerlandais à 10 ans est une excellente idée ?',
        answer:
          'Le néerlandais est parlé par plus de 28 millions de personnes en Belgique, aux Pays-Bas et dans toute l’Europe ! C’est une langue germanique très chaleureuse, cousine de l’anglais, qui développe une oreille linguistique formidable.',
      },
      {
        q: 'Quels sont les premiers mots essentiels en néerlandais ?',
        answer:
          'Retiens ce trio en or : « Goedemorgen » pour saluer le matin avec un grand sourire, « Alsjeblieft » pour demander poliment ou tendre quelque chose, et « Dank je wel » pour remercier chaleureusement !',
      },
      {
        q: 'Comment faire pour retenir facilement les mots d’une langue étrangère ?',
        answer:
          'Associe chaque mot à une image ou à un son familier ! Répète-le à voix haute grâce au bouton audio de prononciation, et revois tes flashcards chaque matin pendant deux petites minutes.',
      },
    ],
  },
];

export const MentorsModal: React.FC<MentorsModalProps> = ({ isOpen, onClose }) => {
  const [selectedMentor, setSelectedMentor] = useState<Mentor>(MENTORS[0]);
  const [conversation, setConversation] = useState<
    { sender: 'mentor' | 'user'; text: string }[]
  >([{ sender: 'mentor', text: MENTORS[0].greeting }]);
  const [customQuestion, setCustomQuestion] = useState('');

  if (!isOpen) return null;

  const handleSelectMentor = (mentor: Mentor) => {
    soundEngine.playClick();
    setSelectedMentor(mentor);
    setConversation([{ sender: 'mentor', text: mentor.greeting }]);
  };

  const handleAskPreset = (q: string, a: string) => {
    soundEngine.playSuccess();
    setConversation((prev) => [
      ...prev,
      { sender: 'user', text: q },
      { sender: 'mentor', text: a },
    ]);
  };

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;

    soundEngine.playSuccess();
    const userQ = customQuestion.trim();
    setCustomQuestion('');

    const thoughtfulReply = `« Très belle question sur ${selectedMentor.subject} ! Pour bien comprendre cela à ton âge : rappelle-toi que la clé est de faire le lien avec ce que tu observes au quotidien. Continue à poser des questions, c’est la marque des plus grands esprits ! »`;

    setConversation((prev) => [
      ...prev,
      { sender: 'user', text: userQ },
      { sender: 'mentor', text: thoughtfulReply },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl border border-purple-500/40 bg-[#0d0f24] text-slate-100 shadow-[0_0_50px_rgba(168,85,247,0.2)] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-950/90 via-pink-950/70 to-slate-950 text-white flex items-center justify-between border-b border-purple-500/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-900/60 border border-purple-400/30 backdrop-blur-md flex items-center justify-center text-xl shadow-md">
              💡
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-editorial leading-tight">
                Le Salon des Grandes Savantes
              </h3>
              <p className="text-xs text-rose-300">
                Pose tes questions d’école aux plus grandes pionnières de l’Histoire
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-purple-900/40 transition-colors"
            title="Fermer le salon"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mentor Selector Cards Row */}
        <div className="p-3 bg-[#0a0a18] border-b border-purple-500/20 flex items-center gap-2 overflow-x-auto shrink-0">
          {MENTORS.map((m) => {
            const isSelected = m.id === selectedMentor.id;
            return (
              <button
                key={m.id}
                onClick={() => handleSelectMentor(m)}
                className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 border ${
                  isSelected
                    ? 'bg-purple-950/80 border-rose-400 text-white shadow-md scale-102 ring-2 ring-rose-500/30'
                    : 'bg-[#12132a]/60 border-purple-500/20 text-slate-400 hover:text-white hover:bg-[#1a1b38]'
                }`}
              >
                <span className="text-base">{m.avatar}</span>
                <div className="text-left leading-none">
                  <div className="font-editorial text-xs">{m.name}</div>
                  <div className="text-[9px] text-purple-300/70 font-sans mt-0.5">
                    {m.subject.split(' ')[0]}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Conversation Dialog Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-[#090916]">
          {conversation.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'mentor' && (
                <div className="w-8 h-8 rounded-full bg-purple-900/60 border border-purple-400/40 flex items-center justify-center text-sm shrink-0">
                  {selectedMentor.avatar}
                </div>
              )}

              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium rounded-tr-xs'
                    : 'bg-[#131530] border border-purple-500/30 text-purple-100 rounded-tl-xs'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Question Prompts for 10-year olds */}
        <div className="p-3 bg-[#0a0a18] border-t border-purple-500/20 space-y-1.5 shrink-0">
          <div className="text-[10px] font-bold text-purple-300 uppercase tracking-wider px-1 font-mono">
            ✨ Questions prêtes pour toi (Clique pour poser) :
          </div>
          <div className="flex flex-wrap gap-1.5">
            {selectedMentor.presetQuestions.map((pq, i) => (
              <button
                key={i}
                onClick={() => handleAskPreset(pq.q, pq.answer)}
                className="px-2.5 py-1 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/30 text-[11px] font-medium text-purple-200 text-left transition-colors"
              >
                {pq.q}
              </button>
            ))}
          </div>
        </div>

        {/* Free text input */}
        <form
          onSubmit={handleSendCustom}
          className="p-3 bg-[#070712] border-t border-purple-500/20 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            placeholder={`Pose une question de cours à ${selectedMentor.name}...`}
            className="flex-1 px-3.5 py-2 text-xs bg-[#101229] border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-rose-400 placeholder:text-slate-500"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-md transition-colors shrink-0"
            title="Envoyer ma question"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
