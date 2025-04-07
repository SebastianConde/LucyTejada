import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private formBuilder = inject(FormBuilder);
  private loginService = inject(LoginService);

  loginForm = this.formBuilder.group({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required , Validators.minLength(6), Validators.maxLength(20), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)]),
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentials = this.loginForm.getRawValue() as { username: string; password: string };

    this.loginService.login(credentials).subscribe({
      next: (res) => {
        console.log('Login exitoso', res);
        localStorage.setItem('access_token', res.token);
        // Redirigir a la página principal
      },
      error: (err) => {
        console.error('Login fallido', err);
        if (err.status === 403) {
          alert('Credenciales incorrectas');
        } else {
          alert('Error en el servidor');
        }
      }
    });
  }
}
