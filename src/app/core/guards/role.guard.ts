import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Role } from '../../shared/api.types';

export const roleGuard = (allowed: Role[]): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isLogged()) { router.navigateByUrl('/auth'); return false; }

    const role = auth.getRole();               // 'PACIENTE' | 'MEDICO' | 'ADMIN' | null
    if (role && allowed.includes(role as Role)) return true;

    // Fallback: reubicar según su rol real
    if      (role === 'PACIENTE') router.navigateByUrl('/citas');
    else if (role === 'MEDICO')   router.navigateByUrl('/medico');
    else if (role === 'ADMIN')    router.navigateByUrl('/admin');
    else                          router.navigateByUrl('/auth');
    return false;
  };
};


