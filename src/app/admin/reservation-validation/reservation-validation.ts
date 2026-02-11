import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  lucideBox,
} from '@ng-icons/lucide';
import { provideIcons, NgIconComponent } from '@ng-icons/core';

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
  providers: [provideIcons({ box: lucideBox })]
})
export class ReservationValidation implements OnInit {
  reservations: ReservationRequest[] = [];
  processingId: string | null = null;

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    // Données d'exemple
    this.reservations = [
      {
        "_id": "698c53fba4c7623a67cb0ce4",
        "shopId": {
          "category": {
            "code": "MODE",
            "label": "Mode"
          },
          "_id": "698c5222a4c7623a67cb0ce3",
          "name": "Zara",
          "userId": "698c5124a4c7623a67cb0ce2"
        },
        "roomId": {
          "_id": "6988d13bf45d21d2d1137468",
          "name": "Box 4",
          "rentPrice": 132000,
          "status": {
            "code": "AVAILABLE",
            "label": "Disponible",
            "_id": "6988d13bf45d21d2d1137465"
          },
          "floor": 1,
          "capacity": 25,
          "dimensions": {
            "length": 10,
            "height": 3,
            "width": 5,
            "area": 50,
            "_id": "6988d13bf45d21d2d1137466"
          },
          "deletedAt": null,
          "__v": 0
        },
        "beginingDate": "2026-02-16T00:00:00.000Z",
        "endingDate": "2026-05-15T00:00:00.000Z",
        "validated": null
      },
      {
        "_id": "698c53fba4c7623a67cb0ce5",
        "shopId": {
          "category": {
            "code": "TECH",
            "label": "Technologie"
          },
          "_id": "698c5222a4c7623a67cb0ce6",
          "name": "Apple Store",
          "userId": "698c5124a4c7623a67cb0ce7"
        },
        "roomId": {
          "_id": "6988d13bf45d21d2d1137469",
          "name": "Box 2",
          "rentPrice": 98000,
          "status": {
            "code": "AVAILABLE",
            "label": "Disponible",
            "_id": "6988d13bf45d21d2d1137470"
          },
          "floor": 2,
          "capacity": 15,
          "dimensions": {
            "length": 8,
            "height": 3,
            "width": 4,
            "area": 32,
            "_id": "6988d13bf45d21d2d1137471"
          },
          "deletedAt": null,
          "__v": 0
        },
        "beginingDate": "2026-03-01T00:00:00.000Z",
        "endingDate": "2026-06-30T00:00:00.000Z",
        "validated": null
      },
      {
        "_id": "698c53fba4c7623a67cb0ce8",
        "shopId": {
          "category": {
            "code": "FOOD",
            "label": "Alimentation"
          },
          "_id": "698c5222a4c7623a67cb0ce9",
          "name": "Carrefour Express",
          "userId": "698c5124a4c7623a67cb0ce10"
        },
        "roomId": {
          "_id": "6988d13bf45d21d2d1137472",
          "name": "Box 1",
          "rentPrice": 156000,
          "status": {
            "code": "AVAILABLE",
            "label": "Disponible",
            "_id": "6988d13bf45d21d2d1137473"
          },
          "floor": 1,
          "capacity": 30,
          "dimensions": {
            "length": 12,
            "height": 3.5,
            "width": 6,
            "area": 72,
            "_id": "6988d13bf45d21d2d1137474"
          },
          "deletedAt": null,
          "__v": 0
        },
        "beginingDate": "2026-02-20T00:00:00.000Z",
        "endingDate": "2026-08-20T00:00:00.000Z",
        "validated": null
      }
    ];
  }

  approveReservation(reservationId: string): void {
    this.processingId = reservationId;
    
    setTimeout(() => {
      const index = this.reservations.findIndex(r => r._id === reservationId);
      if (index !== -1) {
        this.reservations[index].validated = true;
      }
      this.processingId = null;
    }, 800);
  }

  rejectReservation(reservationId: string): void {
    this.processingId = reservationId;
    
    setTimeout(() => {
      const index = this.reservations.findIndex(r => r._id === reservationId);
      if (index !== -1) {
        this.reservations[index].validated = false;
      }
      this.processingId = null;
    }, 800);
  }

  getPendingReservations(): ReservationRequest[] {
    return this.reservations.filter(r => r.validated === null);
  }

  getApprovedReservations(): ReservationRequest[] {
    return this.reservations.filter(r => r.validated === true);
  }

  getRejectedReservations(): ReservationRequest[] {
    return this.reservations.filter(r => r.validated === false);
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