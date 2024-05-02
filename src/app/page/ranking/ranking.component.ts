import { Component, Input } from '@angular/core';
import { ConlumnsDefinition } from '../../shared/components/table/interfaces';
import {TableService} from '../../shared/services/table.service'
import {LeagueService} from '../../shared/services/league.service'
import { NgTableComponent } from '../../shared/components/table/ng-table.component';
import { RunnerRankingModel } from '../../shared/services/interfaces';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [NgTableComponent],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.scss'
})
export class RankingComponent {

  _idRanking: string = '';
  get idRanking(): string{
    return this._idRanking
  }
  @Input('idRanking') set idRanking(value:any){
    this._idRanking = value;

    this.loadData();
  }

  data: RunnerRankingModel[] = []
  columns: ConlumnsDefinition[] = []

  constructor(private tableService: TableService,
    private leagueService: LeagueService
  ){}

  loadData() {
    this.leagueService.getByRawById(this.idRanking).subscribe( result => {
      console.log("leagueService.getData")
      this.data = result.data.history_ranking[0].data;
    })

    this.tableService.getConfig().subscribe( data => {
      this.columns = data;
    })
  }
}
