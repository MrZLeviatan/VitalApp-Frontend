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
import { MedicamentoDto } from '../../../shared/api.types';

@Component({
  selector: 'app-admin-medicamento-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>Registrar Nuevo Medicamento</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" style="width: 100%; margin-bottom: 16px;">
          <mat-label>Nombre del Medicamento</mat-label>
          <input matInput formControlName="nombre" placeholder="Ej: Ibuprofeno 400mg">
          <mat-error *ngIf="form.get('nombre')?.hasError('required')">El nombre es requerido</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" style="width: 100%">
          <mat-label>Precio</mat-label>
          <input matInput type="number" formControlName="precio" placeholder="15000">
          <mat-error *ngIf="form.get('precio')?.hasError('required')">El precio es requerido</mat-error>
          <mat-error *ngIf="form.get('precio')?.hasError('min')">El precio debe ser mayor a 0</mat-error>
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
export class AdminMedicamentoFormComponent {
  fb = inject(FormBuilder);
  adminService = inject(AdminService);
  snackBar = inject(MatSnackBar);
  
  loading = false;
  form = this.fb.group({
    nombre: ['', Validators.required],
    precio: [0, [Validators.required, Validators.min(0)]]
  });

  guardar() {
    if (this.form.invalid) return;
    this.loading = true;
    this.adminService.registrarMedicamento(this.form.value as any).subscribe({
      next: () => {
        this.snackBar.open('Medicamento registrado exitosamente', 'Cerrar', { duration: 3000 });
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error al registrar medicamento', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }
}

@Component({
  selector: 'app-admin-medicamentos',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatSnackBarModule],
  templateUrl: './medicamentos.component.html',
  styleUrls: ['./medicamentos.component.css']
})
export class AdminMedicamentosComponent implements OnInit {
  private adminService = inject(AdminService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  displayedColumns = ['id', 'nombre', 'precio', 'acciones'];
  dataSource: MedicamentoDto[] = [];
  loading = false;

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.loading = true;
    this.adminService.listarMedicamentos().subscribe({
      next: (res: any) => {
        console.log('Respuesta medicamentos:', res);
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
        
        console.log('Medicamentos parseados:', data);
        this.dataSource = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar medicamentos:', err);
        this.snackBar.open('Error al cargar medicamentos: ' + (err?.error?.mensaje || err?.message || 'Error desconocido'), 'Cerrar', { duration: 5000 });
        this.loading = false;
      }
    });
  }

  abrirFormulario() {
    const dialogRef = this.dialog.open(AdminMedicamentoFormComponent, {
      width: '500px'
    });
    dialogRef.afterClosed().subscribe(() => this.cargar());
  }

  volver() {
    this.router.navigateByUrl('/admin');
  }
}

