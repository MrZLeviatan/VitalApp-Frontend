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
import { MedicoDto } from '../../../shared/api.types';

@Component({
  selector: 'app-admin-medicos',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatSnackBarModule, MatChipsModule],
  templateUrl: './medicos.component.html',
  styleUrls: ['./medicos.component.css']
})
export class AdminMedicosComponent implements OnInit {
  private adminService = inject(AdminService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  displayedColumns = ['id', 'nombre', 'email', 'especialidad', 'acciones'];
  dataSource: MedicoDto[] = [];
  loading = false;

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.loading = true;
    this.adminService.listarMedicos().subscribe({
      next: (res: any) => {
        console.log('Respuesta médicos:', res);
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
        this.dataSource = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar médicos:', err);
        this.snackBar.open('Error al cargar médicos: ' + (err?.error?.mensaje || err?.message || 'Error desconocido'), 'Cerrar', { duration: 5000 });
        this.loading = false;
      }
    });
  }

  gestionarAgenda(idMedico: number) {
    this.router.navigateByUrl(`/admin/medicos/${idMedico}/agenda`);
  }

  verCitas(idMedico: number) {
    this.router.navigateByUrl(`/admin/medicos/${idMedico}/citas`);
  }

  eliminar(idMedico: number) {
    if (!confirm('¿Está seguro de eliminar este médico?')) return;
    
    this.adminService.eliminarMedico({ idMedico }).subscribe({
      next: () => {
        this.snackBar.open('Médico eliminado exitosamente', 'Cerrar', { duration: 3000 });
        this.cargar();
      },
      error: () => {
        this.snackBar.open('Error al eliminar médico', 'Cerrar', { duration: 3000 });
      }
    });
  }

  nuevoMedico() {
    this.router.navigateByUrl('/admin/medicos/nuevo');
  }

  volver() {
    this.router.navigateByUrl('/admin');
  }
}

