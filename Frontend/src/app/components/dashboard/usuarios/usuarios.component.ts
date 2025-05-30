import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../interfaces/usuario';
import { LoginService } from '../../../services/login.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private loginService = inject(LoginService);

  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];

  filtro: string = '';
  cargando: boolean = false;
  error: string = '';
  mensajeExito: string = '';

  rol: string | null = this.loginService.getUserRole();

  paginaActual: number = 1;
  usuariosPorPagina: number = 5;

  usuarioAEliminar: Usuario | null = null;
  mostrarModalEliminar: boolean = false;

  ngOnInit(): void {
    this.cargarUsuarios().subscribe({
      next: usuarios => {
        this.usuarios = usuarios;
        this.usuariosFiltrados = usuarios;
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al cargar los usuarios.';
        this.cargando = false;
      }
    });
  }

  cargarUsuarios(): Observable<Usuario[]> {
    this.cargando = true;
    this.error = '';
    return this.usuarioService.obtenerUsuarios();
  }

  trackByUsuario(index: number, usuario: Usuario): string {
    return usuario.cedula || index.toString();
  }

  onFiltroChange() {
    const filtroLower = this.filtro.toLowerCase().trim();

    this.usuariosFiltrados = this.usuarios.filter(usuario => {
      const cedula = String(usuario.cedula ?? '').toLowerCase();
      const otrosCampos = [
        (usuario.nombres ?? '').toLowerCase(),
        (usuario.apellidos ?? '').toLowerCase(),
        (usuario.rol ?? '').toLowerCase(),
        (usuario.correoElectronico ?? '').toLowerCase()
      ];
      // Si el filtro es numérico, busca solo al inicio de la cédula
      if (/^\d+$/.test(filtroLower)) {
        return cedula.startsWith(filtroLower);
      }
      // Si es texto, busca en los demás campos
      return otrosCampos.some(campo => campo.includes(filtroLower));
    });
    this.paginaActual = 1;
  }

  nuevoUsuario(): void {
    this.router.navigate(['/principal-web/registro']);
  }

  editarUsuario(usuario: Usuario): void {
    this.router.navigate(['/principal-web/editar-usuario/', usuario.id]);
  }

  confirmarEliminacion(usuario: Usuario): void {
    this.usuarioAEliminar = usuario;
    this.mostrarModalEliminar = true;
  }

  cancelarEliminacion(): void {
    this.usuarioAEliminar = null;
    this.mostrarModalEliminar = false;
  }

  eliminarUsuarioConfirmado(): void {
    if (!this.usuarioAEliminar?.cedula) return;

    this.cargando = true;
    this.mensajeExito = '';
    this.mostrarModalEliminar = false;

    this.usuarioService.eliminarUsuario(this.usuarioAEliminar.cedula).subscribe({
      next: (response) => {
        this.recargarUsuariosDespuesDeEliminar();
      },
      error: (error) => {
        console.warn('Se eliminó el usuario, pero se recibió error del backend:', error);
        this.recargarUsuariosDespuesDeEliminar();
      }
    });
  }

  private recargarUsuariosDespuesDeEliminar(): void {
    this.cargarUsuarios().subscribe({
      next: usuarios => {
        this.usuarios = usuarios;
        this.usuariosFiltrados = usuarios;
        this.cargando = false;
        this.usuarioAEliminar = null;
      },
      error: () => {
        this.error = 'Error al cargar los usuarios después de eliminar.';
        this.cargando = false;
        this.usuarioAEliminar = null;
      }
    });
  }

  limpiarError(): void {
    this.error = '';
  }

  totalPaginas(): number {
    return Math.ceil(this.usuariosFiltrados.length / this.usuariosPorPagina);
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas()) {
      this.paginaActual = pagina;
    }
  }

  obtenerUsuariosPagina(): Usuario[] {
    const inicio = (this.paginaActual - 1) * this.usuariosPorPagina;
    const fin = inicio + this.usuariosPorPagina;
    return this.usuariosFiltrados.slice(inicio, fin);
  }
}
