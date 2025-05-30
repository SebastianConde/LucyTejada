// components/reportes/reportes.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteService } from '../../../services/reporte.service';
import { AlertsComponent } from '../../alerts/error-alerts.component';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, AlertsComponent],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent {
  private readonly reporteService = inject(ReporteService);

  // Estados para feedback visual
  descargando: boolean = false;
  mensajeSuccess: string | null = null;
  tituloSuccess: string = '';
   tipoAlerta: 'error' | 'success' | 'info' = 'error';

  descargarReporteGeneral(): void {
    if (this.descargando) return; // Prevenir múltiples descargas simultáneas

    this.descargando = true;
    this.mensajeSuccess = null;

    this.reporteService.obtenerReporteGeneral().subscribe({
      next: (blob: Blob) => {
        try {
          // Generar nombre con fecha actual
          const fecha = new Date().toISOString().split('T')[0];
          const nombreArchivo = `reporte-general-${fecha}.xlsx`;
          
          // Descargar archivo
          this.reporteService.descargarArchivo(blob, nombreArchivo);
          
          // Mostrar mensaje de éxito
          this.tipoAlerta = 'success';
          this.tituloSuccess = 'Éxito';
          this.mensajeSuccess = 'Reporte descargado correctamente.';
          
        } catch (error) {
          console.error('Error al procesar descarga:', error);
          this.tipoAlerta = 'error';
          this.tituloSuccess = 'Error';
          this.mensajeSuccess = 'Error al procesar la descarga del archivo.';
        } finally {
          this.descargando = false;
        }
      },
      error: (error) => {
        console.error('Error al descargar reporte:', error);
        this.descargando = false;
        
        this.tipoAlerta = 'error';
        this.tituloSuccess = 'Error';
        
        if (error.status === 401) {
          this.mensajeSuccess = 'No tiene permisos para descargar el reporte.';
        } else if (error.status === 404) {
          this.mensajeSuccess = 'Reporte no encontrado.';
        } else if (error.status === 500) {
          this.mensajeSuccess = 'Error interno del servidor. Intente más tarde.';
        } else {
          this.mensajeSuccess = 'Error al descargar el reporte. Verifique su conexión.';
        }
      }
    });
  }

  cerrarAlerta(): void {
    this.mensajeSuccess = null;
  }
}