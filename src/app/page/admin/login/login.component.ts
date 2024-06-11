import { Component } from '@angular/core';
import { NgFormComponent } from '../../../shared/components/form/ng-form.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { PasswordModule } from 'primeng/password';


@Component({
  selector: 'app-login',
  providers: [MessageService],
  standalone: true,
  imports: [
    CommonModule,
    NgFormComponent,
    MessagesModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    PasswordModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  errorMessage = ''
  loginForm = new FormGroup({
    'user_name': new FormControl(null, [Validators.required, Validators.maxLength(20)]),
    'password': new FormControl(null, [Validators.required, Validators.maxLength(20)]),
  });

  constructor(private router:Router,
    private authService:AuthService,
    private notificationService: MessageService
  ) {
  }

  onSubmit() {
    console.log("onSubmitForm")

    if ((this.loginForm.value.user_name == null || this.loginForm.value.user_name == undefined)||
      (this.loginForm.value.password == null || this.loginForm.value.password == undefined)) {
        return;
    }

    this.authService.login(this.loginForm.value.user_name, this.loginForm.value.password).subscribe(
      {
        next: (value) => {
          console.log(value);
          this.router.navigate(['/', 'admin']).then(() => console.log('Redirec to admin/persons page'))
        },
        error: err => {
          if (err.message == 'Invalid user or password')  {
            this.errorMessage = 'Invalid user or password'
          } else {
            this.notificationService.add({ severity: 'error', summary: 'ERROR', detail: 'Hubo un error en la peticion', life: 3000 })
          }
        }
    })
  }
}
