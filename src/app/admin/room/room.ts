import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InsertionRoom } from './insertion/insertion-room';
import { ListRoom } from './list-room/list-room';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InsertionRoom, ListRoom],
  templateUrl: './room.html',
  styleUrl: './room.css',
})
export class RoomPage implements OnInit {
  boxForm!: FormGroup;
  editingIndex: number | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
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
}
