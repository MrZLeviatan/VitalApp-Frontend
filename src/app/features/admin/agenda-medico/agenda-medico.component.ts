import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-agenda-medico',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSnackBarModule,
    MatChipsModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <div class="header">
              <button mat-icon-button (click)="volver()">
                <mat-icon>arrow_back</mat-icon>
              </button>
              <h1>Gestión de Agenda - {{ nombreMedico }}</h1>
            </div>
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <!-- Formulario para agregar horarios -->
          <div class="form-section">
            <h3>Agregar Nuevo Horario</h3>
            <form [formGroup]="form" (ngSubmit)="agregarHorario()">
              <div class="form-row">
                <mat-form-field appearance="outline" class="field">
                  <mat-label>Fecha</mat-label>
                  <input matInput type="date" formControlName="dia" [min]="fechaMinima">
                  <mat-error>Selecciona una fecha</mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="field">
                  <mat-label>Hora Inicio</mat-label>
                  <input matInput type="time" formControlName="horaInicio">
                  <mat-error>Hora requerida</mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="field">
                  <mat-label>Hora Fin</mat-label>
                  <input matInput type="time" formControlName="horaFin">
                  <mat-error>Hora requerida</mat-error>
                </mat-form-field>

                <button 
                  mat-raised-button 
                  color="primary" 
                  type="submit" 
                  [disabled]="form.invalid || loading"
                  class="add-btn">
                  <mat-icon>add</mat-icon>
                  Agregar
                </button>
              </div>
            </form>
          </div>

          <!-- Lista de horarios existentes -->
          <div class="agenda-section">
            <h3>Horarios Registrados</h3>
            
            <div *ngIf="loading" class="loading">Cargando agenda...</div>
            
            <div *ngIf="!loading && agendas.length === 0" class="empty-state">
              <mat-icon>event_busy</mat-icon>
              <p>No hay horarios registrados para este médico</p>
              <p class="hint">Agrega horarios usando el formulario de arriba</p>
            </div>

            <div *ngIf="!loading && agendas.length > 0" class="agenda-list">
              <div *ngFor="let agenda of agendasPorDia | keyvalue" class="dia-group">
                <h4 class="dia-title">
                  <mat-icon>calendar_today</mat-icon>
                  {{ agenda.key }}
                </h4>
                <div class="horarios-grid">
                  <mat-chip-set>
                    <mat-chip 
                      *ngFor="let horario of agenda.value"
                      [class.inactivo]="!horario.isActivo">
                      <mat-icon>schedule</mat-icon>
                      {{ formatearHora(horario.horaInicio) }} - {{ formatearHora(horario.horaFin) }}
                      <button matChipRemove (click)="eliminarHorario(horario.id)">
                        <mat-icon>cancel</mat-icon>
                      </button>
                    </mat-chip>
                  </mat-chip-set>
                </div>
              </div>
            </div>
          </div>

          <!-- Acciones rápidas -->
          <div class="quick-actions">
            <h3>Acciones Rápidas</h3>
            <div class="actions-grid">
              <button mat-raised-button color="accent" (click)="agregarHorarioLaboral()">
                <mat-icon>work</mat-icon>
                Agregar Horario Completo (Próximos 7 días, 6am-8pm)
              </button>
              <button mat-raised-button (click)="limpiarTodo()" [disabled]="agendas.length === 0">
                <mat-icon>delete_sweep</mat-icon>
                Limpiar Toda la Agenda
              </button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .header h1 {
      margin: 0;
      font-size: 1.8rem;
    }

    .form-section {
      background: #f5f7fa;
      padding: 24px;
      border-radius: 12px;
      margin-bottom: 32px;
    }

    .form-section h3 {
      margin: 0 0 20px 0;
      color: #667eea;
    }

    .form-row {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      flex-wrap: wrap;
    }

    .field {
      flex: 1;
      min-width: 150px;
    }

    .add-btn {
      margin-top: 8px;
    }

    .agenda-section {
      margin-bottom: 32px;
    }

    .agenda-section h3 {
      color: #667eea;
      margin-bottom: 20px;
    }

    .loading {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
    }

    .empty-state mat-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: #ddd;
      margin-bottom: 20px;
    }

    .empty-state p {
      color: #666;
      margin: 8px 0;
    }

    .hint {
      font-size: 0.9rem;
      color: #999;
    }

    .agenda-list {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .dia-group {
      background: #fff;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      padding: 20px;
    }

    .dia-title {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #667eea;
      margin: 0 0 16px 0;
      font-size: 1.2rem;
    }

    .horarios-grid mat-chip-set {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .horarios-grid mat-chip {
      background: #667eea !important;
      color: white !important;
      font-weight: 500;
    }

    .horarios-grid mat-chip.inactivo {
      background: #999 !important;
      opacity: 0.6;
    }

    .horarios-grid mat-chip mat-icon {
      margin-right: 4px;
    }

    .quick-actions h3 {
      color: #667eea;
      margin-bottom: 16px;
    }

    .actions-grid {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .actions-grid button {
      flex: 1;
      min-width: 250px;
    }
  `]
})
export class AdminAgendaMedicoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private adminService = inject(AdminService);
  private snackBar = inject(MatSnackBar);

  idMedico: number = 0;
  nombreMedico: string = '';
  agendas: any[] = [];
  loading = false;
  fechaMinima: string = new Date().toISOString().split('T')[0]; // Fecha mínima = hoy

  form = this.fb.group({
    dia: ['', Validators.required], // Fecha específica
    horaInicio: ['', Validators.required],
    horaFin: ['', Validators.required]
  });

  ngOnInit() {
    this.idMedico = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarMedico();
    this.cargarAgenda();
  }

  cargarMedico() {
    this.adminService.verMedico(this.idMedico).subscribe({
      next: (res: any) => {
        const medico = res?.mensaje || res?.data || res;
        this.nombreMedico = medico?.nombre || medico?.nombreCompleto || `Médico #${this.idMedico}`;
      },
      error: () => {
        this.nombreMedico = `Médico #${this.idMedico}`;
      }
    });
  }

  cargarAgenda() {
    this.loading = true;
    this.adminService.verAgendaMedico(this.idMedico).subscribe({
      next: (res: any) => {
        console.log('Respuesta agenda:', res);
        let data = [];
        if (Array.isArray(res)) {
          data = res;
        } else if (res?.mensaje) {
          data = Array.isArray(res.mensaje) ? res.mensaje : [];
        } else if (res?.data) {
          data = Array.isArray(res.data) ? res.data : [];
        }
        this.agendas = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar agenda:', err);
        this.snackBar.open('Error al cargar agenda', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  get agendasPorDia() {
    const grupos: { [key: string]: any[] } = {};
    
    this.agendas.forEach(agenda => {
      const dia = agenda.dia; // Fecha específica como "2025-10-20"
      if (!grupos[dia]) {
        grupos[dia] = [];
      }
      grupos[dia].push(agenda);
    });

    // Ordenar horarios dentro de cada fecha
    Object.keys(grupos).forEach(dia => {
      grupos[dia].sort((a, b) => {
        const horaA = a.horaInicio;
        const horaB = b.horaInicio;
        return horaA.localeCompare(horaB);
      });
    });

    // Ordenar las fechas
    const gruposOrdenados: { [key: string]: any[] } = {};
    Object.keys(grupos).sort().forEach(dia => {
      gruposOrdenados[dia] = grupos[dia];
    });

    return gruposOrdenados;
  }

  formatearHora(hora: string): string {
    if (!hora) return '';
    // Convierte "08:00:00" a "8:00 AM"
    const [h, m] = hora.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${ampm}`;
  }

  agregarHorario() {
    if (this.form.invalid) return;

    const dto = {
      idMedico: this.idMedico,
      dia: this.form.value.dia!, // Fecha específica "2025-10-20"
      horaInicio: this.form.value.horaInicio + ':00', // Agregar segundos
      horaFin: this.form.value.horaFin + ':00'
    };

    this.loading = true;
    this.adminService.registrarAgenda(dto).subscribe({
      next: () => {
        this.snackBar.open('Horario agregado exitosamente', 'Cerrar', { duration: 3000 });
        this.form.reset();
        this.cargarAgenda();
      },
      error: (err) => {
        this.snackBar.open(err?.error?.mensaje || 'Error al agregar horario', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  eliminarHorario(idAgenda: number) {
    if (!confirm('¿Estás seguro de eliminar este horario?')) return;

    this.adminService.eliminarAgenda(idAgenda).subscribe({
      next: () => {
        this.snackBar.open('Horario eliminado', 'Cerrar', { duration: 3000 });
        this.cargarAgenda();
      },
      error: (err) => {
        this.snackBar.open(err?.error?.mensaje || 'Error al eliminar', 'Cerrar', { duration: 3000 });
      }
    });
  }

  agregarHorarioLaboral() {
    // Generar fechas para los próximos 7 días
    const fechas: string[] = [];
    const hoy = new Date();
    for (let i = 0; i < 7; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + i);
      fechas.push(fecha.toISOString().split('T')[0]);
    }
    
    const horarios = [
      { inicio: '06:00:00', fin: '07:00:00' },
      { inicio: '07:00:00', fin: '08:00:00' },
      { inicio: '08:00:00', fin: '09:00:00' },
      { inicio: '09:00:00', fin: '10:00:00' },
      { inicio: '10:00:00', fin: '11:00:00' },
      { inicio: '11:00:00', fin: '12:00:00' },
      { inicio: '14:00:00', fin: '15:00:00' },
      { inicio: '15:00:00', fin: '16:00:00' },
      { inicio: '16:00:00', fin: '17:00:00' },
      { inicio: '17:00:00', fin: '18:00:00' },
      { inicio: '18:00:00', fin: '19:00:00' },
      { inicio: '19:00:00', fin: '20:00:00' }
    ];

    if (!confirm('¿Agregar horario completo para los próximos 7 días (6am-8pm con pausa)?')) return;

    this.loading = true;
    let completados = 0;
    const total = fechas.length * horarios.length;

    fechas.forEach(fecha => {
      horarios.forEach(horario => {
        const dto = {
          idMedico: this.idMedico,
          dia: fecha,
          horaInicio: horario.inicio,
          horaFin: horario.fin
        };

        this.adminService.registrarAgenda(dto).subscribe({
          next: () => {
            completados++;
            if (completados === total) {
              this.snackBar.open('Horario completo agregado', 'Cerrar', { duration: 3000 });
              this.cargarAgenda();
            }
          },
          error: () => {
            completados++;
            if (completados === total) {
              this.snackBar.open('Algunos horarios no se pudieron agregar', 'Cerrar', { duration: 3000 });
              this.cargarAgenda();
            }
          }
        });
      });
    });
  }

  limpiarTodo() {
    if (!confirm('¿Estás seguro de eliminar TODA la agenda de este médico?')) return;

    let eliminados = 0;
    const total = this.agendas.length;

    this.agendas.forEach(agenda => {
      this.adminService.eliminarAgenda(agenda.id).subscribe({
        next: () => {
          eliminados++;
          if (eliminados === total) {
            this.snackBar.open('Agenda limpiada completamente', 'Cerrar', { duration: 3000 });
            this.cargarAgenda();
          }
        },
        error: () => {
          eliminados++;
          if (eliminados === total) {
            this.cargarAgenda();
          }
        }
      });
    });
  }

  volver() {
    this.router.navigateByUrl('/admin/medicos');
  }
}

