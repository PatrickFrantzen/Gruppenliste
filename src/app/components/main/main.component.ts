import { Component, computed, inject, Signal, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CurrentListService } from '../../services/current-list/current-list.service';
import { KaufStatusPipe } from '../../pipes/kaufStatus.pipe';
import { CurrentListComponent } from '../current-list/current-list.component';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { ItemComponent } from '../dialoge/item/item.component';
import { addIcons } from 'ionicons';
import { IonButton, IonButtons, IonHeader, IonIcon, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { add, close } from 'ionicons/icons';
import { IonModal } from '@ionic/angular/standalone';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    MatTableModule,
    MatCheckboxModule,
    KaufStatusPipe,
    CurrentListComponent,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    IonButton,
    IonIcon,
    IonModal,
    IonHeader,
    ItemComponent,
],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  constructor() {
    addIcons({
      add,
      close
    })
  }
  listService = inject(CurrentListService);
  dialog = inject(MatDialog);

  /*
  *Stellt die aktuell ausgewählte Liste bereit
  */
  // currentList = this.listService.currentListSignal;

  currentListName = this.listService.currentListNameSignal;
  currentListID = this.listService.choosenListIDSignal;
  bedarfsItemForDisplay = this.listService.bedarfsItemForDisplay;

  @ViewChild(IonModal) addItemModal: IonModal | undefined;


  handleCloseModal() {
    this.addItemModal?.dismiss(null, 'cancel');
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
