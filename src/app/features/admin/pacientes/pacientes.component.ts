import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { PacienteDto } from '../../../shared/api.types';

@Component({
  selector: 'app-admin-pacientes',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatSnackBarModule, MatChipsModule],
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class AdminPacientesComponent implements OnInit {
  private adminService = inject(AdminService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  displayedColumns = ['id', 'nombre', 'email', 'eps', 'acciones'];
  dataSource: PacienteDto[] = [];
  loading = false;

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.loading = true;
    this.adminService.listarPacientes().subscribe({
      next: (res: any) => {
        console.log('Respuesta pacientes:', res);
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
        
        console.log('Pacientes parseados:', data);
        this.dataSource = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar pacientes:', err);
        this.snackBar.open('Error al cargar pacientes: ' + (err?.error?.mensaje || err?.message || 'Error desconocido'), 'Cerrar', { duration: 5000 });
        this.loading = false;
      }
    });
  }

  verCitas(idPaciente: number) {
    this.router.navigateByUrl(`/admin/pacientes/${idPaciente}/citas`);
  }

  verFormulas(idPaciente: number) {
    this.router.navigateByUrl(`/admin/pacientes/${idPaciente}/formulas`);
  }

  nuevoPaciente() {
    this.router.navigateByUrl('/admin/pacientes/nuevo');
  }

  volver() {
    this.router.navigateByUrl('/admin');
  }
}

