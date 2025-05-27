// services/curso.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Curso, CrearCursoRequest, ModificarCursoRequest, CursoResponse } from '../interfaces/curso';
import { GetHeaderService } from './get-header.service';

@Injectable({ providedIn: 'root' })
export class CursoService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/lucyTejada';
  private getHeader = inject(GetHeaderService);

  // Obtener todos los cursos (Coordinador)
  obtenerCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.baseUrl}/cursos`, {
      headers: this.getHeader.getHeaders()
    });
  }

  // Obtener mis cursos asignados como instructor (Instructor)
  obtenerMisCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.baseUrl}/mis-cursos`, {
      headers: this.getHeader.getHeaders()
    });
  }

  // Obtener un curso por ID (Coordinador)
  obtenerCursoPorId(id: number): Observable<Curso> {
    return this.http.get<Curso>(`${this.baseUrl}/curso/${id}`, {
      headers: this.getHeader.getHeaders()
    });
  }

  // Obtener cursos por instructor (Coordinador)
  obtenerCursosPorInstructor(instructorId: number): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.baseUrl}/cursos/instructor/${instructorId}`, {
      headers: this.getHeader.getHeaders()
    });
  }

  // Crear curso (Coordinador)
  crearCurso(curso: CrearCursoRequest): Observable<CursoResponse> {
    return this.http.post<CursoResponse>(`${this.baseUrl}/crear-curso`, curso, {
      headers: this.getHeader.getHeaders()
    });
  }

  // Modificar curso (Coordinador)
  modificarCurso(id: number, curso: ModificarCursoRequest): Observable<CursoResponse> {
    return this.http.put<CursoResponse>(`${this.baseUrl}/modificar-curso/${id}`, curso, {
      headers: this.getHeader.getHeaders()
    });
  }

  // Eliminar curso (Coordinador)
  eliminarCurso(id: number): Observable<CursoResponse> {
    return this.http.delete<CursoResponse>(`${this.baseUrl}/eliminar-curso/${id}`, {
      headers: this.getHeader.getHeaders()
    });
  }
}