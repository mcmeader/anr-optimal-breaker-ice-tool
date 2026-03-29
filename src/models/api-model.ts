import { CorpFaction, RelevantCardTypes, RunnerFaction, Side } from './cards.model';

export interface AllCardResponse {
  data: ApiCard[];
  imageUrlTemplate: string;
  last_updated: Date;
  success: boolean;
  total: number;
  version_number: string;
}

export interface CycleDataResponse {
  data: CycleData[];
  total: number;
  success: boolean;
  version_number: string;
  last_updated: Date;
}

export interface PackDataResponse {
  data: PackData[];
  total: number;
  success: boolean;
  version_number: string;
  last_updated: Date;
}

export interface BannedListResponse {
  id: number;
  date_creation: Date;
  date_update: Date;
  code: string;
  name: string;
  active: boolean;
  date_start: Date;
  cards: BannedListCards;
}

export interface BannedListCards {
  string: { deck_limit?: number; global_penalty?: number };
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

export interface CycleData {
  code: string;
  name: string;
  position: number;
  size: number;
  rotated: boolean;
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
