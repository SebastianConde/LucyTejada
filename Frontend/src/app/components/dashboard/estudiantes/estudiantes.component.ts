import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EstudianteService } from '../../../services/estudiante.service';
import { Estudiante, EstudianteConCursos } from '../../../interfaces/estudiante';
import { LoginService } from '../../../services/login.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-estudiantes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.scss']
})
export class EstudiantesComponent implements OnInit {
  private estudianteService = inject(EstudianteService);
  private router = inject(Router);
  private loginService = inject(LoginService);

  estudiantes: EstudianteConCursos[] = [];
  estudiantesFiltrados: EstudianteConCursos[] = [];

  filtro: string = '';
  cargando: boolean = false;
  error: string = '';
  mensajeExito: string = '';

  rol: string | null = this.loginService.getUserRole();
  esInstructor: boolean = false;
  esSoloLector: boolean = false;

  paginaActual: number = 1;
  estudiantesPorPagina: number = 5;

  estudianteAEliminar: EstudianteConCursos | null = null;
  mostrarModalEliminar: boolean = false;

  ngOnInit(): void {
    this.esInstructor = this.rol === 'ROLE_Instructor';
    this.esSoloLector = this.rol === 'ROLE_Coordinador' || this.rol === 'ROLE_Administrativo';

    this.cargarEstudiantes().subscribe({
      next: estudiantes => {
        this.estudiantes = estudiantes;
        this.estudiantesFiltrados = estudiantes;
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al cargar los estudiantes.';
        this.cargando = false;
      }
    });
  }

  cargarEstudiantes(): Observable<EstudianteConCursos[]> {
    this.cargando = true;
    this.error = '';
    return this.estudianteService.obtenerEstudiantes();
  }

  trackByEstudiante(index: number, estudianteConCursos: EstudianteConCursos): string {
    return estudianteConCursos.estudiante.id?.toString() || index.toString();
  }

filtrarEstudiantes(): void {
  const filtroLower = this.filtro.toLowerCase().trim();
  if (!filtroLower) {
    this.estudiantesFiltrados = this.estudiantes;
  } else {
    this.estudiantesFiltrados = this.estudiantes.filter(est => {
      const campos = [
        est.estudiante.documento?.toLowerCase() ?? '',
        est.estudiante.nombres?.toLowerCase() ?? '',
        est.estudiante.apellidos?.toLowerCase() ?? '',
        est.estudiante.correoElectronico?.toLowerCase() ?? '',
        est.estudiante.ciudadOrigen?.toLowerCase() ?? '',
        est.estudiante.ciudadResidencia?.toLowerCase() ?? ''
      ];
      // Solo muestra si la frase completa y en orden está en algún campo
      return campos.some(campo => campo.includes(filtroLower));
    });
  }
  this.paginaActual = 1;
}

  onFiltroChange(): void {
    this.filtrarEstudiantes();
  }

  nuevoEstudiante(): void {
    this.router.navigate(['/principal-web/registro-estudiante']);
  }

  editarEstudiante(estConCursos: EstudianteConCursos): void {
    this.router.navigate(['/principal-web/editar-estudiante', estConCursos.estudiante.id]);
  }

  confirmarEliminacion(estConCursos: EstudianteConCursos): void {
    this.estudianteAEliminar = estConCursos;
    this.mostrarModalEliminar = true;
  }

  cancelarEliminacion(): void {
    this.estudianteAEliminar = null;
    this.mostrarModalEliminar = false;
  }

  eliminarEstudianteConfirmado(): void {
    if (!this.esInstructor || !this.estudianteAEliminar?.estudiante.id) return;

    this.cargando = true;
    this.mensajeExito = '';
    this.mostrarModalEliminar = false;

    this.estudianteService.eliminarEstudiante(this.estudianteAEliminar.estudiante.id).subscribe({
      next: () => {
        this.recargarEstudiantes();
      },
      error: () => {
        this.recargarEstudiantes();
      }
    });
  }

  private recargarEstudiantes(): void {
    this.cargarEstudiantes().subscribe({
      next: (estudiantes) => {
        this.estudiantes = estudiantes;
        this.estudiantesFiltrados = estudiantes;
        this.cargando = false;
        this.estudianteAEliminar = null;
        this.filtrarEstudiantes(); // Aplica el filtro actual si existe
      },
      error: () => {
        this.error = 'Error al recargar los estudiantes.';
        this.cargando = false;
        this.estudianteAEliminar = null;
      }
    });
  }

  limpiarError(): void {
    this.error = '';
  }

  totalPaginas(): number {
    return Math.ceil(this.estudiantesFiltrados.length / this.estudiantesPorPagina);
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas()) {
      this.paginaActual = pagina;
    }
  }

  obtenerEstudiantesPagina(): EstudianteConCursos[] {
    const inicio = (this.paginaActual - 1) * this.estudiantesPorPagina;
    const fin = inicio + this.estudiantesPorPagina;
    return this.estudiantesFiltrados.slice(inicio, fin);
  }

  get cantidadEstudiantes(): number {
    return this.estudiantesFiltrados.length;
  }
  
}