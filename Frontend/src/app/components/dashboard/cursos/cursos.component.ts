// cursos.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CursoService } from '../../../services/curso.service';
import { Curso } from '../../../interfaces/curso';
import { LoginService } from '../../../services/login.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.scss']
})
export class CursosComponent implements OnInit {
  private cursoService = inject(CursoService);
  private router = inject(Router);
  private loginService = inject(LoginService);

  cursos: Curso[] = [];
  cursosFiltrados: Curso[] = [];

  filtro: string = '';
  cargando: boolean = false;
  error: string = '';
  mensajeExito: string = '';

  rol: string | null = this.loginService.getUserRole();

  paginaActual: number = 1;
  cursosPorPagina: number = 5;

  cursoAEliminar: Curso | null = null;
  mostrarModalEliminar: boolean = false;

  ngOnInit(): void {
    this.cargarCursos().subscribe({
      next: cursos => {
        this.cursos = cursos;
        this.cursosFiltrados = cursos;
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al cargar los cursos.';
        this.cargando = false;
      }
    });
  }

  cargarCursos(): Observable<Curso[]> {
    this.cargando = true;
    this.error = '';
    
    // Si es instructor, obtiene solo sus cursos asignados
    if (this.rol === 'ROLE_Instructor') {
      return this.cursoService.obtenerMisCursos();
    }
    
    // Si es coordinador, obtiene todos los cursos
    return this.cursoService.obtenerCursos();
  }

  trackByCurso(index: number, curso: Curso): number {
    return curso.id || index;
  }

  filtrarCursos(): void {
    if (!this.filtro.trim()) {
      this.cursosFiltrados = this.cursos;
    } else {
      const filtroLower = this.filtro.toLowerCase().trim();
      this.cursosFiltrados = this.cursos.filter(curso =>
        curso.nombre.toLowerCase().includes(filtroLower) ||
        curso.descripcion.toLowerCase().includes(filtroLower) ||
        curso.tipo.toLowerCase().includes(filtroLower) ||
        curso.duracion.toLowerCase().includes(filtroLower) ||
        curso.horarios.toLowerCase().includes(filtroLower) ||
        curso.zonaImparticion.toLowerCase().includes(filtroLower)
      );
    }
    this.paginaActual = 1;
  }

  onFiltroChange(): void {
    this.filtrarCursos();
  }

  nuevoCurso(): void {
    this.router.navigate(['/principal-web/crear-curso']);
  }

  editarCurso(curso: Curso): void {
    console.log('Editar curso:', curso);
    this.router.navigate(['/principal-web/editar-curso', curso.id]);
  }

  confirmarEliminacion(curso: Curso): void {
    this.cursoAEliminar = curso;
    this.mostrarModalEliminar = true;
  }

  cancelarEliminacion(): void {
    this.cursoAEliminar = null;
    this.mostrarModalEliminar = false;
  }

  eliminarCursoConfirmado(): void {
    if (!this.cursoAEliminar?.id) return;

    this.cargando = true;
    this.mensajeExito = '';
    this.mostrarModalEliminar = false;

    this.cursoService.eliminarCurso(this.cursoAEliminar.id).subscribe({
      next: (response) => {
        this.mensajeExito = response?.mensaje || 'Curso eliminado correctamente.';
        this.recargarCursosDespuesDeEliminar();
      },
      error: (error) => {
        console.warn('Se eliminó el curso, pero se recibió error del backend:', error);
        this.recargarCursosDespuesDeEliminar();
      }
    });
  }

  private recargarCursosDespuesDeEliminar(): void {
    this.cargarCursos().subscribe({
      next: cursos => {
        this.cursos = cursos;
        this.cursosFiltrados = cursos;
        this.cargando = false;
        this.cursoAEliminar = null;
      },
      error: () => {
        this.error = 'Error al cargar los cursos después de eliminar.';
        this.cargando = false;
        this.cursoAEliminar = null;
      }
    });
  }

  limpiarError(): void {
    this.error = '';
  }

  totalPaginas(): number {
    return Math.ceil(this.cursosFiltrados.length / this.cursosPorPagina);
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas()) {
      this.paginaActual = pagina;
    }
  }

  obtenerCursosPagina(): Curso[] {
    const inicio = (this.paginaActual - 1) * this.cursosPorPagina;
    const fin = inicio + this.cursosPorPagina;
    return this.cursosFiltrados.slice(inicio, fin);
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES');
  }
}