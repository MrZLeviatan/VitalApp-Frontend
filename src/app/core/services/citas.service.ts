import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/api.types';

@Injectable({ providedIn: 'root' })
export class CitasService {
  private base = `${environment.apiBaseUrl}/paciente`;
  constructor(private http: HttpClient) {}

  // --------- CITAS ----------
  registrar(dto: { observaciones: string; idPaciente: number; idMedico: number; idAgenda: number }) {
    return this.http.post<ApiResponse<string>>(`${this.base}/citas/registro`, dto);
  }

  pendientes(idPaciente: number) {
    return this.http.get<ApiResponse<any[]>>(`${this.base}/${idPaciente}/citas/pendientes`);
  }

  listarPorPaciente(idPaciente: number) {
    return this.http.get<ApiResponse<any[]>>(`${this.base}/${idPaciente}/citas`);
  }

  detalle(idCita: number) {
    return this.http.get<ApiResponse<any>>(`${this.base}/citas/${idCita}`);
  }

  cancelar(dto: { idCita: number }) {
    // El controller usa PUT /citas/cancelar con body CambiarEstadoCitaDto
    return this.http.put<ApiResponse<string>>(`${this.base}/citas/cancelar`, dto);
  }

  // --------- REGISTRO (especialidad/medico/agenda) ----------
  especialidades() {
    return this.http.get<ApiResponse<any[]>>(`${this.base}/citas/registro/especialidades`);
  }
  medicosPorEspecialidad(idEspecializacion: number) {
    return this.http.get<ApiResponse<any[]>>(`${this.base}/citas/registro/especialidades/${idEspecializacion}/medicos`);
  }
  agendaDeMedico(idMedico: number) {
    return this.http.get<ApiResponse<any[]>>(`${this.base}/citas/medicos/${idMedico}/agenda`);
  }
}
