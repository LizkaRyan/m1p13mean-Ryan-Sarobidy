import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Room } from '../../../../types/api';
import { 
  lucideBox,
  lucidePlus,
  lucideEdit2,
  lucideMaximize
} from '@ng-icons/lucide';
import { provideIcons, NgIconComponent } from '@ng-icons/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-insertion-room',
  imports: [CommonModule, ReactiveFormsModule, NgIconComponent],
  templateUrl: './insertion-room.html',
  styleUrl: './insertion-room.css',
  providers: [provideIcons({ maximize: lucideMaximize, plus: lucidePlus, edit: lucideEdit2, box: lucideBox })]
})
export class InsertionRoom {
  @Input() boxForm!: FormGroup;
  @Input() editingIndex: number | null = null;

  constructor(private fb: FormBuilder) { }

  statusOptions = [
    { code: 'AVAILABLE', label: 'Disponible' },
    { code: 'RENTED', label: 'Loué' },
    { code: 'MAINTENANCE', label: 'Maintenance' },
    { code: 'RESERVED', label: 'Réservé' }
  ];

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
}
