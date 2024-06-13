import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { League, LeagueRaw } from './interfaces';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, catchError, map, Observable, throwError, zip } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LeagueService {
  baseUrl: string = environment.apiUrlBase
  enpoint: string = 'leagues/'
  url: string = this.baseUrl + this.enpoint
  urlRaw: string = this.url + 'raw/'

  private allLeagues = new BehaviorSubject<League[]|null>(null);
  public allLeagues$ = this.allLeagues.asObservable();

  constructor(private http: HttpClient) {
    this.reloadData();
  }

  getRawById(league_id: string): Observable<LeagueRaw> {
    return this.http.get(this.urlRaw + league_id)
    .pipe(
      map((response: any) => {return response['data']}),
      catchError(this.handleError)
    );
  }

  getByid(league_id: string): League | null {
    let leagues = this.allLeagues.value

    if (leagues == null) {
      return null;
    }

    for (let index = 0; index < leagues.length; index++) {
      const element = leagues[index];
      if (element.id == league_id) {
        return element
      }
    }

    return null
  }

  save_item(league:any) {
    return this.http.post(this.url, league)
    .pipe(
      map((response: any) => {return response['data']}),
      catchError(this.handleError)
    );
  }

  update(league:any) {
    return this.http.put(this.url + league['id'], league)
    .pipe(
      map((response: any) => {return response['data']}),
      catchError(this.handleError)
    );
  }

  remove(league:any) {
    return this.http.delete(this.url + league['id'], league)
    .pipe(
      map((response: any) => {return response['data']}),
      catchError(this.handleError)
    );
  }

  getAll(): Observable<League[]> {
    return this.http.get(this.url)
    .pipe(
      map((response: any) => {return response['data']}),
      catchError(this.handleError)
    );
  }

  reloadData() {
    this.getAll().subscribe(data => {
      this.allLeagues.next(data);
    })
  }

  process(league:League): Observable<League> {
    return this.http.get(this.url + 'run_process/' + league.id)
    .pipe(
      map((response: any) => {return response['data']}),
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('API Error: ', error);
    return throwError(() => new Error(error));
  }
}
