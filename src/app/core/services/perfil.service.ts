// src/app/core/services/perfil.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/api.types';

@Injectable({ providedIn: 'root' })
export class PerfilService {
  private base = `${environment.apiBaseUrl}/paciente`;
  constructor(private http: HttpClient) {}

  detalle(id: number) {
    return this.http.get<ApiResponse<any>>(`${this.base}/${id}`);
  }
  detallePorEmail(email: string) {
    return this.http.get<ApiResponse<any>>(`${this.base}/buscar-email`, { params: { email }});
  }

  editarPerfil(dto: any) { // EditarPacienteDto
    return this.http.put<ApiResponse<string>>(`${this.base}/editar-perfil`, dto);
  }
  editarEmail(dto: any) { // EditarUserDto
    return this.http.put<ApiResponse<string>>(`${this.base}/editar-email`, dto);
  }
  editarPassword(dto: any) { // CambiarContraseniaDto
    return this.http.put<ApiResponse<string>>(`${this.base}/editar-password`, dto);
  }
  eliminarPerfil(dto: any) { // EliminarPacienteDto
    return this.http.delete<ApiResponse<string>>(`${this.base}/eliminar-perfil`, { body: dto });
  }
}
