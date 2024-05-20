import { CanActivateFn } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../core/auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const guestTokenGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService)
  const authService = inject(AuthService)

  if (authService.isLoggedIn()) {
    return true
  }


  return authService.loginGuest().pipe(
      map(r => true)
    )
};
