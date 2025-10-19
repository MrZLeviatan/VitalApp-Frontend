import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  MedicoDto,
  EditarMedicoDto,
  EditarEmailDto,
  CambiarPasswordDto,
  CitaDto,
  CambiarEstadoCitaDto,
  RegistrarFormulaDto,
  AgendaDto
} from '../../shared/api.types';

@Injectable({ providedIn: 'root' })
export class MedicoService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/medico`;

  // ==================== PERFIL ====================
  verPerfil(id: number) {
    return this.http.get<ApiResponse<MedicoDto>>(`${this.base}/${id}`);
  }

  verPerfilPorEmail(email: string) {
    return this.http.get<ApiResponse<MedicoDto>>(`${this.base}/buscar-email`, {
      params: { email }
    });
  }

  editarPerfil(dto: EditarMedicoDto) {
    return this.http.put<ApiResponse<string>>(`${this.base}/editar-perfil`, dto);
  }

  editarEmail(dto: EditarEmailDto) {
    return this.http.put<ApiResponse<string>>(`${this.base}/editar-email`, dto);
  }

  cambiarPassword(dto: CambiarPasswordDto) {
    return this.http.put<ApiResponse<string>>(`${this.base}/editar-password`, dto);
  }

  verMiAgenda(idMedico: number) {
    return this.http.get<ApiResponse<AgendaDto[]>>(`${this.base}/${idMedico}/agenda`);
  }

  // ==================== CITAS ====================
  verMisCitas(idMedico: number) {
    return this.http.get<ApiResponse<CitaDto[]>>(`${this.base}/${idMedico}/citas`);
  }

  verCita(idCita: number) {
    return this.http.get<ApiResponse<CitaDto>>(`${this.base}/citas/${idCita}`);
  }

  ponerCitaEnRevision(dto: CambiarEstadoCitaDto) {
    return this.http.put<ApiResponse<string>>(`${this.base}/citas/revision`, dto);
  }

  registrarFormula(dto: RegistrarFormulaDto) {
    return this.http.post<ApiResponse<string>>(`${this.base}/cita/formula/registro`, dto);
  }
}

