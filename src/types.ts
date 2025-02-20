export interface CeodData {
  carious: number;
  extracted: number;
  filled: number;
  children: number;
}

export type CeodLevel = 'very-low' | 'low' | 'moderate' | 'high' | 'very-high';

export interface CeodResult {
  index: number;
  level: CeodLevel;
  message: string;
}