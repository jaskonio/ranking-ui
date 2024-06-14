// Person
export interface Person {
  id: string;
  first_name: string;
  last_name: string;
  gender: string;
  photo_url: string;
}

// Race info
export interface Race {
  id: string;
  name: string;
  url?: string;
  platform?: string;
  processed?: boolean;
}

export interface RaceRaw {
  id: string;
  name: string;
  url: string;
  platform: string;
  processed: boolean;
  race_data?: RaceDataRaw;
}

// Race results data
export interface RaceData {
  id: string;
  runner_ids: string[];
}

export interface RaceDataRaw {
  id: string;
  runners: RunnerRaceData[];
}

export interface RunnerRaceData extends Person {
  person_id: string;
  dorsal: number;
  club: string;
  category: string;
  finished: boolean

  official_time: string;
  official_pos: number;
  official_avg_time: string;
  official_cat_pos: number;
  official_gen_pos: number;

  real_time: string;
  real_pos: number;
  real_avg_time: string;
  real_cat_pos: number;
  real_gen_pos: number;
}

// League
export interface League {
  id: string;
  name: string;
  order: number;
  races?: LeagueRace[];
  runner_participants?: LeagueRunnerParticipant[];
  ranking_id?: string;
  history_ranking_ids?: string[];
}

export interface LeagueRace extends Race {
  order: number;
}

export interface LeagueRunnerParticipant extends Person {
  person_id: string;
  dorsal?: number;
  category?: string;
  disqualified_order_race?: number;
  unique_dorsal?: boolean;
}

export interface LeagueRanking {
  id: string;
  order: string;
  data: LeagueRankingRunner[];
}

export interface LeagueRankingRunner extends LeagueRunnerParticipant{
  is_disqualified: boolean
  position: number;
  points: number
  pos_last_race: number;
  top_five: number;
  participations: number;
  best_position: string;
  last_position_race: number;
  best_avegare_peace: string;
  best_position_real: number;
}

// Season
export interface Season {
  id: string;
  name: string;
  order: number
  league_ids: string[];
}

export interface SeasonRaw {
  id: string;
  name: string;
  order: number
  leagues: League[];
}

// Notifications
export interface NotificationEvent {
  severity: string;
  summary: string;
  detail: string;
  life: number;
}