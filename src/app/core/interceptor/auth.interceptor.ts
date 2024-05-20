import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../auth.service';


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
