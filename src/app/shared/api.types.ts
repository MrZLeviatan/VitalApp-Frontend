export type Role = 'PACIENTE' | 'MEDICO' | 'ADMIN';

/** En muchos controladores devuelven { error, mensaje } o { error, data } */
export interface ApiResponse<T> {
  error: boolean;
  mensaje?: T | string;   // algunos devuelven el payload dentro de "mensaje"
  data?: T;               // otros devuelven el payload en "data"
}

/** --------- Citas --------- */
export interface CitaDto {
  id: number;
  especialidad?: string;       // o nombreEspecialidad
  fecha?: string;              // o fecha2
  estado?: string;             // o estadoCita
}

export interface RegistrarCitaDto {
  observaciones: string;
  idPaciente: number;
  idMedico: number;
  idAgenda: number;
}

export interface CambiarEstadoCitaDto {
  idCita: number;
}

/** --------- Perfil --------- */
export interface PacienteDto {
  id: number;
  nombre: string;
  documento: string;
  correo: string;
  telefono?: string;
}

export interface EditarPacienteDto {
  id: number;
  nombre: string;
  documento: string;
  correo: string;
  telefono: string;
}

export interface EditarUserDto {
  idUser: number;
  email: string;
}

export interface CambiarContraseniaDto {
  idUser: number;
  password: string;
}

export interface EliminarPacienteDto {
  id: number;
}

/** --------- Resultados/Fórmulas --------- */
export interface FormulaDto {
  id: number;
  fecha: string;
  descripcion?: string;
}

export interface DetalleFormulaDto {
  id: number;
  nombre: string;
  valor: string;
  unidad?: string;
}

