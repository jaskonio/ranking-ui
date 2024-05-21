import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, shareReplay, tap, timeout } from 'rxjs';
import { environment } from '../../environments/environment';
import { JWT_Token } from '../shared/interfaces/interfaces';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl: string = environment.apiUrlBase

  private apiUrl = this.baseUrl + 'token';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService) { }

  loginGuest(): Observable<string> {
    return this.loginAndSabeToken(`${this.apiUrl}/guest`, null)
  }

  login(username: string, password: string): Observable<string> {
    let body = { user_name: username, password: password }
    return this.loginAndSabeToken(this.apiUrl, body)
  }

  logout() {
    this.cookieService.set('id_token', '');
    this.cookieService.set("expires_at", '');
    this.cookieService.set("roles", '');
  }

  isLoggedIn() {
    if (!this.isAuthenticated()) {
      return false
    }

    let nowDate = Date.now()
    return nowDate < this.getExpiration() * 1000;
  }

  getToken() {
    return this.cookieService.get('id_token')
  }

  private loginAndSabeToken(url: string, body: any): Observable<string> {
    return this.http.post<JWT_Token>(url, body)
      .pipe(
        map(response => {
          if (response.success) {
            return response
          }

          throw Error("Failed login")
        }),
        tap(response => this.setSession(response)),
        map(response => response.access_token),
        shareReplay(1)
      );
  }

  private setSession(jwt: JWT_Token) {
    this.cookieService.set('id_token', jwt.access_token);
    this.cookieService.set("expires_at", jwt.expires_in.toString());
    this.cookieService.set("roles", jwt.roles.toString());
  }

  private getExpiration(): number {
    const expiration = this.cookieService.get("expires_at");

    return Number(expiration);
  }

  private isAuthenticated(): boolean {
    let token = this.getToken()

    if (token == "" || token == null) {
      return false
    }

    return true
  }
}
