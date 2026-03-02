import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-product.html',
  styleUrls: ['./create-product.css']
})
export class CreateProduct implements OnInit {

  productForm!: FormGroup;
  shopId: string | null = null;
  isSubmitting = false;

  alertMessage: string | null = null;
  alertType: 'success' | 'error' = 'error';

  // Photo principale
  mainPhotoFile: File | null = null;
  mainPhotoPreview: string | null = null;

  // Photos supplémentaires
  detailPhotoFiles: File[] = [];
  detailPhotoPreviews: string[] = [];

  categories = [
    { code: 'SHOES', label: 'Chaussures' },
    { code: 'CLOTHES', label: 'Vêtements' },
    { code: 'ACCESSORIES', label: 'Accessoires' },
    { code: 'ELECTRONICS', label: 'Électronique' },
    { code: 'FOOD', label: 'Alimentation' },
  ];

  statuses = [
    { code: 'AVAILABLE', label: 'Disponible' },
    { code: 'UNAVAILABLE', label: 'Indisponible' },
    { code: 'OUT_OF_STOCK', label: 'Rupture de stock' },
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.shopId = params['shopId'] ?? null;
    });

    this.productForm = this.fb.group({
      name: ['', Validators.required],
      unityPrice: [null, [Validators.required, Validators.min(0)]],
      category: [null, Validators.required],
      description: [''],
      status: [null, Validators.required],
    });
  }

  // --- Photo principale ---
  onMainPhotoChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.mainPhotoFile = file;
      this.mainPhotoPreview = URL.createObjectURL(file);
    }
  }

  onMainPhotoDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.mainPhotoFile = file;
      this.mainPhotoPreview = URL.createObjectURL(file);
    }
  }

  // --- Photos supplémentaires ---
  onDetailPhotosChange(event: Event): void {
    const files = Array.from((event.target as HTMLInputElement).files ?? []);
    files.forEach(file => {
      this.detailPhotoFiles.push(file);
      this.detailPhotoPreviews.push(URL.createObjectURL(file));
    });
  }

  removeDetailPhoto(index: number, event: Event): void {
    event.stopPropagation();
    this.detailPhotoFiles.splice(index, 1);
    this.detailPhotoPreviews.splice(index, 1);
  }

  // --- Soumission ---
  onSubmit(): void {
    if (this.productForm.invalid) return;
    this.isSubmitting = true;

    const formData = new FormData();
    const { name, unityPrice, category, description, status } = this.productForm.value;

    formData.append('name', name);
    formData.append('unityPrice', unityPrice);
    formData.append('category', JSON.stringify(category));
    formData.append('description', description ?? '');
    formData.append('status', JSON.stringify(status));
    formData.append('shopId', this.shopId ?? '');

    if (this.mainPhotoFile) {
      formData.append('mainPhoto', this.mainPhotoFile);
    }
    this.detailPhotoFiles.forEach(file => {
      formData.append('detailPhotos', file);
    });

    this.http.post(`${environment.baseUrl}/products`, formData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/boutique/products'], {
          queryParams: { shopId: this.shopId },
          state: { successMessage: 'Produit créé avec succès !' }
        });
      },
      error: err => {
        this.isSubmitting = false;
        this.showAlert('Erreur lors de la création du produit', 'error');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/boutique/products'], { queryParams: { shopId: this.shopId } });
  }

  showAlert(message: string, type: 'success' | 'error' = 'error') {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => this.alertMessage = null, 3000);
  }
}