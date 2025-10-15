import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'auth', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'citas', loadComponent: () => import('./features/citas/listado/listado.component').then(m => m.ListadoComponent) },
  { path: 'resultados', loadComponent: () => import('./features/resultados/listado/listado.component').then(m => m.ListadoComponent) },
  { path: 'alertas', loadComponent: () => import('./features/alertas/listado/listado.component').then(m => m.ListadoComponent) },
  { path: 'perfil', loadComponent: () => import('./features/perfil/perfil/perfil.component').then(m => m.PerfilComponent) },
  { path: '', pathMatch: 'full', redirectTo: 'auth' },
  { path: '**', redirectTo: 'auth' }
];
