import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { EventEmitter } from 'stream';
import { environment } from '../../environments/environment';
import { ReviewData } from '../../../types/api';
import { Reviews } from '../../composant/reviews/reviews';

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

@Component({
  selector: 'app-shop-detail',
  standalone: true,
  imports: [CommonModule, Reviews],
  templateUrl: './shop-detail.html',
  styleUrl: './shop-detail.css',
})
export class ShopDetail implements OnInit {
  @Input() showActions: boolean = true;

  private shopSubject = new BehaviorSubject<Shop>(null);
  shop$ = this.shopSubject.asObservable();
  
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  constructor(private router: Router) {}

  reviews: ReviewData[] = [
    {
      _id: "1",
      userId: {
        _id: "user1",
        name: "Jean Dupont",
        email: "jean@test.com",
        role: {code:"CUSTOMER", label:"Client"},
      },
      shopId: "shop1",
      rating: 5,
      text: "Excellent service !",
      createdAt: "2026-01-15T10:30:00.000Z"
    }
  ];

  ngOnInit() {
    this.route.params.subscribe(params => {
      let shopId = params['id'];
      if (shopId) {
        this.getShop(shopId).subscribe({
          next: (shop) => this.shopSubject.next(shop),
          error: (err) => {
            alert('Erreur lors du chargement de la boutique');
            this.router.navigate(['/shop']);
          }
        });
      }
    });
  }

  getShop(id: string): Observable<Shop> {
    return this.http.get<Shop>(`${environment.baseUrl}/shops/${id}`);
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
