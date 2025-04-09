import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidators } from '../../validators/custom-validators';
import { CompletarRegisterService } from '../../services/completa-register.service';
import { CompleteRegisterRequest } from '../../interfaces/register-interface';
import { response } from 'express';


@Component({
  selector: 'app-completar-registro',
  imports: [ReactiveFormsModule],
  templateUrl: './completar-registro.component.html',
  styleUrl: './completar-registro.component.scss'
})
export class CompletarRegistroComponent {
  private formBuilder = inject(FormBuilder);
  service = inject(CompletarRegisterService);


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
      CustomValidators.contrasenasIguales
    ]
  })

  onSubmit(){
    if(this.completeRegistroForm.valid){
      const formValue = this.completeRegistroForm.value as CompleteRegisterRequest
      this.service.completarRegistro(formValue).subscribe({
        next: (response) => {

        },
        error: (er) => {

        }
      })
    }
  }
}
