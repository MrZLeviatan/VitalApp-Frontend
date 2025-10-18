import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowed: ('PACIENTE' | 'MEDICO' | 'ADMIN')[]): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isLogged()) { router.navigateByUrl('/auth'); return false; }

    const role = auth.getRole();
    if (role && allowed.includes(role as any)) return true;

    // Fallback: reubicar a su home según rol
    if (role === 'PACIENTE') router.navigateByUrl('/citas');
    else if (role === 'MEDICO') router.navigateByUrl('/medico');
    else if (role === 'ADMIN') router.navigateByUrl('/admin');
    else router.navigateByUrl('/auth');
    return false;
  };
};
