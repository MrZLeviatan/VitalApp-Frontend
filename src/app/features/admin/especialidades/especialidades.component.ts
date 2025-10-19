import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { EspecialidadDto } from '../../../shared/api.types';

@Component({
  selector: 'app-admin-especialidad-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>Registrar Nueva Especialidad</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" style="width: 100%">
          <mat-label>Nombre de la Especialidad</mat-label>
          <input matInput formControlName="especialidad" placeholder="Ej: Cardiología, Pediatría, etc.">
          <mat-error *ngIf="form.get('especialidad')?.hasError('required')">El nombre es requerido</mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" (click)="guardar()" [disabled]="form.invalid || loading">
        {{ loading ? 'Guardando...' : 'Guardar' }}
      </button>
    </mat-dialog-actions>
  `
})
export class AdminEspecialidadFormComponent {
  fb = inject(FormBuilder);
  adminService = inject(AdminService);
  snackBar = inject(MatSnackBar);
  
  loading = false;
  form = this.fb.group({
    especialidad: ['', Validators.required]
  });

  guardar() {
    if (this.form.invalid) return;
    this.loading = true;
    this.adminService.registrarEspecialidad(this.form.value as any).subscribe({
      next: () => {
        this.snackBar.open('Especialidad registrada exitosamente', 'Cerrar', { duration: 3000 });
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error al registrar especialidad', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }
}

@Component({
  selector: 'app-admin-especialidades',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatSnackBarModule],
  templateUrl: './especialidades.component.html',
  styleUrls: ['./especialidades.component.css']
})
export class AdminEspecialidadesComponent implements OnInit {
  private adminService = inject(AdminService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  displayedColumns = ['id', 'especialidad', 'acciones'];
  dataSource: EspecialidadDto[] = [];
  loading = false;

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.loading = true;
    this.adminService.listarEspecialidades().subscribe({
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
        this.dataSource = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar especialidades:', err);
        this.snackBar.open('Error al cargar especialidades: ' + (err?.error?.mensaje || err?.message || 'Error desconocido'), 'Cerrar', { duration: 5000 });
        this.loading = false;
      }
    });
  }

  abrirFormulario() {
    const dialogRef = this.dialog.open(AdminEspecialidadFormComponent, {
      width: '500px'
    });
    dialogRef.afterClosed().subscribe(() => this.cargar());
  }

  volver() {
    this.router.navigateByUrl('/admin');
  }
}

