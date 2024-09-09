import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthStore } from '../store/auth.store';

export interface AuthInterceptor {}

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}
  authStore = inject(AuthStore);

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // const token = this.authService.tokenSignal()
    console.log('TokenInterceptor', this.authStore.token());
    if (this.authStore.token()) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authStore.token()}`,
        },
      });
    }
    return next.handle(request).pipe(
      catchError((error) => {
        if (error.status === 401) {
            console.log('Token expired or invalid, log out user');
          // Token expired or invalid, log out user
          this.authStore.logout();
          // this.authService.logout();
        }
        return throwError(error);
      })
    );
  }
}
