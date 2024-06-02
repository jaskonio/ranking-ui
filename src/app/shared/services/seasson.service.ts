import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SeassonInfoResponse, SeasonInfoView } from './interfaces';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { LeagueService } from './league.service';


@Injectable({
  providedIn: 'root'
})
export class SeasonService {
  baseUrl: string = environment.apiUrlBase
  enpoint: string = 'season/'
  url: string = this.baseUrl + this.enpoint

  private allSeasson = new BehaviorSubject<SeasonInfoView[]>([]);
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
