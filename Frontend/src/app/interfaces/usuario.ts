export interface Usuario {
  id: number;
  cedula: string;
  nombres: string;
  apellidos: string;
  correoElectronico: string;
  rol: 'Administrativo' | 'Coordinador' | 'Instructor'; // puedes cambiar los valores según tu backend
  contrasena?: string | null; // usualmente viene null en creación
  fechaNacimiento?: string | null;
  direccion?: string | null;
  telefono?: string | null;
  sexo?: string | null;
  tipoSangre?: string | null;
}

export interface EliminarUsuarioResponse {
  mensaje: string;
}
