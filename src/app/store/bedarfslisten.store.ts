import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { Bedarfsliste, List } from "../models/list.model";
import { inject } from "@angular/core";
import { CurrentListService } from "../services/current-list/current-list.service";

type BedarfslistenState = {
    bedarfslisten: Bedarfsliste[];
    loading: boolean;
    error: string;
}

const initialState: BedarfslistenState = {
    bedarfslisten: [],
    loading: false,
    error: ''
};

export const BedarfslistenStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store, bedarfslistenService = inject(CurrentListService)) => ({
        async getAllBedarfslisten() {
            patchState(store, { loading: true });
            try {
                const bedarfslisten = await bedarfslistenService.getAllBedarfslisten();
                patchState(store, { bedarfslisten, loading: false });
            } catch (error) {
                patchState(store, { error: 'Error loading bedarfslisten', loading: false });
            }
        },
        removeAllBedarfslistenOnLogout(){
            patchState(store, { bedarfslisten: [] });
        },
        addBedarfsliste(liste: List) {
            bedarfslistenService.postList(liste);
        }
    })

));