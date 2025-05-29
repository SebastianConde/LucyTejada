import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidators } from '../../validators/custom-validators';
import { CompletarRegisterService } from '../../services/completa-register.service';
import { CompleteRegisterRequest } from '../../interfaces/register-interface';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertsComponent } from '../alerts/error-alerts.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-completar-registro',
  imports: [ReactiveFormsModule, AlertsComponent, CommonModule],
  templateUrl: './completar-registro.component.html',
  styleUrl: './completar-registro.component.scss'
})
export class CompletarRegistroComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private service = inject(CompletarRegisterService);
  private router = inject(Router); 
  private route = inject(ActivatedRoute); // <-- CORRECTO

  mensajeSuccess: string | null = null;
  tituloSuccess: string = '';
  token: string | null = null; 

  completeRegistroForm = this.formBuilder.group({
    fechaNacimiento: new FormControl('',[Validators.required, CustomValidators.edadValida]),
    telefono: new FormControl('',[Validators.required, Validators.pattern(/^[0-9]{10}$/)]),
    direccion: new FormControl('',[Validators.required]),
    contrasena: new FormControl('', [Validators.required , Validators.minLength(6), Validators.maxLength(20), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)]),
    confirmarContrasena: new FormControl('', [Validators.required]),
    tipoSangre: new FormControl('',[Validators.required]),
    sexo: new FormControl('',[Validators.required]),
  },{
    validators:[
      CustomValidators.contrasenasIguales2,
    ]
  })

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || null;
      console.log('Token recibido en query param:', this.token);
    });
  }

  onSubmit() {
    if (this.completeRegistroForm.valid && this.token) {
      const formValue = this.completeRegistroForm.value;

      // Creamos el payload asegurando que los campos no son nulos
      const payload: CompleteRegisterRequest = {
        contrasena: formValue.contrasena!,
        fechaNacimiento: formValue.fechaNacimiento!,
        direccion: formValue.direccion!,
        telefono: formValue.telefono!,
        sexo: formValue.sexo!,
        tipoSangre: formValue.tipoSangre!,
        token: this.token!,
      };

      this.service.completarRegistro(payload).subscribe({
        next: (data) => {
          this.mensajeSuccess = data.mensaje;
          this.tituloSuccess = 'Éxito';
        },
        error: (err) => {
          console.error("Error al completar registro:", err);
        }
      });
    } else {
      if (!this.token) {
        console.error("No se encontró token en los query params");
      }
    }
  }

  onCerrarAlerta() {
    console.log('Cerrando alerta y navegando a login');
    this.mensajeSuccess = null;
    this.tituloSuccess = '';
    this.router.navigate(['/login']);
  }
}
