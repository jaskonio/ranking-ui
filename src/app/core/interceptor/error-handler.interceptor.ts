import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService)
  const route = inject(Router)

  return next(req).pipe(
    catchError((error: HttpErrorResponse, caught) => {
      console.log("errorHandlerInterceptor")
      console.error('API Error: ' + JSON.stringify(error));

      if (error.status == 403) {
        authService.logout();
        route.navigateByUrl('/');
      }

      throw error;
    })
  )
};
