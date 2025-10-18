import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true, selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule,MatIconModule,],
  templateUrl: './login.component.html', styleUrls: ['./login.component.css']
})
export class LoginComponent {

  ngOnInit() {
    // al entrar al login, limpiamos cualquier sesión vieja
    this.auth.logout();
  }
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AuthService);

  loading = false;
  error: string | null = null;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  submit() {
  if (this.form.invalid) return;
  this.loading = true; this.error = null;

  this.auth.login(this.form.value as any).subscribe({
    next: () => {
      const role = localStorage.getItem('sv_role');
      if (role === 'ADMIN')  this.router.navigateByUrl('/admin',  { replaceUrl: true });
      else if (role === 'MEDICO') this.router.navigateByUrl('/medico', { replaceUrl: true });
      else this.router.navigateByUrl('/citas', { replaceUrl: true }); // PACIENTE por defecto
    },
    error: () => { this.error = 'Credenciales inválidas'; this.loading = false; }
  });
  }

}
