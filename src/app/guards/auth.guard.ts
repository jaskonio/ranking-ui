import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { of } from 'rxjs';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService)

  if (!authService.isLoggedIn()) {
    router.navigateByUrl('/login');
  }

  if (!authService.containRole(route.data['role'])) {
    router.navigateByUrl('/login');
  }

  return of(true)
};


export const loginAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService)

  if (authService.containRole(route.data['role'])) {
    router.navigateByUrl('/admin');
  } else {
    router.navigateByUrl('/admin');
  }

  return of(true)
};
