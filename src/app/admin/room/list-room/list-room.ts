import { Component, OnChanges, Input, SimpleChanges, OnInit } from '@angular/core';
import { Room } from '../../../../types/api';
import { FormGroup, FormsModule } from '@angular/forms';
import {
  lucideBox,
  lucidePlus,
  lucideEdit2,
  lucideMaximize
} from '@ng-icons/lucide';
import { provideIcons, NgIconComponent } from '@ng-icons/core';
import { CommonModule } from '@angular/common';
import { RoomService } from '../../../services/room-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list-room',
  imports: [CommonModule, NgIconComponent, FormsModule],
  templateUrl: './list-room.html',
  styleUrl: './list-room.css',
  providers: [provideIcons({ maximize: lucideMaximize, plus: lucidePlus, edit: lucideEdit2, box: lucideBox })]
})
export class ListRoom implements OnInit {
  @Input() boxForm!: FormGroup;
  @Input() editingIndex: number | null = null;
  searchTerm: string = '';
  filteredBoxes$:Observable<Room[]>;

  constructor(private roomService: RoomService) { }

  ngOnInit(): void {
    this.filteredBoxes$ = this.roomService.filteredBoxes$;
  }


  onSearchChange(searchValue: string): void {
    this.searchTerm = searchValue;
  }

  editBox(index: number): void {
    const box = this.roomService.boxes$[index];
    this.editingIndex = index;

    this.boxForm.patchValue({
      name: box.name,
      rentPrice: box.rentPrice,
      statusCode: box.status.code,
      floor: box.floor,
      capacity: box.capacity,
      length: box.dimensions.length,
      height: box.dimensions.height,
      width: box.dimensions.width
    });
  }

  deleteBox(index: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce box ?')) {
      //this.roomService.boxes$.splice(index, 1);
      if (this.editingIndex === index) {
        this.cancelEdit();
      }
    }
  }

  cancelEdit(): void {
    this.editingIndex = null;
    this.boxForm.reset({
      statusCode: 'AVAILABLE',
      floor: 1,
      capacity: 1,
      rentPrice: 0,
      length: 0,
      height: 0,
      width: 0
    });
  }

  getStatusBadgeClass(statusCode: string): string {
    const classes: { [key: string]: string } = {
      'AVAILABLE': 'bg-emerald-100 text-emerald-800 border-emerald-300',
      'RENTED': 'bg-red-100 text-red-800 border-red-300',
      'MAINTENANCE': 'bg-amber-100 text-amber-800 border-amber-300',
      'RESERVED': 'bg-blue-100 text-blue-800 border-blue-300'
    };
    return classes[statusCode] || 'bg-gray-100 text-gray-800 border-gray-300';
  }
}
