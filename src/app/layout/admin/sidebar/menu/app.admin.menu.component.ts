import { OnInit } from '@angular/core';
import { Component } from '@angular/core';


@Component({
    selector: 'app-admin-menu',
    templateUrl: './app.admin.menu.component.html'
})
export class AppAdminMenuComponent implements OnInit {

    model: any[] = [];

    constructor() { }

    ngOnInit() {
        this.model = [
            {
              label: '', icon: 'pi pi-home', routerLink: ['/']
            },
            {
              label: 'Persons', icon: 'pi pi-user', routerLink: ['/admin/persons']
            },
            {
              label: 'Carreras', icon: 'pi pi-flag', routerLink: ['/admin/races-info']
            },
            {
              label: 'Temporadas', icon: 'pi pi-folder-plus', routerLink: ['/admin/seassons']
            },
            {
              label: 'Ligas', icon: 'pi pi-folder-plus', routerLink: ['/admin/leagues']
            }
        ];
    }
}
