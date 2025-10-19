import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PacienteService } from '../../../core/services/paciente.service';
import { CitaDto } from '../../../shared/api.types';

@Component({
  selector: 'app-detalle-cita',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="container">
      <mat-card *ngIf="cita">
        <mat-card-header>
          <mat-card-title>
            <div class="header">
              <button mat-icon-button (click)="volver()">
                <mat-icon>arrow_back</mat-icon>
              </button>
              <h1>Detalles de la Cita</h1>
            </div>
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <div class="info-section">
            <div class="info-row">
              <div class="info-label">
                <mat-icon>confirmation_number</mat-icon>
                <span>ID de Cita</span>
              </div>
              <div class="info-value">{{ cita.id }}</div>
            </div>

            <div class="info-row">
              <div class="info-label">
                <mat-icon>calendar_today</mat-icon>
                <span>Fecha</span>
              </div>
              <div class="info-value">{{ cita.fecha || 'Por definir' }}</div>
            </div>

            <div class="info-row">
              <div class="info-label">
                <mat-icon>info</mat-icon>
                <span>Estado</span>
              </div>
              <div class="info-value">
                <mat-chip-set>
                  <mat-chip [ngClass]="{
                    'pendiente': cita.estado === 'PENDIENTE',
                    'confirmada': cita.estado === 'CONFIRMADA',
                    'completada': cita.estado === 'COMPLETADA',
                    'cancelada': cita.estado === 'CANCELADA'
                  }">
                    {{ cita.estado || 'Pendiente' }}
                  </mat-chip>
                </mat-chip-set>
              </div>
            </div>

            <mat-divider></mat-divider>

            <div class="info-row">
              <div class="info-label">
                <mat-icon>local_hospital</mat-icon>
                <span>Especialidad</span>
              </div>
              <div class="info-value">{{ cita.especialidad || 'No especificada' }}</div>
            </div>

            <div class="info-row" *ngIf="cita.medico">
              <div class="info-label">
                <mat-icon>person</mat-icon>
                <span>Médico</span>
              </div>
              <div class="info-value">{{ cita.medico.nombre }}</div>
            </div>

            <mat-divider></mat-divider>

            <div class="info-row" *ngIf="cita.observaciones">
              <div class="info-label">
                <mat-icon>description</mat-icon>
                <span>Observaciones</span>
              </div>
              <div class="info-value">{{ cita.observaciones }}</div>
            </div>
          </div>

          <div class="actions">
            <button mat-button (click)="volver()">
              <mat-icon>arrow_back</mat-icon>
              Volver
            </button>
            <button mat-raised-button color="warn" (click)="cancelar()" *ngIf="cita.estado === 'PENDIENTE'">
              <mat-icon>cancel</mat-icon>
              Cancelar Cita
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <div *ngIf="loading" class="loading">Cargando...</div>
    </div>
  `,
  styles: [`
    .container {
      padding: 24px;
      max-width: 800px;
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

    .info-section {
      padding: 20px 0;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      gap: 16px;
    }

    .info-label {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #666;
      font-weight: 500;
    }

    .info-label mat-icon {
      color: #667eea;
    }

    .info-value {
      text-align: right;
      font-size: 1.1rem;
      color: #333;
    }

    mat-divider {
      margin: 16px 0;
    }

    mat-chip.pendiente {
      background-color: #fff3cd !important;
      color: #856404 !important;
    }

    mat-chip.confirmada {
      background-color: #d1ecf1 !important;
      color: #0c5460 !important;
    }

    mat-chip.completada {
      background-color: #d4edda !important;
      color: #155724 !important;
    }

    mat-chip.cancelada {
      background-color: #f8d7da !important;
      color: #721c24 !important;
    }

    .actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid #e0e0e0;
    }

    .loading {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }
  `]
})
export class DetalleCitaComponent implements OnInit {
  private pacienteService = inject(PacienteService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  cita: CitaDto | null = null;
  loading = false;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.cargar(id);
  }

  cargar(id: number) {
    this.loading = true;
    this.pacienteService.verCita(id).subscribe({
      next: (res: any) => {
        this.cita = res.mensaje || res.data || null;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error al cargar la cita', 'Cerrar', { duration: 3000 });
        this.loading = false;
        this.volver();
      }
    });
  }

  cancelar() {
    if (!this.cita || !confirm('¿Está seguro de cancelar esta cita?')) return;

    this.pacienteService.cancelarCita({ idCita: this.cita.id }).subscribe({
      next: () => {
        this.snackBar.open('Cita cancelada exitosamente', 'Cerrar', { duration: 3000 });
        this.volver();
      },
      error: () => {
        this.snackBar.open('Error al cancelar la cita', 'Cerrar', { duration: 3000 });
      }
    });
  }

  volver() {
    this.router.navigateByUrl('/citas');
  }
}

