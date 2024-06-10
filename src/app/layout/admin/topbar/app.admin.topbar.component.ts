import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AdminLayoutService } from "../service/app.admin.layout.service";
import { AuthService } from '../../../core/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-admin-topbar',
    templateUrl: './app.admin.topbar.component.html',
})
export class AppAdminTopBarComponent {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: AdminLayoutService,
      public authService:AuthService,
      private router: Router,
    ) { }

    logout() {
      this.authService.logout()
      this.router.navigateByUrl("/")
    }
}
