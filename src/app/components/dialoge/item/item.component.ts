import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CurrentListService } from '../../../services/current-list/current-list.service';
import { Bedarfsliste_Item, Item } from '../../../models/item.model';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../../services/user/user.service';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonModal,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, close } from 'ionicons/icons';
import { ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-item',
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
    IonLabel,
    IonSelect,
    IonSelectOption,
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss',
})
export class ItemComponent implements OnInit {
  @ViewChild(IonModal) modal: IonModal | undefined;
  @Input() modus: 'create' | 'edit' = 'create';
  @Input() item: Bedarfsliste_Item | undefined;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  //Modal und schließen funktioniert noch nicht
  constructor() {
    addIcons({
      close,
      add,
    });
  }

  // readonly dialogRef = inject(MatDialogRef<AddItemComponent>)
  currentListService = inject(CurrentListService);
  currentUserService = inject(UserService);
  modalController = inject(ModalController);

  categories = [
    'Obst',
    'Gemüse',
    'Getränke',
    'Fisch',
    'Fleisch',
    'Beilagen',
    'Soßen',
    'Süßigkeiten',
    'Snacks',
    'Konserven',
    'Tiefkühl',
    'Backwaren',
    'Drogerie',
    'Haushalt',
    'Sonstiges',
  ];
  units = ['Stück', 'kg', 'Liter'];

  itemForm = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    amount: new FormControl<number|null>(null, {
      nonNullable: true,
      validators: Validators.required,
    }),
    unit: new FormControl<string>('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    category: new FormControl<string>('', {
      nonNullable: true,
      validators: Validators.required,
    }),
  });

  ngOnInit() {
    if (this.modus === 'edit') {
      if (this.item) {
        this.itemForm.setValue({
          name: this.item.name,
          amount: this.item.menge,
          unit: this.item.einheit,
          category: this.item.kategorie,
        });
      }
    }
  }

  close() {
    if (this.modus === 'edit') {
      return this.modalController.dismiss(null, 'cancel');
    } else this.closeModal.emit();
    return null;
  }

  save() {
    const values = this.itemForm.getRawValue();
    if (this.modus === 'edit' && this.item) {
      this.item.name = values.name;
      this.item.menge = values.amount || 0;
      this.item.einheit = values.unit;
      this.item.kategorie = values.category;

      // this.currentListService.updateItemInCurrentList(this.item);
      this.currentListService.saveItem(this.item);
      this.modalController.dismiss();
    } else {
      // const item = new Item(
      //   values.name,
      //   values.amount || 0,
      //   values.unit,
      //   values.category
      // );

      const item: Bedarfsliste_Item = {
        name: values.name,
        menge: values.amount || 0,
        einheit: values.unit,
        kategorie: values.category,
        zugeordneteMitglieder: [],
      }
      this.currentListService.saveItem(item);
      
      //Item kommt im backend an, muss da noch gespeichert und wieder zurückgesendet werden, damit die Frontendliste aktualisiert wird


      // this.currentListService.addItemToCurrentList(item);
      this.closeModal.emit();
    }
  }
}
