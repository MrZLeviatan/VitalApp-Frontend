import { Component, OnInit,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CitasService } from '../../../core/services/citas.service';
import { Router,RouterModule } from '@angular/router';


export interface CitaDto { id: number; especialidad?: string; fecha?: string; estado?: string; }

@Component({
  selector: 'app-citas-listado',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, RouterModule],
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css']
})
export class ListadoComponent implements OnInit {
  cols = ['especialidad','fecha','estado','acciones'];
  data: CitaDto[] = [];
  cargando = false;

  
  idPaciente = Number(localStorage.getItem('sv_userId')) || 1;
  private router = inject(Router);

  constructor(private citas: CitasService) {}
  ngOnInit(){ this.cargar(); }

  cargar() {
    this.cargando = true;
    this.citas.listarPorPaciente(this.idPaciente).subscribe({
      next: (res: any) => { 
        console.log('Respuesta citas:', res);
        // Intentar múltiples formas de parsear la respuesta
        let data = [];
        if (Array.isArray(res)) {
          data = res;
        } else if (res?.mensaje) {
          data = Array.isArray(res.mensaje) ? res.mensaje : [res.mensaje];
        } else if (res?.data) {
          data = Array.isArray(res.data) ? res.data : [res.data];
        } else if (res?.content) {
          data = Array.isArray(res.content) ? res.content : [];
        }
        
        console.log('Citas parseadas:', data);
        
        // Mapear los datos del backend al formato esperado por la tabla
        this.data = data.map((cita: any) => ({
          id: cita.id || cita.idCita,
          especialidad: cita.especialidad || cita.nombreEspecialidad || cita.especialidadMedico || `Médico ID: ${cita.idMedico || 'N/A'}`,
          fecha: cita.fecha || cita.dia || cita.fechaCita || cita.fechaHora || cita.fechaAgenda || 'Por definir',
          estado: cita.estadoCita || cita.estado || 'PENDIENTE'
        }));
        
        console.log('Citas mapeadas:', this.data);
        this.cargando = false; 
      },
      error: (err) => { 
        console.error('Error al cargar citas:', err);
        this.cargando = false; 
      }
    });
  }

  verDetalle(idCita: number) {
    this.router.navigateByUrl(`/citas/${idCita}`);
  }

  cancelar(idCita: number) {
    if (!confirm('¿Está seguro de cancelar esta cita?')) return;
    this.citas.cancelar({ idCita }).subscribe(() => this.cargar());
  }

  nueva(){
    this.router.navigateByUrl('/citas/agendar')
  }
}
