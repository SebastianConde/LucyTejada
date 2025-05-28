export interface Estudiante {
  id: number;
  tipoDocumento: 'CC' | 'TI';
  documento: string;
  nombres: string;
  apellidos: string;
  correoElectronico: string;
  ciudadOrigen: string;
  ciudadResidencia: string;
  direccion: string;
  telefono: string;
  tipoSangre: string;
  sexo: 'Masculino' | 'Femenino' | 'Otro';
  createdAt: string;  // ISO 8601 datetime
  updatedAt: string;
}

export interface Curso {
  id: number;
  nombre: string;
  descripcion: string;
  instructorId: number;
  tipo: 'Virtual' | 'Presencial';
  duracion: string;
  horarios: string;
  zonaImparticion: string;
  fechaInicio: string;
  createdAt: string;
  updatedAt: string;
  // Cambia los nombres para que coincidan con el backend
  nombreInst?: string;
  docInst?: string;
}

export interface RegistrarEstudianteRequest {
  tipoDocumento: 'CC' | 'TI';
  documento: string;
  nombres: string;
  apellidos: string;
  correoElectronico: string;
  ciudadOrigen: string;
  ciudadResidencia: string;
  direccion: string;
  telefono: string;
  tipoSangre: string;
  sexo: 'Masculino' | 'Femenino' | 'Otro';
  latitud: number;
  longitud: number;
  curso: string;
}

export interface EstudianteConCursos {
  estudiante: Estudiante;
  cursos: Curso[];
}
