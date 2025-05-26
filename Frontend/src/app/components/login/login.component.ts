import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { LoginRequest } from '../../interfaces/login-interface';
import { AlertsComponent } from '../alerts/error-alerts.component';
import { CustomValidators } from '../../validators/custom-validators'; // 👈 importa tu clase de validadores

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule, AlertsComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private loginService = inject(LoginService);

  errorMessage: string | null = null;
  tituloError: string = '';

  loginForm = this.formBuilder.group({
    email: new FormControl('', [
      Validators.required,
      CustomValidators.correoPersonalizado // 👈 se usa el validador personalizado
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
    ]),
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials: LoginRequest = {
        username: this.loginForm.value.email!,
        password: this.loginForm.value.password!
      };

      this.loginService.login(credentials).subscribe({
        next: (response) => {
          this.loginService.setToken(response.token);
          console.log("Sesión iniciada con éxito");
          const primerInicioSesion = this.loginService.getPrimerInicio();
          if (primerInicioSesion) {
            this.router.navigate(['/completar-registro']);
          } else {
            this.router.navigate(['/principal-web']);
          }
        },
        error: (err) => {
          this.errorMessage = 'No pudimos iniciar tu sesión. Asegúrate de que tu correo y contraseña sean correctos.';
          this.tituloError = 'Error al iniciar sesión';
          console.error('Error al iniciar sesión:', err);
        }
      });
    }
  }
}
