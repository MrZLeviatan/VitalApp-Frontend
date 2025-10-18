import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

type Role = 'PACIENTE' | 'MEDICO' | 'ADMIN';

@Component({
  selector: 'app-root',
  standalone: true,
  // 👇 AÑADIMOS RouterLink y RouterLinkActive
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, MatToolbarModule, MatButtonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  public router = inject(Router);

  isLoggedIn(): boolean { return !!localStorage.getItem('sv_token'); }

  get role(): Role | null {
    const r = localStorage.getItem('sv_role') as Role | null;
    return r === 'PACIENTE' || r === 'MEDICO' || r === 'ADMIN' ? r : null;
  }
  get isPaciente() { return this.role === 'PACIENTE'; }
  get isMedico()   { return this.role === 'MEDICO'; }
  get isAdmin()    { return this.role === 'ADMIN'; }

  logout() {
    localStorage.removeItem('sv_token');
    localStorage.removeItem('sv_role');
    localStorage.removeItem('sv_userId');
    this.router.navigateByUrl('/auth', { replaceUrl: true });
  }
}

