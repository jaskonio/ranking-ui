import { Component, ElementRef } from '@angular/core';
import { LayoutService } from "../../service/app.layout.service";


@Component({
    selector: 'app-admin-sidebar',
    templateUrl: './app.admin.sidebar.component.html',
})
export class AppAdminSidebarComponent {
    constructor(public layoutService: LayoutService, public el: ElementRef) { }
}

