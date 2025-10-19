import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-medico-home',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatToolbarModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeMedicoComponent {
  private router = inject(Router);
  private auth = inject(AuthService);

  go(path: string){ this.router.navigateByUrl(path); }

  cerrarSesion() {
    this.auth.logout();
    this.router.navigateByUrl('/auth');
  }
}

