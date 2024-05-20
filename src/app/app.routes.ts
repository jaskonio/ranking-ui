import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { RankingComponent } from './page/ranking/ranking.component';
import { RankingListComponent } from './page/ranking-list/ranking-list.component';
import { PersonsComponent } from './page/persons/persons.component';
import { AppAdminLayoutComponent } from './layout/admin/app.admin.layout.component';
import { NotFoundComponent } from './page/not-found/not-found.component';
import { guestTokenGuard } from './guards/guest.token.guard';
import { adminAuthGuard, loginAuthGuard } from './guards/auth.guard';
import { LoginComponent } from './page/admin/login/login.component';


export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: '', component: RankingListComponent },
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [loginAuthGuard]
      },
      { path: 'ranking/:idRanking', component: RankingComponent },
    ],
    canActivate: [guestTokenGuard],
    data: {
      role: 'view'
    }
  },
  {
    path: 'admin', component: AppAdminLayoutComponent,
    children: [
      { path: 'persons', component: PersonsComponent },
      { path: '**', component: NotFoundComponent }
    ],
    canActivate: [adminAuthGuard],
    data: {
      role: 'admin'
    }
  },

  {
    path: '**',
    component: NotFoundComponent
  }
];
