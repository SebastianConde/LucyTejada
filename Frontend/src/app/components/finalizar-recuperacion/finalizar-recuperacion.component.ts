import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RecuperarContrasenaService } from '../../services/recuperar-contrasena.service';
import { FinalizarRecuperacionRequest } from '../../interfaces/recuperar-contra';
import { CommonModule } from '@angular/common';
import { AlertsComponent } from '../alerts/error-alerts.component';
import { CustomValidators } from '../../validators/custom-validators';

@Component({
  selector: 'app-finalizar-recuperacion',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, AlertsComponent, RouterModule],
  templateUrl: './finalizar-recuperacion.component.html',
  styleUrls: ['./finalizar-recuperacion.component.scss']
})
export class FinalizarRecuperacionComponent {
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  recuperarService = inject(RecuperarContrasenaService);

  form = this.fb.group({
    nuevaContrasena: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
      ]
    ],
    confirmarContrasena: ['', [Validators.required]]
  }, {
    validators: [CustomValidators.contrasenasIguales]
  });

  mensajeSuccess: string | null = null;
  tituloSuccess: string = '';
  error: string | null = null;

  constructor() {
    // Forzar actualización de validadores de grupo al cambiar cualquiera de los campos
    this.form.get('nuevaContrasena')?.valueChanges.subscribe(() => {
      this.form.updateValueAndValidity();
    });
    this.form.get('confirmarContrasena')?.valueChanges.subscribe(() => {
      this.form.updateValueAndValidity();
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const token = this.route.snapshot.queryParamMap.get('token');
      if (!token) {
        this.error = 'Token inválido o expirado.';
        return;
      }
      const payload: FinalizarRecuperacionRequest = { nuevaContrasena: this.form.value.nuevaContrasena! };
      this.recuperarService.finalizarRecuperacion(token, payload)
        .subscribe({
          next: res => {
            this.mensajeSuccess = res.mensaje;
            this.tituloSuccess = 'Éxito';
          },
          error: err => {
            this.error = 'No se pudo cambiar la contraseña.';
          }
        });
    }
  }

  onCerrarAlerta() {
    this.mensajeSuccess = null;
    this.router.navigate(['/login']);
  }
}