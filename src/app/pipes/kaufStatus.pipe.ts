import { Pipe, PipeTransform } from '@angular/core';
import { Item } from '../models/item.model';

@Pipe({
    name: 'kaufStatus',
    standalone: true
})
export class KaufStatusPipe implements PipeTransform {
    transform(items: Item[], gekauft: boolean): Item[] {
        if (!items ) {
            return [];
        }

        const filteredItems = items.filter(item => item.bought === gekauft);
        return filteredItems;
    }
}