import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SeassonInfoResponse } from './interfaces';
import { environment } from '../../../environments/environment';


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
}
