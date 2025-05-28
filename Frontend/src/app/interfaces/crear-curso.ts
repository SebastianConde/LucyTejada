export interface CrearCursoRequest {
  nombre: string;
  descripcion: string;
  instructorId: number;
  tipo: 'Presencial' | 'Virtual';
  duracion: string;
  horarios: string;
  zonaImparticion: string;
  fechaInicio: string; // formato YYYY-MM-DD
}