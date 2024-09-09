import { computed, inject, Injectable, signal } from '@angular/core';
import { List, Bedarfsliste } from '../../models/list.model';
import { UserService } from '../user/user.service';
import { Bedarfsliste_Item, Item } from '../../models/item.model';
import { HttpClient } from '@angular/common/http';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment';
import { switchMap } from 'rxjs';

const BACKEND_MITGLIED = environment.apiURL + '/gl/mitglieder/';
const BACKEND_BEDARFSLISTE = environment.apiURL + '/gl/bedarfsliste/';

@Injectable({
  providedIn: 'root',
})
export class CurrentListService {
  http: HttpClient = inject(HttpClient);
  userService = inject(UserService);

  bedarfsliste = signal<Bedarfsliste[]>([]);
  choosenListIDSignal = signal<string>('');
  currentListNameSignal = signal<string>('');

  private choosenListID = toObservable(this.choosenListIDSignal).pipe(
    switchMap((id) => {
      if (this.choosenListIDSignal() === '') {
        return [];
      } else 
      return this.http.get<Bedarfsliste_Item[]>(BACKEND_BEDARFSLISTE + id);
    })
  );
 private rawItemsOfListe = toSignal(this.choosenListID, {initialValue: []});
 private itemsOfListe = computed(() => signal(this.rawItemsOfListe()));

 bedarfsItemForDisplay = computed(() => this.itemsOfListe()());

  //NEU
  postList(list: List) {
    const createBedarfslisteDto = { name: list.name, items: list.items, mitglieder: list.zugeordneteUser  };
    this.http.post<Bedarfsliste>(BACKEND_MITGLIED + 'createListe', createBedarfslisteDto)
    .subscribe({
      next: (response) => {
        this.addToBedarfsliste(response);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  async getAllBedarfslisten(): Promise<Bedarfsliste[]> {
    //Nur ausführen wenn User tatsächlich eingeloggt ist, ansonsten wird sofort der Request ausgelöst und es ist noch kein Token vorhanden
    return new Promise<Bedarfsliste[]>((resolve, reject) => {
      this.http.get<Bedarfsliste[]>(BACKEND_BEDARFSLISTE)
    .subscribe({
      next: (response) => {
        // this.bedarfsliste.set(response);
        resolve(response);
      }, 
      error: (error) => {
        reject(error);
        console.log(error);
      }
    });
    }) 
  }


  addToBedarfsliste(liste: Bedarfsliste){
    this.bedarfsliste.update((list) => {
      return [...list, liste];
    });
  }

  saveItem(item: Bedarfsliste_Item) {
      console.log(item);
      const listeID = this.choosenListIDSignal();
      this.http.post(`${BACKEND_BEDARFSLISTE}addItem/${listeID}`, item)
      .subscribe({
        next: (response) => {
          //Bedarfslisten_Item Store erstellen und hinzuzufügen
          console.log('antwort', response);
        },
        error: (error) => {
          console.log(error);
        }
      });
  }


  //ALT
  demoList: List = {
    name: 'Standardliste',
    id: 0,
    zugeordneteUser: [{ name: 'Patrick', id: '0' }],
    items: [
      {
        name: 'Item 1',
        amount: 1,
        unit: 'kg',
        category: 'Obst',
        bought: false,
        zugeordneteMitglieder: [{name: 'Patrick', id: '0'}],
        id: 0,
      },
      {
        name: 'Item 2',
        amount: 2,
        unit: 'Stück',
        category: 'Gemüse',
        bought: true,
        zugeordneteMitglieder: [{name: 'Patrick', id: '0'}],
        id: 1,
      },
      {
        name: 'Item 3',
        amount: 3,
        unit: 'Liter',
        category: 'Getränke',
        bought: false,
        zugeordneteMitglieder: [{name: 'Patrick', id: '0'}],
        id: 2,
      },
    ],
  };

  demoLists = signal<List[]>([
    {
      name: 'Standardliste',
      id: 0,
      zugeordneteUser: [{ name: 'Patrick', id: '0' }],
      items: [
        {
          name: 'Item 1',
          amount: 1,
          unit: 'kg',
          category: 'Obst',
          bought: false,
          zugeordneteMitglieder: [{name: 'Patrick', id: '0'}, {name: 'Rita', id: '1'}, {name: 'Thomas', id: '2'}, {name: 'Michael', id: '3'}],
          id: 0,
        },
        {
          name: 'Item 2',
          amount: 2,
          unit: 'Stück',
          category: 'Gemüse',
          bought: true,
          zugeordneteMitglieder: [{ name: 'Patrick', id: '0' }],
          id: 1,
        },
        {
          name: 'Item 3',
          amount: 3,
          unit: 'Liter',
          category: 'Getränke',
          bought: false,
          zugeordneteMitglieder: [{ name: 'Thomas', id: '2' }],
          id: 2,
        },
      ],
    },
    {
      name: 'Einkaufsliste',
      id: 1,
      zugeordneteUser: [{ name: 'Patrick', id: '0' }],
      items: [
        {
          name: 'Item 1',
          amount: 1,
          unit: 'kg',
          category: 'Fisch',
          bought: false,
          zugeordneteMitglieder: [{ name: 'Patrick', id: '0' }],
          id: 0,
        },
        {
          name: 'Item 2',
          amount: 2,
          unit: 'Stück',
          category: 'Fleisch',
          bought: true,
          zugeordneteMitglieder: [{ name: 'Patrick', id: '0' }],
          id: 1,
        },
        {
          name: 'Item 3',
          amount: 3,
          unit: 'Liter',
          category: 'Beilagen',
          bought: false,
          zugeordneteMitglieder: [{ name: 'Patrick', id: '0' }],
          id: 2,
        },
      ],
    },
    {
      name: 'Wunschliste',
      id: 2,
      zugeordneteUser: [],
      items: [
        {
          name: 'Item 1',
          amount: 1,
          unit: 'kg',
          category: 'Computer',
          bought: false,
          zugeordneteMitglieder: [],
          id: 0,
        },
        {
          name: 'Item 2',
          amount: 2,
          unit: 'Stück',
          category: 'Werkzeug',
          bought: true,
          zugeordneteMitglieder: [],
          id: 1,
        },
        {
          name: 'Item 3',
          amount: 3,
          unit: 'Liter',
          category: 'Skateboard',
          bought: false,
          zugeordneteMitglieder: [],
          id: 2,
        },
      ],
    },
  ]);

  

  currentListSignal = computed(() => {
    this.demoLists().forEach((list) => {
      list.items.sort((a, b) =>
        a.bought === b.bought ? 0 : a.bought ? 1 : -1
      );
    });
    return (
      // this.demoLists().find((list) => list.id === this.choosenListIDSignal()) ||
      this.demoList
    );
  });

  allListsSignal = computed(() => {
    return this.demoLists().filter((list) =>
      list.zugeordneteUser.includes(this.userService.user())
    );
  });

  updateListInAllLists(list: List) {
    this.demoLists.update((lists) => {
      const updatedLists = lists.map((l) => {
        if (l.id === list.id) {
          const updatedItems = list.items.sort((a, b) =>
            a.bought === b.bought ? 0 : a.bought ? 1 : -1
          );
          return { ...l, items: updatedItems };
        }
        return l;
      });
      return updatedLists;
    });
  }

  addItemToCurrentList(item: Item) {
    const currentList = this.currentListSignal();
    this.demoLists.update((lists) => {
      const updatedList = lists.find((list) => list.id === currentList.id)!;
      updatedList.items = [...updatedList.items, item];
      return lists;
    });
  }

  updateItemInCurrentList(item: Item) {
    const currentList = this.currentListSignal();
    this.demoLists.update((lists) => {
      const updatedList = lists.find((list) => list.id === currentList.id)!;
      updatedList.items = updatedList.items.map((i) =>
        i.id === item.id ? item : i
      );
      return lists;
    });
  }

  deleteItemFromCurrentList(item: Item) {
    const currentList = this.currentListSignal();
    this.demoLists.update((lists) => {
      const updatedList = lists.find((list) => list.id === currentList.id)!;
      updatedList.items = updatedList.items.filter((i) => i !== item);
      return lists;
    });
  }
}
