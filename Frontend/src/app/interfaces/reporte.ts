export interface ReporteResponse {
  archivo: Blob;
  nombreArchivo?: string;
}

export interface ErrorResponse {
  mensaje: string;
  codigo?: number;
}