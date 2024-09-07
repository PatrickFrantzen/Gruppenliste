import { Item } from './item.model';
import { Mitglied } from './mitglied.model';

//ALTE Zuordnung, muss überarbeitet werden
export class List {
  constructor(name: string, items: Item[], user: Mitglied[]) {
    this.name = name ? name : '';
    this.items = items ? items : [];
    this.id = Math.floor(Math.random() * 1000);
    this.zugeordneteUser = user ? user : [];
  }
  name = '';
  items: Item[] = [];
  id: number = 0;
  zugeordneteUser: Mitglied[] = [];
}

export interface Lists {
    allLists: List[];
}

export interface Liste {
  name: string,
  id: string
}