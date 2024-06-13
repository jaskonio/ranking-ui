// League
export interface RequestLeagueRace {
  order: number;
  race_info_id: string;
}

export interface RequestLeagueRunnerParticipant {
  person_id?: string;
  dorsal?: number;
  category?: string;
  disqualified_order_race?: number;
  unique_dorsal?: boolean;
}

export interface RequestLeague {
  id: string;
  name: string;
  order: number;
  races?: RequestLeagueRace[];
  runner_participants?: RequestLeagueRunnerParticipant[];
}
