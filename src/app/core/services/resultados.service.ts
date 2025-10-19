import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResponse, FormulaDto, DetalleFormulaDto } from '../../shared/api.types';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ResultadosService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  /** Devuelve '/api/paciente' | '/api/admin' según el rol */
  private get base(): string {
    const role = this.auth.getRole() ?? 'PACIENTE';
    const segment = role === 'ADMIN' ? 'admin' : 'paciente';
    return `${environment.apiBaseUrl}/${segment}`;
  }

  // todas las fórmulas del paciente
  formulasPaciente(idPaciente: number) {
    const role = this.auth.getRole();
    if (role === 'ADMIN') {
      return this.http.get<ApiResponse<FormulaDto[]>>(`${environment.apiBaseUrl}/admin/paciente/${idPaciente}/formula`);
    }
    return this.http.get<ApiResponse<FormulaDto[]>>(`${environment.apiBaseUrl}/paciente/${idPaciente}/formula`);
  }

  // una fórmula
  formula(idFormula: number) {
    const role = this.auth.getRole();
    if (role === 'ADMIN') {
      return this.http.get<ApiResponse<FormulaDto>>(`${environment.apiBaseUrl}/admin/paciente/formula/${idFormula}`);
    }
    return this.http.get<ApiResponse<FormulaDto>>(`${environment.apiBaseUrl}/paciente/formula/${idFormula}`);
  }

  // detalles de la fórmula
  detallesFormula(idFormula: number) {
    const role = this.auth.getRole();
    if (role === 'ADMIN') {
      return this.http.get<ApiResponse<DetalleFormulaDto[]>>(`${environment.apiBaseUrl}/admin/paciente/formula/${idFormula}/detalles`);
    }
    return this.http.get<ApiResponse<DetalleFormulaDto[]>>(`${environment.apiBaseUrl}/paciente/formula/${idFormula}/detalles`);
  }
}

