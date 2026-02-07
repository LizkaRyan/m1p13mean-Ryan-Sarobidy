import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Room } from "../../types/api";

@Injectable({ providedIn: 'root' }) // disponible partout
export class RoomService {
    private boxesSubject = new BehaviorSubject<Room[]>([]);
    boxes$ = this.boxesSubject.asObservable();

    private filteredBoxesSubject = new BehaviorSubject<Room[]>([]);
    filteredBoxes$ = this.filteredBoxesSubject.asObservable();

    private editingIndexSubject = new BehaviorSubject<string | null>(null);
    editingIndex$ = this.editingIndexSubject.asObservable();

    setEditingIndex(id: string | null) {
        this.editingIndexSubject.next(id);
    }

    private searchTermSubject = new BehaviorSubject<string>('');
    searchTerm$ = this.searchTermSubject.asObservable();

    setBoxes(boxes: Room[]) {
        this.boxesSubject.next(boxes);
        this.setFilteredBoxes(this.filterBoxes(this.searchTermSubject.value));
    }

    setFilteredBoxes(filteredBoxes: Room[]) {
        this.filteredBoxesSubject.next(filteredBoxes);
    }

    filterBoxes(searchTerm: string): Room[] {
        let filteredBoxes: Room[] = [];
        if (!searchTerm.trim()) {
            filteredBoxes = [...this.boxesSubject.value];
        } else {
            const searchLower = searchTerm.toLowerCase().trim();
            filteredBoxes = this.boxesSubject.value.filter(box =>
                box.name.toLowerCase().includes(searchLower)
            );
        }
        return filteredBoxes;
    }
}
