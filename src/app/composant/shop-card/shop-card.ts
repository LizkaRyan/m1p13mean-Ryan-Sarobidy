import { Component, Input } from '@angular/core';
import { Reservation } from '../../../types/api';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shop-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop-card.html',
  styleUrl: './shop-card.css',
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
    this.router.navigate(['/shop/'+this.reservation._id]);
  }
}
