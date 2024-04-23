import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConlumnsDefinition } from '../components/table/interfaces';
import { SeasonInfoView } from './interfaces';


@Injectable({
  providedIn: 'root'
})
export class SeasonService {

  constructor(private http: HttpClient) {

  }

  getAllSeasonInfo() {
    return this.http.get<SeasonInfoView[]>('/assets/data/season/data.json');
  }
}
