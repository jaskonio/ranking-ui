import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SeasonInfoView } from './interfaces';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SeasonService {
  baseUrl: string = environment.apiUrlBase
  enpoint: string = 'season/'
  url: string = this.baseUrl + this.enpoint

  private allSeasson = new BehaviorSubject<SeasonInfoView[]|null>(null);
  public allSeasson$ = this.allSeasson.asObservable();

  private seassonSelected = new BehaviorSubject<SeasonInfoView|null>(null);
  public seassonSelected$ = this.seassonSelected.asObservable()

  constructor(private http: HttpClient
  ) {
    this.reloadData();
  }

  getAllSeasonInfo(): Observable<SeasonInfoView[]> {
    return this.http.get(this.url)
          .pipe(
            map((response: any) => {return response['data']}),
            catchError(this.handleError),
        );
  }

  save(item:any): Observable<SeasonInfoView[]>{
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

  selectedSeasson(item:SeasonInfoView) {
    this.seassonSelected.next(item)
  }

  reloadData() {
    this.getAllSeasonInfo().subscribe(data=> {
      this.allSeasson.next(data)
    });
  }

  private handleError(error: any) {
    console.error('API Error: ', error);
    return throwError(() => new Error(error));
  }
}
