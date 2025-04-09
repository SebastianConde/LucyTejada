import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RecuperarPasswordComponent } from './components/recuperar-password/recuperar-password.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { CompletarRegistroComponent } from './components/completar-registro/completar-registro.component';

export const routes: Routes = [
  {
    path: '', component: LoginComponent
  },
  {
    path: 'recuperar-password', component: RecuperarPasswordComponent
  },
  {
    path: 'completar-registro', component: CompletarRegistroComponent
  },
  {
    path: 'not-found', component: NotFoundComponent
  },
  {
    path: '**',
    redirectTo: 'not-found',
    pathMatch: 'full'
  }
  
];
