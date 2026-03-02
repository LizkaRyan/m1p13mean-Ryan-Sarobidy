import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../../../services/auth.service';
import { Shop } from '../../../types/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-boutique',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-boutique.html',
  styleUrls: ['./create-boutique.css']
})
export class CreateBoutique implements OnInit {

  boutiqueForm!: FormGroup;
  editingIndex: number | null = null;
  editingShopId: string | null = null;
  shops: Shop[] = [];
  successMessage: string | null = null;

  private shopSubject = new BehaviorSubject<Shop[]>([]);
  shops$ = this.shopSubject.asObservable();

  constructor(private fb: FormBuilder, private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.boutiqueForm = this.fb.group({
      name: ['', Validators.required],
      category: this.fb.group({
        code: ['', Validators.required],
        label: ['', Validators.required]
      })
    });

    this.fetchShops().subscribe({
      next: shops => {
        this.shops = shops;
        this.shopSubject.next(shops);
      },
      error: err => console.error('Erreur récupération shops', err)
    });
  }

  onSubmit(): void {
    if (this.boutiqueForm.invalid) return;

    const boutiquePayload = {
      ...this.boutiqueForm.value,
      userId: this.authService.getUserId()
    };

    if (this.editingShopId) {
      this.http.put(`${environment.baseUrl}/shops/${this.editingShopId}`, boutiquePayload).subscribe({
        next: (updated: any) => {
          this.shops = this.shops.map(s => s._id === updated._id ? updated : s);
          this.shopSubject.next(this.shops);
          this.boutiqueForm.reset();
          this.editingIndex = null;
          this.editingShopId = null;
          this.successMessage = `Boutique "${updated.name}" mise à jour avec succès !`;
          setTimeout(() => this.successMessage = null, 3000);
        },
        error: err => console.error('Erreur mise à jour', err)
      });
    } else {
      this.http.post(`${environment.baseUrl}/shops/create`, boutiquePayload).subscribe({
        next: (newShop: any) => {
          this.shops = [...this.shops, newShop];
          this.shopSubject.next(this.shops);
          this.boutiqueForm.reset();
          this.editingIndex = null;
          this.successMessage = `Boutique "${newShop.name}" créée avec succès !`;
          setTimeout(() => this.successMessage = null, 3000);
        },
        error: err => console.error('Erreur création boutique', err)
      });
    }
  }

  editShop(shop: Shop): void {
    this.editingIndex = 0;
    this.editingShopId = shop._id;
    this.boutiqueForm.patchValue({
      name: shop.name,
      category: {
        code: shop.category?.code ?? '',
        label: shop.category?.label ?? ''
      }
    });
  }

  confirmDeleteShop: Shop | null = null;
  deleteShop(shop: Shop): void {
    this.confirmDeleteShop = shop;
  }

  confirmDelete(): void {
    if (!this.confirmDeleteShop) return;

    this.http.delete(`${environment.baseUrl}/shops/${this.confirmDeleteShop._id}`).subscribe({
      next: () => {
        this.shops = this.shops.filter(s => s._id !== this.confirmDeleteShop!._id);
        this.shopSubject.next(this.shops);
        this.confirmDeleteShop = null;
      },
      error: err => console.error('Erreur suppression', err)
    });
  }

  cancelDelete(): void {
    this.confirmDeleteShop = null;
  }

  cancelEdit(): void {
    this.boutiqueForm.reset();
    this.editingIndex = null;
    this.editingShopId = null;
  }

  private fetchShops(): Observable<Shop[]> {
    const id = this.authService.getUserId();
    return this.http.get<Shop[]>(`${environment.baseUrl}/shops/user/${id}`);
  }

  viewProducts(shopId: string): void {
    this.router.navigate(['/boutique/products'], { queryParams: { shopId } });
  }
}