import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { PerfilService } from '../../../core/services/perfil.service';

@Component({
  standalone: true,
  selector: 'app-perfil',
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  private fb = inject(FormBuilder);
  private perfil = inject(PerfilService);

  // TODO: reemplazar id con el del usuario logueado
  private idPaciente = 1;

  form = this.fb.group({
    id: [this.idPaciente],
    nombre: ['', Validators.required],
    documento: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    telefono: ['']
  });

  ngOnInit() {
    
    this.perfil.detalle(this.idPaciente).subscribe({
      next: (res: any) => {
        
        const data = res?.data ?? res;
        this.form.patchValue({
          id: data.id,
          nombre: data.nombre,
          documento: data.documento,
          correo: data.correo,
          telefono: data.telefono
        });
      }
    });
  }

  save() {
    
    this.perfil.editarPerfil(this.form.value).subscribe(() => alert('Perfil actualizado'));
  }

  
  saveEmail() {
    this.perfil.editarEmail({ id: this.form.value.id, email: this.form.value.correo })
      .subscribe(() => alert('Email actualizado'));
  }
}
