import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { AvatarModule } from 'primeng/avatar';
import { ChipModule } from 'primeng/chip';
import { ConlumnsDefinition, TableConfiguracion } from '../../interfaces/interfaces';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ng-table',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    AvatarModule,
    ChipModule,
    ButtonModule,
    RippleModule,
    InputTextModule,
    FormsModule
  ],
  templateUrl: './ng-table.component.html'
})
export class NgTableComponent {
  DEFAULT_VALUE_SORT_ORDER = 'asc'

  @Input() dataSource: any;

  private _columns!: ConlumnsDefinition[];
  @Input()
  public get columns(): ConlumnsDefinition[] {
    return this._columns
  }
  public set columns(item) {
    this._columns = item;
    this.processColumns(this._columns)
  }

  @Input() configuration!:TableConfiguracion;

  @Output() clickRowEvent = new EventEmitter<any>();

  private _selectedRow: any[] = [];
  public get selectedRow() {
    return this._selectedRow;
  }
  public set selectedRow(rows) {
    this._selectedRow = rows;
  }

  public enabledColumns: any[] = [];
  public dataKey: string|undefined = undefined;
  public sortFieldSelected: string | undefined = undefined;
  public sortOrderSelected: number = 0;
  public filterFieldSupport: string[] = []

  constructor() { }

  ngOnInit() {
  }

  processColumns(newColumns: any[]) {
    console.log("setNewColumnsDefinition")

    this.enabledColumns = []

    newColumns.sort((a,b) => a.order - b.order);

    newColumns.map(item => {
      if (item.foreign_key == true) {
        this.dataKey = item.key
      }

      if (item.visible != false){
        this.enabledColumns.push(item)
      }

      if(item.activeSortable) {
        this.sortFieldSelected = item.key;

        let sortableOrder = this.DEFAULT_VALUE_SORT_ORDER;

        if (item.sortableOrder != undefined) {
          sortableOrder = item.sortableOrder;
        }

        this.sortOrderSelected = sortableOrder == 'asc' ? 1 : -1;
      }

      if (item.supportFilter) {
        this.filterFieldSupport.push(item.key);
      }
    });
  }

  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  onRowClick(rowData: any) {
    console.log("onRowClick");

    this.clickRowEvent.emit(rowData);
  }

  getMessage() {
    if (this.dataSource == undefined) {
      return
    }

    if (this.dataSource.length == 0 && this.configuration.message != "") {
      return this.configuration.message
    }

    return "No data"
  }
}
