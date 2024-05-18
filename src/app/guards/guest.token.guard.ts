import { CanActivateFn } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../core/auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const guestTokenGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService)
  const authService = inject(AuthService)

  let token = cookieService.get('id_token') == "" ? authService.getToken() : cookieService.get('id_token')

  if (token == "" || token == null) {
    return authService.getGuestToken().pipe(
      map(r => true)
    )
  }

  if (authService.isLoggedOut()) {
    return authService.getGuestToken().pipe(
      map(r => true)
    )
  }

  return true
};
