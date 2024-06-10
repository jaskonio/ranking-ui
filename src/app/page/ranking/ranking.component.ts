import { Component, Input, OnInit } from '@angular/core';
import {TableService} from '../../shared/services/table.service'
import {LeagueService} from '../../shared/services/league.service'
import { NgTableComponent } from '../../shared/components/table/ng-table.component';
import { League, LeagueRawView, RunnerRankingModel } from '../../shared/services/interfaces';
import { ConlumnsDefinition, TableConfiguracion } from '../../shared/interfaces/interfaces';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [NgTableComponent],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.scss'
})
export class RankingComponent {
  allLeagues: League[] = []

  _idRanking: string = '';
  get idRanking(): string{
    return this._idRanking
  }
  @Input('idRanking') set idRanking(value:any){
    this._idRanking = value;

    this.leagueService.getRawById(value).subscribe(data => {
      this.league = data
      this.configuration.title = this.league.name
      this.data = this.league.ranking_latest.data;
    })
  }

  public league?: LeagueRawView;

  data: RunnerRankingModel[] = []
  columns: ConlumnsDefinition[] = []

  public configuration:TableConfiguracion = {
    title: '',
    paginator: true,
    editableRow: false,
    rowsPerPageOptions: [5, 10, 20, 100],
    rows: 20,
    showCurrentPageReport: true,
  }

  constructor(private tableService: TableService,
    private leagueService: LeagueService
  ){
    this.tableService.getConfig().subscribe( data => {
      this.columns = data;
    })
  }

  ngOnInit() {
  }
}
