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
import { BehaviorSubject, catchError, flatMap, forkJoin, map, mergeMap, Observable, of, switchMap } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { NotificationEvent } from '../../services/interfaces';
import { combineLatest, timer } from "rxjs";


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

  title_table: string = "Lista de Corredores"
  property_id:string = ""
  fields_filter_support: string[] = []

  data_source: any = []
  all_visibles_conlumn: ConlumnsDefinition[] = [];
  def_visibles_conlumn: ConlumnsDefinition[] = [];

  @Input() service!:ICrudService;
  @Input() formConfiguration?: any = undefined;

  sortFieldValue:string | undefined;
  sortOrderValue: number = this.DEFAULT_VALUE_SORT_ORDER;

  dialog_action: string = ''

  dialog_to_view_or_edit: boolean = false;

  deleteProductDialog: boolean = false;

  deleteProductsDialog: boolean = false;

  dialog_title_to_edit_or_update_or_delete: string = ''

  item_to_edit_or_update_or_delete: any = {};

  selectedRow: any[] = [];

  rowsPerPageOptions = [5, 10, 20];

  public definitionColumnsObservable$!: Observable<ConlumnsDefinition[]>;

  public rowDataObservable$!: Observable<any[]>;

  constructor(private notificationService: NotificationService
    ,private config: PrimeNGConfig
  ) { }

  ngOnInit() {
    this.definitionColumnsObservable$ = this.service.get_definition_columns();
    this.rowDataObservable$ = this.service.get_data()
      .pipe(
        catchError((error:any, caught: Observable<any[]>) => {
          console.log(error)
          console.log(caught)
          this.notificationService.notification = { severity: 'error', summary: 'Error Peticion', detail: 'No ha precesado la petición', life: 3000 }
          throw new Error(error)
        }
      ));

    this.loadConlumnsDefinition();
    this.loadData();
  }

    openNew() {
        this.item_to_edit_or_update_or_delete = {};
        this.dialog_to_view_or_edit = true;
        this.dialog_action = 'add'
        this.dialog_title_to_edit_or_update_or_delete = "Nuevo Corredor"
    }

    deleteSelectedItems() {
        this.deleteProductsDialog = true;
    }

    editRow(item: any) {
        this.item_to_edit_or_update_or_delete = { ...item };
        this.dialog_to_view_or_edit = true;
        this.dialog_action = 'edit'
        this.dialog_title_to_edit_or_update_or_delete = "Datos Corredor"
    }

    deleteRow(row_data: any) {
        this.deleteProductDialog = true;
        this.item_to_edit_or_update_or_delete = { ...row_data };
    }

    confirmDeleteSelected() {
        this.deleteProductsDialog = false;
        let observer = of(this.selectedRow)

        observer.pipe(
          switchMap((items) => {
            const obs$: Observable<boolean>[] = []
            items.map((item => {
              obs$.push(this.service.delete_item(item))
            }))

            return combineLatest(obs$)
          })
        ).subscribe(
          {
            next: (value) => {
              value .forEach( x => {
                if (x) {
                  this.notificationService.notification =  { severity: 'success', summary: 'Successful', detail: 'Registro Eliminado', life: 3000 }
                }
              })

            },
            error: err => this.notificationService.notification =  { severity: 'error', summary: 'eroor', detail: 'error al processar', life: 3000 },
            complete: () => {
              this.selectedRow = [];
              this.loadData();
            }
        })
    }

    confirmDelete() {
        this.deleteProductDialog = false;
        this.service?.delete_item(this.item_to_edit_or_update_or_delete).subscribe(is_ok => {
          if (is_ok){
            this.notificationService.notification = { severity: 'success', summary: 'Successful', detail: 'Registro Eliminado', life: 3000 }
          }

          this.loadData();
        })

        this.item_to_edit_or_update_or_delete = {};
    }

    hideDialog() {
        this.dialog_to_view_or_edit = false;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    loadData() {
      console.log("loadData");

      this.rowDataObservable$.subscribe((data) => {
        console.log("get_data")
        this.setNewDataIntoTable(data)
      })
    }

    setNewDataIntoTable(data: any) {
      this.data_source = [];
      this.data_source = data;
    }

    loadConlumnsDefinition() {
      console.log("loadConlumnsDefinition");

      this.definitionColumnsObservable$.subscribe( (data) => {
        this.setNewColumnsDefinition(data)
      })
    }

    setNewColumnsDefinition(data: ConlumnsDefinition[]) {
      console.log("setNewColumnsDefinition")
      this.fields_filter_support = []

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
    }

    onSubmitForm(event:any) {
      console.log("onSubmitForm")
      console.log(event)

      this.hideDialog()

      if (event == null){
        return;
      }

      if (this.dialog_action == 'edit') {
        event['id'] = this.item_to_edit_or_update_or_delete['id']
        this.service?.update_item(event).subscribe(item => {
          console.log(item);
          this.loadData();
        })
      }

      else if (this.dialog_action == 'add') {
        this.service?.save_item(event).subscribe( item => {
          console.log(item);
          this.loadData();
        })
      }
    }
}
