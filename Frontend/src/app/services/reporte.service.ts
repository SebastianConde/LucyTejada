// services/reporte.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { GetHeaderService } from './get-header.service';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private readonly http = inject(HttpClient);
  private readonly getHeaderService = inject(GetHeaderService);
  private readonly baseUrl = 'http://localhost:8080/api/lucyTejada';

  obtenerReporteGeneral(): Observable<Blob> {
    // Para archivos binarios, necesitamos headers específicos
    const headers = new HttpHeaders({
      'Authorization': this.getHeaderService.getHeaders().get('Authorization') || ''
    });

    return this.http.get(`${this.baseUrl}/reporte-general`, {
      headers: headers,
      responseType: 'blob' // Importante: especificar que esperamos un blob
    }).pipe(
      catchError(error => {
        console.error('Error al obtener reporte:', error);
        return throwError(() => error);
      })
    );
  }

  descargarArchivo(blob: Blob, nombreArchivo = 'reporte-general.xlsx'): void {
    // Crear URL del blob
    const url = window.URL.createObjectURL(blob);
    
    // Crear elemento anchor para descargar
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    
    // Agregar al DOM temporalmente y hacer click
    document.body.appendChild(link);
    link.click();
    
    // Limpiar
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}