import { Component, computed, inject } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { CurrentListService } from '../../services/current-list/current-list.service';
import { IonFooter, IonToolbar, IonTitle } from '@ionic/angular/standalone';


@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [IonTitle, MatToolbarModule, MatIconModule, IonFooter, IonToolbar],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  currentListSignal = inject(CurrentListService).currentListSignal;

  listName = computed(() => this.currentListSignal()!.name);

}
