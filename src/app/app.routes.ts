import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auth' },

  // Auth
  { path: 'auth', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },

  // Admin
  { path: 'admin', canActivate: [roleGuard(['ADMIN'])], loadComponent: () => import('./features/admin/home/home.component').then(m => m.HomeAdminComponent) },

  // Médico
  { path: 'medico', canActivate: [roleGuard(['MEDICO'])], loadComponent: () => import('./features/medico/home/home.component').then(m => m.HomeMedicoComponent) },

  // Paciente (o compartidas)
  { path: 'citas',      canActivate: [roleGuard(['PACIENTE','MEDICO','ADMIN'])], loadComponent: () => import('./features/citas/listado/listado.component').then(m => m.ListadoComponent) },
  { path: 'perfil',     canActivate: [roleGuard(['PACIENTE','MEDICO','ADMIN'])], loadComponent: () => import('./features/perfil/perfil/perfil.component').then(m => m.PerfilComponent) },
  { path: 'resultados', loadComponent: () => import('./features/resultados/listado/listado.component').then(m => m.ResultadosListadoComponent) },
  { path: 'resultados/:id', loadComponent: () => import('./features/resultados/detalle/detalle.component').then(m => m.ResultadoDetalleComponent) },
  { path: 'alertas',    canActivate: [roleGuard(['PACIENTE','MEDICO','ADMIN'])], loadComponent: () => import('./features/alertas/listado/alertas.component').then(m => m.AlertasComponent) },


  {
  path: 'citas/agendar',
  canActivate: [roleGuard(['PACIENTE'])],
  loadComponent: () => import('./features/citas/agendar/agendar.component').then(m => m.AgendarComponent)
  },


  { path: '**', redirectTo: 'auth' }
];

