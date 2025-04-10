import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export class RegistroComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      cedula: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      rol: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const dataToSend = {
        ...this.registerForm.value,
        contraseña: null,
        fechaNacimiento: null,
        direccion: null,
        telefono: null,
        sexo: null,
        tipoSangre: null,
      };
      console.log('Formulario valido: ', this.registerForm.value);
      this.http
        .post('url: http://localhost:8080/api/lucyTejada/registrar', dataToSend)
        .subscribe({
          next: (data) => console.log('Registro exitoso: ', data),
          error: (error) => console.error('Error en el registro: ', error),
        });
    } else {
      console.log('Formulario invalido: ');
    }
  }
}
