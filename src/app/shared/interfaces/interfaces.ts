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
