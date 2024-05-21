import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RippleModule } from 'primeng/ripple';
// import { AppMenuComponent } from './app.menu.component';
// import { AppMenuitemComponent } from './app.menuitem.component';
import { RouterModule } from '@angular/router';
import { AppTopBarComponent } from '../topbar/app.topbar.component';
import { AppFooterComponent } from '../footer/app.footer.component';
// import { AppConfigModule } from '../config/config.module';
import { AppSidebarComponent } from "./sidebar/app.sidebar.component";
import { CommonModule } from '@angular/common';
import { AppAdminLayoutComponent } from './app.admin.layout.component';
import { AppLayoutModule } from '../app.layout.module';

@NgModule({
    declarations: [
        AppAdminLayoutComponent,
    ],
    imports: [CommonModule,
      RouterModule,
      AppLayoutModule
    ],
    exports: [AppAdminLayoutComponent]
})
export class AppAdminLayoutModule { }
