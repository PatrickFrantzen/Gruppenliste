import { Component, effect, inject, ViewChild } from '@angular/core';
import { CurrentListService } from '../../services/current-list/current-list.service';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import {
  IonHeader,
  IonToolbar,
  IonMenu,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonMenuButton,
  IonList,
  IonItem,
  IonMenuToggle,
  IonIcon,
  IonModal,
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth/auth.service';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { AddListComponent } from '../dialoge/add-list/add-list.component';
import { Liste } from '../../models/list.model';
import { AuthStore } from '../../store/auth.store';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    AddListComponent,
    IonIcon,
    IonTitle,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonMenu,
    IonMenuToggle,
    IonContent,
    IonButtons,
    IonButton,
    IonMenuButton,
    IonList,
    IonItem,
    IonModal,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(
  ) {
    effect(() => {
      console.log('Bedarfsliste', this.allLists());
      console.log('Items', this.currentListService.bedarfsItemForDisplay());
    });
    addIcons({ add });
  }
  @ViewChild(IonModal) addListeModal: IonModal | undefined;
  readonly authStore = inject(AuthStore);
  readonly userService = inject(UserService);
  readonly authService = inject(AuthService);
  public setChoosenListID = inject(CurrentListService).choosenListIDSignal;
  public setChoosenListName = inject(CurrentListService).currentListNameSignal;
  readonly currentListService = inject(CurrentListService);
  // readonly userLoggedIn = this.authService.tokenSignal;

  allLists = this.currentListService.bedarfsliste;

  logout() {
    // this.authService.logout();
    this.authStore.logout();

  }

  selectList(liste: Liste) {
    console.log('Liste ausgewählt', liste);
    this.setChoosenListID.set(liste.id);
    this.setChoosenListName.set(liste.name);
  }

  handleCloseModal() {
    this.addListeModal?.dismiss(null, 'cancel');
  }

  onWillDismiss(event: Event) {

    //falls auf das schließen irgendwie reagiert werden soll

    // const ev = event as CustomEvent<OverlayEventDetail<string>>;
    // console.log('will dismiss with', ev.detail);
    // if (ev.detail.role === 'confirm') {
    //   console.log('Confirmed');
    // }
  }
}
