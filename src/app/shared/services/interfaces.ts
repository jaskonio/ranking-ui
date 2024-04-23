export interface SeasonInfoView {
  id: number;
  name: string;
  leagues: LeagueInfoView[];
}

export interface LeagueInfoView {
  id: number;
  name: string;
  order: number;
  resultId: number;
}
