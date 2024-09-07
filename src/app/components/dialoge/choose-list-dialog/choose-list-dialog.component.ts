import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';
import { CurrentListService } from '../../../services/current-list/current-list.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-choose-list-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatRadioModule, RouterLink],
  templateUrl: './choose-list-dialog.component.html',
  styleUrl: './choose-list-dialog.component.scss'
})
export class ChooseListDialogComponent {

  readonly dialogRef = inject(MatDialogRef<ChooseListDialogComponent>)
  currentListService = inject(CurrentListService);

  allLists = this.currentListService.allListsSignal;

  choosenID(id: number) {
    this.dialogRef.close(id);
  }

}
