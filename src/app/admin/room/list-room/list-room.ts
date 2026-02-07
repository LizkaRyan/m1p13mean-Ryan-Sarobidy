import { Component, Input, OnInit } from '@angular/core';
import { Room } from '../../../../types/api';
import { FormGroup } from '@angular/forms';
import { 
  lucideBox,
  lucidePlus,
  lucideEdit2,
  lucideMaximize
} from '@ng-icons/lucide';
import { provideIcons, NgIconComponent } from '@ng-icons/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-room',
  imports: [CommonModule, NgIconComponent],
  templateUrl: './list-room.html',
  styleUrl: './list-room.css',
  providers: [provideIcons({ maximize: lucideMaximize, plus: lucidePlus, edit: lucideEdit2, box: lucideBox })]
})
export class ListRoom implements OnInit {
  @Input() boxForm!: FormGroup;
  @Input() editingIndex: number | null = null;
  boxes: Room[] = [];

  ngOnInit(): void {
    this.loadSampleData();
  }

  loadSampleData(): void {
    this.boxes = [
      {
        _id: '1',
        name: "Box 1",
        rentPrice: 1500,
        status: { code: "AVAILABLE", label: "Disponible" },
        floor: 2,
        capacity: 6,
        dimensions: { length: 8, height: 3, width: 6, area: 48 }
      },
      {
        _id: '2',
        name: "Box 2",
        rentPrice: 1220,
        status: { code: "AVAILABLE", label: "Disponible" },
        floor: 1,
        capacity: 4,
        dimensions: { length: 6, height: 3, width: 5, area: 30 }
      },
      {
        _id: '3',
        name: "Box 3",
        rentPrice: 980,
        status: { code: "RENTED", label: "Loué" },
        floor: 1,
        capacity: 2,
        dimensions: { length: 4, height: 2.5, width: 4, area: 16 }
      },
      {
        _id: '3',
        name: "Box 3",
        rentPrice: 980,
        status: { code: "RENTED", label: "Loué" },
        floor: 1,
        capacity: 2,
        dimensions: { length: 4, height: 2.5, width: 4, area: 16 }
      },
      {
        _id: '3',
        name: "Box 3",
        rentPrice: 980,
        status: { code: "RENTED", label: "Loué" },
        floor: 1,
        capacity: 2,
        dimensions: { length: 4, height: 2.5, width: 4, area: 16 }
      }
    ];
  }

  editBox(index: number): void {
    const box = this.boxes[index];
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
      this.boxes.splice(index, 1);
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
