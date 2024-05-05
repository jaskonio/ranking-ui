import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PersonRequest, PersonResponse } from './interfaces';
import { catchError, map, Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PersonService {
  baseUrl: string = "http://localhost:8000/"
  enpoint: string = 'persons'
  url: string = this.baseUrl + this.enpoint

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<PersonResponse[]> {
    return this.http.get(this.url)
    .pipe(
      map((response: any) => {return response['data']}),
      catchError((err, caught) => {
        console.log('API Error: ' + JSON.stringify(err));
        return caught
      })
    );
  }

  add(newPerson:any) {
    return this.http.post(this.url, newPerson)
    .pipe(
      map((response: any) => {return response['data']}),
      catchError((err, caught) => {
        console.log('API Error: ' + JSON.stringify(err));
        return caught
      })
    );
  }
}
