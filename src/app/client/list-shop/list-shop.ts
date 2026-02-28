import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Reservation } from '../../../types/api';
import { ShopCard } from '../../composant/shop-card/shop-card';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { NgIconComponent } from '@ng-icons/core';
import { provideIcons } from '@ng-icons/core';
import { lucideMailbox } from '@ng-icons/lucide';

@Component({
  selector: 'app-list-shop',
  standalone: true,
  imports: [CommonModule, ShopCard, NgIconComponent],
  templateUrl: './list-shop.html',
  styleUrls: ['./list-shop.css'],
  providers: [provideIcons({ empty: lucideMailbox })]
})
export class ListShop implements OnInit {
  private shopsSubject = new BehaviorSubject<Reservation[]>([]);
  shops$ = this.shopsSubject.asObservable();
  private http = inject(HttpClient);

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.getReservations().subscribe({
      next: (reservations) => this.shopsSubject.next(reservations),
      error: (err) => console.error('Error fetching reservations:', err)
    });
  }

  getReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${environment.baseUrl}/shops/available`);
  }
}