import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-alertas',
  imports: [CommonModule, MatIconModule],
  template: `
    <h2>Alertas</h2>
    <div class="empty">
      <mat-icon>notifications_none</mat-icon>
      <p>No tienes alertas por ahora.</p>
    </div>
  `,
  styles: [`
    .empty { padding: 24px; background:#fff; border:1px solid #eee; border-radius:12px;
             display:flex; gap:12px; align-items:center; }
    h2 { margin: 12px 0; }
  `]
})
export class AlertasComponent {}
