import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { AuthStore } from '../store/auth.store';

export const adminGuard: CanActivateFn = (route, state) => {
  // const authService = inject(AuthService);
  const authStore = inject(AuthStore);
  const router = inject(Router);
  // const isAdmin = authService.adminSignal();
  const isAdmin = authStore.isAdmin();

  if (!isAdmin) {
    router.navigate(['/']);
    return false;
  }

  return true;
};