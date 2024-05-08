import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { AvatarModule } from 'primeng/avatar';
import { ChipModule } from 'primeng/chip';
import { ConlumnsDefinition } from '../../interfaces/interfaces';

@Component({
  selector: 'app-ng-table',
  standalone: true,
  imports: [CommonModule, TableModule, AvatarModule, ChipModule],
  templateUrl: './ng-table.component.html'
})
export class NgTableComponent {
  DEFAULT_VALUE_SORT_ORDER: number = 1;

  defVisiblesConlumn: ConlumnsDefinition[] = [];
  dataSource: any = []
  sortFieldValue:string | undefined;
  sortOrderValue: number = this.DEFAULT_VALUE_SORT_ORDER;

  _data: any;
  get data(): any{
    return this._data
  }
  @Input('data') set data(value:any){
    this._data = value;
    this.reloadConfig();
  }

  _conlumnsDefinition:ConlumnsDefinition[] = [];
  get conlumnsDefinition(): ConlumnsDefinition[]{
    return this._conlumnsDefinition;
  }

  @Input('conlumnsDefinition') set conlumnsDefinition(value:ConlumnsDefinition[]){
    this._conlumnsDefinition = value;
    console.log(this._conlumnsDefinition)
    this.loadConlumnsDefinition();
  }

  constructor(private cdref: ChangeDetectorRef) {
    console.log("constructor")
  }

  ngOnInit() {
    console.log("ngOnInit")

    this.loadData();
  }

  ngAfterViewInit() {
    console.log("ngAfterViewInit");
  }

  reloadConfig() {
    console.log("reloadConfig");

    this.loadData();
  }

  loadData() {
    console.log("loadData");
    this.dataSource = [];
    this.dataSource = this.data;
  }

  loadConlumnsDefinition() {
    console.log("loadConlumnsDefinition");

    this.defVisiblesConlumn = []

    this.conlumnsDefinition.sort((a,b) => a.order - b.order);

    if (this.conlumnsDefinition!=null ){
      this.conlumnsDefinition.map(item => {
        if (item.visible != false){
          this.defVisiblesConlumn.push(item)
        }

        if(item.activeSortable) {
          this.sortFieldValue = item.key;

          let sortableOrder = this.DEFAULT_VALUE_SORT_ORDER;

          if (item.sortableOrder != undefined) {
            sortableOrder = item.sortableOrder == 'asc' ? 1 : -1;
          }

          this.sortOrderValue = sortableOrder
        }

      });
    }
  }
}
