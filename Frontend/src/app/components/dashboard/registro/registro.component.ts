import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { RegistroService } from '../../../services/register.service';
import { RegisterRequest } from '../../../interfaces/registrar-usuario';
import { AlertsComponent } from '../../alerts/error-alerts.component';
import { CustomValidators } from '../../../validators/custom-validators';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, AlertsComponent],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent {
  private fb = inject(FormBuilder);
  private service = inject(RegistroService);
  private router = inject(Router);

  // Alertas
  mensajeSuccess: string | null = null;
  tituloSuccess = '';
  tipoAlerta: 'success' | 'error' = 'success';

  registerForm = this.fb.group({
    nombres: ['', [Validators.required, CustomValidators.noSoloEspacios]],
    apellidos: ['', [Validators.required, CustomValidators.noSoloEspacios]],
    cedula: ['', [Validators.required, CustomValidators.cedulaValida]],
    correoElectronico: ['', [
      Validators.required,
      Validators.email,
      CustomValidators.correoPersonalizado
    ]],
    rol: ['', [Validators.required]]
  });

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formValue = this.registerForm.value;

    const data: RegisterRequest = {
      nombres: formValue.nombres!,
      apellidos: formValue.apellidos!,
      cedula: formValue.cedula!,
      correoElectronico: formValue.correoElectronico!,
      rol: formValue.rol!,
      contrasena: null,
      fechaNacimiento: null,
      direccion: null,
      telefono: null,
      sexo: null,
      tipoSangre: null
    };

    this.service.registrarUsuario(data).subscribe({
      next: () => {
        this.tipoAlerta = 'success';
        this.tituloSuccess = 'Éxito';
        this.mensajeSuccess = 'Usuario creado exitosamente.';
        this.registerForm.reset();
      },
      error: (err) => {
        this.tipoAlerta = 'error';
        this.tituloSuccess = 'Error';

        if (err.status === 403) {
          this.mensajeSuccess = 'No tiene permisos para realizar esta acción.';
        } else if (err.status === 409) {
          this.mensajeSuccess = 'El correo electrónico o cédula ya están registrados.';
        } else if (err.status === 200){
          this.tipoAlerta = 'success';
          this.tituloSuccess = 'Éxito';
          this.mensajeSuccess = 'Usuario creado exitosamente.';
          this.registerForm.reset();
        } else {
          this.tipoAlerta = 'success';
          this.tituloSuccess = 'Éxito';
          this.mensajeSuccess = 'Usuario creado exitosamente.';
          this.registerForm.reset();
        }

        console.error('Error en el registro:', err);
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['principal-web/usuarios']);
  }

  onCerrarAlerta() {
    this.mensajeSuccess = null;
    this.tituloSuccess = '';
  }
}
