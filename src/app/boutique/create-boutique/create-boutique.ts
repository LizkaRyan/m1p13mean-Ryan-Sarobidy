import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../../../services/auth.service';
import { Shop } from '../../../types/api';
import { Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideBuilding, lucideCamera, lucideImage, lucideLayoutDashboard, lucidePen, lucideTrash } from '@ng-icons/lucide';

@Component({
  selector: 'app-create-boutique',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIconComponent],
  templateUrl: './create-boutique.html',
  styleUrls: ['./create-boutique.css'],
  providers: [provideIcons({ building: lucideBuilding, trash: lucideTrash, camera: lucideCamera, exterior: lucideImage, interior: lucideLayoutDashboard, delete: lucideTrash, edit: lucidePen})]
})
export class CreateBoutique implements OnInit {

  boutiqueForm!: FormGroup;
  editingIndex: number | null = null;
  editingShopId: string | null = null;
  shops: Shop[] = [];
  successMessage: string | null = null;

  private shopSubject = new BehaviorSubject<Shop[]>([]);
  shops$ = this.shopSubject.asObservable();

  // Photos
  exteriorFile: File | null = null;
  exteriorPreview: string | null = null;
  interiorFile: File | null = null;
  interiorPreview: string | null = null;
  diversFiles: File[] = [];
  diversPreviews: string[] = [];

  categories = [
    { code: 'MODE', label: 'Mode' },
    { code: 'FOOD COURT', label: 'Food Court' },
    { code: 'BEAUTY SALON', label: 'Salon de beauté' },
    { code: 'SPORT', label: 'Salle de sport' },
  ];

  constructor(private fb: FormBuilder, private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.boutiqueForm = this.fb.group({
      name: ['', Validators.required],
      category: [null, Validators.required]
    });

    this.fetchShops().subscribe({
      next: shops => { this.shops = shops; this.shopSubject.next(shops); },
      error: err => console.error('Erreur récupération shops', err)
    });
  }

  // --- Extérieur ---
  onExteriorChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) { this.exteriorFile = file; this.exteriorPreview = URL.createObjectURL(file); }
  }
  onExteriorDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (file) { this.exteriorFile = file; this.exteriorPreview = URL.createObjectURL(file); }
  }

  // --- Intérieur ---
  onInteriorChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) { this.interiorFile = file; this.interiorPreview = URL.createObjectURL(file); }
  }
  onInteriorDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (file) { this.interiorFile = file; this.interiorPreview = URL.createObjectURL(file); }
  }

  // --- Divers ---
  onDiversChange(event: Event): void {
    const files = Array.from((event.target as HTMLInputElement).files ?? []);
    files.forEach(file => {
      this.diversFiles.push(file);
      this.diversPreviews.push(URL.createObjectURL(file));
    });
  }
  removeDivers(index: number, event: Event): void {
    event.stopPropagation();
    this.diversFiles.splice(index, 1);
    this.diversPreviews.splice(index, 1);
  }

  onSubmit(): void {
    if (this.boutiqueForm.invalid) return;

    console.log('exteriorFile:', this.exteriorFile?.name);  
    console.log('interiorFile:', this.interiorFile?.name);

    const formData = new FormData();
    formData.append('name', this.boutiqueForm.value.name);
    formData.append('category', JSON.stringify(this.boutiqueForm.value.category));
    formData.append('userId', this.authService.getUserId());

    if (this.exteriorFile) formData.append('exteriorPhoto', this.exteriorFile);
    if (this.interiorFile) formData.append('interiorPhoto', this.interiorFile);
    this.diversFiles.forEach(file => formData.append('diversPhotos', file));

    if (this.editingShopId) {
      this.http.put(`${environment.baseUrl}/shops/${this.editingShopId}`, formData).subscribe({
        next: (updated: any) => {
          this.shops = this.shops.map(s => s._id === updated._id ? updated : s);
          this.shopSubject.next(this.shops);
          this.resetForm();
          this.successMessage = `Boutique "${updated.name}" mise à jour avec succès !`;
          setTimeout(() => this.successMessage = null, 3000);
        },
        error: err => console.error('Erreur mise à jour', err)
      });
    } else {
      this.http.post(`${environment.baseUrl}/shops/create`, formData).subscribe({
        next: (newShop: any) => {
          this.shops = [...this.shops, newShop];
          this.shopSubject.next(this.shops);
          this.resetForm();
          this.successMessage = `Boutique "${newShop.name}" créée avec succès !`;
          setTimeout(() => this.successMessage = null, 3000);
        },
        error: err => console.error('Erreur création boutique', err)
      });
    }
  }

  resetForm(): void {
    this.boutiqueForm.reset();
    this.editingIndex = null;
    this.editingShopId = null;
    this.exteriorFile = null; this.exteriorPreview = null;
    this.interiorFile = null; this.interiorPreview = null;
    this.diversFiles = []; this.diversPreviews = [];
  }

  editShop(shop: Shop): void {
    this.editingIndex = 0;
    this.editingShopId = shop._id;
    this.boutiqueForm.patchValue({
      name: shop.name,
      category: this.categories.find(c => c.code === shop.category?.code) ?? null
    });
  }

  confirmDeleteShop: Shop | null = null;
  deleteShop(shop: Shop): void { this.confirmDeleteShop = shop; }

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

  cancelDelete(): void { this.confirmDeleteShop = null; }

  cancelEdit(): void { this.resetForm(); }

  private fetchShops(): Observable<Shop[]> {
    const id = this.authService.getUserId();
    return this.http.get<Shop[]>(`${environment.baseUrl}/shops/user/${id}`);
  }

  viewProducts(shopId: string): void {
    this.router.navigate(['/boutique/products'], { queryParams: { shopId } });
  }
  baseUrl = environment.baseUrl;
  selectedShop: Shop | null = null;
  activePhotoIndex = 0;
  activePhotoType = 'EXTERIOR';

  photoTypes = [
    { code: 'EXTERIOR', label: 'Extérieur' },
    { code: 'INTERIOR', label: 'Intérieur' },
    { code: 'DIVERS',   label: 'Divers' }
  ];

  openGallery(shop: Shop): void {
    this.selectedShop = shop;
    this.activePhotoIndex = 0;
    this.activePhotoType = 'EXTERIOR';
  }

  closeGallery(): void {
    this.selectedShop = null;
    this.activePhotoIndex = 0;
  }

  filteredPhotos(): any[] {
    return this.selectedShop?.photos?.filter(p => p.type?.code === this.activePhotoType) ?? [];
  }

  countPhotos(typeCode: string): number {
    return this.selectedShop?.photos?.filter(p => p.type?.code === typeCode).length ?? 0;
  }
}