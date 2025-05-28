// services/curso.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Curso } from '../interfaces/curso';
import { GetHeaderService } from './get-header.service';

interface MensajeResponse {
  mensaje: string;
}

@Injectable({ providedIn: 'root' })
export class CursoService {
  private http = inject(HttpClient);
  private headers = inject(GetHeaderService);
  private apiUrl = 'http://localhost:8080/api/lucyTejada';

  obtenerCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.apiUrl}/cursos`, {
      headers: this.headers.getHeaders(),
    });
  }

  eliminarCurso(id: number): Observable<MensajeResponse> {
    return this.http.delete<MensajeResponse>(`${this.apiUrl}/eliminar-curso/${id}`, {
      headers: this.headers.getHeaders(),
    });
  }
}
