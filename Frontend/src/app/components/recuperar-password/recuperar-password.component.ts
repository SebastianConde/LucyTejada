import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RecuperarContrasenaService } from '../../services/recuperar-contrasena.service';
import { RecuperarContraRequest } from '../../interfaces/recuperar-contra';
import { AlertsComponent } from '../alerts/error-alerts.component';

@Component({
  selector: 'app-recuperar-password',
  imports: [ReactiveFormsModule, RouterModule, AlertsComponent],
  templateUrl: './recuperar-password.component.html',
  styleUrl: './recuperar-password.component.scss'
})
export class RecuperarPasswordComponent {

  formBuilder = inject(FormBuilder);
  recuperarContraService = inject(RecuperarContrasenaService);
  mensajeSucces: string | null = null;
  tituloSucces: string = '';

  recuperarPasswordForm = this.formBuilder.group({
    email: new FormControl('',[Validators.required, Validators.email]),
  })


  onSubmit(){
    if(this.recuperarPasswordForm.valid){
      const data =  this.recuperarPasswordForm.value as RecuperarContraRequest
      this.recuperarContraService.recuperarContra(data).subscribe({
        next: (response) => {
          this.mensajeSucces = 'Correo de recuperación enviado.';
          this.tituloSucces = 'Exito!';
          console.log(response.mensaje);
        },
        error: (err) => {
          console.error('Error al recuperar la contraseña:', err);
        }
      });
    }
    console.log(this.recuperarPasswordForm);
  }
}
