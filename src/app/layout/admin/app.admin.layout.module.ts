import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppAdminLayoutComponent } from './app.admin.layout.component';
import { AppAdminMenuComponent } from './sidebar/menu/app.admin.menu.component';
import { AppAdminSidebarComponent } from './sidebar/app.admin.sidebar.component';
import { AppAdmiFooterComponent } from './footer/app.admin.footer.component';
import { AppAdminTopBarComponent } from './topbar/app.admin.topbar.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';

@NgModule({
    declarations: [
        AppAdminTopBarComponent,
        AppAdmiFooterComponent,
        AppAdminMenuComponent,
        AppAdminSidebarComponent,
        AppAdminLayoutComponent
    ],
    imports: [
      CommonModule,
      FormsModule,
      HttpClientModule,
      InputTextModule,
      SidebarModule,
      BadgeModule,
      RadioButtonModule,
      InputSwitchModule,
      RippleModule,
      RouterModule
    ],
    exports: [AppAdminLayoutComponent]
})
export class AppAdminLayoutModule { }
