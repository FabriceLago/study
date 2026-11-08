import { useState, useEffect } from 'react';

export type StudyLanguage = 'fr' | 'nl' | 'en' | 'es';

export interface LanguageInfo {
  code: StudyLanguage;
  name: string;
  nativeName: string;
  flag: string;
  voiceLang: string;
  description: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  {
    code: 'fr',
    name: 'Français',
    nativeName: 'Français',
    flag: '🇫🇷',
    voiceLang: 'fr-FR',
    description: 'Langue principale d’apprentissage',
  },
  {
    code: 'nl',
    name: 'Néerlandais',
    nativeName: 'Nederlands',
    flag: '🇳🇱',
    voiceLang: 'nl-NL',
    description: 'Woordenschat, zinnen & basis grammatica',
  },
  {
    code: 'en',
    name: 'Anglais',
    nativeName: 'English',
    flag: '🇬🇧',
    voiceLang: 'en-US',
    description: 'Vocabulary, idioms & daily conversation',
  },
  {
    code: 'es',
    name: 'Espagnol',
    nativeName: 'Español',
    flag: '🇪🇸',
    voiceLang: 'es-ES',
    description: 'Vocabulario, expresiones y cultura',
  },
];

export interface TranslationDictionary {
  appName: string;
  appSubtitle: string;
  systemOperational: string;
  muteAll: string;
  unmuteAll: string;
  soundOn: string;
  soundMuted: string;
  searchPlaceholder: string;
  studyLanguage: string;
  switchLanguage: string;
  // Tabs
  tabPlan: string;
  tabCity: string;
  tabChallenges: string;
  tabSchedule: string;
  tabWonder: string;
  tabFocus: string;
  tabShop: string;
  // Plan
  operationalProgress: string;
  waypointsCompleted: string;
  alpineObjective: string;
  interventionsAndSites: string;
  allFilter: string;
  pendingFilter: string;
  discipline: string;
  station: string;
  action: string;
  start: string;
  done: string;
  cityTelemetry: string;
  streakDays: string;
  level: string;
  // Challenges
  incidentHubTitle: string;
  incidentHubDesc: string;
  createCustomDistrict: string;
  allCities: string;
  deployBuilding: string;
  mentor: string;
  questionsCount: string;
  intervene: string;
  review: string;
  // Flashcards
  flashcardsTitle: string;
  flashcardsDesc: string;
  filterAllLang: string;
  filterDutch: string;
  filterFrench: string;
  filterEnglish: string;
  filterSpanish: string;
  listenSpeech: string;
  // Audio
  audioVoiceLang: string;
  // New features
  duel1v1: string;
  caseOpening: string;
  voiceChallenge: string;
  videoDemo: string;
  memoNotebook: string;
  miniGames: string;
  homework: string;
  certificate: string;
  passport: string;
  coins: string;
  bricks: string;
  flowers: string;
  liveDrops: string;
  season1: string;
}

export const TRANSLATIONS: Record<StudyLanguage, TranslationDictionary> = {
  fr: {
    appName: 'Study',
    appSubtitle: 'Esports & Academy Pédagogique',
    systemOperational: 'Système Opérationnel · 6 Cités',
    muteAll: 'Couper le son',
    unmuteAll: 'Activer le son',
    soundOn: 'Audio Actif',
    soundMuted: 'Audio Coupé',
    searchPlaceholder: 'Rechercher un cours, monument, défi...',
    studyLanguage: 'Langue de la plateforme',
    switchLanguage: 'Changer de langue',
    tabPlan: 'Plan du Sommet',
    tabCity: 'Cités Scolaires',
    tabChallenges: 'Chantiers & Épreuves',
    tabSchedule: 'Guide & Révisions',
    tabWonder: 'Palais Céleste',
    tabFocus: 'Studio Focus & Thé',
    tabShop: 'Fleuriste & Parcs',
    operationalProgress: 'Progression Opérationnelle',
    waypointsCompleted: 'secteurs validés',
    alpineObjective: 'Objectif sommet Resq · 100% réel',
    interventionsAndSites: 'Interventions & Chantiers',
    allFilter: 'Tous',
    pendingFilter: 'En cours',
    discipline: 'Discipline',
    station: 'Balise',
    action: 'Action',
    start: 'Start',
    done: 'Fait',
    cityTelemetry: 'Télémétrie des Cités',
    streakDays: 'j. série',
    level: 'Niveau',
    incidentHubTitle: 'Centre d’Interventions & Chantiers',
    incidentHubDesc: 'Chaque épreuve résout une anomalie pédagogique et active le déploiement d’un nouveau monument sur vos cités.',
    createCustomDistrict: 'Créer un Chantier Personnalisé',
    allCities: 'Toutes les Cités',
    deployBuilding: 'Déploie',
    mentor: 'Mentor',
    questionsCount: 'questions',
    intervene: 'Intervenir',
    review: 'Réexaminer',
    flashcardsTitle: 'Fiches Mémos & Cartes de Révision',
    flashcardsDesc: 'Révisez votre vocabulaire en français, néerlandais, anglais et espagnol.',
    filterAllLang: 'Toutes les langues',
    filterDutch: 'Néerlandais 🇳🇱',
    filterFrench: 'Français 🇫🇷',
    filterEnglish: 'Anglais 🇬🇧',
    filterSpanish: 'Espagnol 🇪🇸',
    listenSpeech: 'Écouter la prononciation',
    audioVoiceLang: 'fr-FR',
    duel1v1: 'Duel 1v1 Esport',
    caseOpening: 'Caisses & Butin',
    voiceChallenge: 'Défi Vocal Micro',
    videoDemo: 'Démo 1 min',
    memoNotebook: 'Carnet Mémo',
    miniGames: 'Mini-Jeux (60s)',
    homework: 'Devoirs',
    certificate: 'Brevet Officiel',
    passport: 'Passeport',
    coins: 'Pièces',
    bricks: 'Briques Dorées',
    flowers: 'Fleurs',
    liveDrops: 'Live Drops',
    season1: 'Saison 1',
  },
  nl: {
    appName: 'Study',
    appSubtitle: 'Esports & Pedagogische Academie',
    systemOperational: 'Systeem Operationeel · 6 Steden',
    muteAll: 'Geluid Dempen',
    unmuteAll: 'Geluid Aan',
    soundOn: 'Audio Actief',
    soundMuted: 'Audio Gedempt',
    searchPlaceholder: 'Zoek een les, monument, uitdaging...',
    studyLanguage: 'Platformtaal',
    switchLanguage: 'Taal wijzigen',
    tabPlan: 'Bergexpeditie Plan',
    tabCity: 'Schoolsteden',
    tabChallenges: 'Bouwwerven & Taken',
    tabSchedule: 'Gids & Woordenlijsten',
    tabWonder: 'Hemels Paleis',
    tabFocus: 'Focus Studio & Thee',
    tabShop: 'Bloemist & Parken',
    operationalProgress: 'Operationele Voortgang',
    waypointsCompleted: 'sectoren voltooid',
    alpineObjective: 'Resq Bergtop Doel · 100% echt',
    interventionsAndSites: 'Interventies & Werven',
    allFilter: 'Alle',
    pendingFilter: 'Bezig',
    discipline: 'Vakgebied',
    station: 'Baken',
    action: 'Actie',
    start: 'Starten',
    done: 'Klaar',
    cityTelemetry: 'Stadstelemetrie',
    streakDays: 'dagen reeks',
    level: 'Niveau',
    incidentHubTitle: 'Interventiecentrum & Werven',
    incidentHubDesc: 'Elke opgave lost een pedagogische uitdaging op en activeert een nieuw monument in je steden.',
    createCustomDistrict: 'Aangepaste Werf Maken',
    allCities: 'Alle Steden',
    deployBuilding: 'Bouwt',
    mentor: 'Mentor',
    questionsCount: 'vragen',
    intervene: 'Ingrijpen',
    review: 'Herhalen',
    flashcardsTitle: 'Geheugenkaarten & Herhaling',
    flashcardsDesc: 'Oefen je woordenschat in het Nederlands, Frans, Engels en Spaans.',
    filterAllLang: 'Alle talen',
    filterDutch: 'Nederlands 🇳🇱',
    filterFrench: 'Frans 🇫🇷',
    filterEnglish: 'Engels 🇬🇧',
    filterSpanish: 'Spaans 🇪🇸',
    listenSpeech: 'Beluister uitspraak',
    audioVoiceLang: 'nl-NL',
    duel1v1: '1v1 Esport Duel',
    caseOpening: 'Kisten & Buit',
    voiceChallenge: 'Spraakmicrofoon Uitdaging',
    videoDemo: 'Demo 1 min',
    memoNotebook: 'Lesnotities',
    miniGames: 'Mini-Games (60s)',
    homework: 'Huiswerk',
    certificate: 'Officieel Brevet',
    passport: 'Paspoort',
    coins: 'Munten',
    bricks: 'Gouden Bakstenen',
    flowers: 'Bloemen',
    liveDrops: 'Live Drops',
    season1: 'Seizoen 1',
  },
  en: {
    appName: 'Study',
    appSubtitle: 'Esports & Learning Academy',
    systemOperational: 'System Operational · 6 Cities',
    muteAll: 'Mute All',
    unmuteAll: 'Unmute All',
    soundOn: 'Audio Active',
    soundMuted: 'Audio Muted',
    searchPlaceholder: 'Search for courses, monuments, challenges...',
    studyLanguage: 'Platform Language',
    switchLanguage: 'Switch language',
    tabPlan: 'Mountain Plan',
    tabCity: 'Subject Cities',
    tabChallenges: 'Build Challenges',
    tabSchedule: 'Review & Schedule',
    tabWonder: 'Celestial Palace',
    tabFocus: 'Focus & Tea Studio',
    tabShop: 'Florist & Parks',
    operationalProgress: 'Operational Progress',
    waypointsCompleted: 'sectors cleared',
    alpineObjective: 'Resq Summit Goal · 100% authentic',
    interventionsAndSites: 'Operations & Sites',
    allFilter: 'All',
    pendingFilter: 'In Progress',
    discipline: 'Discipline',
    station: 'Beacon',
    action: 'Action',
    start: 'Start',
    done: 'Done',
    cityTelemetry: 'City Telemetry',
    streakDays: 'd. streak',
    level: 'Level',
    incidentHubTitle: 'Operations & Build Center',
    incidentHubDesc: 'Each challenge resolves a learning anomaly and unlocks a monument across your cities.',
    createCustomDistrict: 'Create Custom Site',
    allCities: 'All Cities',
    deployBuilding: 'Deploys',
    mentor: 'Mentor',
    questionsCount: 'questions',
    intervene: 'Intervene',
    review: 'Review',
    flashcardsTitle: 'Memory Flashcards & Review',
    flashcardsDesc: 'Practice vocabulary in French, Dutch, English, and Spanish.',
    filterAllLang: 'All languages',
    filterDutch: 'Dutch 🇳🇱',
    filterFrench: 'French 🇫🇷',
    filterEnglish: 'English 🇬🇧',
    filterSpanish: 'Spanish 🇪🇸',
    listenSpeech: 'Listen to pronunciation',
    audioVoiceLang: 'en-US',
    duel1v1: '1v1 Esport Duel',
    caseOpening: 'Cases & Loot',
    voiceChallenge: 'Voice Mic Challenge',
    videoDemo: '1 Min Demo',
    memoNotebook: 'Notebook',
    miniGames: 'Mini-Games (60s)',
    homework: 'Homework',
    certificate: 'Official Diploma',
    passport: 'Passport',
    coins: 'Coins',
    bricks: 'Golden Bricks',
    flowers: 'Flowers',
    liveDrops: 'Live Drops',
    season1: 'Season 1',
  },
  es: {
    appName: 'Study',
    appSubtitle: 'Academia y Esports de Aprendizaje',
    systemOperational: 'Sistema Operativo · 6 Ciudades',
    muteAll: 'Silenciar Todo',
    unmuteAll: 'Activar Sonido',
    soundOn: 'Audio Activo',
    soundMuted: 'Audio Silenciado',
    searchPlaceholder: 'Buscar un curso, monumento, reto...',
    studyLanguage: 'Idioma de la plataforma',
    switchLanguage: 'Cambiar de idioma',
    tabPlan: 'Plan de la Cumbre',
    tabCity: 'Ciudades Escolares',
    tabChallenges: 'Retos y Obras',
    tabSchedule: 'Guía y Repaso',
    tabWonder: 'Palacio Celeste',
    tabFocus: 'Estudio Focus y Té',
    tabShop: 'Floristería y Parques',
    operationalProgress: 'Progreso Operativo',
    waypointsCompleted: 'sectores validados',
    alpineObjective: 'Objetivo cumbre Resq · 100% real',
    interventionsAndSites: 'Intervenciones y Obras',
    allFilter: 'Todos',
    pendingFilter: 'En curso',
    discipline: 'Disciplina',
    station: 'Baliza',
    action: 'Acción',
    start: 'Iniciar',
    done: 'Hecho',
    cityTelemetry: 'Telemetría de Ciudades',
    streakDays: 'd. racha',
    level: 'Nivel',
    incidentHubTitle: 'Centro de Intervenciones y Retos',
    incidentHubDesc: 'Cada reto resuelve una anomalía pedagógica y activa un nuevo monumento en tus ciudades.',
    createCustomDistrict: 'Crear Obra Personalizada',
    allCities: 'Todas las Ciudades',
    deployBuilding: 'Despliega',
    mentor: 'Mentor',
    questionsCount: 'preguntas',
    intervene: 'Intervenir',
    review: 'Reexaminar',
    flashcardsTitle: 'Tarjetas de Memoria y Repaso',
    flashcardsDesc: 'Repasa vocabulario en francés, neerlandés, inglés y español.',
    filterAllLang: 'Todos los idiomas',
    filterDutch: 'Neerlandés 🇳🇱',
    filterFrench: 'Francés 🇫🇷',
    filterEnglish: 'Inglés 🇬🇧',
    filterSpanish: 'Español 🇪🇸',
    listenSpeech: 'Escuchar pronunciación',
    audioVoiceLang: 'es-ES',
    duel1v1: 'Duelo 1v1 Esport',
    caseOpening: 'Cajas y Botín',
    voiceChallenge: 'Reto de Voz Micro',
    videoDemo: 'Demo 1 min',
    memoNotebook: 'Cuaderno Memo',
    miniGames: 'Mini-Juegos (60s)',
    homework: 'Deberes',
    certificate: 'Brevet Oficial',
    passport: 'Pasaporte',
    coins: 'Monedas',
    bricks: 'Ladrillos Dorados',
    flowers: 'Flores',
    liveDrops: 'Live Drops',
    season1: 'Temporada 1',
  },
};

type LanguageListener = (lang: StudyLanguage) => void;

class I18nManager {
  private currentLang: StudyLanguage = 'fr';
  private listeners: Set<LanguageListener> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('studyquest_study_lang') as StudyLanguage;
        if (saved && TRANSLATIONS[saved]) {
          this.currentLang = saved;
        }
      } catch {}
    }
  }

  public getLanguage(): StudyLanguage {
    return this.currentLang;
  }

  public getLanguageInfo(): LanguageInfo {
    return SUPPORTED_LANGUAGES.find((l) => l.code === this.currentLang) || SUPPORTED_LANGUAGES[0];
  }

  public setLanguage(lang: StudyLanguage) {
    if (this.currentLang === lang) return;
    this.currentLang = lang;
    try {
      localStorage.setItem('studyquest_study_lang', lang);
    } catch {}
    this.notify();
  }

  public t(): TranslationDictionary {
    return TRANSLATIONS[this.currentLang] || TRANSLATIONS.fr;
  }

  public subscribe(listener: LanguageListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    for (const listener of this.listeners) {
      try {
        listener(this.currentLang);
      } catch (err) {
        console.error(err);
      }
    }
  }
}

export const i18n = new I18nManager();

/**
 * React hook to reactively consume translations and language updates across components
 */
export function useLanguage() {
  const [lang, setLang] = useState<StudyLanguage>(() => i18n.getLanguage());

  useEffect(() => {
    return i18n.subscribe((newLang) => {
      setLang(newLang);
    });
  }, []);

  return {
    lang,
    t: i18n.t(),
    setLanguage: (newLang: StudyLanguage) => i18n.setLanguage(newLang),
    langInfo: i18n.getLanguageInfo(),
    supportedLanguages: SUPPORTED_LANGUAGES,
  };
}
