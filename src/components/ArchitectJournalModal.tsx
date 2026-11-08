import React, { useState } from 'react';
import {
  BookOpen,
  X,
  Sparkles,
  Printer,
  Star,
  CheckCircle2,
  Building2,
  Bookmark,
  Share2,
} from 'lucide-react';
import { SubjectCity, SubjectCityId, Building } from '../types/game';
import { soundEngine } from '../utils/audio';

interface ArchitectJournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  cities: SubjectCity[];
  buildings: Building[];
}

interface StudySummaryRule {
  id: string;
  cityId: SubjectCityId;
  subjectTitle: string;
  ruleTitle: string;
  kidFriendlyExplanation: string;
  formulaOrQuote: string;
  memoryTrick: string;
  monumentName: string;
}

const STUDY_RULES: StudySummaryRule[] = [
  {
    id: 'rule_fr_1',
    cityId: 'francais',
    subjectTitle: 'Français & Grammaire',
    ruleTitle: 'L’accord du participe passé avec l’auxiliaire AVOIR',
    kidFriendlyExplanation:
      'Avec le verbe AVOIR, le participe passé ne s’accorde QUE si le C.O.D. (le complément d’objet direct) est placé AVANT le verbe !',
    formulaOrQuote:
      '« Les poèmes que j’ai ÉCRITS » (on a écrit quoi ? « que » = les poèmes, placé avant -> accord s !)',
    memoryTrick:
      '💡 Pose la question « QUI ? » ou « QUOI ? » juste après avoir lu le verbe. Si la réponse était déjà dite avant, accorde !',
    monumentName: 'Bibliothèque des Grands Textes',
  },
  {
    id: 'rule_fr_2',
    cityId: 'francais',
    subjectTitle: 'Français & Littérature',
    ruleTitle: 'Les Figures de Style magiques (Oxymore & Métaphore)',
    kidFriendlyExplanation:
      'L’oxymore réunit deux contraires poétiques (comme « une douce violence »). La métaphore compare deux choses sans utiliser le mot « comme » !',
    formulaOrQuote:
      'Comparaison : « Ses yeux brillent comme des étoiles ». Métaphore : « Ses yeux sont des étoiles ».',
    memoryTrick:
      '💡 L’oxymore fait un choc d’idées, la métaphore fait une passerelle poétique directe !',
    monumentName: 'Pavillon Littéraire & Éloquence',
  },
  {
    id: 'rule_sc_1',
    cityId: 'sciences',
    subjectTitle: 'Sciences Naturelles & SVT',
    ruleTitle: 'La Photosynthèse et le cycle du vivant',
    kidFriendlyExplanation:
      'Les plantes vertes absorbent le dioxyde de carbone (CO₂) dans l’air et l’eau du sol. Avec la lumière du soleil, elles créent leur nourriture (sucre) et rejettent du dioxygène (O₂) indispensable pour que nous respirions !',
    formulaOrQuote:
      'Lumière du soleil + Eau (H₂O) + Gaz carbonique (CO₂) ➔ Glucose + Oxygène (O₂)',
    memoryTrick:
      '💡 Les arbres et les plantes sont de vraies usines à oxygène propre pour toute la planète !',
    monumentName: 'Grande Serre Botanique & Vivant',
  },
  {
    id: 'rule_sc_2',
    cityId: 'sciences',
    subjectTitle: 'Physique & SVT',
    ruleTitle: 'Les 3 États de l’Eau et son cycle infini',
    kidFriendlyExplanation:
      'L’eau existe sous 3 formes : Solide (glace en dessous de 0°C), Liquide (l’eau courante), et Gazeux (vapeur invisible quand elle bout à 100°C ou s’évapore au soleil).',
    formulaOrQuote:
      'Évaporation (lacs) ➔ Condensation (nuages) ➔ Précipitations (pluie/neige) ➔ Ruisseaux',
    memoryTrick:
      '💡 L’eau que nous buvons aujourd’hui est la même eau qui abreuvait les dinosaures il y a des millions d’années !',
    monumentName: 'Laboratoire d’Hydrologie & Physique',
  },
  {
    id: 'rule_ma_1',
    cityId: 'maths',
    subjectTitle: 'Mathématiques & Géométrie',
    ruleTitle: 'Le Théorème de Pythagore dans le triangle rectangle',
    kidFriendlyExplanation:
      'Dans un triangle qui possède un angle droit de 90°, le plus grand côté opposé s’appelle l’hypoténuse. Le carré de sa longueur est égal à la somme des carrés des deux autres côtés !',
    formulaOrQuote: 'a² + b² = c²  (Exemple célèbre : 3² + 4² = 9 + 16 = 25 = 5²)',
    memoryTrick:
      '💡 L’hypoténuse est le côté géant : son carré regroupe la puissance des deux petits côtés réunis !',
    monumentName: 'Institut de Géométrie Pure',
  },
  {
    id: 'rule_ma_2',
    cityId: 'maths',
    subjectTitle: 'Mathématiques & Algèbre',
    ruleTitle: 'Résoudre une équation comme une balance',
    kidFriendlyExplanation:
      'Une équation est comme une balance de cuisine parfaitement en équilibre. Tout ce que tu ajoutes ou enlèves d’un côté du signe « = », tu dois l’ajouter ou l’enlever de l’autre côté !',
    formulaOrQuote: 'Si 4x - 5 = 15, on ajoute 5 partout : 4x = 20, donc x = 20 / 4 = 5 !',
    memoryTrick:
      '💡 Pour isoler la lettre x, fais l’opération inverse : un + devient -, une multiplication devient division !',
    monumentName: 'Le Pont Harmonique de Pythagore',
  },
  {
    id: 'rule_hi_1',
    cityId: 'histoire',
    subjectTitle: 'Histoire & Citoyenneté',
    ruleTitle: '1789 et la Déclaration des droits de l’homme',
    kidFriendlyExplanation:
      'Pendant la Révolution française, le 26 août 1789, a été votée la Déclaration qui affirme pour la première fois que tous les êtres humains naissent et demeurent libres et égaux en droits.',
    formulaOrQuote:
      '« Article 1 : Les hommes naissent et demeurent libres et égaux en droits. »',
    memoryTrick:
      '💡 1789 a mis fin aux privilèges de la monarchie absolue et a posé les bases de notre République moderne.',
    monumentName: 'Musée des Grandes Civilisations',
  },
  {
    id: 'rule_la_1',
    cityId: 'langues',
    subjectTitle: 'Langues Vivantes (Anglais)',
    ruleTitle: 'Détourner le piège des faux-amis célèbres',
    kidFriendlyExplanation:
      'Certains mots anglais ressemblent au français mais ne veulent pas du tout dire la même chose ! « Actually » ne veut pas dire actuellement mais « en réalité », et « Library » veut dire bibliothèque (et non librairie) !',
    formulaOrQuote: 'Actually = En réalité / En fait | Currently = Actuellement',
    memoryTrick:
      '💡 Pour dire que quelque chose est super facile, les anglophones disent : « It’s a piece of cake ! » (c’est du gâteau !)',
    monumentName: 'Salon Linguistique International',
  },
  {
    id: 'rule_in_1',
    cityId: 'informatique',
    subjectTitle: 'Informatique & Numérique',
    ruleTitle: 'Les Bits, les Octets et les Algorithmes',
    kidFriendlyExplanation:
      'Un bit vaut soit 0 soit 1 (comme un mini interrupteur éteint ou allumé). 8 bits forment 1 octet (byte). Un algorithme est une suite d’étapes ordonnées pour résoudre un problème, comme une recette de gâteau pour l’ordinateur !',
    formulaOrQuote: '8 bits = 1 octet | Algorithme = Recette logique pas à pas',
    memoryTrick:
      '💡 Ada Lovelace a écrit le tout premier algorithme de l’Histoire en 1843, bien avant l’invention des écrans !',
    monumentName: 'Atelier d’Algorithmique & Code',
  },
];

export const ArchitectJournalModal: React.FC<ArchitectJournalModalProps> = ({
  isOpen,
  onClose,
  cities,
  buildings,
}) => {
  const [selectedCityId, setSelectedCityId] = useState<SubjectCityId | 'all'>('all');
  const [userNotes, setUserNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('studyquest_journal_notes');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  if (!isOpen) return null;

  const handleSaveNote = (ruleId: string, text: string) => {
    setUserNotes((prev) => {
      const updated = { ...prev, [ruleId]: text };
      try {
        localStorage.setItem('studyquest_journal_notes', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const filteredRules =
    selectedCityId === 'all'
      ? STUDY_RULES
      : STUDY_RULES.filter((r) => r.cityId === selectedCityId);

  const handlePrint = () => {
    soundEngine.playSuccess();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border border-purple-500/40 bg-[#0d0f22] text-slate-100 shadow-[0_0_50px_rgba(244,63,94,0.2)] overflow-hidden">
        {/* Notebook Spiral Spine Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-950/90 via-pink-950/60 to-slate-900 border-b border-purple-500/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-900/60 border border-purple-400/40 flex items-center justify-center text-xl shadow-md">
              📖
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-editorial text-white leading-tight">
                Le Carnet de Bord de l’Architecte
              </h3>
              <p className="text-xs text-rose-300 font-medium">
                Tes fiches mémo illustrées & règles clés pour briller à l’école
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 border border-purple-400/40 text-xs font-bold text-purple-200 shadow-sm transition-colors"
              title="Imprimer ou enregistrer tes fiches mémo en PDF"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Imprimer ma Fiche</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-purple-900/40 transition-colors"
              title="Fermer le carnet"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Subject Filter Ribbons */}
        <div className="px-4 py-2.5 bg-[#0a0a18] border-b border-purple-500/20 flex items-center gap-2 overflow-x-auto shrink-0 text-xs font-semibold">
          <button
            onClick={() => {
              soundEngine.playClick();
              setSelectedCityId('all');
            }}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
              selectedCityId === 'all'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-purple-950/40 border border-purple-500/20 text-slate-300 hover:text-white hover:bg-purple-900/40'
            }`}
          >
            Toutes les Matières ({STUDY_RULES.length})
          </button>

          {cities.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                soundEngine.playClick();
                setSelectedCityId(c.id);
              }}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedCityId === c.id
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-purple-950/40 border border-purple-500/20 text-slate-300 hover:text-white hover:bg-purple-900/40'
              }`}
            >
              <span>{c.name.replace('Cité du ', '').replace('Cité des ', '').replace('Cité de l’', '')}</span>
            </button>
          ))}
        </div>

        {/* Scrollable Journal Cards Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#0b0c1e]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredRules.map((rule) => {
              const city = cities.find((c) => c.id === rule.cityId);
              const noteText = userNotes[rule.id] || '';

              return (
                <div
                  key={rule.id}
                  className="rounded-3xl border border-purple-500/30 bg-[#12142e]/90 p-5 shadow-lg hover:shadow-xl hover:border-purple-400/50 transition-all flex flex-col justify-between space-y-3 relative overflow-hidden group"
                >
                  {/* Subtle top color ribbon */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1.5"
                    style={{ backgroundColor: city?.color || '#f43f5e' }}
                  />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="px-2 py-0.5 rounded-md border border-purple-500/40 bg-purple-950/60 text-purple-200">
                        {rule.subjectTitle}
                      </span>
                      <span className="text-slate-400 font-mono text-[10px]">
                        Édifice : {rule.monumentName}
                      </span>
                    </div>

                    <h4 className="text-base font-bold font-editorial text-white leading-snug">
                      {rule.ruleTitle}
                    </h4>

                    {/* Simple Explanation for 10 year olds */}
                    <p className="text-xs text-purple-100 leading-relaxed bg-purple-950/40 p-3 rounded-2xl border border-purple-500/20">
                      {rule.kidFriendlyExplanation}
                    </p>

                    {/* Formula or Example Quote */}
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-950/80 to-pink-950/60 border border-purple-400/30 text-xs font-mono text-pink-200 font-semibold leading-relaxed">
                      {rule.formulaOrQuote}
                    </div>

                    {/* Memory Trick */}
                    <div className="text-xs text-emerald-200 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/30">
                      {rule.memoryTrick}
                    </div>
                  </div>

                  {/* Personal Student Note Field */}
                  <div className="pt-2 border-t border-purple-500/20 space-y-1">
                    <label className="text-[10px] font-bold text-purple-300 uppercase tracking-wider block font-mono">
                      ✏️ Tes notes personnelles / mémo :
                    </label>
                    <input
                      type="text"
                      value={noteText}
                      onChange={(e) => handleSaveNote(rule.id, e.target.value)}
                      placeholder="Ex: astuce de ma prof, exemple perso..."
                      className="w-full px-3 py-1.5 text-xs bg-[#090a18] border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-rose-400 placeholder:text-slate-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Note */}
        <div className="p-3 bg-[#0a0a18] border-t border-purple-500/20 text-center text-xs text-slate-400 shrink-0 flex items-center justify-between px-6">
          <span>Toutes tes règles d’école enregistrées au fil de tes constructions</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs shadow-md transition-transform active:scale-95"
          >
            Fermer le Carnet
          </button>
        </div>
      </div>
    </div>
  );
};
