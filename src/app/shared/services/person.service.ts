import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Person } from './interfaces';
import { catchError, from, map, Observable, of, switchMap, combineLatest, BehaviorSubject } from 'rxjs';
import {ConlumnsDefinition, ICrudService} from '../interfaces/interfaces'
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonService implements ICrudService{
  baseUrl: string = environment.apiUrlBase
  enpoint: string = 'persons/'
  url: string = this.baseUrl + this.enpoint

  
  private allPersons = new BehaviorSubject<Person[]|null>(null);
  public allPersons$ = this.allPersons.asObservable();

  constructor(private http: HttpClient) {
    this.reload_data()
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

  get_data(): Observable<Person[] | null> {
    return this.allPersons$
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
    return this.http.put(this.url + newPerson.id, newPerson)
    .pipe(
      map((response: any) => {return response['data']}),
      catchError((err, caught) => {
        console.log('API Error: ' + JSON.stringify(err));
        throw new Error(err)
      })
    );
  }

  delete_item(person:any) {
    return this.http.delete(this.url + person.id)
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

  reload_data() {
    this.__update_data().subscribe(data => {
      this.allPersons.next(data);
    })
  }
  
  __update_data(): Observable<Person[]> {
    return this.http.get(this.url)
    .pipe(
      map((response: any) => {return response['data']}),
      catchError((err, caught) => {
        console.log('API Error: ' + JSON.stringify(err));
        throw new Error(err)
      })
    );
  }
}
