import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Room } from '../../../types/api';
import { CommonModule } from '@angular/common';
import { 
  lucideBox,
  lucidePlus,
  lucideEdit2,
  lucideTrash2,
  lucideMaximize
} from '@ng-icons/lucide';
import { provideIcons, NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIconComponent],
  providers: [provideIcons({ maximize: lucideMaximize, plus: lucidePlus, edit: lucideEdit2, delete: lucideTrash2, box: lucideBox })],
  templateUrl: './room.html',
  styleUrl: './room.css',
})
export class RoomPage implements OnInit {
  boxForm!: FormGroup;
  boxes: Room[] = [];
  editingIndex: number | null = null;

  statusOptions = [
    { code: 'AVAILABLE', label: 'Disponible' },
    { code: 'RENTED', label: 'Loué' },
    { code: 'MAINTENANCE', label: 'Maintenance' },
    { code: 'RESERVED', label: 'Réservé' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.loadSampleData();
  }

  initForm(): void {
    this.boxForm = this.fb.group({
      name: ['', Validators.required],
      rentPrice: [0, [Validators.required, Validators.min(0)]],
      statusCode: ['AVAILABLE', Validators.required],
      floor: [1, [Validators.required, Validators.min(0)]],
      capacity: [1, [Validators.required, Validators.min(1)]],
      length: [0, [Validators.required, Validators.min(0)]],
      height: [0, [Validators.required, Validators.min(0)]],
      width: [0, [Validators.required, Validators.min(0)]]
    });
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

  onSubmit(): void {
    if (this.boxForm.valid) {
      const formValue = this.boxForm.value;
      const area = formValue.length * formValue.width;
      
      const selectedStatus = this.statusOptions.find(s => s.code === formValue.statusCode);
      
      const box: Room = {
        _id: "0",
        name: formValue.name,
        rentPrice: formValue.rentPrice,
        status: {
          code: selectedStatus!.code,
          label: selectedStatus!.label
        },
        floor: formValue.floor,
        capacity: formValue.capacity,
        dimensions: {
          length: formValue.length,
          height: formValue.height,
          width: formValue.width,
          area: area
        }
      };

      if (this.editingIndex !== null) {
        this.boxes[this.editingIndex] = box;
        this.editingIndex = null;
      } else {
        this.boxes.push(box);
      }

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
