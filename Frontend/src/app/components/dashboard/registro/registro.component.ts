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

  mensajeSuccess: string | null = null;
  tituloSuccess = '';

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
      next: (res) => {
        this.tituloSuccess = 'Éxito';
        this.mensajeSuccess = res.mensaje;
        this.registerForm.reset();
      },
      error: (err) => {
        this.tituloSuccess = 'Error';
        if (err.status === 403) {
          this.mensajeSuccess = 'No tiene permisos para realizar esta acción.';
        } else {
          this.mensajeSuccess = 'Hubo un error al registrar el usuario.';
        }
        console.error('Error en el registro:', err);
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['principal-web/usuarios']);
  }
}
