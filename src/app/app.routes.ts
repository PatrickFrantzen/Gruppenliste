import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
    {path: '', loadComponent: () => import('./components/main/main.component').then((m) => m.MainComponent), canActivate: [authGuard]},
    {path: 'admin', loadComponent: () => import('./components/admin/admin.component').then((m) => m.AdminComponent), canActivate: [adminGuard]},
    {path: 'login', loadComponent: () => import('./components/login/login.component').then((m) => m.LoginComponent)},
];
