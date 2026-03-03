import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../../../services/auth.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideFilter, lucidePackage } from '@ng-icons/lucide';

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
  imports: [CommonModule, RouterModule, FormsModule, NgIconComponent],
  providers: [provideIcons({ filter: lucideFilter })]
})
export class ReviewList implements OnInit {

  private allReviews$ = new BehaviorSubject<Review[]>([]);

  // Filtres
  showFilterPanel = false;
  filterEmail = '';
  filterShop = '';
  filterRating: number | null = null;
  filterDateFrom = '';
  filterDateTo = '';

  private filter$ = new BehaviorSubject<any>({});

  reviews$ = combineLatest([this.allReviews$, this.filter$]).pipe(
    map(([reviews, _]) => this.applyFilters(reviews))
  );

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.http.get<Review[]>(`${environment.baseUrl}/reviews/user/${userId}`).subscribe({
      next: reviews => this.allReviews$.next(reviews ?? []),
      error: err => console.error('Erreur:', err)
    });
  }

  applyFilters(reviews: Review[]): Review[] {
    return reviews.filter(r => {
      const matchEmail = !this.filterEmail || r.userId?.email?.toLowerCase().includes(this.filterEmail.toLowerCase());
      const matchShop = !this.filterShop || r.shopId?.name?.toLowerCase().includes(this.filterShop.toLowerCase());
      const matchRating = !this.filterRating || r.rating === this.filterRating;
      const matchFrom = !this.filterDateFrom || r.createdAt >= this.filterDateFrom;
      const matchTo = !this.filterDateTo || r.createdAt <= this.filterDateTo;
      return matchEmail && matchShop && matchRating && matchFrom && matchTo;
    });
  }

  onFilterChange(): void {
    this.filter$.next({});
  }

  resetFilters(): void {
    this.filterEmail = '';
    this.filterShop = '';
    this.filterRating = null;
    this.filterDateFrom = '';
    this.filterDateTo = '';
    this.filter$.next({});
  }

  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i + 1);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  shops$ = this.allReviews$.pipe(
    map(reviews => {
        const seen = new Set<string>();
        return reviews
        .filter(r => r.shopId && !seen.has(r.shopId._id) && seen.add(r.shopId._id))
        .map(r => r.shopId);
    })
);
}