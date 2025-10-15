import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <!-- Nav mínima para probar -->
    <nav style="padding:8px; border-bottom:1px solid #ddd">
      <a routerLink="/auth">Auth</a> |
      <a routerLink="/citas">Citas</a> |
      <a routerLink="/resultados">Resultados</a> |
      <a routerLink="/alertas">Alertas</a> |
      <a routerLink="/perfil">Perfil</a>
    </nav>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {}
