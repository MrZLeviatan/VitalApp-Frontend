import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitasService } from '../../../core/services/citas.service';

@Component({
  selector: 'app-citas-listado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listado.component.html',
  template: `<h1>Citas</h1><pre>{{ data | json }}</pre>`
})
export class ListadoComponent implements OnInit{

  data: any;
  constructor(private citas: CitasService) {}
  ngOnInit() { this.citas.listar().subscribe(d => this.data = d); }
}
