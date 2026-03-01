export interface AllCardResponse {
  data: Card[];
  imageUrlTemplate: string;
  last_updated: Date;
  success: boolean;
  total: number;
  version_number: string;
}

export interface Card {
  code: number;
  cost: number;
  deck_limit: number;
  faction_code: RunnerFaction | CorpFaction;
  faction_cost: number;
  illustrator: string;
  keywords: string;
  memory_cost: number;
  pack_code: string;
  position: number;
  quantity: 3;
  side_code: Side;
  stripped_text: string;
  stripped_title: string;
  type_code: RelevantCardTypes;
  uniqueness: boolean;
  additionalFields: {
    parsedSubs: string[];
    parsedInterface: number;
    parsedBoost: number;
  };
}

export enum RelevantCardTypes {
  PROGRAM = 'program',
  BREAKER = 'Icebreaker',
  ICE = 'ice',
}

export enum BreakerType {
  DECODER = 'Decoder',
  FRACTER = 'Fracter',
  KILLER = 'Killer',
  AI = 'AI',
  OTHER = 'other',
}

export enum IceType {
  BARRIER = 'barrier',
  CODE_GATE = 'code_gate',
  SENTRY = 'sentry',
  NO_MAIN_TYPE = 'none',
}

export enum Side {
  RUNNER = 'runner',
  CORP = 'corp',
}

export enum RunnerFaction {
  ANARCH = 'anarch',
  CRIMINAL = 'criminal',
  SHAPER = 'shaper',
  NEUTRAL = 'neutral-runner',
  SUNNY = 'sunny',
  APEX = 'apex',
  ADAM = 'adam',
  THR = 'thr',
}

export enum CorpFaction {
  HB = 'haas-bioroid',
  JINTEKI = 'jinteki',
  NBN = 'nbn',
  WEYLAND = 'weyland-consortium',
  NEUTRAL = 'neutral-corp',
}
