import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConlumnsDefinition } from '../components/table/interfaces';
import { SeassonInfoResponse } from './interfaces';


@Injectable({
  providedIn: 'root'
})
export class SeasonService {

  constructor(private http: HttpClient) {

  }

  getAllSeasonInfo() {
    return this.http.get<SeassonInfoResponse>('http://127.0.0.1:8000/season/');
  }
}
