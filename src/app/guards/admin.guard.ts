import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isAdmin = authService.adminSignal();

  if (!isAdmin) {
    router.navigate(['/']);
    return false;
  }

  return true;
};