import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Reservation } from '../../../types/api';
import { ShopCard } from '../../composant/shop-card/shop-card';

@Component({
  selector: 'app-list-shop',
  standalone: true,
  imports: [CommonModule, ShopCard],
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