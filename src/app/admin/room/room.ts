import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InsertionRoom } from './insertion/insertion-room';
import { ListRoom } from './list-room/list-room';
import { Observable } from 'rxjs';
import { Room } from '../../../types/api';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RoomService } from '../../../services/room-service';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InsertionRoom, ListRoom],
  templateUrl: './room.html',
  styleUrl: './room.css',
})
export class RoomPage implements OnInit {
  boxForm!: FormGroup;
  private http = inject(HttpClient);

  constructor(private fb: FormBuilder, private roomService: RoomService) {}

  ngOnInit(): void {
    this.initForm();
    this.loadSampleData();
  }

  initForm(): void {
    this.boxForm = this.fb.group({
      name: ['Box 3', Validators.required],
      rentPrice: [132000, [Validators.required, Validators.min(0)]],
      statusCode: ['AVAILABLE', Validators.required],
      floor: [1, [Validators.required, Validators.min(0)]],
      capacity: [25, [Validators.required, Validators.min(1)]],
      length: [10, [Validators.required, Validators.min(0)]],
      height: [3, [Validators.required, Validators.min(0)]],
      width: [5, [Validators.required, Validators.min(0)]]
    });
  }

  getRoom(): Observable<Room[]> {
    return this.http.get<Room[]>(`${environment.baseUrl}/rooms`);
  }

  loadSampleData(): void {
    this.getRoom().subscribe({
      next: (rooms: Room[]) => {
        this.roomService.setBoxes(rooms); // Angular détecte correctement le changement
      },
      error: (err) => console.error('Error loading rooms:', err)
    });
  }
}
