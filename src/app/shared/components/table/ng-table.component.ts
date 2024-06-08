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
import { InputNumberModule } from 'primeng/inputnumber';

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
    FormsModule,
    InputNumberModule
  ],
  templateUrl: './ng-table.component.html'
})
export class NgTableComponent {
  DEFAULT_VALUE_SORT_ORDER = 'asc'

  private _dataSource:any;

  @Input()
  get dataSource() {
    return this._dataSource;
  }

  set dataSource(data) {
    this._dataSource = data;
    this.onChange.emit(data);
  }

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
  @Output() onChange = new EventEmitter<any>();

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
  public globalFilterDiabled: boolean = false

  constructor() { }

  ngOnInit() {
  }

  processColumns(newColumns: any[]) {
    console.log("processColumns")

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

  onClickButtonAction(callback: Function, rowData:any) {
    console.log("onRowClick");

    callback(rowData)
    // this.clickRowEvent.emit(rowData);
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

  clonedDataSource:any = {}

  onRowEditInit(rowData: any, index:number) {
    console.log("onRowEditInit")
    let copyRowData = {...this.dataSource[index]}
    this.clonedDataSource[rowData.id] = {...copyRowData};
    console.log(this.dataSource)

    this.globalFilterDiabled = true
  }

  onRowEditSave(rowData: any, index:number) {
    console.log("onRowEditSave")
    console.log(this.dataSource)
    console.log(rowData)

    delete this.clonedDataSource[rowData.id];
    this.onChange.emit(this.dataSource)
    this.globalFilterDiabled = false
  }

  onRowEditCancel(rowData: any, index: number) {
    console.log("onRowEditCancel")
    console.log(this.dataSource)
    console.log(rowData)

    this.dataSource[index] = {...this.clonedDataSource[rowData.id]}
    rowData = {...this.clonedDataSource[rowData.id]}
    console.log("end")

    this.globalFilterDiabled = false
  }

  getValue( row: any, col:string, index:number) {
    return this.dataSource[index][col]
  }
}
