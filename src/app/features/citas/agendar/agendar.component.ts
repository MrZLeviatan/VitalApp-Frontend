import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PacienteService } from '../../../core/services/paciente.service';
import { AuthService } from '../../../core/services/auth.service';
import { EspecialidadDto, MedicoDto, AgendaDto } from '../../../shared/api.types';

@Component({
  selector: 'app-agendar-cita',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './agendar.component.html',
  styleUrls: ['./agendar.component.css']
})
export class AgendarComponent implements OnInit {
  private fb = inject(FormBuilder);
  private pacienteService = inject(PacienteService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  idPaciente: number = 0;
  especialidades: EspecialidadDto[] = [];
  medicos: MedicoDto[] = [];
  agendas: AgendaDto[] = [];
  loading = false;

  especialidadForm = this.fb.group({
    idEspecialidad: ['', Validators.required]
  });

  medicoForm = this.fb.group({
    idMedico: ['', Validators.required]
  });

  agendaForm = this.fb.group({
    idAgenda: ['', Validators.required],
    observaciones: ['', Validators.required]
  });

  ngOnInit() {
    // Obtener userId del AuthService o localStorage
    const userId = this.auth.getUserId() || Number(localStorage.getItem('sv_userId')) || 0;
    
    if (userId === 0) {
      console.warn('No se encontró userId en la sesión');
      this.snackBar.open('Hay un problema con tu sesión. Por favor, vuelve a iniciar sesión.', 'Cerrar', { duration: 5000 });
      // No redirigir automáticamente, dar chance al usuario
    }
    
    this.idPaciente = userId;
    this.cargarEspecialidades();
  }

  cargarEspecialidades() {
    this.loading = true;
    this.pacienteService.listarEspecialidades().subscribe({
      next: (res: any) => {
        console.log('Respuesta especialidades:', res);
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
        
        console.log('Especialidades parseadas:', data);
        this.especialidades = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar especialidades:', err);
        this.snackBar.open('Error al cargar especialidades: ' + (err?.error?.mensaje || err?.message || 'Error desconocido'), 'Cerrar', { duration: 5000 });
        this.loading = false;
      }
    });
  }

  onEspecialidadChange() {
    const idEspecialidad = this.especialidadForm.value.idEspecialidad;
    if (!idEspecialidad) return;

    this.loading = true;
    this.pacienteService.listarMedicosPorEspecialidad(Number(idEspecialidad)).subscribe({
      next: (res: any) => {
        console.log('Respuesta médicos por especialidad:', res);
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
        
        console.log('Médicos parseados:', data);
        this.medicos = data;
        this.loading = false;
        
        if (data.length === 0) {
          this.snackBar.open('No hay médicos disponibles para esta especialidad', 'Cerrar', { duration: 3000 });
        }
      },
      error: (err) => {
        console.error('Error al cargar médicos:', err);
        this.snackBar.open('Error al cargar médicos: ' + (err?.error?.mensaje || err?.message || 'Error desconocido'), 'Cerrar', { duration: 5000 });
        this.loading = false;
      }
    });
  }

  onMedicoChange() {
    const idMedico = this.medicoForm.value.idMedico;
    if (!idMedico) return;

    this.loading = true;
    this.pacienteService.verAgendaMedico(Number(idMedico)).subscribe({
      next: (res: any) => {
        console.log('Respuesta agenda médico:', res);
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
        
        console.log('Agenda parseada:', data);
        this.agendas = data;
        this.loading = false;
        
        if (data.length === 0) {
          this.snackBar.open('No hay agenda disponible para este médico', 'Cerrar', { duration: 3000 });
        }
      },
      error: (err) => {
        console.error('Error al cargar agenda:', err);
        this.snackBar.open('Error al cargar agenda: ' + (err?.error?.mensaje || err?.message || 'Error desconocido'), 'Cerrar', { duration: 5000 });
        this.loading = false;
      }
    });
  }

  agendar() {
    if (this.agendaForm.invalid) return;

    const dto = {
      observaciones: this.agendaForm.value.observaciones || '',
      idPaciente: this.idPaciente,
      idMedico: Number(this.medicoForm.value.idMedico),
      idAgenda: Number(this.agendaForm.value.idAgenda)
    };

    this.loading = true;
    this.pacienteService.registrarCita(dto).subscribe({
      next: () => {
        this.snackBar.open('Cita agendada exitosamente', 'Cerrar', { duration: 3000 });
        this.router.navigateByUrl('/citas');
      },
      error: () => {
        this.snackBar.open('Error al agendar cita', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  volver() {
    this.router.navigateByUrl('/citas');
  }
}
