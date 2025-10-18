import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { CitasService } from '../../../core/services/citas.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-citas-agendar',
  imports: [
    CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatCardModule
  ],
  templateUrl: './agendar.component.html',
  styleUrls: ['./agendar.component.css']
})
export class AgendarComponent implements OnInit {

  private fb = inject(FormBuilder);
  private citas = inject(CitasService);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = false;
  especialidades: { id: number; nombre: string }[] = [];

  form = this.fb.group({
    especialidadId: ['', Validators.required],
    fecha: ['', Validators.required],
  });

  ngOnInit(): void {
    this.citas.especialidades().subscribe({
      next: (res: any) => {
        const src = (res?.data ?? res ?? []) as any[];
        this.especialidades = src.map((e: any) => ({
          id: e.idEspecialidad ?? e.especialidadId ?? e.id,
          nombre: e.nombre ?? e.nombreEspecialidad
        }));
      },
      error: () => alert('No se pudieron cargar las especialidades')
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    const pacienteId = this.auth.getUserId();
    if (!pacienteId) { alert('Sesión inválida'); return; }

    // OJO: el endpoint /paciente/citas/registro pide estos 4 campos.
    // Más adelante podemos reemplazar idMedico / idAgenda por selects reales.
    const dto = {
      observaciones: '',
      idPaciente: pacienteId,
      idMedico: 1,
      idAgenda: 1
    };

    this.loading = true;
    this.citas.registrar(dto).subscribe({
      next: (_r: any) => {
        alert('Cita agendada');
        this.router.navigateByUrl('/citas');
      },
      error: (e: any) => {
        this.loading = false;
        alert('No se pudo agendar: ' + (e?.error?.message ?? 'intenta de nuevo'));
      }
    });
  }
}
