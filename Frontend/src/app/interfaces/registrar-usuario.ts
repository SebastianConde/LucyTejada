export interface RegisterRequest {
  nombres: string;
  apellidos: string;
  cedula: string;
  correoElectronico: string;
  rol: string;
  contrasena?: string | null;
  fechaNacimiento?: string | null;
  direccion?: string | null;
  telefono?: string | null;
  sexo?: string | null;
  tipoSangre?: string | null;
}

export interface RegistroUsuarioResponse {
  mensaje: string;
}