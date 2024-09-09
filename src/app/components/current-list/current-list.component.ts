import { Component, effect, inject, input, ViewChild } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { KaufStatusPipe } from '../../pipes/kaufStatus.pipe';
import { Bedarfsliste_Item, Item } from '../../models/item.model';
import { CurrentListService } from '../../services/current-list/current-list.service';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/user/user.service';
import {
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  ModalController,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ItemComponent } from '../dialoge/item/item.component';

@Component({
  selector: 'app-current-list',
  standalone: true,
  imports: [
    IonModal,
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    KaufStatusPipe,
    MatIconModule,
    IonList,
    IonItem,
    IonLabel,
    IonModal,
    ItemComponent,
  ],
  templateUrl: './current-list.component.html',
  styleUrl: './current-list.component.scss',
})
export class CurrentListComponent {
  @ViewChild(IonModal) editItemModal: IonModal | undefined;
  displayedColumns: string[] = ['name', 'edit', 'delete'];

  listItems = input.required<Bedarfsliste_Item[]>();
  // kaufStatus = input.required<boolean>();

  listService = inject(CurrentListService);
  userSerivce = inject(UserService);
  modalController = inject(ModalController);

  //neu

  //alt
  currentList = this.listService.currentListSignal;

  /*
   *Ändert den Einkaufsstatus eines Items und aktuallisiert das Signal
   */
  changeEinkaufsstatus(item: Item) {
    this.currentList().items = this.currentList().items.map((i) =>
      i === item ? { ...i, bought: !i.bought } : i
    );
    this.listService.updateListInAllLists(this.currentList());
  }

  changeZuordnung(item: Item) {
    const currentUser = this.userSerivce.user();
    this.currentList().items = this.currentList().items.map((i) => {
      if (i === item) {
        const isUserAssigned = i.zugeordneteMitglieder.includes(currentUser);
        const updatedUsers = isUserAssigned
          ? i.zugeordneteMitglieder.filter((u) => u !== currentUser)
          : [...i.zugeordneteMitglieder, currentUser];
        return { ...i, zugeordneteUser: updatedUsers };
      }
      return i;
    });
    console.log(this.currentList().items);
    this.listService.updateListInAllLists(this.currentList());
  }

  getFormattedZugeordneteUser(users: string[]) {
    if (users.length === 0) {
      return '';
    } else if (users.length === 1) {
      return users[0];
    } else if (users.length === 3) {
      return users.join(', ');
    } else {
      return (
        users.slice(0, 2).join(', ') + ' und ' + (users.length - 2) + ' weitere'
      );
    }
  }

  /*
   *Löscht ein Item aus der aktuellen Liste
   */
  deleteItem(item: Item) {
    this.listService.deleteItemFromCurrentList(item);
  }

  async openEditModal(item: Item) {
    const modal = await this.modalController.create({
      component: ItemComponent,
      componentProps: {
        item: item,
        modus: 'edit',
      },
    });
    modal.present();
  }

  checkifUserIsAssigned(item: Item) {
    console.log('item', item);
    if (item.zugeordneteMitglieder.length === 0) {
      return false;
      
    } else 
    return item.zugeordneteMitglieder.includes(this.userSerivce.user());
  }

  handleCloseModal() {
    this.editItemModal?.dismiss(null, 'cancel');
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
