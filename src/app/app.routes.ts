import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auth' },

  // Auth
  { path: 'auth', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },

  // ==================== ADMIN ====================
  { path: 'admin', canActivate: [roleGuard(['ADMIN'])], loadComponent: () => import('./features/admin/home/home.component').then(m => m.HomeAdminComponent) },
  { path: 'admin/eps', canActivate: [roleGuard(['ADMIN'])], loadComponent: () => import('./features/admin/eps/eps.component').then(m => m.AdminEpsComponent) },
  { path: 'admin/especialidades', canActivate: [roleGuard(['ADMIN'])], loadComponent: () => import('./features/admin/especialidades/especialidades.component').then(m => m.AdminEspecialidadesComponent) },
  { path: 'admin/medicamentos', canActivate: [roleGuard(['ADMIN'])], loadComponent: () => import('./features/admin/medicamentos/medicamentos.component').then(m => m.AdminMedicamentosComponent) },
  { path: 'admin/medicos', canActivate: [roleGuard(['ADMIN'])], loadComponent: () => import('./features/admin/medicos/medicos.component').then(m => m.AdminMedicosComponent) },
  { path: 'admin/medicos/nuevo', canActivate: [roleGuard(['ADMIN'])], loadComponent: () => import('./features/admin/medicos/registro-medico.component').then(m => m.RegistroMedicoComponent) },
  { path: 'admin/medicos/:id/agenda', canActivate: [roleGuard(['ADMIN'])], loadComponent: () => import('./features/admin/agenda-medico/agenda-medico.component').then(m => m.AdminAgendaMedicoComponent) },
  { path: 'admin/pacientes', canActivate: [roleGuard(['ADMIN'])], loadComponent: () => import('./features/admin/pacientes/pacientes.component').then(m => m.AdminPacientesComponent) },
  { path: 'admin/pacientes/nuevo', canActivate: [roleGuard(['ADMIN'])], loadComponent: () => import('./features/admin/pacientes/registro-paciente.component').then(m => m.RegistroPacienteComponent) },

  // ==================== MÉDICO ====================
  { path: 'medico', canActivate: [roleGuard(['MEDICO'])], loadComponent: () => import('./features/medico/home/home.component').then(m => m.HomeMedicoComponent) },
  { path: 'medico/citas', canActivate: [roleGuard(['MEDICO'])], loadComponent: () => import('./features/medico/citas/citas.component').then(m => m.MedicoCitasComponent) },
  { path: 'medico/citas/:id/formula', canActivate: [roleGuard(['MEDICO'])], loadComponent: () => import('./features/medico/formula/formula.component').then(m => m.RegistrarFormulaComponent) },
  { path: 'medico/agenda', canActivate: [roleGuard(['MEDICO'])], loadComponent: () => import('./features/medico/agenda/agenda.component').then(m => m.MedicoAgendaComponent) },

  // ==================== PACIENTE / COMPARTIDAS ====================
  { path: 'citas', canActivate: [roleGuard(['PACIENTE','MEDICO','ADMIN'])], loadComponent: () => import('./features/citas/listado/listado.component').then(m => m.ListadoComponent) },
  { path: 'citas/agendar', canActivate: [roleGuard(['PACIENTE'])], loadComponent: () => import('./features/citas/agendar/agendar.component').then(m => m.AgendarComponent) },
  { path: 'citas/:id', canActivate: [roleGuard(['PACIENTE','MEDICO','ADMIN'])], loadComponent: () => import('./features/citas/detalle/detalle-cita.component').then(m => m.DetalleCitaComponent) },
  { path: 'formulas', canActivate: [roleGuard(['PACIENTE'])], loadComponent: () => import('./features/paciente/formulas/formulas.component').then(m => m.MisFormulasComponent) },
  { path: 'perfil', canActivate: [roleGuard(['PACIENTE','MEDICO','ADMIN'])], loadComponent: () => import('./features/perfil/perfil/perfil.component').then(m => m.PerfilComponent) },
  { path: 'resultados', loadComponent: () => import('./features/resultados/listado/listado.component').then(m => m.ResultadosListadoComponent) },
  { path: 'resultados/:id', loadComponent: () => import('./features/resultados/detalle/detalle.component').then(m => m.ResultadoDetalleComponent) },
  { path: 'alertas', canActivate: [roleGuard(['PACIENTE','MEDICO','ADMIN'])], loadComponent: () => import('./features/alertas/listado/alertas.component').then(m => m.AlertasComponent) },

  { path: '**', redirectTo: 'auth' }
];

