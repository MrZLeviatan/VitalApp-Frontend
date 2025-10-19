import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  PacienteDto,
  EditarPacienteDto,
  EditarEmailDto,
  CambiarPasswordDto,
  EliminarPacienteDto,
  CitaDto,
  RegistrarCitaDto,
  CambiarEstadoCitaDto,
  EspecialidadDto,
  MedicoDto,
  AgendaDto,
  FormulaDto,
  DetalleFormulaDto
} from '../../shared/api.types';

@Injectable({ providedIn: 'root' })
export class PacienteService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/paciente`;

  // ==================== PERFIL ====================
  verPerfil(id: number) {
    return this.http.get<ApiResponse<PacienteDto>>(`${this.base}/${id}`);
  }

  verPerfilPorEmail(email: string) {
    return this.http.get<ApiResponse<PacienteDto>>(`${this.base}/buscar-email`, {
      params: { email }
    });
  }

  editarPerfil(dto: EditarPacienteDto) {
    return this.http.put<ApiResponse<string>>(`${this.base}/editar-perfil`, dto);
  }

  editarEmail(dto: EditarEmailDto) {
    return this.http.put<ApiResponse<string>>(`${this.base}/editar-email`, dto);
  }

  cambiarPassword(dto: CambiarPasswordDto) {
    return this.http.put<ApiResponse<string>>(`${this.base}/editar-password`, dto);
  }

  eliminarPerfil(dto: EliminarPacienteDto) {
    return this.http.delete<ApiResponse<string>>(`${this.base}/eliminar-perfil`, {
      body: dto
    });
  }

  // ==================== CITAS ====================
  registrarCita(dto: RegistrarCitaDto) {
    return this.http.post<ApiResponse<string>>(`${this.base}/citas/registro`, dto);
  }

  verCitasPendientes(idPaciente: number) {
    return this.http.get<ApiResponse<CitaDto[]>>(`${this.base}/${idPaciente}/citas/pendientes`);
  }

  verMisCitas(idPaciente: number) {
    return this.http.get<ApiResponse<CitaDto[]>>(`${this.base}/${idPaciente}/citas`);
  }

  verCita(idCita: number) {
    return this.http.get<ApiResponse<CitaDto>>(`${this.base}/citas/${idCita}`);
  }

  cancelarCita(dto: CambiarEstadoCitaDto) {
    return this.http.put<ApiResponse<string>>(`${this.base}/citas/cancelar`, dto);
  }

  // ==================== REGISTRO CITAS (especialidades/médicos/agenda) ====================
  listarEspecialidades() {
    return this.http.get<ApiResponse<EspecialidadDto[]>>(`${this.base}/citas/registro/especialidades`);
  }

  listarMedicosPorEspecialidad(idEspecialidad: number) {
    return this.http.get<ApiResponse<MedicoDto[]>>(`${this.base}/citas/registro/especialidades/${idEspecialidad}/medicos`);
  }

  verAgendaMedico(idMedico: number) {
    return this.http.get<ApiResponse<AgendaDto[]>>(`${this.base}/citas/medicos/${idMedico}/agenda`);
  }

  // ==================== FÓRMULAS ====================
  verMisFormulas(idPaciente: number) {
    return this.http.get<ApiResponse<FormulaDto[]>>(`${this.base}/${idPaciente}/formula`);
  }

  verFormula(idFormula: number) {
    return this.http.get<ApiResponse<FormulaDto>>(`${this.base}/formula/${idFormula}`);
  }

  verDetallesFormula(idFormula: number) {
    return this.http.get<ApiResponse<DetalleFormulaDto[]>>(`${this.base}/formula/${idFormula}/detalles`);
  }
}

