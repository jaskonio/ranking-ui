import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Season, SeasonRaw } from './interfaces';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SeasonService {
  baseUrl: string = environment.apiUrlBase
  enpoint: string = 'season/'
  url: string = this.baseUrl + this.enpoint

  private allSeasson = new BehaviorSubject<Season[]|null>(null);
  public allSeasson$ = this.allSeasson.asObservable();

  private seassonSelected = new BehaviorSubject<Season|null>(null);
  public seassonSelected$ = this.seassonSelected.asObservable()

  constructor(private http: HttpClient
  ) {
    this.reloadData();
  }

  getAll(): Observable<Season[]> {
    return this.http.get(this.url)
          .pipe(
            map((response: any) => {return response['data']}),
            catchError(this.handleError),
        );
  }
  getAllRaw(): Observable<SeasonRaw[]> {
    return this.http.get(this.url + 'raw')
          .pipe(
            map((response: any) => {return response['data']}),
            catchError(this.handleError),
        );
  }

  save(item:any): Observable<Season[]>{
    return this.http.post(this.url, item)
      .pipe(
        map((response: any) => {return response['data']}),
        catchError(this.handleError),
      );
  }

  update(item:any) {
    return this.http.put(this.url + item['id'], item)
    .pipe(
      map((response: any) => {return response['data']}),
      catchError(this.handleError)
    );
  }

  remove(item:any) {
    return this.http.delete(this.url + item['id'])
    .pipe(
      map((response: any) => {return response}),
      catchError(this.handleError)
    );
  }

  selectedSeason(item:Season) {
    this.seassonSelected.next(item)
  }

  reloadData() {
    this.getAll().subscribe(data=> {
      this.allSeasson.next(data)
    });
  }

  private handleError(error: any) {
    console.error('API Error: ', error);
    return throwError(() => new Error(error));
  }
}
