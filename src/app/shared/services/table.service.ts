import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConlumnsDefinition } from '../components/table/interfaces';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  constructor(private http: HttpClient) {

  }

  getData() {
    return this.http.get('/assets/data/ranking/data.json')
  }

  getConfig() {
    return this.http.get<ConlumnsDefinition[]>('/assets/data/ranking/config.json')
  }
}
