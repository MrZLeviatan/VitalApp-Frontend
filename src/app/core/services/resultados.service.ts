import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResponse, FormulaDto, DetalleFormulaDto } from '../../shared/api.types';

@Injectable({ providedIn: 'root' })
export class ResultadosService {
  private base = `${environment.apiBaseUrl}/admin`;

  constructor(private http: HttpClient) {}

  // todas las fórmulas del paciente
  formulasPaciente(idPaciente: number) {
    return this.http.get<ApiResponse<FormulaDto[]>>(`${this.base}/paciente/${idPaciente}/formula`);
  }

  // una fórmula
  formula(idFormula: number) {
    return this.http.get<ApiResponse<FormulaDto>>(`${this.base}/paciente/formula/${idFormula}`);
  }

  // detalles de la fórmula
  detallesFormula(idFormula: number) {
    return this.http.get<ApiResponse<DetalleFormulaDto[]>>(`${this.base}/paciente/formula/${idFormula}/detalles`);
  }
}

