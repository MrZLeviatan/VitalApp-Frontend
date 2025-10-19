import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  EpsDto,
  RegistrarEpsDto,
  EspecialidadDto,
  RegistrarEspecialidadDto,
  MedicamentoDto,
  RegistrarMedicamentoDto,
  MedicoDto,
  RegistrarMedicoDto,
  EliminarMedicoDto,
  PacienteDto,
  RegistrarPacienteDto,
  CitaDto,
  FormulaDto,
  DetalleFormulaDto,
  ListaMedicosParams,
  ListaPacientesParams
} from '../../shared/api.types';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/admin`;

  // ==================== EPS ====================
  registrarEps(dto: RegistrarEpsDto) {
    return this.http.post<ApiResponse<EpsDto>>(`${this.base}/eps/registrar`, dto);
  }

  obtenerEps(id: number) {
    return this.http.get<ApiResponse<EpsDto>>(`${this.base}/eps/${id}`);
  }

  listarEps() {
    return this.http.get<ApiResponse<EpsDto[]>>(`${this.base}/eps/listar`);
  }

  // ==================== ESPECIALIDADES ====================
  registrarEspecialidad(dto: RegistrarEspecialidadDto) {
    return this.http.post<ApiResponse<EspecialidadDto>>(`${this.base}/especialidad/registro`, dto);
  }

  obtenerEspecialidad(id: number) {
    return this.http.get<ApiResponse<EspecialidadDto>>(`${this.base}/especialidad/${id}`);
  }

  listarEspecialidades() {
    return this.http.get<ApiResponse<EspecialidadDto[]>>(`${this.base}/especialidad/listar`);
  }

  // ==================== MEDICAMENTOS ====================
  registrarMedicamento(dto: RegistrarMedicamentoDto) {
    return this.http.post<ApiResponse<MedicamentoDto>>(`${this.base}/medicamento/registro`, dto);
  }

  obtenerMedicamento(id: number) {
    return this.http.get<ApiResponse<MedicamentoDto>>(`${this.base}/medicamento/${id}`);
  }

  listarMedicamentos() {
    return this.http.get<ApiResponse<MedicamentoDto[]>>(`${this.base}/medicamento/listar`);
  }

  // ==================== MÉDICOS ====================
  registrarMedico(dto: RegistrarMedicoDto) {
    return this.http.post<ApiResponse<MedicoDto>>(`${this.base}/medico/registro`, dto);
  }

  obtenerMedico(id: number) {
    return this.http.get<ApiResponse<MedicoDto>>(`${this.base}/medico/${id}`);
  }

  obtenerMedicoPorEmail(email: string) {
    return this.http.get<ApiResponse<MedicoDto>>(`${this.base}/medico/buscar-email`, {
      params: { email }
    });
  }

  eliminarMedico(dto: EliminarMedicoDto) {
    return this.http.delete<ApiResponse<string>>(`${this.base}/medico/eliminar-perfil`, {
      body: dto
    });
  }

  listarMedicos(params: ListaMedicosParams = {}) {
    let httpParams = new HttpParams();
    if (params.pagina !== undefined) httpParams = httpParams.set('pagina', params.pagina);
    if (params.size !== undefined) httpParams = httpParams.set('size', params.size);
    if (params.idEspecialidad) httpParams = httpParams.set('idEspecialidad', params.idEspecialidad);
    
    return this.http.get<ApiResponse<MedicoDto[]>>(`${this.base}/medico/listar`, { params: httpParams });
  }

  verAgendaMedico(idMedico: number) {
    return this.http.get<ApiResponse<any[]>>(`${this.base}/medicos/${idMedico}/agenda`);
  }

  verCitasMedico(idMedico: number) {
    return this.http.get<ApiResponse<CitaDto[]>>(`${this.base}/medico/${idMedico}/citas`);
  }

  // ==================== PACIENTES ====================
  registrarPaciente(dto: RegistrarPacienteDto) {
    return this.http.post<ApiResponse<PacienteDto>>(`${this.base}/paciente/registro`, dto);
  }

  obtenerPaciente(id: number) {
    return this.http.get<ApiResponse<PacienteDto>>(`${this.base}/paciente/${id}`);
  }

  obtenerPacientePorEmail(email: string) {
    return this.http.get<ApiResponse<PacienteDto>>(`${this.base}/paciente/buscar-email`, {
      params: { email }
    });
  }

  listarPacientes(params: ListaPacientesParams = {}) {
    let httpParams = new HttpParams();
    if (params.pagina !== undefined) httpParams = httpParams.set('pagina', params.pagina);
    if (params.size !== undefined) httpParams = httpParams.set('size', params.size);
    if (params.idEps) httpParams = httpParams.set('idEps', params.idEps);
    if (params.idCiudad) httpParams = httpParams.set('idCiudad', params.idCiudad);
    
    return this.http.get<ApiResponse<PacienteDto[]>>(`${this.base}/paciente/listar`, { params: httpParams });
  }

  verCitasPaciente(idPaciente: number) {
    return this.http.get<ApiResponse<CitaDto[]>>(`${this.base}/paciente/${idPaciente}/citas`);
  }

  verFormulasPaciente(idPaciente: number) {
    return this.http.get<ApiResponse<FormulaDto[]>>(`${this.base}/paciente/${idPaciente}/formula`);
  }

  verFormula(idFormula: number) {
    return this.http.get<ApiResponse<FormulaDto>>(`${this.base}/paciente/formula/${idFormula}`);
  }

  verDetallesFormula(idFormula: number) {
    return this.http.get<ApiResponse<DetalleFormulaDto[]>>(`${this.base}/paciente/formula/${idFormula}/detalles`);
  }
}

