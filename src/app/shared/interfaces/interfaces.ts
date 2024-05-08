import { catchError, map, Observable, of } from 'rxjs';

export interface ConlumnsDefinition {
  key: string;
  value: string;
  order: number;
  foreign_key?: boolean;
  visible?: boolean;
  sortable?: boolean;
  sortableOrder?: string
  activeSortable?: boolean;
  type?: string; // 'string', 'number', 'image', 'action'
  supportImageKey?: string; // name of the key thats contain img value
  supportFilter?: boolean;
}

export interface ICrudService {
  get_data(): Observable<any[]>;
  get_definition_columns(): Observable<ConlumnsDefinition[]>;
  save_item(item: any): Observable<boolean>;
  update_item(item: any): Observable<boolean>;
  delete_item(item: any): Observable<boolean>;
}
