import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../interfaces/usuario';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
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

  rol: string | null = this.loginService.getUserRole();

  // Paginación
  paginaActual: number = 1;
  usuariosPorPagina: number = 5;

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  trackByUsuario(index: number, usuario: Usuario): string {
  return usuario.cedula || index.toString();
}

  cargarUsuarios(): void {
    this.cargando = true;
    this.error = '';

    this.usuarioService.obtenerUsuarios().subscribe({
      next: (usuarios) => {
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
    this.paginaActual = 1; // reiniciar a la primera página
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

  eliminarUsuario(usuario: Usuario): void {
    if (!usuario.cedula) {
      this.error = 'Error: No se puede eliminar el usuario, falta la cédula.';
      return;
    }
    const confirmacion = confirm(`¿Está seguro de que desea eliminar al usuario ${usuario.nombres} ${usuario.apellidos}?`);
    if (confirmacion) {
      this.cargando = true;
      this.usuarioService.eliminarUsuario(usuario.cedula).subscribe({
        next: (response) => {
          console.log('Usuario eliminado:', response.mensaje);
          this.cargarUsuarios(); // recarga los usuarios
        },
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
          this.error = 'Error al eliminar el usuario. Verifique permisos o intente nuevamente.';
          this.cargando = false;
        }
      });
    }
  }

  limpiarError(): void {
    this.error = '';
  }

  // Métodos de paginación
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
