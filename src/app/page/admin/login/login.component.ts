import { Component } from '@angular/core';
import { NgFormComponent } from '../../../shared/components/form/ng-form.component';
import { Validators } from '@angular/forms';
import { CustomFormField } from '../../../shared/components/form/interfaces';
import { AuthService } from '../../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgFormComponent],
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

  constructor(private router:Router, private authService:AuthService) {

  }

  onSubmitForm(event: any) {
    console.log("To login")
    console.log(event)

    if (event == null){
      return;
    }

    this.authService.login(event['user_name'], event['password']).subscribe(
      result => {
        console.log(result);
        this.router.navigateByUrl('/admin/persons');
      }
    )
  }
}
