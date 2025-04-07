import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';



@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
 
  private formBuilder = inject(FormBuilder);

  loginForm = this.formBuilder.group({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required , Validators.minLength(6), Validators.maxLength(20), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)]),
  });
  
  onSubmit() {
    console.log(this.loginForm);
  }
}
