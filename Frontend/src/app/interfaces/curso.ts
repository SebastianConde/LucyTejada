// interfaces/curso.ts
export interface Curso {
  id: number;
  nombre: string;
  descripcion?: string;
  instructorId: number;
  tipo: string;
  duracion: string;
  horarios?: string;
  zonaImparticion?: string;
  fechaInicio?: string;
}
