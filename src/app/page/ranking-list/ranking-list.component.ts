import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SeasonInfoView, SeasonItem } from '../../shared/services/interfaces';
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
  seasons: SeasonItem[] = [];

  private destroy$ = new Subject<void>();

  constructor(private router: Router,
    private seasonService: SeasonService,
    public leagueService:LeagueService
  ){

    combineLatest([
      this.leagueService.allLeagues$,
      this.seasonService.allSeasson$
    ]).pipe(takeUntil(this.destroy$)).subscribe(([leagues, seasons]) => {
      console.log("allSeasson$");
      let allLeagues = leagues ?? []
      this.seasons =  []

      if (seasons == null) {
        return;
      }

      this.seasons = seasons.map(season => {
        let item: SeasonItem = {
          id: season.id,
          name: season.name,
          order: season.order,
          leagues: []
        }

        allLeagues.forEach(league => {
          if (season.league_ids.includes(league.id)) {
            item.leagues.push(league)
          }
        })

        return item
      });
    });
  }

  goToRanking(league_id: string) {
    this.router.navigateByUrl("/ranking/" + league_id)
  }
}
