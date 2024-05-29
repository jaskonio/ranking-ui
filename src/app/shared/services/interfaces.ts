export interface SeasonInfoView {
  id: number;
  name: string;
  order: number
  league_ids: string[];
}

export interface LeagueInfoView {
  id: number;
  name: string;
  order: number;
  resultId: number;
}

export interface RunnerRankingModel {
  person_id: string;
  first_name: string;
  last_name: string;
  nationality: string;
  gender: string;
  photo_url: string;
  dorsal: number;
  category: string;
  is_disqualified: boolean;
  position: number;
  points: number;
  pos_last_race: number;
  top_five: number;
  participations: number;
  best_position: string;
  last_position_race: number;
  best_avegare_peace: string;
  best_position_real: number;
}

export interface RankingModel {
  id: number;
  order: string;
  data: RunnerRankingModel[];
}

export interface LeagueRawView {
  id: number;
  name: string;
  order: number;
  race: any;
  runner_participants: any;
  ranking_latest: any;
  history_ranking: RankingModel[];
}

export interface SeassonInfoResponse {
  status: string;
  message: string;
  data: SeasonInfoView[]
}


export interface LeagueRawViewResponse {
  status: string;
  message: string;
  data: LeagueRawView
}

// Persons
export interface PersonResponse {
  id: string;
  first_name: string;
  last_name: string;
  gender: string;
  photo_url: string;
}

export interface RunnerParticipant extends PersonResponse{
  person_id?: string;
  dorsal?: number;
  disqualified_order_race?: number;
}

export interface NotificationEvent {
  severity: string;
  summary: string;
  detail: string;
  life: number;
}

export interface RaceResponse {
  id: string;
  name: string;
  url: string;
  platform: string;
  processed: boolean;
  race_data_id: boolean
}

export interface RaceLeague {
  name: string;
  order: number;
  runner_ids?: string[];
  race_info_id: string;
}

export interface League {
  id: string;
  name: string;
  order: number;
  races: RaceLeague[];
  runner_participants: RunnerParticipant[];
  ranking_id: string;
  history_ranking_ids: string[];
}
