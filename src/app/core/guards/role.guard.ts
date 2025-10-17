import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowed: Array<'PACIENTE'|'MEDICO'|'ADMIN'>): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isLogged()) { router.navigateByUrl('/auth'); return false; }
    const role = auth.getRole();
    if (role && allowed.includes(role)) return true;

    if (role === 'PACIENTE') router.navigateByUrl('/citas');
    if (role === 'MEDICO')   router.navigateByUrl('/medico');
    if (role === 'ADMIN')    router.navigateByUrl('/admin');
    return false;
  };
};
