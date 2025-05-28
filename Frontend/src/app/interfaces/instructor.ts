export interface Instructor {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  especialidad?: string;
  activo?: boolean;
  createdAt?: string;
  updatedAt?: string;
}