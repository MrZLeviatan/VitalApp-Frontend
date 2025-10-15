import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API = 'http://localhost:8080/api'; // ajustar back en caso de que use otra URL/base

@Injectable({ providedIn: 'root' })
export class CitasService {
  constructor(private http: HttpClient) {}
  listar() { return this.http.get(`${API}/citas`); }
}