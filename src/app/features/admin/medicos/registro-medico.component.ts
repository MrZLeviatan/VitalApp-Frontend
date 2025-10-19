import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { EspecialidadDto } from '../../../shared/api.types';

@Component({
  selector: 'app-registro-medico',
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
              <h1>Registrar Nuevo Médico</h1>
            </div>
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="registrar()">
            <h3>Información Personal</h3>
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Nombre Completo</mat-label>
                <mat-icon matPrefix>person</mat-icon>
                <input matInput formControlName="nombre" placeholder="Dr. Juan Pérez">
                <mat-error *ngIf="form.get('nombre')?.hasError('required')">
                  El nombre es requerido
                </mat-error>
              </mat-form-field>
            </div>

            <h3>Credenciales de Acceso</h3>
            <div class="form-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Email</mat-label>
                <mat-icon matPrefix>email</mat-icon>
                <input matInput type="email" formControlName="email" placeholder="doctor@hospital.com">
                <mat-error *ngIf="form.get('email')?.hasError('required')">
                  El email es requerido
                </mat-error>
                <mat-error *ngIf="form.get('email')?.hasError('email')">
                  Email inválido
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Contraseña</mat-label>
                <mat-icon matPrefix>lock</mat-icon>
                <input matInput type="password" formControlName="password" placeholder="••••••••">
                <mat-error *ngIf="form.get('password')?.hasError('required')">
                  La contraseña es requerida
                </mat-error>
                <mat-error *ngIf="form.get('password')?.hasError('minlength')">
                  Mínimo 6 caracteres
                </mat-error>
              </mat-form-field>
            </div>

            <h3>Especialidad</h3>
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Especialidad</mat-label>
                <mat-icon matPrefix>local_hospital</mat-icon>
                <mat-select formControlName="idEspecialidad">
                  <mat-option *ngFor="let esp of especialidades" [value]="esp.id">
                    {{ esp.especialidad }}
                  </mat-option>
                </mat-select>
                <mat-error>Debe seleccionar una especialidad</mat-error>
              </mat-form-field>
            </div>

            <h3>Teléfonos de Contacto</h3>
            <div formArrayName="telefonos">
              <div *ngFor="let tel of telefonos.controls; let i = index" [formGroupName]="i" class="phone-row">
                <mat-form-field appearance="outline" class="phone-field">
                  <mat-label>Teléfono {{ i + 1 }}</mat-label>
                  <mat-icon matPrefix>phone</mat-icon>
                  <input matInput formControlName="numero" placeholder="3001234567">
                  <mat-error>Número de teléfono requerido</mat-error>
                </mat-form-field>
                <button mat-icon-button type="button" color="warn" (click)="eliminarTelefono(i)" *ngIf="telefonos.length > 1">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
            <button mat-button type="button" (click)="agregarTelefono()" class="add-phone-btn">
              <mat-icon>add</mat-icon>
              Agregar otro teléfono
            </button>

            <div class="actions">
              <button mat-button type="button" (click)="volver()">Cancelar</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading">
                <mat-icon>save</mat-icon>
                {{ loading ? 'Registrando...' : 'Registrar Médico' }}
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
      max-width: 900px;
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

    h3 {
      color: #667eea;
      margin: 24px 0 16px 0;
      font-size: 1.2rem;
    }

    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 8px;
    }

    .full-width {
      width: 100%;
    }

    .half-width {
      flex: 1;
    }

    .phone-row {
      display: flex;
      gap: 8px;
      align-items: flex-start;
      margin-bottom: 8px;
    }

    .phone-field {
      flex: 1;
    }

    .add-phone-btn {
      margin: 8px 0 16px 0;
    }

    .actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid #e0e0e0;
    }
  `]
})
export class RegistroMedicoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  especialidades: EspecialidadDto[] = [];
  loading = false;

  form = this.fb.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    idEspecialidad: ['', Validators.required],
    telefonos: this.fb.array([
      this.fb.group({
        numero: ['', Validators.required]
      })
    ])
  });

  get telefonos() {
    return this.form.get('telefonos') as FormArray;
  }

  ngOnInit() {
    this.cargarEspecialidades();
  }

  cargarEspecialidades() {
    this.adminService.listarEspecialidades().subscribe({
      next: (res: any) => {
        this.especialidades = res.mensaje || res.data || [];
      },
      error: () => {
        this.snackBar.open('Error al cargar especialidades', 'Cerrar', { duration: 3000 });
      }
    });
  }

  agregarTelefono() {
    this.telefonos.push(this.fb.group({
      numero: ['', Validators.required]
    }));
  }

  eliminarTelefono(index: number) {
    this.telefonos.removeAt(index);
  }

  registrar() {
    if (this.form.invalid) return;

    const telefonos = this.form.value.telefonos || [];
    const dto = {
      nombre: this.form.value.nombre!,
      user: {
        email: this.form.value.email!,
        password: this.form.value.password!
      },
      telefonos: telefonos.map(t => ({ numero: t.numero || '' })),
      idEspecialidad: Number(this.form.value.idEspecialidad)
    };

    this.loading = true;
    this.adminService.registrarMedico(dto).subscribe({
      next: () => {
        this.snackBar.open('Médico registrado exitosamente', 'Cerrar', { duration: 3000 });
        this.router.navigateByUrl('/admin/medicos');
      },
      error: (err) => {
        this.snackBar.open(err?.error?.mensaje || 'Error al registrar médico', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  volver() {
    this.router.navigateByUrl('/admin/medicos');
  }
}

