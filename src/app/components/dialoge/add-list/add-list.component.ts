import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonSelect, IonSelectOption, IonTitle, IonToolbar, ModalController } from "@ionic/angular/standalone";
import { CurrentListService } from '../../../services/current-list/current-list.service';
import { UserService } from '../../../services/user/user.service';
import { List } from '../../../models/list.model';
import { Mitglied } from '../../../models/mitglied.model';
import { Item } from '../../../models/item.model';
import { BedarfslistenStore } from '../../../store/bedarfslisten.store';

@Component({
  selector: 'app-add-list',
  standalone: true,
  imports: [
    IonList,
    IonLabel,
    IonIcon,
    MatButtonModule,
    MatDialogModule,
    MatFormField,
    ReactiveFormsModule,
    MatInputModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonTitle,
    IonContent,
    IonItem,
    IonInput,
    IonSelect,
    IonSelectOption,
  ],
  templateUrl: './add-list.component.html',
  styleUrls: ['./add-list.component.scss'],
})
export class AddListComponent  implements OnInit {
  @Input() modus: 'create' | 'edit' = 'create';
  @Input() list: List | undefined;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  bedarfslistenStore = inject(BedarfslistenStore);

  currentListService = inject(CurrentListService);
  currentUserService = inject(UserService);
  modalController = inject(ModalController);
  fb = inject(FormBuilder);

  listForm = this.fb.nonNullable.group({
    name: new FormControl('', Validators.required),
    mitglieder: new FormControl<Mitglied[]>([]),
  });

  ngOnInit() {}

  close() {
    if (this.modus === 'edit') {
      return this.modalController.dismiss(null, 'cancel');
    } else this.closeModal.emit();
    return null;
  }

  save() {
    const values = this.listForm.getRawValue();
    if (this.modus === 'edit' && this.list) {
      this.list.name = values.name!;
      this.list.zugeordneteUser = values.mitglieder!;
  

      // this.currentListService.updateItemInCurrentList(this.item);
      this.modalController.dismiss();
    } else {
      const name = values.name!;
      const items: Item[] = [];
      const mitglieder = values.mitglieder!;
      const list = new List(name, items, mitglieder);
      //Ans Backend senden und neue Liste erstellen

      // const item = new Item(
      //   values.name,
      //   values.amount || 0,
      //   values.unit,
      //   values.category
      // );
      // console.log('Item', item);

      // this.currentListService.postList(list);
      this.bedarfslistenStore.addBedarfsliste(list);
      this.closeModal.emit();
    }
  }

}
