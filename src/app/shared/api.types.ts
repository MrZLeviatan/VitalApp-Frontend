export type Role = 'PACIENTE' | 'MEDICO' | 'ADMIN';

/** En muchos controladores devuelven { error, mensaje } o { error, data } */
export interface ApiResponse<T> {
  error: boolean;
  mensaje?: T | string;
  data?: T;
}

/** --------- Auth --------- */
export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  mensaje?: { token: string };
  message?: { token: string };
  data?: string | { token: string };
}

/** --------- EPS --------- */
export interface EpsDto {
  id: number;
  nombre: string;
}

export interface RegistrarEpsDto {
  nombre: string;
}

/** --------- Especialidades --------- */
export interface EspecialidadDto {
  id: number;
  especialidad: string;
}

export interface RegistrarEspecialidadDto {
  especialidad: string;
}

/** --------- Medicamentos --------- */
export interface MedicamentoDto {
  id: number;
  nombre: string;
  precio: number;
}

export interface RegistrarMedicamentoDto {
  nombre: string;
  precio: number;
}

/** --------- Médicos --------- */
export interface MedicoDto {
  id: number;
  nombre: string;
  email?: string;
  especialidad?: string;
  telefonos?: TelefonoDto[];
}

export interface RegistrarMedicoDto {
  nombre: string;
  user: {
    email: string;
    password: string;
  };
  telefonos: TelefonoDto[];
  idEspecialidad: number;
}

export interface EditarMedicoDto {
  id: number;
  password: string;
  nombre: string;
}

export interface EliminarMedicoDto {
  idMedico: number;
}

/** --------- Pacientes --------- */
export interface PacienteDto {
  id: number;
  nombre: string;
  email?: string;
  documento?: string;
  correo?: string;
  telefono?: string;
  telefonos?: TelefonoDto[];
  eps?: EpsDto;
  ciudad?: CiudadDto;
}

export interface RegistrarPacienteDto {
  nombre: string;
  crearUserDto: {
    email: string;
    password: string;
  };
  idEps: number;
  idCiudad: number;
  telefonos: TelefonoDto[];
}

export interface EditarPacienteDto {
  id: number;
  nombre: string;
  idCiudad?: number;
}

export interface EditarEmailDto {
  id: number;
  emailNuevo: string;
  password: string;
}

export interface CambiarPasswordDto {
  id: number;
  antiguoPassword: string;
  nuevoPassword: string;
}

export interface EliminarPacienteDto {
  idPaciente: number;
  password: string;
}

/** --------- Citas --------- */
export interface CitaDto {
  id: number;
  especialidad?: string;
  fecha?: string;
  estado?: string;
  observaciones?: string;
  paciente?: PacienteDto;
  medico?: MedicoDto;
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

/** --------- Agenda --------- */
export interface AgendaDto {
  id: number;
  fecha: string;
  horaInicio?: string;
  horaFin?: string;
  disponible?: boolean;
}

/** --------- Fórmulas --------- */
export interface FormulaDto {
  id: number;
  fecha: string;
  descripcion?: string;
  paciente?: PacienteDto;
  medico?: MedicoDto;
  cita?: CitaDto;
}

export interface DetalleFormulaDto {
  id: number;
  cantidad: number;
  observaciones?: string;
  dosis: string;
  medicamento?: MedicamentoDto;
  nombre?: string;
  valor?: string;
  unidad?: string;
}

export interface RegistrarFormulaDto {
  idPaciente: number;
  idCita: number;
  detallesFormula: {
    cantidad: number;
    observaciones: string;
    dosis: string;
    idMedicamento: number;
  }[];
}

/** --------- Auxiliares --------- */
export interface TelefonoDto {
  numero: string;
}

export interface CiudadDto {
  id: number;
  nombre: string;
}

/** --------- Paginación --------- */
export interface PaginacionParams {
  pagina?: number;
  size?: number;
}

export interface ListaMedicosParams extends PaginacionParams {
  idEspecialidad?: number;
}

export interface ListaPacientesParams extends PaginacionParams {
  idEps?: number;
  idCiudad?: number;
}

