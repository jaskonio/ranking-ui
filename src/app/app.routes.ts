import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { RankingComponent } from './page/ranking/ranking.component';
import { RankingListComponent } from './page/ranking-list/ranking-list.component';

export const routes: Routes = [
  {
    path: '', component: AppLayoutComponent,
    children: [
      { path: '', component: RankingListComponent },
      { path: 'ranking/:idRanking', component: RankingComponent }
    ]
  }
];
