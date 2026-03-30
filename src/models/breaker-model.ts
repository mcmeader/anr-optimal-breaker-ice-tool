import { BreakerType, Format, RunnerFaction } from './enums';

export interface ParsedBreaker {
  name: string;
  text: string;
  faction: RunnerFaction;
  influence: number;
  memory: number;
  legality: Format[];
  cost: number;
  interfaceCost: BreakCost;
  boostCost: BoostCost;
  baseStrength: number;
  breakerType: BreakerType[];
  set: string;
  imageCode: string;
}

export interface BreakCost {
  credits: Break;
  cards: Break;
  clicks: Break;
  virusCounters: Break;
  powerCounters: Break;
}

export interface BoostCost {
  credits: Boost;
  netDamage: Boost;
  meatDamage: Boost;
  coreDamage: Boost;
  cards: Boost;
  clicks: Boost;
  virusCounters: Boost;
  powerCounters: Boost;
}

export interface Break {
  cost: number;
  subs: number;
  stealth?: boolean;
  usableTimes?: number;
}

export interface Boost {
  cost: number;
  amount: number;
  stealth: boolean;
  usableTimes: number;
}
