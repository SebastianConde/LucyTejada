import { Component, OnInit, inject } from '@angular/core';
import { CursoService } from '../../../services/curso.service';
import { Curso } from '../../../interfaces/estudiante';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../../services/login.service';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.scss']
})
export class CursosComponent implements OnInit {
  cursos: Curso[] = [];
  cursosFiltrados: Curso[] = [];
  filtro: string = '';
  cargando = false;
  error: string = '';
  mensajeExito: string = '';
  paginaActual = 1;
  cursosPorPagina = 10;
  mostrarModalEliminar = false;
  cursoAEliminar: Curso | null = null;
  rol: string = ''; // Debes obtener el rol real del usuario autenticado

  private cursoService = inject(CursoService);
  private router = inject(Router);
  private loginService = inject(LoginService);

  ngOnInit() {
    this.rol = this.loginService.getUserRole() ?? '';
    this.cargarCursos();
  }

  cargarCursos() {
    this.cargando = true;
    this.cursoService.obtenerCursos().subscribe({
      next: cursos => {
        this.cursos = cursos;
        this.cursosFiltrados = cursos;
        this.cargando = false;
      },
      error: err => {
        this.error = 'Error al cargar cursos';
        this.cargando = false;
      }
    });
  }

  onFiltroChange() {
    const filtroLower = this.filtro.toLowerCase();
    this.cursosFiltrados = this.cursos.filter(curso =>
      curso.nombre.toLowerCase().includes(filtroLower) ||
      curso.duracion.toLowerCase().includes(filtroLower) ||
      (curso.nombreInst?.toLowerCase().includes(filtroLower) ?? false)
    );
    this.paginaActual = 1;
  }

  obtenerCursosPagina() {
    const inicio = (this.paginaActual - 1) * this.cursosPorPagina;
    return this.cursosFiltrados.slice(inicio, inicio + this.cursosPorPagina);
  }

  totalPaginas() {
    return Math.ceil(this.cursosFiltrados.length / this.cursosPorPagina) || 1;
  }

  cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas()) {
      this.paginaActual = nuevaPagina;
    }
  }

  nuevoCurso() {
    this.router.navigate(['/principal-web/crear-curso']);
  }

  editarCurso(curso: Curso) {
    this.router.navigate(['/dashboard/cursos/editar', curso.id]);
  }

  confirmarEliminacion(curso: Curso) {
    this.cursoAEliminar = curso;
    this.mostrarModalEliminar = true;
  }

  cancelarEliminacion() {
    this.cursoAEliminar = null;
    this.mostrarModalEliminar = false;
  }

  eliminarCursoConfirmado() {
    if (!this.cursoAEliminar) return;
    this.cursoService.eliminarCurso(this.cursoAEliminar.id).subscribe({
      next: res => {
        this.cargarCursos();
        this.cancelarEliminacion();
      },
      error: err => {
        this.error = 'Error al eliminar el curso';
        this.cancelarEliminacion();
      }
    });
  }

  limpiarError() {
    this.error = '';
  }

  trackByCurso(index: number, curso: Curso) {
    return curso.id;
  }
}