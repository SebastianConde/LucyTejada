import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RecuperarPasswordComponent } from './components/recuperar-password/recuperar-password.component';

export const routes: Routes = [
  {
    path: '', component: LoginComponent
  },
  {
    path: 'recuperar-password', component: RecuperarPasswordComponent
  },
  
];
