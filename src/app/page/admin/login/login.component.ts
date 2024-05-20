import { Component } from '@angular/core';
import { NgFormComponent } from '../../../shared/components/form/ng-form.component';
import { Validators } from '@angular/forms';
import { CustomFormField } from '../../../shared/components/form/interfaces';
import { AuthService } from '../../../core/auth.service';
import { Router, RouterOutlet } from '@angular/router';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgFormComponent, RouterOutlet],
  providers: [NotificationService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  fields_configuration: CustomFormField[] = [
    {
      label: "Nombre",
      placeholder: "Nombre",
      control_name: "user_name",
      control_type:"text",
      default_value: null,
      validators: [Validators.required, Validators.maxLength(20)]
    },
    {
      label: "Password",
      placeholder: "Password",
      control_name: "password",
      control_type: "text",
      default_value: null,
      validators: [Validators.required, Validators.maxLength(20)]
    }
  ]

  formConfiguration = {
    title_form: "Login",
    fields_configuration: this.fields_configuration,
    submitButtonEnabled: false,
  }

  constructor(private router:Router, private authService:AuthService,
    private notificationService: NotificationService
  ) {

  }

  onSubmitForm(event: any) {
    console.log("onSubmitForm")

    if (event == null){
      return;
    }

    this.authService.login(event['user_name'], event['password']).subscribe(
      {
        next: (value) => {
          console.log(value);
          this.router.navigateByUrl('/admin/persons').then(() => console.log('Redirecto admin/persons page'))
        },
        error: err => {
          console.error(err);
          this.notificationService.notification = { severity: 'error', summary: 'ERROR', detail: 'Usuario o contraseña invalido', life: 3000 }
        }
    })
  }
}
