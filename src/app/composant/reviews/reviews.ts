import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReviewData, User } from '../../../types/api';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideSend } from '@ng-icons/lucide';

export interface NewReview {
  rating: number;
  text: string;
}

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, NgIconComponent],
  templateUrl: './reviews.html',
  styleUrl: './reviews.css',
  providers: [provideIcons({ send: lucideSend })]
})
export class Reviews implements OnInit {
  @Input() reviews: ReviewData[] = [];
  @Input() shopId?: string;
  @Input() canAddReview: boolean = true;
  @Input() currentUser?: User;
  Math = Math;

  reviewForm!: FormGroup;
  hoveredRating: number = 0;
  isSubmitting: boolean = false;

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {
    const reviews = this.reviews;
    console.log("Reviews reçues dans le composant : ", reviews);
  }

  initForm(): void {
    this.reviewForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      text: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  setRating(rating: number): void {
    this.reviewForm.patchValue({ rating });
  }

  onSubmit(): void {
    if (this.reviewForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const newReview: NewReview = {
        rating: this.reviewForm.value.rating,
        text: this.reviewForm.value.text
      };


      // Reset form after submission
      setTimeout(() => {
        this.reviewForm.reset({ rating: 0, text: '' });
        this.hoveredRating = 0;
        this.isSubmitting = false;
      }, 500);
    }
  }

  getStarArray(rating: number): boolean[] {
    return Array(5).fill(false).map((_, index) => index < rating);
  }

  getAverageRating(): number {
    if (this.reviews.length === 0) return 0;
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    const response = Math.round((sum / this.reviews.length) * 10) / 10;
    return response;
  }

  getRatingDistribution(): { [key: number]: number } {
    const distribution: { [key: number]: number } = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    };

    this.reviews.forEach(review => {
      distribution[review.rating] = (distribution[review.rating] || 0) + 1;
    });

    return distribution;
  }

  getRatingPercentage(rating: number): number {
    if (this.reviews.length === 0) return 0;
    const distribution = this.getRatingDistribution();
    return Math.round((distribution[rating] / this.reviews.length) * 100);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
    if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`;

    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getUserInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getAvatarColor(userId: string): string {
    const colors = [
      'bg-gradient-to-br from-pink-400 to-rose-500',
      'bg-gradient-to-br from-blue-400 to-cyan-500',
      'bg-gradient-to-br from-green-400 to-emerald-500',
      'bg-gradient-to-br from-purple-400 to-fuchsia-500',
      'bg-gradient-to-br from-orange-400 to-amber-500',
      'bg-gradient-to-br from-red-400 to-rose-500',
      'bg-gradient-to-br from-indigo-400 to-purple-500',
      'bg-gradient-to-br from-teal-400 to-cyan-500'
    ];

    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  }

  get characterCount(): number {
    return this.reviewForm.get('text')?.value?.length || 0;
  }
}
