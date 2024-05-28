import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SeassonInfoResponse } from './interfaces';
import { environment } from '../../../environments/environment';
import { catchError, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SeasonService {
  baseUrl: string = environment.apiUrlBase
  enpoint: string = 'season'
  url: string = this.baseUrl + this.enpoint

  constructor(private http: HttpClient) {

  }

  getAllSeasonInfo() {
    return this.http.get<SeassonInfoResponse>(this.url);
  }

  save(item:any) {
    return this.http.post(this.url, item)
      .pipe(
        map((response: any) => {return response['data']}),
        catchError((err, caught) => {
        console.log('API Error: ' + JSON.stringify(err));
        throw new Error(err)
      })
    );
  }

  selectedSeasson() {

  }
}
