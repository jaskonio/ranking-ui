import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConlumnsDefinition } from '../components/table/interfaces';
import { LeagueInfoView } from './interfaces';



@Injectable({
  providedIn: 'root'
})
export class LeagueService {

  constructor(private http: HttpClient) {

  }

  getAllLeagueInfo() {
    return this.http.get<LeagueInfoView[]>('/assets/data/ranking/leagues.json')
  }
}
