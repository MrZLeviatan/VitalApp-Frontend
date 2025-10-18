import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/api.types';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class PerfilService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  /** Devuelve '/api/paciente' | '/api/medico' | '/api/admin' */
  private get base(): string {
    const role = this.auth.getRole() ?? 'PACIENTE';
    const segment = role === 'MEDICO' ? 'medico' : role === 'ADMIN' ? 'admin' : 'paciente';
    return `${environment.apiBaseUrl}/${segment}`;
  }

  detalle(id: number) {
    return this.http.get<ApiResponse<any>>(`${this.base}/${id}`);
  }

  detallePorEmail(email: string) {
    // si tu backend usa otra ruta cámbiala aquí ('/buscar-email' es un ejemplo muy común)
    return this.http.get<ApiResponse<any>>(`${this.base}/buscar-email`, { params: { email } });
  }

  editarPerfil(dto: any) {
    return this.http.put<ApiResponse<string>>(`${this.base}/editar-perfil`, dto);
  }

  editarEmail(dto: any) {
    return this.http.put<ApiResponse<string>>(`${this.base}/editar-email`, dto);
  }

  editarPassword(dto: any) {
    return this.http.put<ApiResponse<string>>(`${this.base}/editar-password`, dto);
  }

  eliminarPerfil(dto: any) {
    return this.http.delete<ApiResponse<string>>(`${this.base}/eliminar-perfil`, { body: dto });
  }
}

