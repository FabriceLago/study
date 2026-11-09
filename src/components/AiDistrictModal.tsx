import React, { useState } from 'react';
import { Sparkles, X, Loader2, Wand2, AlertCircle } from 'lucide-react';
import { ConstructionChallenge, SubjectCityId } from '../types/game';
import { soundEngine } from '../utils/audio';

interface AiDistrictModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChallengeCreated: (newChallenge: ConstructionChallenge) => void;
}

export const AiDistrictModal: React.FC<AiDistrictModalProps> = ({
  isOpen,
  onClose,
  onChallengeCreated,
}) => {
  const [topic, setTopic] = useState('');
  const [buildingIdea, setBuildingIdea] = useState('');
  const [targetCity, setTargetCity] = useState<'auto' | SubjectCityId>('auto');
  const [questLang, setQuestLang] = useState<'fr' | 'nl' | 'en' | 'es'>('fr');
  const [schoolGrade, setSchoolGrade] = useState('Collège (6e - 3e)');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const mapSubjectToCity = (sub: string): SubjectCityId => {
    const s = sub.toLowerCase();
    if (s.includes('math') || s.includes('calc') || s.includes('géom') || s.includes('alg')) return 'maths';
    if (s.includes('bio') || s.includes('scien') || s.includes('phys') || s.includes('chim') || s.includes('nature') || s.includes('svt')) return 'sciences';
    if (s.includes('hist') || s.includes('géo') || s.includes('patrimoine') || s.includes('citoyen')) return 'histoire';
    if (s.includes('fran') || s.includes('litt') || s.includes('gramm') || s.includes('poé') || s.includes('ortho')) return 'francais';
    if (
      s.includes('angl') ||
      s.includes('esp') ||
      s.includes('lang') ||
      s.includes('neerl') ||
      s.includes('nederl') ||
      s.includes('dutch') ||
      s.includes('flamand') ||
      s.includes('allem') ||
      s.includes('ital')
    )
      return 'langues';
    if (s.includes('code') || s.includes('info') || s.includes('algo') || s.includes('tech') || s.includes('numér')) return 'informatique';
    return 'francais';
  };

  const determineCityId = (rawSubject: string): SubjectCityId => {
    if (targetCity !== 'auto') return targetCity;
    return mapSubjectToCity(rawSubject || topic);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() && !notes.trim()) {
      setErrorMsg('Veuillez renseigner un sujet de cours ou coller vos notes.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    soundEngine.playSuccess();

    try {
      const response = await fetch('/api/generate-quest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          schoolGrade,
          difficulty: 'Moyen',
          notes: notes.trim(),
        }),
      });

      if (!response.ok) {
        generateLocalFallbackChallenge();
        return;
      }

      const questData = await response.json();
      if (!questData.questions || questData.questions.length === 0) {
        generateLocalFallbackChallenge();
        return;
      }

      const resolvedCityId = determineCityId(questData.subject || topic);

      const generated: ConstructionChallenge = {
        id: `chal_ai_${Date.now()}`,
        cityId: resolvedCityId,
        title: `Chantier : ${buildingIdea.trim() || `Le Pavillon de ${topic}`}`,
        buildingName: buildingIdea.trim() || `Le Pavillon de ${topic}`,
        buildingEmoji: '🏛️',
        subject: questData.subject || topic,
        difficulty: 'Moyen',
        description:
          questData.lore ||
          `Bâtissez un nouveau monument pour votre cité en validant vos connaissances sur ${topic}.`,
        foreman: {
          name: 'Guide d’Étude',
          role: 'Architecte Conseil',
          avatar: '👩‍💼',
          dialogue: `« Ce nouveau bâtiment dédié à ${topic} enrichira l’archipel de nos cités ! »`,
        },
        questions: questData.questions.map((q: any, i: number) => ({
          id: `ai_q_${i}`,
          question: q.question,
          options: q.options || ['Choix A', 'Choix B', 'Choix C', 'Choix D'],
          correctIndex: q.correctIndex ?? 0,
          hint: q.hint || 'Rappelez-vous les notions clés du cours.',
          explanation: q.explanation || 'Règle essentielle du programme.',
          xp: q.xp || 35,
          bricks: 15,
        })),
        rewardBricks: 80,
        rewardFlowers: 40,
        rewardXp: 160,
        unlocksBuildingId: `bld_ai_${Date.now()}`,
        isAiGenerated: true,
      };

      soundEngine.playLevelUp();
      onChallengeCreated(generated);
      onClose();
    } catch {
      generateLocalFallbackChallenge();
    } finally {
      setLoading(false);
    }
  };

  const generateLocalFallbackChallenge = () => {
    const chosenTopic = topic.trim() || 'Culture & Curiosités';
    const buildingName = buildingIdea.trim() || `L’Atelier Floral de ${chosenTopic.slice(0, 15)}`;
    const resolvedCityId = determineCityId(chosenTopic);

    const fallback: ConstructionChallenge = {
      id: `chal_ai_${Date.now()}`,
      cityId: resolvedCityId,
      title: `Chantier : ${buildingName}`,
      buildingName,
      buildingEmoji: '🌸',
      subject: chosenTopic,
      difficulty: 'Moyen',
      description: `Posez les fondations de ${buildingName} en répondant aux énigmes de révision sur « ${chosenTopic} ».`,
      foreman: {
        name: 'Mireille l’Urbaniste',
        role: 'Architecte en chef',
        avatar: '👩‍🏫',
        dialogue: `« Tout est prêt pour faire fleurir ${buildingName}. Réfléchissons ensemble ! »`,
      },
      questions: [
        {
          id: 'q_fb_1',
          question: `Quelle méthode permet de structurer au mieux sa réflexion sur le thème « ${chosenTopic} » ?`,
          options: [
            'Définir clairement les termes et vérifier chaque étape avec rigueur',
            'Choisir la réponse la plus longue sans lire',
            'Répondre au hasard en 1 seconde',
            'Attendre la fin de l’année scolaire',
          ],
          correctIndex: 0,
          hint: 'La clarté méthodologique est la clé de toute belle construction.',
          explanation: `Pour réussir dans l'apprentissage de ${chosenTopic}, il est essentiel de maîtriser le vocabulaire et les étapes logiques.`,
          xp: 35,
          bricks: 15,
        },
        {
          id: 'q_fb_2',
          question: `Lorsqu’on apprend une nouvelle notion dans « ${chosenTopic} », comment consolider sa mémoire ?`,
          options: [
            'En s’auto-interrogeant régulièrement avec des questions et des fiches',
            'En relisant une seule fois sans y repenser',
            'En apprenant par cœur sans chercher à comprendre',
            'En recopiant la leçon 50 fois',
          ],
          correctIndex: 0,
          hint: 'La répétition espacée active est la méthode la plus efficace scientifiquement.',
          explanation: 'La réactivation active de la mémoire crée des connexions neuronales solides et durables.',
          xp: 35,
          bricks: 15,
        },
        {
          id: 'q_fb_3',
          question: `Quel état d’esprit favorise la réussite des projets et l'apprentissage de « ${chosenTopic} » ?`,
          options: [
            'La curiosité, la bienveillance envers ses erreurs et la persévérance',
            'La peur d’échouer qui paralyse',
            'Penser qu’on n’est pas douée',
            'Tout abandonner dès la première difficulté',
          ],
          correctIndex: 0,
          hint: 'Une erreur n’est pas un échec, c’est une information pour progresser.',
          explanation: 'Chaque erreur est une étape naturelle vers l’apprentissage et la construction de sa confiance en soi.',
          xp: 35,
          bricks: 15,
        },
      ],
      rewardBricks: 75,
      rewardFlowers: 35,
      rewardXp: 150,
      unlocksBuildingId: `bld_ai_${Date.now()}`,
      isAiGenerated: true,
    };

    soundEngine.playLevelUp();
    onChallengeCreated(fallback);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-3xl border border-purple-500/30 bg-[#0d0f22] shadow-2xl p-6 sm:p-7 space-y-5 text-slate-100">
        <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
          <div className="flex items-center gap-2 text-rose-400 font-editorial text-lg font-bold">
            <Wand2 className="w-5 h-5 text-rose-400" />
            <span>Dessiner un Bâtiment & Chantier par IA</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Sujet de Révision ou Chapitre
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex: La Révolution Française, La Photosynthèse, Le Théorème de Pythagore..."
              className="w-full px-3.5 py-2.5 bg-[#121432] border border-purple-500/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-rose-400 placeholder:text-slate-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Nom du Monument à Bâtir
              </label>
              <input
                type="text"
                value={buildingIdea}
                onChange={(e) => setBuildingIdea(e.target.value)}
                placeholder="Ex: Le Kiosque des Océans..."
                className="w-full px-3 py-2 bg-[#121432] border border-purple-500/30 rounded-xl text-xs text-white focus:outline-none focus:border-rose-400 placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Cité Scolaire de Destination
              </label>
              <select
                value={targetCity}
                onChange={(e) => setTargetCity(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#121432] border border-purple-500/30 rounded-xl text-xs text-white focus:outline-none focus:border-rose-400"
              >
                <option value="auto" className="bg-[#0d0f22] text-white">Automatique selon la matière</option>
                <option value="francais" className="bg-[#0d0f22] text-white">Cité du Français (Français & Littérature)</option>
                <option value="sciences" className="bg-[#0d0f22] text-white">Cité des Sciences (SVT & Nature)</option>
                <option value="maths" className="bg-[#0d0f22] text-white">Cité des Mathématiques (Mathématiques)</option>
                <option value="histoire" className="bg-[#0d0f22] text-white">Cité de l'Histoire (Histoire & Géo)</option>
                <option value="langues" className="bg-[#0d0f22] text-white">Cité des Langues (Langues Vivantes)</option>
                <option value="informatique" className="bg-[#0d0f22] text-white">Cité du Numérique (Informatique & Code)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Langue d’Étude
              </label>
              <select
                value={questLang}
                onChange={(e) => setQuestLang(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#121432] border border-purple-500/30 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="fr" className="bg-[#0d0f22] text-white">🇫🇷 Français</option>
                <option value="nl" className="bg-[#0d0f22] text-white">🇳🇱 Néerlandais</option>
                <option value="en" className="bg-[#0d0f22] text-white">🇬🇧 Anglais</option>
                <option value="es" className="bg-[#0d0f22] text-white">🇪🇸 Espagnol</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Niveau Scolaire
              </label>
              <select
                value={schoolGrade}
                onChange={(e) => setSchoolGrade(e.target.value)}
                className="w-full px-3 py-2 bg-[#121432] border border-purple-500/30 rounded-xl text-xs text-white focus:outline-none focus:border-rose-400"
              >
                <option value="Primaire (CM1 - CM2)" className="bg-[#0d0f22] text-white">Primaire (CM1 - CM2)</option>
                <option value="Collège (6e - 5e)" className="bg-[#0d0f22] text-white">Collège (6e - 5e)</option>
                <option value="Collège (4e - 3e)" className="bg-[#0d0f22] text-white">Collège (4e - 3e)</option>
                <option value="Lycée" className="bg-[#0d0f22] text-white">Lycée</option>
                <option value="Culture Générale" className="bg-[#0d0f22] text-white">Culture Générale & Loisirs</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Matière scolaire
              </label>
              <div className="text-xs text-cyan-300 py-2.5 px-3 bg-[#121432] border border-purple-500/20 rounded-xl font-mono truncate">
                {targetCity === 'auto' ? 'Automatique' : targetCity}
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              (Facultatif) Vos notes de cours pour des questions sur-mesure
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Collez ici un paragraphe de votre leçon, les formules ou le vocabulaire à réviser..."
              rows={3}
              className="w-full px-3.5 py-2 bg-[#121432] border border-purple-500/30 rounded-xl text-xs text-white focus:outline-none focus:border-rose-400 placeholder:text-slate-500 resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 rounded-xl shadow-md flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Tracé du Plan par l’IA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Générer le Chantier Urbain</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
