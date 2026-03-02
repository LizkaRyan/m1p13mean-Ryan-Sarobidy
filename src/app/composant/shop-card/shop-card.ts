import { Component, Input } from '@angular/core';
import { Reservation } from '../../../types/api';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideEye, lucideLogIn } from '@ng-icons/lucide';

@Component({
  selector: 'app-shop-card',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  templateUrl: './shop-card.html',
  styleUrl: './shop-card.css',
  providers: [provideIcons({detail: lucideEye, seeMore: lucideLogIn})]
})
export class ShopCard {
  @Input() reservation: Reservation;
  @Input() isEditing: boolean = false;

  constructor(private router: Router) {}

  onEdit() {
    
  }

  onDelete() {
    
  }

  onViewDetails(){
    this.router.navigate(['/shop/'+this.reservation.shopId._id]);
  }

  onViewProducts() {
    this.router.navigate(['/shop/'+this.reservation.shopId._id+'/products']);
  }
}
