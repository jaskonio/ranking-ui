import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService)

  let token = authService.getToken()

  if (token == "" || token == null) {
    return next(req);
  }

  const cloneReq = req.clone({
    headers: req.headers.set("Authorization", "Bearer " + token)
  })

  return next(cloneReq)
};

export const loginAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService)
  const route = inject(Router)

  if (!authService.isLoggedIn()){
    authService.logout()
    route.navigateByUrl('/')
  }

  return next(req)
};
