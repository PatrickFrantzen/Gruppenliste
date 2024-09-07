import { Injectable, signal } from '@angular/core';
import { Mitglied } from '../../models/mitglied.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  user = signal<Mitglied>({ name: 'Patrick', id: '0' });

  logout() {
    this.user.set({ name: '', id: '' });
  }

  login() {
    this.user.set({ name: 'Patrick', id: '0' });
  }
}
