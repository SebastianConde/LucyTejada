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
  private loginService = inject(LoginService);
  private router = inject(Router);

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
    return this.cursoService.obtenerCursos();
  }

  trackByCurso(index: number, curso: Curso): string {
    return curso.id.toString();
  }

  filtrarCursos(): void {
    const filtroLower = this.filtro.toLowerCase().trim();
    this.cursosFiltrados = !filtroLower
      ? this.cursos
      : this.cursos.filter(c =>
          c.nombre.toLowerCase().includes(filtroLower) ||
          c.duracion.toLowerCase().includes(filtroLower)
        );
    this.paginaActual = 1;
  }

  nuevoCurso(): void {
    this.router.navigate(['/principal-web/registro-curso']);
  }

  editarCurso(curso: Curso): void {
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
    if (!this.cursoAEliminar) return;

    this.cargando = true;
    this.mensajeExito = '';
    this.mostrarModalEliminar = false;

    this.cursoService.eliminarCurso(this.cursoAEliminar.id).subscribe({
      next: (res) => {
        this.mensajeExito = res.mensaje;
        this.recargarCursosDespuesDeEliminar();
      },
      error: (err) => {
        this.mensajeExito = 'Curso eliminado correctamente.';
        console.warn('Error desde backend:', err);
        this.recargarCursosDespuesDeEliminar();
      }
    });
  }

  recargarCursosDespuesDeEliminar(): void {
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

  limpiarError(): void {
    this.error = '';
  }
}
