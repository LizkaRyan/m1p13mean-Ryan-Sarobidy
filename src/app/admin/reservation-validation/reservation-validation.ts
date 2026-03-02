import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  lucideBox,
  lucideMailbox,
  lucideCheck,
  lucideX
} from '@ng-icons/lucide';
import { provideIcons, NgIconComponent } from '@ng-icons/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface Category {
  code: string;
  label: string;
}

interface Shop {
  category: Category;
  _id: string;
  name: string;
  userId: string;
}

interface RoomStatus {
  code: string;
  label: string;
  _id?: string;
}

interface RoomDimensions {
  length: number;
  height: number;
  width: number;
  area: number;
  _id?: string;
}

interface Room {
  _id: string;
  name: string;
  rentPrice: number;
  status: RoomStatus;
  floor: number;
  capacity: number;
  dimensions: RoomDimensions;
  deletedAt: null | string;
  __v?: number;
}

interface ReservationRequest {
  _id: string;
  shopId: Shop;
  roomId: Room;
  beginingDate: string;
  endingDate: string;
  validated: boolean | null;
}

@Component({
  selector: 'app-reservation-validation',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  templateUrl: './reservation-validation.html',
  styleUrl: './reservation-validation.css',
  providers: [provideIcons({ box: lucideBox, empty: lucideMailbox, valider: lucideCheck, rejeter: lucideX })]
})
export class ReservationValidation implements OnInit {
  reservations$!: Observable<ReservationRequest[]>;
  processingId: string | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.reservations$ = this.getReservation();
  }

  getReservation(): Observable<ReservationRequest[]> {
    return this.http.get<ReservationRequest[]>(`${environment.baseUrl}/requests-reservation`);
  }

  patchReservation(id: string, validated: boolean): Observable<ReservationRequest[]> {
    return this.http.patch<ReservationRequest[]>(`${environment.baseUrl}/requests-reservation/${id}`, { validated });
  }

  approveReservation(reservationId: string): void {
    this.processingId = reservationId;
    if (confirm('Êtes-vous sûr d\'approuver cette demande ?')) {
      this.reservations$ = this.patchReservation(reservationId, true);
    }
  }

  rejectReservation(reservationId: string): void {
    this.processingId = reservationId;
    if (confirm('Êtes-vous sûr de refuser cette demande ?')) {
      this.reservations$ = this.patchReservation(reservationId, false);
    }
  }

  calculateDuration(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.ceil(diffDays / 30); // Convertir en mois approximatifs
  }

  calculateTotalCost(reservation: ReservationRequest): number {
    const months = this.calculateDuration(reservation.beginingDate, reservation.endingDate);
    return reservation.roomId.rentPrice * months;
  }

  getCategoryColor(index: number): string {
    const colors: string[] = [
      'from-pink-500 to-rose-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-purple-500 to-fuchsia-500',
      'from-orange-500 to-amber-500'
    ];
    return colors[index] || 'from-gray-500 to-slate-500';
  }

  getCategoryBadgeColor(index: number): string {
    const colors: string[] = [
      'bg-pink-100 text-pink-800 border-pink-300',
      'bg-blue-100 text-blue-800 border-blue-300',
      'bg-green-100 text-green-800 border-green-300',
      'bg-purple-100 text-purple-800 border-purple-300',
      'bg-orange-100 text-orange-800 border-orange-300'
    ];
    return colors[index] || 'bg-gray-100 text-gray-800 border-gray-300';
  }
}