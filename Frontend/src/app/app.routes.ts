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
    path: 'recuperar-password/terminar',
    loadComponent: () => import('./components/finalizar-recuperacion/finalizar-recuperacion.component').then(m => m.FinalizarRecuperacionComponent),
    title: 'Restablecer Contraseña'
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
        path: 'home',
        loadComponent: () => import('./components/dashboard/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./components/dashboard/usuarios/usuarios.component').then(m => m.UsuariosComponent)
      },
      {
        path: 'editar-usuario/:id',
        loadComponent: () => import('./components/dashboard/editar-usuario/editar-usuario.component').then(m => m.EditarUsuarioComponent)
      },
      {
        path: 'registro',
        loadComponent: () => import('./components/dashboard/registro/registro.component').then(m => m.RegistroComponent)
      },
      {
        path: 'registro-estudiante',
        loadComponent: () => import('./components/dashboard/registrar-estudiante/registrar-estudiante.component').then(m => m.RegistroEstudianteComponent)
      },
      {
        path: 'editar-estudiante/:id',
        loadComponent: () => import('./components/dashboard/editar-estudiante/editar-estudiante.component').then(m => m.EditarEstudianteComponent)
      },
      {
        path: 'estudiantes',
        loadComponent: () => import('./components/dashboard/estudiantes/estudiantes.component').then(m => m.EstudiantesComponent)
      },
      {
        path: 'crear-curso',
        loadComponent: () => import('./components/dashboard/crear-curso/crear-curso.component').then(m => m.CrearCursoComponent)
      },
      {
        path: 'cursos',
        loadComponent: () => import('./components/dashboard/cursos/cursos.component').then(m => m.CursosComponent)
      },
      {
        path: 'cursos-editar/:id',
        loadComponent: () => import('./components/dashboard/editar-curso/editar-curso.component').then(m => m.EditarCursoComponent)
      },
      {
        path: 'reportes',
        loadComponent: () => import('./components/dashboard/reportes/reportes.component').then(m => m.ReportesComponent)
      },
      {
        path: '',
        redirectTo: 'home',
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
