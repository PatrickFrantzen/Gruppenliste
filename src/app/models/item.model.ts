import { Mitglied } from "./mitglied.model";

export class Item {
    constructor(name: string, amount: number, unit: string, category: string) {
        this.name = name || '';
        this.amount = amount || 0;
        this.unit = unit || '';
        this.category = category || '';
        this.bought = false;
        this.zugeordneteUser = [];
        this.id = Math.floor(Math.random() * 1000);
    }

    name: string;
    amount: number;
    unit: string;
    category: string;
    bought: boolean;
    zugeordneteUser: Mitglied[];
    id: number;
}

export interface Bedarfsliste_Item {
    name: string,
    menge: number,
    einheit: string,
    kategorie: string,
    zugeordneteMitglieder: Mitglied[],
    _id?: string
}