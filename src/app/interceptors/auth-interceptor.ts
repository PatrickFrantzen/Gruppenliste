import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "../services/auth/auth.service";
import { catchError, Observable, throwError } from "rxjs";

export interface AuthInterceptor {
}

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.authService.tokenSignal()
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }
        return next.handle(request).pipe(
            catchError(error => {
                if (error.status === 401) {
                    // Token expired or invalid, log out user
                    this.authService.logout();
                }
                return throwError(error);
            })
        );
    }
}