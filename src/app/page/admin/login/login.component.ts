import { Component } from '@angular/core';
import { NgFormComponent } from '../../../shared/components/form/ng-form.component';
import { Validators } from '@angular/forms';
import { CustomFormField } from '../../../shared/components/form/interfaces';
import { AuthService } from '../../../core/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';


@Component({
  selector: 'app-login',
  providers: [MessageService],
  standalone: true,
  imports: [NgFormComponent, MessagesModule],
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
      control_type: "password",
      default_value: null,
      validators: [Validators.required, Validators.maxLength(20)]
    }
  ]

  formConfiguration = {
    title_form: "Login",
    fields_configuration: this.fields_configuration,
    submitButtonEnabled: false,
  }

  constructor(private router:Router,
    private authService:AuthService,
    private notificationService: MessageService
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
          this.router.navigate(['/', 'admin']).then(() => console.log('Redirecto admin/persons page'))
        },
        error: err => {
          console.error(err);
          this.notificationService.add({ severity: 'error', summary: 'ERROR', detail: 'Usuario o contraseña invalido', life: 3000 })
        }
    })
  }
}
