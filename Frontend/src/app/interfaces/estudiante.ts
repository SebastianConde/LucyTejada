export interface Estudiante {
  id?: number;
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
