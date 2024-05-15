import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PersonRequest, PersonResponse } from './interfaces';
import { catchError, from, map, Observable, of, switchMap, combineLatest } from 'rxjs';
import {ConlumnsDefinition, ICrudService} from '../interfaces/interfaces'

@Injectable({
  providedIn: 'root'
})
export class PersonService implements ICrudService{
  baseUrl: string = "http://localhost:8000/"
  enpoint: string = 'persons'
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
      "key": "photo_url",
      "value": "Foto",
      "order": 1
    },
    {
      "key": "first_name",
      "value": "Nombre",
      "order": 2,
      "sortable": true,
      "supportImageKey": "photo_url",
      "activeSortable": true,
      "supportFilter": true
    },
    {
      "key": "last_name",
      "value": "Apellido",
      "order": 3,
      "sortable": true,
      "supportFilter": true
    },
    {
      "key": "gender",
      "value": "Genero",
      "order": 4,
      "sortable": true
    }
  ]

  get_data(): Observable<PersonResponse[]> {
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

  save_item(newPerson:any) {
    return this.http.post(this.url, newPerson)
    .pipe(
      map((response: any) => {return response['data']}),
      catchError((err, caught) => {
        console.log('API Error: ' + JSON.stringify(err));
        throw new Error(err)
      })
    );
  }

  update_item(newPerson:any) {
    return this.http.put(this.url + '/' + newPerson.id, newPerson)
    .pipe(
      map((response: any) => {return response['data']}),
      catchError((err, caught) => {
        console.log('API Error: ' + JSON.stringify(err));
        throw new Error(err)
      })
    );
  }

  delete_item(person:any) {
    return this.http.delete(this.url + '/' + person.id)
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
}
