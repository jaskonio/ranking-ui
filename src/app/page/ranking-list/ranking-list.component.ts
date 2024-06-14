import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Season } from '../../shared/services/interfaces';
import { SeasonService } from '../../shared/services/seasson.service';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { LeagueService } from '../../shared/services/league.service';

@Component({
  selector: 'app-ranking-list',
  standalone: true,
  imports: [],
  templateUrl: './ranking-list.component.html',
  styleUrl: './ranking-list.component.scss'
})
export class RankingListComponent {
  seasons: Season[] = [];

  private destroy$ = new Subject<void>();

  constructor(private router: Router,
    private seasonService: SeasonService
  ){
    this.seasonService.allSeasson$.pipe(takeUntil(this.destroy$)).subscribe(seasonsRaw => {
      console.log("allSeasson$");
      this.seasons = seasonsRaw ?? []
    });
  }

  goToRanking(league_id: string) {
    this.router.navigateByUrl("/ranking/" + league_id)
  }
}
