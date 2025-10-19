import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MedicoService } from '../../../core/services/medico.service';
import { AdminService } from '../../../core/services/admin.service';
import { AuthService } from '../../../core/services/auth.service';
import { MedicamentoDto, CitaDto } from '../../../shared/api.types';

@Component({
  selector: 'app-registrar-formula',
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
    MatDividerModule,
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
              <h1>Registrar Fórmula Médica</h1>
            </div>
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <div *ngIf="cita" class="cita-info">
            <h3>Información de la Cita</h3>
            <p><strong>Paciente:</strong> {{ cita.paciente?.nombre || 'N/A' }}</p>
            <p><strong>Fecha:</strong> {{ cita.fecha || 'N/A' }}</p>
            <p><strong>Observaciones:</strong> {{ cita.observaciones || 'N/A' }}</p>
          </div>

          <mat-divider></mat-divider>

          <form [formGroup]="form" (ngSubmit)="registrar()">
            <h3>Medicamentos Recetados</h3>

            <div formArrayName="detallesFormula">
              <div *ngFor="let detalle of detallesFormula.controls; let i = index" [formGroupName]="i" class="medicamento-item">
                <div class="medicamento-header">
                  <h4>Medicamento {{ i + 1 }}</h4>
                  <button mat-icon-button type="button" color="warn" (click)="eliminarMedicamento(i)" *ngIf="detallesFormula.length > 1">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Medicamento</mat-label>
                    <mat-select formControlName="idMedicamento">
                      <mat-option *ngFor="let med of medicamentos" [value]="med.id">
                        {{ med.nombre }} ({{ med.precio | currency:'COP':'symbol-narrow':'1.0-0' }})
                      </mat-option>
                    </mat-select>
                    <mat-error>Debe seleccionar un medicamento</mat-error>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="third-width">
                    <mat-label>Cantidad</mat-label>
                    <input matInput type="number" formControlName="cantidad" min="1">
                    <mat-error>Cantidad requerida</mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="third-width">
                    <mat-label>Dosis</mat-label>
                    <input matInput formControlName="dosis" placeholder="400mg">
                    <mat-error>Dosis requerida</mat-error>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Instrucciones</mat-label>
                    <textarea matInput formControlName="observaciones" rows="2" placeholder="Tomar cada 8 horas con alimentos"></textarea>
                    <mat-error>Instrucciones requeridas</mat-error>
                  </mat-form-field>
                </div>

                <mat-divider *ngIf="i < detallesFormula.length - 1"></mat-divider>
              </div>
            </div>

            <button mat-button type="button" (click)="agregarMedicamento()" class="add-button">
              <mat-icon>add</mat-icon>
              Agregar otro medicamento
            </button>

            <div class="actions">
              <button mat-button type="button" (click)="volver()">Cancelar</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading">
                <mat-icon>save</mat-icon>
                {{ loading ? 'Registrando...' : 'Registrar Fórmula' }}
              </button>
            </div>
          </form>
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

    .header h1 {
      margin: 0;
      font-size: 1.8rem;
    }

    .cita-info {
      background: #f5f7fa;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }

    .cita-info h3 {
      margin-top: 0;
      color: #667eea;
    }

    .cita-info p {
      margin: 8px 0;
    }

    h3 {
      color: #667eea;
      margin: 24px 0 16px 0;
      font-size: 1.2rem;
    }

    .medicamento-item {
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 16px;
    }

    .medicamento-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .medicamento-header h4 {
      margin: 0;
      color: #333;
    }

    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 8px;
    }

    .full-width {
      width: 100%;
    }

    .third-width {
      flex: 1;
    }

    .add-button {
      margin: 16px 0;
    }

    .actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid #e0e0e0;
    }

    mat-divider {
      margin: 20px 0;
    }
  `]
})
export class RegistrarFormulaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private medicoService = inject(MedicoService);
  private adminService = inject(AdminService);
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  medicamentos: MedicamentoDto[] = [];
  cita: CitaDto | null = null;
  idCita = 0;
  loading = false;

  form = this.fb.group({
    detallesFormula: this.fb.array([
      this.crearDetalleFormula()
    ])
  });

  get detallesFormula() {
    return this.form.get('detallesFormula') as FormArray;
  }

  ngOnInit() {
    this.idCita = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarDatos();
  }

  cargarDatos() {
    // Cargar medicamentos
    this.adminService.listarMedicamentos().subscribe({
      next: (res: any) => {
        this.medicamentos = res.mensaje || res.data || [];
      }
    });

    // Cargar info de la cita
    this.medicoService.verCita(this.idCita).subscribe({
      next: (res: any) => {
        this.cita = res.mensaje || res.data || null;
      }
    });
  }

  crearDetalleFormula() {
    return this.fb.group({
      idMedicamento: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      dosis: ['', Validators.required],
      observaciones: ['', Validators.required]
    });
  }

  agregarMedicamento() {
    this.detallesFormula.push(this.crearDetalleFormula());
  }

  eliminarMedicamento(index: number) {
    this.detallesFormula.removeAt(index);
  }

  registrar() {
    if (this.form.invalid || !this.cita) return;

    const dto = {
      idPaciente: this.cita.paciente?.id || 0,
      idCita: this.idCita,
      detallesFormula: this.form.value.detallesFormula!.map(d => ({
        cantidad: d.cantidad!,
        observaciones: d.observaciones!,
        dosis: d.dosis!,
        idMedicamento: Number(d.idMedicamento)
      }))
    };

    this.loading = true;
    this.medicoService.registrarFormula(dto).subscribe({
      next: () => {
        this.snackBar.open('Fórmula registrada exitosamente', 'Cerrar', { duration: 3000 });
        this.router.navigateByUrl('/medico/citas');
      },
      error: (err) => {
        this.snackBar.open(err?.error?.mensaje || 'Error al registrar fórmula', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  volver() {
    this.router.navigateByUrl('/medico/citas');
  }
}

