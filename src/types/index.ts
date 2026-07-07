export interface Matter {
  id: string;
  name: string;
  rarity: RarityLevel;
  inventor: string | null;
  is_basic: boolean;
  created_at: string;
}

export interface SynthesisRule {
  id: string;
  ingredient_a: string;
  ingredient_b: string;
  result: string;
  created_at: string;
}

export type RarityLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface RarityInfo {
  level: RarityLevel;
  name: string;
  color: string;
}

export const RARITY_MAP: Record<RarityLevel, RarityInfo> = {
  1:  { level: 1,  name: '普通',   color: '#9ca3af' },
  2:  { level: 2,  name: '稳定',   color: '#34d399' },
  3:  { level: 3,  name: '活性',   color: '#38bdf8' },
  4:  { level: 4,  name: '稀有',   color: '#a78bfa' },
  5:  { level: 5,  name: '精纯',   color: '#c084fc' },
  6:  { level: 6,  name: '奇异',   color: '#2dd4bf' },
  7:  { level: 7,  name: '超凡',   color: '#f87171' },
  8:  { level: 8,  name: '传说',   color: '#fbbf24' },
  9:  { level: 9,  name: '神话',   color: '#f472b6' },
  10: { level: 10, name: '终极',   color: '#22d3ee' },
};

export interface ConflictCheckResult {
  hasConflict: boolean;
  conflictType: 'duplicate_rule' | 'duplicate_name' | null;
  message: string;
}
