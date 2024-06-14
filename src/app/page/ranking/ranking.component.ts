import { Component, Input } from '@angular/core';
import {LeagueService} from '../../shared/services/league.service'
import { NgTableComponent } from '../../shared/components/table/ng-table.component';
import { League, LeagueRankingRunner } from '../../shared/services/interfaces';
import { ConlumnsDefinition, TableConfiguracion } from '../../shared/interfaces/interfaces';

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

    this.leagueService.getByid(value).subscribe(data => {
      this.league = data
      this.configuration.title = this.league.name
      if (this.league?.ranking_latest) {
        this.data = this.league.ranking_latest.data
      }
    })
  }

  public league?: League;

  data: LeagueRankingRunner[] = []
  columns: ConlumnsDefinition[] = [
    {
      "key": "id",
      "value": "ID",
      "order": 99,
      "sortable": false,
      "foreign_key": true,
      "visible": false
    },
    {
      "key": "position",
      "value": "Pos",
      "order": 0,
      "sortable": true,
      "activeSortable": true
    },
    {
      "key": "photo_url",
      "value": "Foto",
      "order": 1
    },
    {
      "key": "first_name",
      "value": "Nombre",
      "order": 2,
      "sortable": false,
      "supportImageKey": "photo_url",
      "supportFilter": true
    },
    {
      "key": "last_name",
      "value": "Apellido",
      "order": 5,
      "sortable": true,
      "supportFilter": true
    },
    {
      "key": "dorsal",
      "value": "Dorsal",
      "order": 6,
      "sortable": true
    },
    {
      "key": "points",
      "value": "Puntos",
      "order": 7,
      "sortable": true
    },
    {
      "key": "pos_last_race",
      "value": "Ultima pos",
      "order": 8,
      "sortable": true
    },
    {
      "key": "top_five",
      "value": "Top Five",
      "order": 9,
      "sortable": true
    },
    {
      "key": "participations",
      "value": "Participaciones",
      "order": 10,
      "sortable": true
    },
    {
      "key": "best_position",
      "value": "Mejor Pos",
      "order": 11,
      "sortable": true
    },
    {
      "key": "last_position_race",
      "value": "Ultima pos en carrea",
      "order": 12,
      "sortable": true
    },
    {
      "key": "best_avegare_peace",
      "value": "Mejor media Ritmo",
      "order": 0,
      "visible": false
    },
    {
      "key": "best_position_real",
      "value": "Mejor Pos real",
      "order": 0,
      "visible": false
    },
    {
      "key": "nationality",
      "value": "Nacionalidad",
      "order": 0,
      "visible": false
    }
  ]

  public configuration:TableConfiguracion = {
    title: '',
    paginator: true,
    editableRow: false,
    rowsPerPageOptions: [5, 10, 20, 100],
    rows: 20,
    showCurrentPageReport: true,
  }

  constructor(private leagueService: LeagueService){
  }

  ngOnInit() {
  }
}
