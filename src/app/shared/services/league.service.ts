import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { League, LeagueRawViewResponse } from './interfaces';
import { environment } from '../../../environments/environment';
import { catchError, map, Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LeagueService {
  baseUrl: string = environment.apiUrlBase
  enpoint: string = 'leagues/'
  url: string = this.baseUrl + this.enpoint

  private allLeagues = new Subject<League[]>();
  public allLeagues$ = this.allLeagues.asObservable();

  constructor(private http: HttpClient) {
    this.reloadData();
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

  update(league:any) {
    return this.http.put(this.url + league['id'], league)
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

  reloadData() {
    this.getAll().subscribe(data => {
      this.allLeagues.next(data);
    })
  }
}
