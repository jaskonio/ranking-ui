import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SeasonInfoView } from '../../shared/services/interfaces';
import { SeasonService } from '../../shared/services/seasson.service';

@Component({
  selector: 'app-ranking-list',
  standalone: true,
  imports: [],
  templateUrl: './ranking-list.component.html',
  styleUrl: './ranking-list.component.scss'
})
export class RankingListComponent {
  rankingIds = [1,2,3,4,5,6]

  seasons: SeasonInfoView[] = [];
  constructor(private router: Router,
    private seasonService: SeasonService
  ){
    this.seasonService.getAllSeasonInfo().subscribe( data => {
      this.seasons = data;
    });
  }

  goToRanking(id: number) {
    this.router.navigateByUrl("/ranking/" + id.toString())
  }
}
