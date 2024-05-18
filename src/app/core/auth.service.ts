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
  private token: string | null = null;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService) { }

  login(username: string, password: string): Observable<string> {
    return this.http.post<JWT_Token>(this.apiUrl + "/", { user_name: username, password: password })
      .pipe(
        tap(response => this.setSession(response)),
        map(response => response.access_token),
        tap(access_token => this.token = access_token),
        shareReplay(1)
      );
  }

  getGuestToken(): Observable<string> {
    return this.http.get<JWT_Token>(`${this.apiUrl}/guest`)
      .pipe(
        tap(response => this.setSession(response)),
        map(response=> response.access_token),
        tap(access_token => this.token = access_token),
        shareReplay(1)
      )
  }

  getToken(): string | null {
    return this.token
  }

  isAuthenticated(): boolean {
    return this.token !== null;
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  private setSession(jwt: JWT_Token) {
    this.cookieService.set('id_token', jwt.access_token);
    this.cookieService.set("expires_at", jwt.expires_in.toString());
  }

  public isLoggedIn() {
    let nowDate = Date.now()
    return nowDate < this.getExpiration() * 1000;
  }

  private getExpiration(): number {
    const expiration = this.cookieService.get("expires_at");
    return Number(expiration);
  }

  public scheduleTokenRenewal() {
    if (this.token != null && this.token != "") {
      const now = Date.now();
      const timeout = ((this.getExpiration() * 1000) - now) - 60000; // 1min

      if (timeout > 0 ) {
        setTimeout(() => this.renewGuestToken(), timeout);
      }
      else {
        this.renewGuestToken();
      }
    }
  }

  private renewGuestToken(): void {
    this.getGuestToken().subscribe( result => this.scheduleTokenRenewal());
  }
}
