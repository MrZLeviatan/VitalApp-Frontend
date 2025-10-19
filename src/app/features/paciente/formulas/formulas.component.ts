import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PacienteService } from '../../../core/services/paciente.service';
import { AuthService } from '../../../core/services/auth.service';
import { FormulaDto, DetalleFormulaDto } from '../../../shared/api.types';

@Component({
  selector: 'app-mis-formulas',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatSnackBarModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <div class="header">
              <mat-icon class="header-icon">description</mat-icon>
              <h1>Mis Fórmulas Médicas</h1>
            </div>
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <div *ngIf="loading" class="loading">
            <mat-icon class="loading-icon">hourglass_empty</mat-icon>
            <p>Cargando fórmulas...</p>
          </div>

          <div *ngIf="!loading && formulas.length === 0" class="empty-state">
            <mat-icon>inbox</mat-icon>
            <h3>No tienes fórmulas registradas</h3>
            <p>Tus fórmulas médicas aparecerán aquí después de tus citas</p>
          </div>

          <mat-accordion *ngIf="!loading && formulas.length > 0">
            <mat-expansion-panel *ngFor="let formula of formulas" class="formula-panel">
              <mat-expansion-panel-header>
                <mat-panel-title>
                  <div class="formula-header">
                    <mat-icon>medical_services</mat-icon>
                    <div class="formula-info">
                      <strong>Fórmula #{{ formula.id }}</strong>
                      <span class="formula-date">{{ formula.fecha }}</span>
                    </div>
                  </div>
                </mat-panel-title>
                <mat-panel-description>
                  <span *ngIf="formula.medico">Dr. {{ formula.medico.nombre }}</span>
                </mat-panel-description>
              </mat-expansion-panel-header>

              <div class="formula-content">
                <button mat-raised-button color="primary" (click)="verDetalles(formula.id)" class="ver-detalles-btn">
                  <mat-icon>visibility</mat-icon>
                  Ver Medicamentos
                </button>

                <div *ngIf="detallesMap[formula.id]" class="detalles-section">
                  <h4>Medicamentos Recetados:</h4>
                  <div *ngFor="let detalle of detallesMap[formula.id]" class="medicamento-item">
                    <div class="medicamento-header">
                      <mat-icon>medication</mat-icon>
                      <strong>{{ detalle.medicamento?.nombre || detalle.nombre }}</strong>
                    </div>
                    <div class="medicamento-details">
                      <p><strong>Dosis:</strong> {{ detalle.dosis }}</p>
                      <p><strong>Cantidad:</strong> {{ detalle.cantidad }} {{ detalle.unidad || 'unidad(es)' }}</p>
                      <p *ngIf="detalle.observaciones"><strong>Instrucciones:</strong> {{ detalle.observaciones }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </mat-expansion-panel>
          </mat-accordion>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      padding: 24px;
      max-width: 1000px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .header-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      color: #667eea;
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

    .formula-panel {
      margin-bottom: 16px;
    }

    .formula-header {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .formula-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .formula-date {
      font-size: 0.9rem;
      color: #666;
    }

    .formula-content {
      padding: 20px 0;
    }

    .ver-detalles-btn {
      margin-bottom: 20px;
    }

    .detalles-section {
      margin-top: 20px;
    }

    .detalles-section h4 {
      color: #667eea;
      margin-bottom: 16px;
    }

    .medicamento-item {
      background: #f5f7fa;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;
    }

    .medicamento-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }

    .medicamento-header mat-icon {
      color: #667eea;
    }

    .medicamento-details p {
      margin: 4px 0;
      color: #333;
    }
  `]
})
export class MisFormulasComponent implements OnInit {
  private pacienteService = inject(PacienteService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  formulas: FormulaDto[] = [];
  detallesMap: { [key: number]: DetalleFormulaDto[] } = {};
  loading = false;
  idPaciente = this.auth.getUserId() || 1;

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.loading = true;
    this.pacienteService.verMisFormulas(this.idPaciente).subscribe({
      next: (res: any) => {
        console.log('Respuesta fórmulas:', res);
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
        
        console.log('Fórmulas parseadas:', data);
        this.formulas = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar fórmulas:', err);
        this.snackBar.open('Error al cargar fórmulas: ' + (err?.error?.mensaje || err?.message || 'Error desconocido'), 'Cerrar', { duration: 5000 });
        this.loading = false;
      }
    });
  }

  verDetalles(idFormula: number) {
    if (this.detallesMap[idFormula]) {
      delete this.detallesMap[idFormula];
      return;
    }

    this.pacienteService.verDetallesFormula(idFormula).subscribe({
      next: (res: any) => {
        console.log('Respuesta detalles fórmula:', res);
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
        
        console.log('Detalles parseados:', data);
        this.detallesMap[idFormula] = data;
      },
      error: (err) => {
        console.error('Error al cargar detalles:', err);
        this.snackBar.open('Error al cargar detalles: ' + (err?.error?.mensaje || err?.message || 'Error desconocido'), 'Cerrar', { duration: 5000 });
      }
    });
  }
}

