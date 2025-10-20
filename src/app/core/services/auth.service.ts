import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';

type Role = 'PACIENTE' | 'MEDICO' | 'ADMIN';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = `${environment.apiBaseUrl}/auth`;
  constructor(private http: HttpClient) {}

  login(body: { email: string; password: string }) {
    return this.http.post<any>(`${this.base}/login`, body, { observe: 'response' })
      .pipe(tap(res => {
        const bodyAny: any = res.body ?? {};
        const token =
          bodyAny.mensaje?.token ??
          bodyAny.message?.token ??
          bodyAny.token ??
          bodyAny.data?.token ??
          bodyAny.data;
        if (token) this.setSession(token);
      }));
  }

private setSession(token: string){
  localStorage.setItem('sv_token', token);

  const payload: any = this.decode(token) ?? {};
  console.log('JWT Payload decodificado:', payload);

  // role puede venir como ROLE_X o como 'PACIENTE'/'MEDICO'/'ADMIN'
  const rawRole = payload.rol ?? payload.role ?? payload.roles?.[0] ?? 'PACIENTE';
  const role = String(rawRole).replace(/ROLE_/i, '').toUpperCase();

  // Intentar múltiples campos para userId
  const userId = Number(
    payload.userId ?? 
    payload.id ?? 
    payload.user_id ?? 
    payload.idUsuario ?? 
    payload.idPaciente ??
    payload.idMedico ??
    payload.sub ?? 
    0
  );
  
  // Email puede venir en varios campos
  const email = String(payload.email ?? payload.sub ?? payload.username ?? '');

  console.log('Datos extraídos del JWT:', { userId, role, email });

  localStorage.setItem('sv_role', role);
  // Guardar userId incluso si es 0 para debugging
  localStorage.setItem('sv_userId', String(userId));
  if (email) localStorage.setItem('sv_email', email);
}

getEmail(): string | null {
  return localStorage.getItem('sv_email');
}



  private decode(t: string) {
    try { return JSON.parse(atob(t.split('.')[1])); } catch { return null; }
  }

  logout() {
    localStorage.removeItem('sv_token');
    localStorage.removeItem('sv_role');
    localStorage.removeItem('sv_userId');
  }

  getToken()  { return localStorage.getItem('sv_token'); }
  

  isLogged(): boolean { return !!localStorage.getItem('sv_token'); }



  getRole(): Role | null {
    const r = localStorage.getItem('sv_role') as Role | null;
    return r === 'PACIENTE' || r === 'MEDICO' || r === 'ADMIN' ? r : null;
  }
  getUserId(): number | null {
    const id = localStorage.getItem('sv_userId');
    return id ? Number(id) : null;
  }
}
