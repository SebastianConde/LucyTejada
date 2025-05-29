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
  rol: string = '';

  private cursoService = inject(CursoService);
  private router = inject(Router);
  private loginService = inject(LoginService);

  ngOnInit() {
    this.rol = this.loginService.getUserRole() ?? '';
    this.cargarCursos();
  }

  cargarCursos() {
    this.cargando = true;
    const obs = this.rol === 'ROLE_Instructor'
      ? this.cursoService.obtenerMisCursos()
      : this.cursoService.obtenerCursos();

    obs.subscribe({
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
      const filtroLower = this.filtro.toLowerCase().trim();

      this.cursosFiltrados = this.cursos.filter(curso => {
        const campos = [
        (curso.instructorId ?? '').toString().toLowerCase(),
        (curso.docInst ?? '').toString().toLowerCase(),
        (curso.nombre ?? '').toLowerCase(),
        (curso.nombreInst ?? '').toLowerCase(),
        (curso.duracion ?? '').toLowerCase(),
        (curso.tipo ?? '').toLowerCase(),
        (curso.zonaImparticion ?? '').toLowerCase()
      ];
      // Si el filtro es una palabra, permite buscar solo por zona
      if (['centro', 'oeste', 'norte', 'sur', 'este', 'rural'].some(zona => filtroLower === zona)) {
        return (curso.zonaImparticion ?? '').toLowerCase().includes(filtroLower);
      }
      // Si no, busca en todos los campos
      return campos.some(campo => campo.includes(filtroLower));
    });
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
    this.router.navigate(['/principal-web/cursos-editar/', curso.id]);
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