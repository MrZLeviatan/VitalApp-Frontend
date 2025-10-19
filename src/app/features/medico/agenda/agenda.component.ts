import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MedicoService } from '../../../core/services/medico.service';
import { AuthService } from '../../../core/services/auth.service';
import { AgendaDto } from '../../../shared/api.types';

@Component({
  selector: 'app-medico-agenda',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSnackBarModule
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
              <h1>Mi Agenda de Atención</h1>
            </div>
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <div *ngIf="loading" class="loading">
            <mat-icon class="loading-icon">hourglass_empty</mat-icon>
            <p>Cargando agenda...</p>
          </div>

          <div *ngIf="!loading && dataSource.length === 0" class="empty-state">
            <mat-icon>event_busy</mat-icon>
            <h3>No hay horarios registrados</h3>
            <p>Tu agenda de atención está vacía</p>
          </div>

          <table mat-table [dataSource]="dataSource" *ngIf="!loading && dataSource.length > 0" class="mat-elevation-z2">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let item">{{ item.id }}</td>
            </ng-container>

            <ng-container matColumnDef="fecha">
              <th mat-header-cell *matHeaderCellDef>Fecha</th>
              <td mat-cell *matCellDef="let item">
                <div class="cell-with-icon">
                  <mat-icon class="cell-icon">calendar_today</mat-icon>
                  <span>{{ item.fecha }}</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="horaInicio">
              <th mat-header-cell *matHeaderCellDef>Hora Inicio</th>
              <td mat-cell *matCellDef="let item">
                <div class="cell-with-icon">
                  <mat-icon class="cell-icon">schedule</mat-icon>
                  <span>{{ item.horaInicio || 'N/A' }}</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="horaFin">
              <th mat-header-cell *matHeaderCellDef>Hora Fin</th>
              <td mat-cell *matCellDef="let item">
                <div class="cell-with-icon">
                  <mat-icon class="cell-icon">schedule</mat-icon>
                  <span>{{ item.horaFin || 'N/A' }}</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="disponible">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let item">
                <mat-chip-set>
                  <mat-chip [class.disponible]="item.disponible" [class.ocupado]="!item.disponible">
                    {{ item.disponible ? 'Disponible' : 'Ocupado' }}
                  </mat-chip>
                </mat-chip-set>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
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

    .loading {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .loading-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      animation: spin 2s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
    }

    .empty-state mat-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: #ccc;
      margin-bottom: 20px;
    }

    .empty-state h3 {
      color: #333;
      margin: 0 0 10px 0;
      font-size: 1.5rem;
    }

    .empty-state p {
      color: #666;
      margin: 0;
    }

    table {
      width: 100%;
      margin-top: 20px;
    }

    .cell-with-icon {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .cell-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: #666;
    }

    mat-chip.disponible {
      background-color: #d4edda !important;
      color: #155724 !important;
    }

    mat-chip.ocupado {
      background-color: #f8d7da !important;
      color: #721c24 !important;
    }
  `]
})
export class MedicoAgendaComponent implements OnInit {
  private medicoService = inject(MedicoService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  displayedColumns = ['id', 'fecha', 'horaInicio', 'horaFin', 'disponible'];
  dataSource: AgendaDto[] = [];
  loading = false;
  idMedico = this.auth.getUserId() || 1;

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.loading = true;
    this.medicoService.verMiAgenda(this.idMedico).subscribe({
      next: (res: any) => {
        console.log('Respuesta agenda:', res);
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
        this.dataSource = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar agenda:', err);
        this.snackBar.open('Error al cargar agenda: ' + (err?.error?.mensaje || err?.message || 'Error desconocido'), 'Cerrar', { duration: 5000 });
        this.loading = false;
      }
    });
  }

  volver() {
    this.router.navigateByUrl('/medico');
  }
}

