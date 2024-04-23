import { Component, Input } from '@angular/core';
import { ConlumnsDefinition } from '../../shared/components/table/interfaces';
import {TableService} from '../../shared/services/table.service'
import { NgTableComponent } from '../../shared/components/table/ng-table.component';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [NgTableComponent],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.scss'
})
export class RankingComponent {

  _idRanking: number = 0;
  get idRanking(): number{
    return this._idRanking
  }
  @Input('idRanking') set idRanking(value:any){
    this._idRanking = value;

    if (this._idRanking > 0 ) {
      this.loadData();
    }
  }

  data: any = []
  columns: ConlumnsDefinition[] = []

  constructor(private tableService: TableService){}

  loadData() {
    this.tableService.getData().subscribe( data => {
      console.log("tableService.getData")
      this.data = data;
    })

    this.tableService.getConfig().subscribe( data => {
      this.columns = data;
    })
  }
}
