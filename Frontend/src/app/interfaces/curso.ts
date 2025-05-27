// interfaces/curso.ts
export interface Curso {
  id: number;
  nombre: string;
  descripcion: string;
  instructorId: number;
  tipo: 'Presencial' | 'Virtual';
  duracion: string;
  horarios: string;
  zonaImparticion: string;
  fechaInicio: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CrearCursoRequest {
  nombre: string;
  descripcion: string;
  instructorId: number;
  tipo: 'Presencial' | 'Virtual';
  duracion: string;
  horarios: string;
  zonaImparticion: string;
  fechaInicio: string;
}

export interface ModificarCursoRequest {
  nombre: string;
  descripcion: string;
  instructorId: number;
  tipo: 'Presencial' | 'Virtual';
  duracion: string;
  horarios: string;
  zonaImparticion: string;
  fechaInicio: string;
}

export interface CursoResponse {
  mensaje: string;
}