import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { NewReview, ReviewData } from '../../../types/api';
import { Reviews } from '../../composant/reviews/reviews';
import { AuthService } from '../../../services/auth.service';

interface Category {
  code: string;
  label: string;
}

interface PhotoType {
  code: string;
  label: string;
}

interface Photo {
  _id: string;
  url: string;
  createdAt: string;
  type: PhotoType;
}

export interface Shop {
  category: Category;
  _id: string;
  name: string;
  userId: string;
  photos: Photo[];
  rooms: string[];
}

export interface ShopAPI {
  canAddReview: boolean;
  shop: Shop;
}

@Component({
  selector: 'app-shop-detail',
  standalone: true,
  imports: [CommonModule, Reviews],
  templateUrl: './shop-detail.html',
  styleUrl: './shop-detail.css',
})
export class ShopDetail implements OnInit {
  @Input() showActions: boolean = true;

  baseUrl = environment.baseUrl;

  private shopSubject = new BehaviorSubject<Shop>(null);
  shop$ = this.shopSubject.asObservable();
  shopId: string;

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private reviewsSubject = new BehaviorSubject<ReviewData[]>([]);
  reviews$ = this.reviewsSubject.asObservable();

  private canAddReviewSubject = new BehaviorSubject<boolean>(false);
  canAddReview$ = this.canAddReviewSubject.asObservable();

  addReview(review: NewReview): void {
    this.postReview(review).subscribe({
      next: (newReview) => {
        const currentReviews = this.reviewsSubject.getValue();
        this.reviewsSubject.next([newReview, ...currentReviews,]);
        this.canAddReviewSubject.next(false);
      },
      error: (err) => {
        alert('Erreur lors de l\'ajout de l\'avis');
      }
    });
  }

  postReview(data: NewReview): Observable<ReviewData> {
    return this.http.post<ReviewData>(`${environment.baseUrl}/shops/${this.shopId}/reviews`, data);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.shopId = params['id'];
      if (this.shopId) {
        this.getShop(this.shopId).subscribe({
          next: (shop) => {
            this.shopSubject.next(shop.shop)
            this.canAddReviewSubject.next(shop.canAddReview);
          },
          error: (err) => {
            console.error('Erreur lors du chargement de la boutique:', err);
            this.router.navigate(['/shop']);
          }
        });
        this.getReviews(this.shopId).subscribe({
          next: (reviews) => this.reviewsSubject.next(reviews),
          error: (err) => {
            console.error('Erreur lors du chargement des avis:', err);
          }
        });
      }
    });
  }

  getShop(id: string): Observable<ShopAPI> {
    return this.http.get<ShopAPI>(`${environment.baseUrl}/shops/${id}`);
  }

  getReviews(shopId: string): Observable<ReviewData[]> {
    return this.http.get<ReviewData[]>(`${environment.baseUrl}/shops/${shopId}/reviews`);
  }

  editShop(): void {
  }

  deleteShop(): void {
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return date.toLocaleDateString('fr-FR', options);
  }
}
