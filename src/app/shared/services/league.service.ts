import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { League, LeagueRawViewResponse } from './interfaces';
import { environment } from '../../../environments/environment';
import { catchError, map, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LeagueService {
  baseUrl: string = environment.apiUrlBase
  enpoint: string = 'leagues/'
  url: string = this.baseUrl + this.enpoint

  constructor(private http: HttpClient) {

  }

  getByRawById(league_id: string) {
    return this.http.get<LeagueRawViewResponse>(this.url + league_id)
  }

  save_item(league:any) {
    return this.http.post(this.url, league)
    .pipe(
      map((response: any) => {return response['data']}),
      catchError((err, caught) => {
        console.log('API Error: ' + JSON.stringify(err));
        throw new Error(err)
      })
    );
  }

  getAll(): Observable<League[]> {
    return this.http.get(this.url)
    .pipe(
      map((response: any) => {return response['data']}),
      catchError((err, caught) => {
        console.log('API Error: ' + JSON.stringify(err));
        throw new Error(err)
      })
    );
  }
}
