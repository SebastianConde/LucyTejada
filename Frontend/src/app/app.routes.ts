import { Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
    title: 'Login'
  },
  {
    path: 'recuperar-password',
    loadComponent: () => import('./components/recuperar-password/recuperar-password.component').then(m => m.RecuperarPasswordComponent),
    title: 'Recuperar Contraseña'
  },
  {
    path: 'completar-registro',
    loadComponent: () => import('./components/completar-registro/completar-registro.component').then(m => m.CompletarRegistroComponent),
    title: 'Completar Registro'
  },
  {
    path: 'principal-web',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    title: 'Lucy Tejada WEB',
    children: [
      {
        path: 'usuarios',
        loadComponent: () => import('./components/dashboard/usuarios/usuarios.component').then(m => m.UsuariosComponent)
      },
      {
        path: 'estudiantes',
        loadComponent: () => import('./components/dashboard/estudiantes/estudiantes.component').then(m => m.EstudiantesComponent)
      },
      {
        path: 'cursos',
        loadComponent: () => import('./components/dashboard/cursos/cursos.component').then(m => m.CursosComponent)
      },
      {
        path: 'reportes',
        loadComponent: () => import('./components/dashboard/reportes/reportes.component').then(m => m.ReportesComponent)
      },
      {
        path: '',
        redirectTo: 'estudiantes',
        pathMatch: 'full'
      }
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
