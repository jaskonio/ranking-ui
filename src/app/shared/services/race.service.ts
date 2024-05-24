import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, from, map, Observable, of, switchMap, combineLatest } from 'rxjs';
import {ConlumnsDefinition, ICrudService} from '../interfaces/interfaces'
import { environment } from '../../../environments/environment';
import { RaceResponse } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class RaceService implements ICrudService{
  baseUrl: string = environment.apiUrlBase
  enpoint: string = 'raceinfo/'
  url: string = this.baseUrl + this.enpoint

  constructor(private http: HttpClient) {
  }

  definition_cdolumns: ConlumnsDefinition[] = [
    {
      "key": "id",
      "value": "ID",
      "order": 99,
      "sortable": true,
      "visible": false,
      "foreign_key": true
    },
    {
      "key": "name",
      "value": "Nombre",
      "order": 1,
      "sortable": true,
      "activeSortable": true,
      "supportFilter": true
    },
    {
      "key": "url",
      "value": "URL",
      "order": 2,
      "sortable": true,
      "supportFilter": true
    },
    {
      "key": "platform",
      "value": "Plataforma",
      "order": 3,
      "sortable": true,
      "supportFilter": true
    },
    {
      "key": "processed",
      "value": "Processado",
      "order": 4,
      "sortable": true,
      "type": "bool"
    },
  ]

  get_data(): Observable<RaceResponse[]> {
    return this.http.get(this.url)
    .pipe(
      map((response: any) => {return response['data']}),
      catchError((err, caught) => {
        console.log('API Error: ' + JSON.stringify(err));
        throw new Error(err)
      })
    );
  }

  get_definition_columns(): Observable<ConlumnsDefinition[]> {
    console.log(this.definition_cdolumns)
    return from([this.definition_cdolumns])
  }

  save_item(newItem:any) {
    return this.http.post(this.url, newItem)
    .pipe(
      map((response: any) => {return response['data']}),
      catchError((err, caught) => {
        console.log('API Error: ' + JSON.stringify(err));
        throw new Error(err)
      })
    );
  }

  update_item(newItem:any) {
    return this.http.put(this.url + newItem.id, newItem)
    .pipe(
      map((response: any) => {return response['data']}),
      catchError((err, caught) => {
        console.log('API Error: ' + JSON.stringify(err));
        throw new Error(err)
      })
    );
  }

  delete_item(item:any) {
    return this.http.delete(this.url + item.id)
    .pipe(
      map(x => x as boolean),
      catchError((err, caught) => {
        console.log('API Error: ' + JSON.stringify(err));
        throw new Error(err)
      })
    )
  }

  delete_items(items:any[]) {
    let observer = of(items)

    return observer.pipe(
      switchMap((persons) => {
        const obs$: Observable<boolean>[] = []
        persons.map((person => {
          obs$.push(this.delete_item(person))
        }))

        return combineLatest(obs$)
      })
    )
  }

  process_race(item:any) {
    return this.http.get(this.url + 'run_process/' + item.id)
    .pipe(
      map((response: any) => {return true}),
      catchError((err, caught) => {
        console.log('API Error: ' + JSON.stringify(err));
        throw new Error(err)
      })
    );
  }
}
