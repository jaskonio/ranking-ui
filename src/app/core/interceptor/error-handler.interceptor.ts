import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {

  return next(req).pipe(
    catchError((err: HttpErrorResponse, caught) => {
      console.error('API Error: ' + JSON.stringify(err));
      throw new Error(err.message)
    })
  )
};
