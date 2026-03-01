import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Room } from '../../../types/api';
import { Observable, switchMap, take, filter } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'app-boutique-reservation',
  templateUrl: './reservation.html',
  styleUrls: ['./reservation.css'],
  standalone: true,
  imports: [CommonModule]
})
export class Reservation implements OnInit {
  rooms: Room[] = [];

  // Propriétés pour l'alerte stylée
  alertMessage: string | null = null;
  alertType: 'success' | 'error' = 'success';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.fetchAvailableRooms().subscribe({
      next: r => this.rooms = r,
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

    this.showAlert(`Une demande de réservation a été envoyée pour la salle ${room.name}`, 'success');

    // Ici tu pourrais appeler ton backend pour enregistrer la réservation
    // this.http.post(`${environment.baseUrl}/rooms/reserve`, { id: room.id }).subscribe(...);
    setTimeout(() => {
    this.router.navigate(['/boutique/reservation/select-shop']);
  }, 1000);
  }

  showAlert(message: string, type: 'success' | 'error' = 'success') {
    this.alertMessage = message;
    this.alertType = type;

    setTimeout(() => this.alertMessage = null, 3000);
  }

  closeAlert() {
    this.alertMessage = null;
  }
}