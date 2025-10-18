import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { PerfilService } from '../../../core/services/perfil.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-perfil',
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule
  ],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  private fb = inject(FormBuilder);
  private perfil = inject(PerfilService);
  private auth = inject(AuthService);

  // siempre number
  private idPaciente: number = this.auth.getUserId() ?? 1;

  loading = false;
  error: string | null = null;

  form = this.fb.group({
    id: [this.idPaciente],
    nombre: ['', Validators.required],
    documento: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    telefono: ['']
  });

  ngOnInit(): void {
    // intenta por id
    this.perfil.detalle(this.idPaciente).subscribe({
      next: (res: any) => {
        const data = res?.data ?? res;
        if (data) {
          this.form.patchValue({
            id: data.id,
            nombre: data.nombre,
            documento: data.documento,
            correo: data.correo,
            telefono: data.telefono
          });
        }
      },
      error: () => { this.error = 'No se pudo cargar tu perfil.'; alert(this.error); }
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.loading = true; this.error = null;
    this.perfil.editarPerfil(this.form.value).subscribe({
      next: () => { this.loading = false; alert('Perfil actualizado'); },
      error: (e: any) => { this.loading = false; this.error = 'Error inesperado'; alert(this.error); }
    });
  }
}

