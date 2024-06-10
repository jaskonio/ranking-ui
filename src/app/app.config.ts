import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { NotificationService } from './shared/services/notification.service';
import { errorHandlerInterceptor } from './core/interceptor/error-handler.interceptor';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './core/auth.service';
import { authInterceptor, loginAuthInterceptor } from './core/interceptor/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors(
      [authInterceptor, errorHandlerInterceptor]
    )),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimations(),
    MessageService,
    NotificationService,
    CookieService,
    AuthService
    ]
};
