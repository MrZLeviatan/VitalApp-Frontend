import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MedicoService } from '../../../core/services/medico.service';
import { AuthService } from '../../../core/services/auth.service';
import { CitaDto } from '../../../shared/api.types';

@Component({
  selector: 'app-medico-citas',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatChipsModule, MatSnackBarModule],
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.css']
})
export class MedicoCitasComponent implements OnInit {
  private medicoService = inject(MedicoService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  displayedColumns = ['id', 'paciente', 'fecha', 'estado', 'acciones'];
  dataSource: CitaDto[] = [];
  loading = false;
  idMedico = this.auth.getUserId() || 1;

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.loading = true;
    this.medicoService.verMisCitas(this.idMedico).subscribe({
      next: (res: any) => {
        console.log('Respuesta citas médico:', res);
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
        this.dataSource = data.map((cita: any) => ({
          id: cita.id || cita.idCita,
          paciente: cita.nombrePaciente || `Paciente ID: ${cita.idPaciente || 'N/A'}`,
          eps: cita.epsPaciente,
          telefono: cita.telefonoPaciente,
          fecha: cita.fecha || cita.dia || cita.fechaCita || cita.fechaHora || 'Por definir',
          horaInicio: cita.horaInicio,
          horaFin: cita.horaFin,
          estado: cita.estadoCita || cita.estado || 'PENDIENTE',
          observaciones: cita.observaciones
        }));
        
        console.log('Citas mapeadas:', this.dataSource);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar citas:', err);
        this.snackBar.open('Error al cargar citas: ' + (err?.error?.mensaje || err?.message || 'Error desconocido'), 'Cerrar', { duration: 5000 });
        this.loading = false;
      }
    });
  }

  ponerEnRevision(idCita: number) {
    this.medicoService.ponerCitaEnRevision({ idCita }).subscribe({
      next: () => {
        this.snackBar.open('Cita puesta en revisión', 'Cerrar', { duration: 3000 });
        this.cargar();
      },
      error: () => {
        this.snackBar.open('Error al actualizar cita', 'Cerrar', { duration: 3000 });
      }
    });
  }

  registrarFormula(idCita: number) {
    this.router.navigateByUrl(`/medico/citas/${idCita}/formula`);
  }

  volver() {
    this.router.navigateByUrl('/medico');
  }
}

