import { CorpFaction, Format, IceSubType, IceType } from './enums';

export interface ParsedIce {
  name: string;
  faction: CorpFaction;
  influence: number;
  legality: Format[];
  cost: number;
  text: string;
  encounterEffect: string;
  subroutines: IceSubroutine[];
  strength: number;
  iceType: IceType[];
  iceSubTypes: IceSubType[];
  imageCode: string;
}

export interface IceSubroutine {
  etr?: EndRun;
  trace?: Trace;
  damage?: DamageType;
  clicks?: number;
  trash?: TrashType;
  runner?: CreditChange;
  corp?: CreditChange;
  purge?: boolean;
  tags?: number;
}

export interface DamageType {
  netDamage: number;
  meatDamage: number;
  coreDamage: number;
}

export interface EndRun {
  conditional: boolean;
  requiresTag: boolean;
}

export interface Trace {
  value: number;
  effect?: IceSubroutine;
}

export interface TrashType {
  program: number;
  hardware: number;
  resource: number;
}

export interface CreditChange {
  gain: number;
  loss: number;
}
