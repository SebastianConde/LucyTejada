import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Curso } from '../interfaces/estudiante'; // Usa siempre la misma interfaz
import { environment } from '../env/environment';
import { GetHeaderService } from './get-header.service';

@Injectable({ providedIn: 'root' })
export class CursoService {
  private apiUrl = `${environment.apiUrl}/lucyTejada`;

  constructor(private http: HttpClient, private headerService: GetHeaderService) {}

  obtenerMisCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.apiUrl}/mis-cursos`, {
      headers: this.headerService.getHeaders(),
    });
  }

  obtenerCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.apiUrl}/cursos`, {
      headers: this.headerService.getHeaders(),
    });
  }

  crearCurso(curso: Partial<Curso>): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(`${this.apiUrl}/crear-curso`, curso, {
      headers: this.headerService.getHeaders(),
    });
  }

  modificarCurso(id: number, curso: Partial<Curso>): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${this.apiUrl}/modificar-curso/${id}`, curso, {
      headers: this.headerService.getHeaders(),
    });
  }

  eliminarCurso(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.apiUrl}/eliminar-curso/${id}`, {
      headers: this.headerService.getHeaders(),
    });
  }

  obtenerCursoPorId(id: number): Observable<Curso> {
    return this.http.get<Curso>(`${this.apiUrl}/curso/${id}`, {
      headers: this.headerService.getHeaders(),
    });
  }
}