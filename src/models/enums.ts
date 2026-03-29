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
