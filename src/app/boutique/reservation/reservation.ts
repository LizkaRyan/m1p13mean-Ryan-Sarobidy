import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Room } from '../../../types/api';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-boutique-reservation',
  templateUrl: './reservation.html',
  styleUrls: ['./reservation.css'],
  standalone: true,
  imports: [CommonModule]
})
export class Reservation implements OnInit {
  private roomSubject = new BehaviorSubject<Room[]>([]);
  rooms$ = this.roomSubject.asObservable();

  alertMessage: string | null = null;
  alertType: 'success' | 'error' = 'error';

  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const msg = history.state['successMessage'];
      if (msg) this.showAlert(msg, 'success');
    }
    this.fetchAvailableRooms().subscribe({
      next: r => this.roomSubject.next(r),
      error: err => {
        console.error('Erreur récupération salles', err);
        this.showAlert('Impossible de récupérer les salles', 'error');
      }
    });
  }

  private fetchAvailableRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${environment.baseUrl}/rooms/available`);
  }

  reserveRoom(room: Room): void {
    console.log('Demande de reservation :', room);
    this.router.navigate(['/boutique/reservation/select-shop'], { state: { room } });
  }

  showAlert(message: string, type: 'success' | 'error' = 'error') {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => this.alertMessage = null, 3000);
  }

  closeAlert() {
    this.alertMessage = null;
  }
}