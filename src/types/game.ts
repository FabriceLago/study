export type SubjectCityId =
  | 'francais'
  | 'sciences'
  | 'maths'
  | 'histoire'
  | 'langues'
  | 'informatique';

export interface Building {
  id: string;
  cityId: SubjectCityId;
  name: string;
  subject: string;
  level: number;
  maxLevel: number;
  emoji: string;
  description: string;
  costBricks: number;
  costFlowers: number;
  happinessBonus: number;
  residentsBonus: number;
  status: 'locked' | 'unlocked' | 'built';
  gridSlot: number;
  associatedChallengeId: string;
}

export interface SubjectCity {
  id: SubjectCityId;
  name: string;
  subject: string;
  subjectTag: string;
  tagline: string;
  description: string;
  bannerImage: string;
  color: string;
  accentBg: string;
  borderColor: string;
  iconName: string;
  population: number;
  happiness: number;
  unlocked: boolean;
  requiredMayorLevel: number;
}

export interface ArchipelagoStats {
  mayorName: string;
  architectTitle: string;
  avatarUrl: string;
  currentCityId: SubjectCityId;
  level: number;
  xp: number;
  xpToNextLevel: number;
  bricks: number; // Briques d'or
  flowers: number; // Fleurs d'inspiration
  gems: number; // Joyaux célestes
  streakDays: number;
  totalAnswered: number;
  totalCorrect: number;
  wondersCompleted: number;
  completedChallengeIds: string[];
  builtBuildingIds: string[];
  cityPopulations: Record<SubjectCityId, number>;
  cityHappiness: Record<SubjectCityId, number>;
  ownedDecorations: Record<string, number>;
  unlockedBadges: string[];
}

export type StudyLanguage = 'fr' | 'nl' | 'en' | 'es';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  hint: string;
  explanation: string;
  xp: number;
  bricks: number;
  language?: StudyLanguage;
}

export interface SiteForeman {
  name: string;
  role: string;
  avatar: string;
  dialogue: string;
}

export interface ConstructionChallenge {
  id: string;
  cityId: SubjectCityId;
  title: string;
  buildingName: string;
  buildingEmoji: string;
  subject: string;
  difficulty: 'Facile' | 'Moyen' | 'Difficile' | 'Merveille';
  description: string;
  foreman: SiteForeman;
  questions: Question[];
  rewardBricks: number;
  rewardFlowers: number;
  rewardXp: number;
  unlocksBuildingId: string;
  isAiGenerated?: boolean;
  language?: StudyLanguage;
}

export interface DecorationItem {
  id: string;
  name: string;
  category: 'fleuriste' | 'monument' | 'compagnon';
  costFlowers: number;
  costGems: number;
  happinessBoost: number;
  description: string;
  icon: string;
}

export interface Flashcard {
  id: string;
  cityId: SubjectCityId;
  subject: string;
  front: string;
  back: string;
  box: number;
  timesReviewed: number;
  language?: StudyLanguage;
}

export interface AchievementBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export type AmbientTimeOfDay = 'day' | 'dusk' | 'night';

export interface JournalNote {
  buildingId: string;
  notes: string;
  starred: boolean;
  lastUpdated: string;
}

export interface CompanionPet {
  id: string;
  name: string;
  species: string;
  emoji: string;
  affection: number; // 0 - 100
  favoriteSubject: string;
  advice: string[];
}

export interface HomeworkItem {
  id: string;
  title: string;
  subjectId: SubjectCityId;
  day: 'Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi' | 'Weekend';
  details?: string;
  done: boolean;
  rewardBricks: number;
}

export interface ExplorerCustomization {
  title: string;
  backpackColor: string; // hex or tailwind class
  badgeEmoji: string;
  avatarIcon: string;
}
