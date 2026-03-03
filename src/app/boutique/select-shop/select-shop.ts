import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';
import { Room, Shop } from '../../../types/api';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideBuilding } from '@ng-icons/lucide';

@Component({
  selector: 'app-select-shop',
  templateUrl: './select-shop.html',
  styleUrls: ['./select-shop.css'],
  imports: [CommonModule, FormsModule, NgIconComponent],
  standalone: true,
  providers: [provideIcons({ building: lucideBuilding})]
})
export class SelectShop implements OnInit {

  private shopSubject = new BehaviorSubject<Shop[]>([]);
  shops$ = this.shopSubject.asObservable();

  room: Room | null = null;
  selectedShop: Shop | null = null;

  today = new Date().toISOString().split('T')[0];
  dateMap: { [shopId: string]: { start: string; end: string } } = {};

  warningMessage: string | null = null;

  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.room = history.state['room'] ?? null;
      console.log('Room reçue:', this.room);
    }

    this.fetchShops().subscribe({
      next: s => {
        s.forEach(shop => {
          this.dateMap[shop._id] = { start: '', end: '' };
        });
        this.shopSubject.next(s);
      },
      error: err => console.error('Erreur récupération magasins', err)
    });
  }

  private fetchShops(): Observable<Shop[]> {
    const id = this.authService.getUserId();
    console.log('Fetching shops for user ID:', id);
    return this.http.get<Shop[]>(`${environment.baseUrl}/shops/user/${id}`);
  }

  getKey(shop: Shop): string {
    return shop._id;
  }

  selectShop(shop: Shop): void {
    this.warningMessage = null;
    this.selectedShop = this.selectedShop?._id === shop._id ? null : shop;
  }

  isSelected(shop: Shop): boolean {
    if (!this.selectedShop) return false;
    return this.selectedShop._id === shop._id;
  }

  getDate(shop: Shop): { start: string; end: string } {
    if (!this.dateMap[shop._id]) {
      this.dateMap[shop._id] = { start: '', end: '' };
    }
    return this.dateMap[shop._id];
  }

  private isDurationValid(start: string, end: string): boolean {
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Date minimale = start + 3 mois
    const minEnd = new Date(startDate);
    minEnd.setMonth(minEnd.getMonth() + 3);

    return endDate >= minEnd;
  }

  successMessage: string | null = null;

  reserveShop(shop: Shop | null): void {
    if (!shop) return;

    const dates = this.getDate(shop);

    if (!this.isDurationValid(dates.start, dates.end)) {
      this.warningMessage = 'La durée de réservation doit être d\'au moins 3 mois.';
      this.successMessage = null;
      return;
    }

    this.warningMessage = null;

    const payload = {
      shopId: shop._id,
      roomId: this.room!._id,
      beginingDate: dates.start,
      endingDate: dates.end
    };

    this.http.post(`${environment.baseUrl}/requests-reservation/create`, payload).subscribe({
      next: () => {
        console.log('=== Réservation créée ===');
        console.log('Room :', this.room);
        console.log('Shop :', shop);
        console.log('Date début :', dates.start);
        console.log('Date fin :', dates.end);

        this.successMessage = `Demande de réservation envoyée pour ${shop.name} du ${dates.start} au ${dates.end}.`;
        setTimeout(() => {
          this.successMessage = null;
          this.router.navigate(['/boutique/reservation'], {
            state: { successMessage: `Demande de réservation envoyée pour ${shop.name} du ${dates.start} au ${dates.end}.` }
          });
        }, 2000);
      },
      error: err => {
        console.error('Erreur lors de la réservation', err);
        this.warningMessage = 'Une erreur est survenue lors de l\'envoi de la demande.';
      }
    });
  }
}