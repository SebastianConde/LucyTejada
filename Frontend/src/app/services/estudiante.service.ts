import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Estudiante, EstudianteConCursos, RegistrarEstudianteRequest } from '../interfaces/estudiante';
import { environment } from '../env/environment';
import { GetHeaderService } from './get-header.service';

interface MensajeResponse {
  mensaje: string;
}

@Injectable({ providedIn: 'root' })
export class EstudianteService {
  private apiUrl = `${environment.apiUrl}/lucyTejada`;

  constructor(private http: HttpClient, private headerService: GetHeaderService) {}

  registrarEstudiante(est: RegistrarEstudianteRequest): Observable<MensajeResponse> {
    return this.http.post<MensajeResponse>(`${this.apiUrl}/registro-estudiantes`, est, {
      headers: this.headerService.getHeaders(),
    });
  }

  obtenerEstudiantes(): Observable<EstudianteConCursos[]> {
    return this.http.get<EstudianteConCursos[]>(`${this.apiUrl}/estudiantes`, {
      headers: this.headerService.getHeaders(),
    }).pipe(
      tap(estudiantes => {
        console.log('Estudiantes recibidos:', estudiantes);
      })
    );
  }

  eliminarEstudiante(id: number): Observable<MensajeResponse> {
    return this.http.delete<MensajeResponse>(`${this.apiUrl}/eliminar-estudiante/${id}`, {
      headers: this.headerService.getHeaders(),
    });
  }

  estudianteExiste(documento: string): Observable<{ existe: boolean }> {
    return this.http.get<{ existe: boolean }>(
      `${this.apiUrl}/estudiante-existe?documento=${encodeURIComponent(documento)}`,
      { headers: this.headerService.getHeaders() }
    );
  }

  inscribirEstudiante(documento: string, curso: string): Observable<MensajeResponse> {
    return this.http.post<MensajeResponse>(
      `${this.apiUrl}/inscribir-estudiante?documento=${encodeURIComponent(documento)}&curso=${encodeURIComponent(curso)}`,
      {},
      { headers: this.headerService.getHeaders() }
    );
  }

  editarEstudiante(id: number, estudiante: Partial<Estudiante>): Observable<MensajeResponse> {
    return this.http.put<MensajeResponse>(`${this.apiUrl}/editar-estudiante/${id}`, estudiante, {
      headers: this.headerService.getHeaders(),
    });
  }

}
