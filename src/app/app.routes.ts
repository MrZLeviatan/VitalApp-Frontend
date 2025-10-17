import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/login/login.component')
      .then(m => m.LoginComponent)
  },
  {
    path: 'citas',
    loadComponent: () => import('./features/citas/listado/listado.component')
      .then(m => m.ListadoComponent),
    canActivate: [roleGuard(['PACIENTE'])]
  },
  {
    path: 'perfil',
    loadComponent: () => import('./features/perfil/perfil/perfil.component')
      .then(m => m.PerfilComponent),
    canActivate: [roleGuard(['PACIENTE'])]
  },
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth' }
];

