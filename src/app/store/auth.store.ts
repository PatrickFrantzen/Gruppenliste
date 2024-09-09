import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { CurrentListService } from '../services/current-list/current-list.service';
import { BedarfslistenStore } from './bedarfslisten.store';

type AuthState = {
  token: string | undefined;
  loading: boolean;
  isAdmin: boolean;
  tokenExpirationTimer: any | null;
};

const initialState: AuthState = {
  token: undefined,
  loading: false,
  isAdmin: false,
  tokenExpirationTimer: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, authService = inject(AuthService), currentListService = inject(CurrentListService), bedarfslistenStore = inject(BedarfslistenStore)) => ({
    async login(name: string, password: string) {
      patchState(store, { loading: true });

      const token = await authService.login(name, password);
      const decodedToken = jwtDecode(token);
      const isAdmin = decodedToken.isAdmin;
      this.checkExpirationDurationAndSetTimer(decodedToken);
      patchState(store, { token: token, isAdmin, loading: false });
      // currentListService.getAllBedarfslisten();
      bedarfslistenStore.getAllBedarfslisten();
    },

    logout() {
      authService.logout();
      bedarfslistenStore.removeAllBedarfslistenOnLogout();
      const timer = store.tokenExpirationTimer;
      if (typeof timer === 'number') {
        clearTimeout(timer)!;
      } 
      patchState(store, { token: undefined, isAdmin: false, tokenExpirationTimer: null });
    },

    loadTokenFromLocalStorage(): boolean {
      const token = authService.checkIfTokenIsValid();

      if (token) {
        this.checkExpirationDurationAndSetTimer(jwtDecode(token.token));
        patchState(store, { token: token.token, isAdmin: token.isAdmin });
        // currentListService.getAllBedarfslisten();
      bedarfslistenStore.getAllBedarfslisten();

        return true;
      } else {
        this.logout();
        return true
      }
    },

    checkExpirationDurationAndSetTimer(decodedToken: JwtPayload) {
      const expirationDuration = decodedToken.exp
        ? decodedToken.exp * 1000 - Date.now()
        : null;

      if (expirationDuration) {
        if (expirationDuration) {
          const hours = Math.floor(expirationDuration / (1000 * 60 * 60));
          const minutes = Math.floor(
            (expirationDuration % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((expirationDuration % (1000 * 60)) / 1000);
          console.log(
            'expirationDuration',
            hours,
            'hours',
            minutes,
            'minutes',
            seconds,
            'seconds'
          );
        }
        patchState(store, {
          tokenExpirationTimer: setTimeout(() => {
            console.log('Timer abgelaufen');
            this.logout();
          }, expirationDuration),
        });
      }
    },
  }))
);
