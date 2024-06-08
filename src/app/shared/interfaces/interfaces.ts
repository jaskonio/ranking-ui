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
  editable?: boolean; //default false
}

export interface ActionsCrud {
  actions: string;
  callback(item: any): Observable<boolean>;
  icon: string;
}


export enum TableActions {
  EDIT, DELETE, CUSTOM_ACTIONS
}

export interface TableActionType {
  styles: string,
  typeAction: TableActions;
  icon: string;
  callback(item: any): any;
}

export interface TableConfiguracion {
  title: string;
  message?: string;
  responsiveLayout?: string;
  rows?: number;
  paginator?: boolean;
  rowsPerPageOptions?: number[];
  showCurrentPageReport?: boolean;
  currentPageReportTemplate?: string;
  selectionMode?: "multiple" | "single"| null;
  rowHover?: boolean;
  buttonActions?: TableActionType[];
  editableRow?: boolean; // default false
  columnCheckboxEnable?: boolean; // default false
}

export interface ICrudService {
  get_data(): Observable<any[]>;
  get_definition_columns(): Observable<ConlumnsDefinition[]>;
  save_item(item: any): Observable<any>;
  update_item(item: any): Observable<any>;
  delete_item(item: any): Observable<boolean>;
  delete_items(items: any[]): Observable<boolean[]>;
}

export interface JWT_Token {
  access_token: string;
  expires_in: number;
  token_type: string;
  roles: string[];
  success: boolean;
}

export interface AppConfig {
  inputStyle: string;
  colorScheme: string;
  theme: string;
  ripple: boolean;
  menuMode: string;
  scale: number;
}

export interface LayoutState {
  staticMenuDesktopInactive: boolean;
  overlayMenuActive: boolean;
  profileSidebarVisible: boolean;
  configSidebarVisible: boolean;
  staticMenuMobileActive: boolean;
  menuHoverActive: boolean;
}

