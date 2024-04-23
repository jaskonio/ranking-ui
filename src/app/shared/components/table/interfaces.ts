export interface ConlumnsDefinition {
  key: string;
  value: string;
  order: number;

  visible?: boolean;
  sortable?: boolean;
  sortableOrder?: string
  activeSortable?: boolean;
  type?: string; // 'string', 'number', 'image', 'action'
  supportImageKey?: string; // name of the key thats contain img value
}
