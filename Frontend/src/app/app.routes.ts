import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RecuperarPasswordComponent } from './components/recuperar-password/recuperar-password.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { CompletarRegistroComponent } from './components/completar-registro/completar-registro.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UsuariosComponent } from './components/dashboard/usuarios/usuarios.component';
import { EstudiantesComponent } from './components/dashboard/estudiantes/estudiantes.component';
import { CursosComponent } from './components/dashboard/cursos/cursos.component';
import { ReportesComponent } from './components/dashboard/reportes/reportes.component';



export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login'
  },
  {
    path: 'recuperar-password',
    component: RecuperarPasswordComponent,
    title: 'Recuperar Contraseña'
  },
  {
    path: 'completar-registro',
    component: CompletarRegistroComponent,
    title: 'Completar Registro'
  },
  {
    path: 'principal-web',
    component: DashboardComponent,
    title: 'Lucy Tejada WEB',
    children: [
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'estudiantes', component: EstudiantesComponent },
      { path: 'cursos', component: CursosComponent },
      { path: 'reportes', component: ReportesComponent },
      { path: '', redirectTo: 'estudiantes', pathMatch: 'full' }
    ]
  },
  {
    path: 'not-found',
    component: NotFoundComponent
  },
  {
    path: '**',
    redirectTo: 'not-found',
    pathMatch: 'full'
  }
];
