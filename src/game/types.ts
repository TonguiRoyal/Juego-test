export type GraphicsQuality = 'low' | 'medium' | 'high';

export interface GirlProfile {
  id: number;
  name: string;
  tagline: string;
  personality: string;
  favGift: string;
  color: string;
  accentColor: string;
  avatarIcon: string;
  roomTheme: string;
  dialogueSuccess: string[];
  dialogueCaught: string;
  secretFact: string;
}

export interface LevelConfig {
  id: number;
  title: string;
  subtitle: string;
  difficulty: 'Fácil' | 'Media' | 'Difícil' | 'Extrema';
  girlId: number;
  houseTheme: 'suburban' | 'modern' | 'dojo' | 'cyberpunk' | 'tropical' | 'gothic' | 'highrise' | 'bakery' | 'observatory' | 'castle';
  floorColor: number;
  wallColor: number;
  carpetColor: number;
  accentLightColor: number;
  description: string;
  parTime: number; // in seconds
  parentType: 'dad_slipper' | 'mom_pin' | 'both' | 'mega_dad';
  parentSpeed: number;
  parentPatrolRadius: number;
  enemyTypes: ('vacuum_robot' | 'dust_bunny' | 'gnome' | 'laser_cat' | 'mischief_bat')[];
  enemyCount: number;
  furnitureStyle: 'cozy' | 'sleek' | 'traditional' | 'tech' | 'luxury' | 'vintage' | 'royal';
}

export interface PlayerSkin {
  id: string;
  name: string;
  desc: string;
  cost: number;
  unlocked: boolean;
  shirtColor: number;
  pantsColor: number;
  headExtra?: 'headband' | 'glasses' | 'box' | 'bear_ears' | 'ninja_mask';
}

export interface WeaponItem {
  id: string;
  name: string;
  desc: string;
  cost: number;
  unlocked: boolean;
  damage: number;
  icon: string;
  modelType: 'pillow' | 'rose' | 'water_gun' | 'chancla_golden';
  glowColor: number;
}

export interface LevelProgress {
  unlocked: boolean;
  stars: number;
  highScore: number;
  bestTime: number;
  lettersCollected: number; // 0 to 3
}

export interface GameSettings {
  quality: GraphicsQuality;
  soundEnabled: boolean;
  musicEnabled: boolean;
  joystickSize: 'small' | 'medium' | 'large';
  invertY: boolean;
  cameraSensitivity: number; // 0.4 to 3.0 (default 1.0)
  moveSensitivity: number;   // 0.5 to 2.0 (default 1.0)
}
