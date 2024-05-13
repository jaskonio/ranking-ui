import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppLayoutModule } from './layout/app.layout.module';
import { AppAdminLayoutModule } from './layout/admin/app.admin.layout.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AppLayoutModule, AppAdminLayoutModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'ranking-ui';
}
