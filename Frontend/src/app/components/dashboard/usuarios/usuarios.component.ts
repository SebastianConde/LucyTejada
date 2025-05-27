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

  filtrarUsuarios(): void {
    if (!this.filtro.trim()) {
      this.usuariosFiltrados = this.usuarios;
    } else {
      const filtroLower = this.filtro.toLowerCase().trim();
      this.usuariosFiltrados = this.usuarios.filter(usuario =>
        usuario.cedula.toLowerCase().includes(filtroLower) ||
        usuario.nombres.toLowerCase().includes(filtroLower) ||
        usuario.apellidos.toLowerCase().includes(filtroLower) ||
        usuario.rol.toLowerCase().includes(filtroLower) ||
        usuario.correoElectronico.toLowerCase().includes(filtroLower)
      );
    }
    this.paginaActual = 1;
  }

  onFiltroChange(): void {
    this.filtrarUsuarios();
  }

  nuevoUsuario(): void {
    this.router.navigate(['/principal-web/registro']);
  }

  editarUsuario(usuario: Usuario): void {
    console.log('Editar usuario:', usuario);
    // this.router.navigate(['/principal-web/editar-usuario', usuario.id]);
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
        this.mensajeExito = response?.mensaje || 'Usuario eliminado correctamente.';
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
