import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { AuthStore } from '../store/auth.store';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const authStore = inject(AuthStore);
  const router = inject(Router);
  // const isAuthenticated = authService.checkIfTokenIsValid();
  const isAuthenticated = authStore.loadTokenFromLocalStorage();

  if (!isAuthenticated) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
