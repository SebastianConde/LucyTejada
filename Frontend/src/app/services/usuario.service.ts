import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario, EliminarUsuarioResponse } from '../interfaces/usuario';
import { GetHeaderService } from './get-header.service';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private http = inject(HttpClient);
  private baseUrl = 'https://lucytejada.onrender.com/api/lucyTejada';
  private getHeader = inject(GetHeaderService);

  obtenerUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}/usuarios`, {
      headers: this.getHeader.getHeaders()
    });
  }

  eliminarUsuario(cedula: string): Observable<EliminarUsuarioResponse> {
    return this.http.request<EliminarUsuarioResponse>('delete', `${this.baseUrl}/eliminar`, {
      headers: this.getHeader.getHeaders(),
      body: { cedula }
    });
  }

  editarUsuario(id: number, usuario: Partial<Usuario>) {
    return this.http.put<{ mensaje: string }>(
      `${this.baseUrl}/editar?id=${id}`,
      usuario,
      { headers: this.getHeader.getHeaders() }
    );
  }
}

