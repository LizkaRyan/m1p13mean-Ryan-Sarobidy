import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../../../services/auth.service';

interface Review {
  _id: string;
  rating: number;
  text: string;
  createdAt: string;
  userId: { _id: string; name: string; email: string };
  shopId: { _id: string; name: string };
}

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.html',
  styleUrls: ['./review-list.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class ReviewList implements OnInit {

  private reviewSubject = new BehaviorSubject<Review[]>([]);
  reviews$ = this.reviewSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.http.get<Review[]>(`${environment.baseUrl}/reviews/user/${userId}`).subscribe({
      next: reviews => {
        console.log('API retour:', reviews);
        this.reviewSubject.next(reviews ?? []);
      },      
      error: err => console.error('Erreur:', err)
    });
  }

  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i + 1);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}