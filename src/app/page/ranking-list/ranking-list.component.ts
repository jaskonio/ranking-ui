import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ranking-list',
  standalone: true,
  imports: [],
  templateUrl: './ranking-list.component.html',
  styleUrl: './ranking-list.component.scss'
})
export class RankingListComponent {
  rankingIds = [1,2,3,4,5,6]

  constructor(private router: Router,){}

  goToRanking(id: number) {
    this.router.navigateByUrl("/ranking/" + id.toString())
  }
}
