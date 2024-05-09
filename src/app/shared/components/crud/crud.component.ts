import { Component, Input, OnInit } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { Table } from 'primeng/table';
import { ConlumnsDefinition, ICrudService } from '../../interfaces/interfaces';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { ProgressBarModule } from 'primeng/progressbar';
import { FormsModule } from '@angular/forms';
import { CrudRoutingModule } from './crud-routing.module';

import { TableModule } from 'primeng/table';


import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { ChipModule } from 'primeng/chip';
import { CommonModule } from '@angular/common';
import { NgFormComponent } from '../form/ng-form.component';
@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  providers: [MessageService],
  standalone: true,
  imports: [
    BadgeModule,
    ProgressBarModule,
    CommonModule,
    CrudRoutingModule,
    TableModule,
    FileUploadModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    ChipModule,
    NgFormComponent
  ]
})
export class CrudComponent implements OnInit {
  DEFAULT_VALUE_SORT_ORDER: number = 1;
  //
  title_table: string = "Lista de Corredores"
  property_id:string = ""
  fields_filter_support: string[] = []

  data_source: any = []
  all_visibles_conlumn: ConlumnsDefinition[] = [];
  def_visibles_conlumn: ConlumnsDefinition[] = [];

  @Input() service?:ICrudService = undefined;
  @Input() formConfiguration?: any = undefined;

  sortFieldValue:string | undefined;
  sortOrderValue: number = this.DEFAULT_VALUE_SORT_ORDER;

    dialog_to_view_or_edit: boolean = false;

    deleteProductDialog: boolean = false;

    deleteProductsDialog: boolean = false;

    dialog_title_to_edit_or_update_or_delete: string = ''

    item_to_edit_or_update_or_delete: any = {};

    selectedRow: any[] = [];

    submitted: boolean = false;

    rowsPerPageOptions = [5, 10, 20];

    constructor(private messageService: MessageService
      ,private config: PrimeNGConfig
    ) { }

    ngOnInit() {
      this.loadConlumnsDefinition();
      this.loadData();
    }

    openNew() {
        this.item_to_edit_or_update_or_delete = {};
        this.submitted = false;
        this.dialog_to_view_or_edit = true;
        this.dialog_title_to_edit_or_update_or_delete = "Nuevo Corredor"
    }

    deleteSelectedItems() {
        this.deleteProductsDialog = true;
    }

    editRow(item: any) {
        this.item_to_edit_or_update_or_delete = { ...item };
        this.dialog_to_view_or_edit = true;
        this.service?.update_item(this.item_to_edit_or_update_or_delete)
        this.dialog_title_to_edit_or_update_or_delete = "Datos Corredor"
    }

    deleteRow(row_data: any) {
        this.deleteProductDialog = true;
        this.item_to_edit_or_update_or_delete = { ...row_data };
    }

    confirmDeleteSelected() {
        this.deleteProductsDialog = false;
        this.selectedRow.forEach( item =>{
          this.service?.delete_item(item)
        })

        this.selectedRow = [];
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    }

    confirmDelete() {
        this.deleteProductDialog = false;
        this.service?.delete_item(this.item_to_edit_or_update_or_delete)

        this.item_to_edit_or_update_or_delete = {};
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    }

    hideDialog() {
        this.dialog_to_view_or_edit = false;
        this.submitted = false;
    }

    saveItem() {
        this.submitted = true;
        this.item_to_edit_or_update_or_delete = {};
        // TODO
        this.service?.save_item(this.item_to_edit_or_update_or_delete)
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    reloadConfig() {
      console.log("reloadConfig");

      this.loadData();
    }

    loadData() {
      console.log("loadData");
      this.data_source = [];
      // this.data_source =
      this.service?.get_data().subscribe((data) => {
        console.log("get_data")
        console.log(data)

        this.data_source = data;
      })
    }

    loadConlumnsDefinition() {
      console.log("loadConlumnsDefinition");

      if (this.service == undefined){
        return
      }

      this.fields_filter_support = []
      // this.def_visibles_conlumn =
      this.service.get_definition_columns().subscribe( (data) => {
        console.log("get_definition_columns")
        console.log(data)

        this.all_visibles_conlumn = data
        this.def_visibles_conlumn = []

        this.all_visibles_conlumn.sort((a,b) => a.order - b.order);

        this.all_visibles_conlumn.map(item => {
          if (item.foreign_key == true) {
            this.property_id = item.key
          }

          if (item.visible != false){
            this.def_visibles_conlumn.push(item)
          }

          if(item.activeSortable) {
            this.sortFieldValue = item.key;

            let sortableOrder = this.DEFAULT_VALUE_SORT_ORDER;

            if (item.sortableOrder != undefined) {
              sortableOrder = item.sortableOrder == 'asc' ? 1 : -1;
            }

            this.sortOrderValue = sortableOrder
          }

          if (item.supportFilter) {
            this.fields_filter_support.push(item.key);
          }
        });
      })
    }
}
