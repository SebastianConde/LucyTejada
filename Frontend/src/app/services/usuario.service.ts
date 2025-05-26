import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario';
import { EliminarUsuarioResponse } from '../interfaces/usuario'; 
import { LoginService } from './login.service';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private http = inject(HttpClient);
  private loginService = inject(LoginService);
  private baseUrl = 'http://localhost:8080/api/lucyTejada';

  private getHeaders(): HttpHeaders {
    const token = this.loginService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  obtenerUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}/usuarios`, {
      headers: this.getHeaders()
    });
  }

  eliminarUsuario(cedula: string): Observable<EliminarUsuarioResponse> {
    return this.http.request<EliminarUsuarioResponse>('delete', `${this.baseUrl}/eliminar`, {
      headers: this.getHeaders(),
      body: { cedula }
    });
  }
}
