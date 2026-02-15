export enum PartSlot {
  HEAD = 'HEAD',
  CORE = 'CORE',
  LEFT_ARM = 'LEFT_ARM',
  RIGHT_ARM = 'RIGHT_ARM',
  LEGS = 'LEGS'
}

export interface Stats {
  strength: number;
  agility: number;
  defense: number;
  tech: number;
  energy: number;
}

export interface CyborgPart {
  id: string;
  name: string;
  slot: PartSlot;
  description: string;
  stats: Stats;
  cost: number;
  rarity: 'common' | 'rare' | 'legendary' | 'prototype';
  category: string;
}

export interface CyborgConfiguration {
  [PartSlot.HEAD]: CyborgPart;
  [PartSlot.CORE]: CyborgPart;
  [PartSlot.LEFT_ARM]: CyborgPart;
  [PartSlot.RIGHT_ARM]: CyborgPart;
  [PartSlot.LEGS]: CyborgPart;
}

export interface AnalysisResult {
  codename: string;
  combatRole: string;
  tacticalAnalysis: string;
  weakness: string;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
}