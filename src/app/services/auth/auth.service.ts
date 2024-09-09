import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { Router } from '@angular/router';
import { CurrentListService } from '../current-list/current-list.service';
import { Liste } from '../../models/list.model';
import { AuthStore } from '../../store/auth.store';

const BACKEND_AUTH = environment.apiURL + '/gl/auth/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http = inject(HttpClient);
  router = inject(Router)
  currentListService = inject(CurrentListService);


  // tokenSignal = signal('');
  // adminSignal = signal<boolean | undefined>(undefined);
  private tokenExpirationTimer: any;


  createUser(name: string, password: string) {
    const createAuthDto = { name, password };
    this.http.post<{message: string}>(BACKEND_AUTH + 'signup', createAuthDto)
    .subscribe({
      next: (response) => {
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  async login(name: string, password: string): Promise<string> {
    const loginAuthDto = { name, password };
    return new Promise<string>((resolve, reject) => {
      this.http.post<{accessToken: string, bedarfslisten: Liste[]}>(BACKEND_AUTH + 'login', loginAuthDto)
      .subscribe({
        next: (response) => {
          localStorage.setItem('token', response.accessToken);
          const decodedToken = jwtDecode(response.accessToken);
          
          // this.tokenSignal.set(response.accessToken);
          // this.adminSignal.set(decodedToken.isAdmin);
          this.currentListService.bedarfsliste.set(response.bedarfslisten);
          // this.checkExpirationDurationAndSetTimer(decodedToken);
          this.router.navigate(['/']);
          resolve(response.accessToken);
        },
        error: (error) => {
          console.log(error);
          reject(error);
        }
      });
    });
  }

  logout() {
    localStorage.removeItem('token');
    // this.tokenSignal.set('');
    // this.adminSignal.set(undefined);
    this.currentListService.bedarfsliste.set([]);
    this.router.navigate(['/login']);

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  checkExpirationDurationAndSetTimer(decodedToken: JwtPayload) {
    const expirationDuration = decodedToken.exp
      ? decodedToken.exp * 1000 - Date.now()
      : null;
    // if (expirationDuration) {
    //   const hours = Math.floor(expirationDuration / (1000 * 60 * 60));
    //   const minutes = Math.floor(
    //     (expirationDuration % (1000 * 60 * 60)) / (1000 * 60)
    //   );
    //   const seconds = Math.floor((expirationDuration % (1000 * 60)) / 1000);
    //   // console.log(
    //   //   'expirationDuration',
    //   //   hours,
    //   //   'hours',
    //   //   minutes,
    //   //   'minutes',
    //   //   seconds,
    //   //   'seconds'
    //   // );
    //   this.tokenExpirationTimer = setTimeout(() => {
    //     // this.logout();
    //     // this.authStore.logout();
    //   }, expirationDuration);
    // }
    if (expirationDuration) {
      this.tokenExpirationTimer = setTimeout(() => {
        // this.authStore.logout();
        // this.logout();
      }, expirationDuration);
    }
  }

  checkIfTokenIsValid(): {token: string, isAdmin: boolean} | false {
    const token = localStorage.getItem('token');

    if (!token) {
      return false;
    }

    const decodedToken = jwtDecode(token);
    const expirationDate = decodedToken.exp
      ? new Date(decodedToken.exp * 1000)
      : null;
    if (expirationDate && expirationDate <= new Date()) {
      // this.logout();
      // this.authStore.logout();
      return false;
    }
    // this.tokenSignal.set(token);
    // this.adminSignal.set(decodedToken.isAdmin);
    // this.currentListService.getAllLists();
    // this.checkExpirationDurationAndSetTimer(decodedToken);
    return {token, isAdmin: decodedToken.isAdmin};
  }
}
