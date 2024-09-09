import { Component, inject, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonItem,
  IonLabel,
  IonList, IonIcon, 
  IonInputPasswordToggle, IonInput } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eye, eyeOff } from 'ionicons/icons';
import { AuthStore } from '../../store/auth.store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonInput, IonIcon, 
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    IonList,
    IonItem,
    IonLabel,
    IonButtons,
    IonButton,
    IonIcon,
    IonInputPasswordToggle
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  router = inject(Router);
  userService = inject(UserService);
  authService = inject(AuthService);
  authStore = inject(AuthStore);
  fb = inject(FormBuilder);
  hide = signal(true);

  constructor() {
    addIcons({ eye, eyeOff });
  }

  form = this.fb.nonNullable.group({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(32),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(32),
      this.passwordStrengthValidator(),
    ]),
  });

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  register() {
    const name = this.form.get('name')?.getRawValue();
    const password = this.form.get('password')?.getRawValue();
    this.authService.createUser(name, password);
  }

  login() {
    const name = this.form.get('name')?.getRawValue();
    const password = this.form.get('password')?.getRawValue();
    this.authStore.login(name, password);
    // this.authService.createUser('Patrick', '1234');
    // this.userService.login();
    // this.router.navigate(['/']);
  }

  onEnter(event: KeyboardEvent) {
    if (this.form.valid && event.key === 'Enter') {
      this.login();
    }
  }

  passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
  
      const regex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
      const valid = regex.test(value);
  
      return valid ? null : { passwordStrength: true };
    };
  }
}
