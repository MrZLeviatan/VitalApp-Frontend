import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { ResultadosService } from '../../../core/services/resultados.service';
import { FormulaDto } from '../../../shared/api.types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resultados-listado',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule],
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css']
})
export class ResultadosListadoComponent implements OnInit {
  private resultados = inject(ResultadosService);
  private router = inject(Router);

  cols = ['fecha','descripcion','acciones'];
  data: FormulaDto[] = [];
  cargando = false;

  idPaciente = Number(localStorage.getItem('sv_userId')) || 1;

  ngOnInit(){ this.cargar(); }

  cargar(){
    this.cargando = true;
    this.resultados.formulasPaciente(this.idPaciente).subscribe({
      next: (res) => {
        const payload = (res.data ?? (res.mensaje as any)) ?? [];
        this.data = payload || [];
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }

  ver(id: number){
    this.router.navigateByUrl(`/resultados/${id}`);
  }
}
