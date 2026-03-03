import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Product } from '../../../types/api';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideImage, lucidePackage } from '@ng-icons/lucide';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css'],
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [provideIcons({ cardboard: lucidePackage })]

})
export class ProductList implements OnInit {
  private productSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productSubject.asObservable();

  baseUrl = environment.baseUrl;
  alertMessage: string | null = null;
  alertType: 'success' | 'error' = 'error';
  currentShopId: string | null = null;

  // Galerie
  selectedProduct: Product | null = null;
  activePhotoIndex = 0;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const shopId = params['shopId'];
      this.currentShopId = shopId ?? null;
      if (shopId) {
        this.fetchProductsByShop(shopId);
      } else {
        this.fetchProducts().subscribe({
          next: p => this.productSubject.next(p),
          error: err => this.showAlert('Impossible de récupérer les produits', 'error')
        });
      }
    });
  }

  openGallery(product: Product): void {
    this.selectedProduct = product;
    this.activePhotoIndex = 0;
  }

  closeGallery(): void {
    this.selectedProduct = null;
    this.activePhotoIndex = 0;
  }

  private fetchProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.baseUrl}/products`);
  }

  fetchProductsByShop(shopId: string): void {
    this.http.get<Product[]>(`${environment.baseUrl}/products/shop/${shopId}`).subscribe({
      next: p => this.productSubject.next(p),
      error: err => this.showAlert('Impossible de récupérer les produits', 'error')
    });
  }

  goToCreate(): void {
    this.router.navigate(['/boutique/products/create'], {
      queryParams: { shopId: this.currentShopId }
    });
  }

  showAlert(message: string, type: 'success' | 'error' = 'error') {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => this.alertMessage = null, 3000);
  }

  closeAlert() { this.alertMessage = null; }
}