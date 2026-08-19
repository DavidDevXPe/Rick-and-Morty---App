export const API_BASE_URL = 'https://rickandmortyapi.com/api';
export const MIN_LOCATION_ID = 1;
export const MAX_LOCATION_ID = 126;
export const RESIDENTS_PER_PAGE = 5;

export const MIN_EPISODE_ID = 1;
export const MAX_EPISODE_ID = 51;

export const STATUS_OPTIONS = [
  { label: 'Vivo', value: 'alive' },
  { label: 'Muerto', value: 'dead' },
  { label: 'Desconocido', value: 'unknown' },
];

export const SPECIES_OPTIONS = [
  'Human',
  'Alien',
  'Humanoid',
  'Robot',
  'Animal',
  'Mythological Creature',
  'Cronenberg',
  'Disease',
  'Poopybutthole',
];

export const SPECIES_LABELS = {
  Human: 'Humano',
  Alien: 'Alien',
  Humanoid: 'Humanoide',
  Robot: 'Robot',
  Animal: 'Animal',
  'Mythological Creature': 'Criatura mitológica',
  Cronenberg: 'Cronenberg',
  Disease: 'Enfermedad',
  Poopybutthole: 'Poopybutthole',
};

export const GENDER_OPTIONS = [
  { label: 'Masculino', value: 'male' },
  { label: 'Femenino', value: 'female' },
  { label: 'Sin género', value: 'genderless' },
  { label: 'Desconocido', value: 'unknown' },
];

export const STATUS_LABELS = {
  alive: 'Vivo',
  dead: 'Muerto',
  unknown: 'Desconocido',
};

export const THEME_STORAGE_KEY = 'rm-theme';
export const FAVORITES_STORAGE_KEY = 'rm-favorites';
