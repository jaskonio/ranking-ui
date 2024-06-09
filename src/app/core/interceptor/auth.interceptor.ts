import { HttpErrorResponse, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('authInterceptor')

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
  console.log('loginAuthInterceptor')

  const authService = inject(AuthService)
  const route = inject(Router)

  if (!authService.isLoggedIn()){
    authService.logout()
    route.navigateByUrl('/login')
  }

  return next(req)
};
