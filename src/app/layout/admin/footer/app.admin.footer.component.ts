import { Component } from '@angular/core';
import { AdminLayoutService } from "../service/app.admin.layout.service";

@Component({
    selector: 'app-admin-footer',
    templateUrl: './app.admin.footer.component.html'
})
export class AppAdmiFooterComponent {
    constructor(public layoutService: AdminLayoutService) { }
}
