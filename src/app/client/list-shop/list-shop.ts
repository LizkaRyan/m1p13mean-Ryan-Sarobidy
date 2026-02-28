import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

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

interface Room {
  _id: string;
  name: string;
}

export interface Reservation {
  _id: string;
  shopId: Shop;
  roomId: Room;
}

@Component({
  selector: 'app-list-shop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-shop.html',
  styleUrls: ['./list-shop.css']
})
export class ListShop implements OnInit {
  reservations: Reservation[] = [];

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    // Données d'exemple
    this.reservations = [
      {
        "_id": "698ca38e245dee41d3bbc8f8",
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
          "_id": "698c9820d0bdcba2131f0ca0",
          "name": "Box 2"
        }
      },
      {
        "_id": "6995c497585a0ba2bc626a04",
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
          "_id": "698c97f6d0bdcba2131f0c99",
          "name": "Box 1"
        }
      },
      {
        "_id": "6995c497585a0ba2bc626a0b",
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
          "_id": "698c97f6d0bdcba2131f0c99",
          "name": "Box 1"
        }
      }
    ];
  }

  getCategoryColor(categoryCode: string): string {
    const colors: { [key: string]: string } = {
      'MODE': 'from-pink-500 to-rose-500',
      'TECH': 'from-blue-500 to-cyan-500',
      'FOOD': 'from-green-500 to-emerald-500',
      'BEAUTY': 'from-purple-500 to-fuchsia-500',
      'SPORT': 'from-orange-500 to-amber-500'
    };
    return colors[categoryCode] || 'from-gray-500 to-slate-500';
  }

  getCategoryBadgeColor(categoryCode: string): string {
    const colors: { [key: string]: string } = {
      'MODE': 'bg-pink-100 text-pink-800 border-pink-300',
      'TECH': 'bg-blue-100 text-blue-800 border-blue-300',
      'FOOD': 'bg-green-100 text-green-800 border-green-300',
      'BEAUTY': 'bg-purple-100 text-purple-800 border-purple-300',
      'SPORT': 'bg-orange-100 text-orange-800 border-orange-300'
    };
    return colors[categoryCode] || 'bg-gray-100 text-gray-800 border-gray-300';
  }

  onViewDetails(reservation: Reservation): void {
    console.log('Voir détails:', reservation);
  }

  onEditReservation(reservation: Reservation): void {
    console.log('Modifier:', reservation);
  }

  onDeleteReservation(reservation: Reservation): void {
    if (confirm(`Supprimer la réservation pour ${reservation.shopId.name} - ${reservation.roomId.name} ?`)) {
      console.log('Supprimer:', reservation);
    }
  }
}