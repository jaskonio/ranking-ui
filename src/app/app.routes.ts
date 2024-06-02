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
import { RacesInfoComponent } from './page/races-info/races-info.component';
import { LeaguesComponent } from './page/leagues/leagues.component';
import { SeassonsComponent } from './page/seassons/seassons.component';


export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: '', component: RankingListComponent },
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
      { path: '', redirectTo: '/admin/persons', pathMatch: 'full' },
      { path: 'persons', component: PersonsComponent },
      { path: 'races-info', component: RacesInfoComponent},
      { path: 'seassons', component: SeassonsComponent},
      { path: 'leagues', component: LeaguesComponent},
      { path: '**', component: NotFoundComponent }
    ],
    canActivate: [adminAuthGuard],
    data: {
      role: 'admin'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginAuthGuard],
    data: {
      role: 'admin'
    }
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];
