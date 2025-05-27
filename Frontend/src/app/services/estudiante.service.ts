import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estudiante } from '../interfaces/estudiante';
import { environment } from '../env/environment';
import { GetHeaderService } from './get-header.service';

interface MensajeResponse {
  mensaje: string;
}

@Injectable({ providedIn: 'root' })
export class EstudianteService {
  private apiUrl = `${environment.apiUrl}/lucyTejada`;

  constructor(private http: HttpClient, private headerService: GetHeaderService) {}

  registrarEstudiante(est: Estudiante): Observable<MensajeResponse> {
    return this.http.post<MensajeResponse>(`${this.apiUrl}/registro-estudiantes`, est, {
      headers: this.headerService.getHeaders(),
    });
  }

  obtenerEstudiantes(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(`${this.apiUrl}/estudiantes`, {
      headers: this.headerService.getHeaders(),
    });
  }

  eliminarEstudiante(id: number): Observable<MensajeResponse> {
    return this.http.delete<MensajeResponse>(`${this.apiUrl}/eliminar-estudiante/${id}`, {
      headers: this.headerService.getHeaders(),
    });
  }
}
