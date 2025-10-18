import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ResultadosService } from '../../../core/services/resultados.service';
import { DetalleFormulaDto, FormulaDto } from '../../../shared/api.types';

@Component({
  standalone: true,
  selector: 'app-resultado-detalle',
  imports: [CommonModule],
  templateUrl: './detalle.component.html'
})
export class ResultadoDetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(ResultadosService);

  formula: FormulaDto | null = null;
  detalles: DetalleFormulaDto[] = [];
  cargando = false;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;
    this.cargando = true;

    this.api.formula(id).subscribe({
      next: (res) => this.formula = (res.data ?? res.mensaje as any) || null
    });

    this.api.detallesFormula(id).subscribe({
      next: (res) => {
        this.detalles = (res.data ?? (res.mensaje as any)) || [];
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }
}
