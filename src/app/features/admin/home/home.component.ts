import { Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'admin-home',
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatToolbarModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeAdminComponent {
  
  private router = inject(Router);
  private auth = inject(AuthService);

  go(url: string){ this.router.navigateByUrl(url); }

  cerrarSesion() {
    this.auth.logout();
    this.router.navigateByUrl('/auth');
  }
}

