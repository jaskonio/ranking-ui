import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { LeagueComponent } from './page/league.component';

export const routes: Routes = [
  {
    path: '', component: AppLayoutComponent,
    children: [
      { path: 'ligas', component: LeagueComponent }
    ]
  }
];
