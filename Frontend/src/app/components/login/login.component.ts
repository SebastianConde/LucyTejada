import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { LoginRequest } from '../../interfaces/login-interface';
import { ErrorAlertsComponent } from '../error-alerts/error-alerts.component';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule, ErrorAlertsComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private formBuilder = inject(FormBuilder);
  private loginService = inject(LoginService);
  errorMessage: string | null = null;
  tituloError: string = '';

  loginForm = this.formBuilder.group({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required , Validators.minLength(6), Validators.maxLength(20), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)]),
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value as LoginRequest;
      this.loginService.login(credentials).subscribe({
        next: (response) => {
          this.loginService.setToken(response.token);
          console.log("Sesion iniciada con exito");
          console.log(response)
        },
        error: (err) => {
          this.errorMessage = 'No pudimos iniciar tu sesión. Asegúrate de que tu correo y contraseña sean correctos.';
          this.tituloError = 'Error al iniciar sesión';
          console.error('Error al iniciar sesión:', err);
        }
      })
    }
  }
}
