import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-recuperar-password',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './recuperar-password.component.html',
  styleUrl: './recuperar-password.component.scss'
})
export class RecuperarPasswordComponent {

  formBuilder = inject(FormBuilder);
  recuperarPasswordForm = this.formBuilder.group({
    email: new FormControl('',[Validators.required, Validators.email]),
  })


  onSubmit(){
    console.log(this.recuperarPasswordForm);
  }
}
