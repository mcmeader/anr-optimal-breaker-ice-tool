//Api interfaces
export interface AllCardResponse {
  data: ApiCard[];
  imageUrlTemplate: string;
  last_updated: Date;
  success: boolean;
  total: number;
  version_number: string;
}

export interface ApiCard {
  code: string;
  cost?: number | null;
  deck_limit: number;
  faction_code: string | RunnerFaction | CorpFaction;
  faction_cost: number;
  illustrator?: string;
  keywords?: string;
  memory_cost?: number;
  pack_code: string;
  position: number;
  quantity: number;
  side_code: string | Side;
  stripped_text?: string;
  stripped_title: string;
  text?: string;
  strength?: number | null;
  type_code: string | RelevantCardTypes;
  uniqueness: boolean;
}
//

//Parsed interfaces
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
//

export interface IceInteraction {
  breakerName: string;
  iceName: string;
  costToBreak: BreakCost;
  smartBreakCost: BreakCost;
  canFullBreak: boolean;
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

export interface EndRun {
  conditional: boolean;
  requiresTag: boolean;
}

export interface CreditChange {
  gain: number;
  loss: number;
}

export interface Trace {
  value: number;
  effect?: IceSubroutine;
}

export interface DamageType {
  netDamage: number;
  meatDamage: number;
  coreDamage: number;
}

export interface TrashType {
  program: number;
  hardware: number;
  resource: number;
}

export interface BreakCost {
  credits: Break;
  damage?: DamageType;
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
  subs: number;
  stealth: boolean;
  usableTimes: number;
}

export enum Format {
  STANDARD = 'standard',
  STARTUP = 'startup',
  ETERNAL = 'eternal',
}

export enum RelevantCardTypes {
  PROGRAM = 'program',
  BREAKER = 'icebreaker',
  ICE = 'ice',
}

export enum BreakerType {
  DECODER = 'decoder',
  FRACTER = 'fracter',
  KILLER = 'killer',
  AI = 'ai',
  OTHER = 'other',
}

export enum IceType {
  BARRIER = 'barrier',
  CODE_GATE = 'code_gate',
  SENTRY = 'sentry',
  NO_MAIN_TYPE = 'none',
}

export enum IceSubType {
  TRACER = 'tracer',
  PSI = 'psi',
  AP = 'ap',
  BIOROID = 'bioroid',
  DESTROYER = 'destroyer',
  AMBUSH = 'ambush',
  OBSERVER = 'observer',
  HARMONIC = 'harmonic',
  NEXT = 'next',
  DEFLECTOR = 'deflector',
  LIABILITY = 'liability',
  MORPH = 'morph',
  ADVERTISEMENT = 'advertisement',
  TRAP = 'trap',
  EXPENDABLE = 'expendable',
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

export interface BannedList {
  id: number;
  date_creation: Date;
  date_update: Date;
  code: string;
  name: string;
  active: boolean;
  date_start: Date;
  cards: {
    string: { deck_limit?: number; global_penalty?: number };
  };
}

export interface ParsedBanList {
  [Format.ETERNAL]: string[];
  [Format.STANDARD]: string[];
  [Format.STARTUP]: string[];
}

export interface CycleDataResponse {
  data: CycleData[];
  total: number;
  success: boolean;
  version_number: string;
  last_updated: Date;
}

export interface CycleData {
  code: string;
  name: string;
  position: number;
  size: number;
  rotated: boolean;
}

export interface PackDataResponse {
  data: PackData[];
  total: number;
  success: boolean;
  version_number: string;
  last_updated: Date;
}

export interface PackData {
  code: string;
  cycle_code: string;
  date_release: Date;
  name: string;
  position: number;
  size: number;
  ffg_id: number | null;
}

//"imageUrlTemplate": "https://card-images.netrunnerdb.com/v2/large/{code}.jpg",
