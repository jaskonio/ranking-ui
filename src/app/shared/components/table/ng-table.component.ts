import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ConlumnsDefinition } from './interfaces';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ChipModule } from 'primeng/chip';

@Component({
  selector: 'app-ng-table',
  standalone: true,
  imports: [CommonModule, TableModule, AvatarModule, ChipModule],
  templateUrl: './ng-table.component.html'
})
export class NgTableComponent {
  defVisiblesConlumn: ConlumnsDefinition[] = [];
  dataSource: any = []

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
    // this.loadConlumnsDefinition();
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
        }});
    }
  }
}
