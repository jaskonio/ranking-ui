import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SeassonInfoResponse, SeasonInfoView } from './interfaces';
import { environment } from '../../../environments/environment';
import { Observable, Subject, catchError, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SeasonService {
  baseUrl: string = environment.apiUrlBase
  enpoint: string = 'season'
  url: string = this.baseUrl + this.enpoint

  private allSeasson = new Subject<SeasonInfoView[]>();
  public allSeasson$ = this.allSeasson.asObservable();

  private seassonSelected = new Subject<SeasonInfoView>();
  public seassonSelected$ = this.seassonSelected.asObservable()

  constructor(private http: HttpClient) {
  }

  getAllSeasonInfo() {
    return this.http.get<SeassonInfoResponse>(this.url);
  }

  save(item:any): Observable<SeasonInfoView[]>{
    return this.http.post(this.url, item)
      .pipe(
        map((response: any) => {return response['data']}),
        catchError((err, caught) => {
        console.log('API Error: ' + JSON.stringify(err));
        throw new Error(err)
      })
    );
  }

  selectedSeasson(item:SeasonInfoView) {
    this.seassonSelected.next(item)
  }

  reloadData() {
    this.http.get(this.url)
      .pipe(
       map((response: any) => {return response['data']}),
        catchError((err, caught) => {
          console.log('API Error: ' + JSON.stringify(err));
          throw new Error(err)
        })
    ).subscribe(data=> {
      this.allSeasson.next(data)
    });
  }
}
