import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/api.types';
import { tap } from 'rxjs/operators';
import { Role } from '../../shared/api.types';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = `${environment.apiBaseUrl}/auth`;
  constructor(private http: HttpClient) {}

  login(body: { email: string; password: string }) {
  
  return this.http.post<any>(`${this.base}/login`, body, { observe: 'response' })
  .pipe(tap(res => {
    const body: any = res.body;
    const token =
      body?.mensaje?.token ??
      body?.message?.token ??
      body?.token ??
      body?.data?.token ??
      body?.data;
    if (token) this.setSession(token);
  }));

}


  private setSession(token: string){
  localStorage.setItem('sv_token', token);
  const payload: any = this.decode(token) ?? {};

  
  const rawRole = payload.rol ?? payload.role ?? payload.roles?.[0] ?? 'PACIENTE';
  const role = String(rawRole).replace(/^ROLE_/i, '').toUpperCase();

  const userId = Number(payload.userId ?? payload.id ?? payload.sub ?? 1);

  localStorage.setItem('sv_role', role);
  localStorage.setItem('sv_userId', String(userId));
  }


  private decode(t: string){
    try { return JSON.parse(atob(t.split('.')[1])); } catch { return null; }
  }

  logout(){ localStorage.removeItem('sv_token'); localStorage.removeItem('sv_role'); localStorage.removeItem('sv_userId'); }
  get token(){ return localStorage.getItem('sv_token'); }



isLogged(): boolean { return !!localStorage.getItem('sv_token'); }

getRole(): 'PACIENTE'|'MEDICO'|'ADMIN'|null {
  const r = localStorage.getItem('sv_role');
  return r === 'PACIENTE' || r === 'MEDICO' || r === 'ADMIN' ? r : null;
}



getUserId(): number | null {
  const id = localStorage.getItem('sv_userId');
  return id ? Number(id) : null;
}

}
