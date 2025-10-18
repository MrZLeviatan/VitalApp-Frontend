import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CitasService } from '../../../core/services/citas.service';

export interface CitaDto { id: number; especialidad?: string; fecha?: string; estado?: string; }

@Component({
  selector: 'app-citas-listado',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css']
})
export class ListadoComponent implements OnInit {
  cols = ['especialidad','fecha','estado','acciones'];
  data: CitaDto[] = [];
  cargando = false;

  
  idPaciente = Number(localStorage.getItem('sv_userId')) || 1;

  constructor(private citas: CitasService) {}
  ngOnInit(){ this.cargar(); }

  cargar() {
    this.cargando = true;
    this.citas.listarPorPaciente(this.idPaciente).subscribe({
      next: (res: any) => { this.data = res || []; this.cargando = false; },
      error: () => { this.cargando = false; }
    });
  }

  cancelar(idCita: number) {
    this.citas.cancelar({ idCita }).subscribe(() => this.cargar());
  }
}
