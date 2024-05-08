import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LeagueRawViewResponse } from './interfaces';


@Injectable({
  providedIn: 'root'
})
export class LeagueService {

  constructor(private http: HttpClient) {

  }

  getByRawById(league_id: string) {
    return this.http.get<LeagueRawViewResponse>('http://127.0.0.1:8000/leagues/raw/' + league_id)
  }
}
