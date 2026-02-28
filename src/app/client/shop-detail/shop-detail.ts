import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { EventEmitter } from 'stream';

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
}

@Component({
  selector: 'app-shop-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop-detail.html',
  styleUrl: './shop-detail.css',
})
export class ShopDetail {
  @Input() showActions: boolean = true;
  shop: Shop = {
    category: {
      code: "MODE",
      label: "Mode"
    },
    _id: "698c5222a4c7623a67cb0ce3",
    name: "Zara",
    userId: "698c5124a4c7623a67cb0ce2",
    photos: [
      {
        _id: "photo1",
        url: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=300&fit=crop",
        createdAt: "2026-01-10",
        type: {
          code: "EXTERIOR",
          label: "Exterior"
        }
      },
      {
        _id: "photo2",
        url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=300&fit=crop",
        createdAt: "2026-01-12",
        type: {
          code: "INTERIOR",
          label: "Interior"
        }
      }
    ]
  };
  currentPhotoIndex: number = 0;

  getCategoryColor(categoryCode: string): string {
    const colors: { [key: string]: string } = {
      'MODE': 'from-pink-500 to-rose-500',
      'TECH': 'from-blue-500 to-cyan-500',
      'FOOD': 'from-green-500 to-emerald-500',
      'BEAUTY': 'from-purple-500 to-fuchsia-500',
      'SPORT': 'from-orange-500 to-amber-500'
    };
    return colors[categoryCode] || 'from-gray-500 to-slate-500';
  }

  getCategoryBadgeColor(categoryCode: string): string {
    const colors: { [key: string]: string } = {
      'MODE': 'bg-pink-100 text-pink-800 border-pink-300',
      'TECH': 'bg-blue-100 text-blue-800 border-blue-300',
      'FOOD': 'bg-green-100 text-green-800 border-green-300',
      'BEAUTY': 'bg-purple-100 text-purple-800 border-purple-300',
      'SPORT': 'bg-orange-100 text-orange-800 border-orange-300'
    };
    return colors[categoryCode] || 'bg-gray-100 text-gray-800 border-gray-300';
  }

  getPhotoTypeBadgeColor(typeCode: string): string {
    const colors: { [key: string]: string } = {
      'EXTERIOR': 'bg-blue-100 text-blue-700 border-blue-300',
      'INTERIOR': 'bg-purple-100 text-purple-700 border-purple-300',
      'PRODUCT': 'bg-green-100 text-green-700 border-green-300',
      'LOGO': 'bg-amber-100 text-amber-700 border-amber-300'
    };
    return colors[typeCode] || 'bg-gray-100 text-gray-700 border-gray-300';
  }

  get currentPhoto(): Photo | null {
    if (this.shop.photos && this.shop.photos.length > 0) {
      return this.shop.photos[this.currentPhotoIndex];
    }
    return null;
  }

  nextPhoto(): void {
    if (this.shop.photos && this.shop.photos.length > 0) {
      this.currentPhotoIndex = (this.currentPhotoIndex + 1) % this.shop.photos.length;
    }
  }

  previousPhoto(): void {
    if (this.shop.photos && this.shop.photos.length > 0) {
      this.currentPhotoIndex =
        (this.currentPhotoIndex - 1 + this.shop.photos.length) % this.shop.photos.length;
    }
  }

  goToPhoto(index: number): void {
    this.currentPhotoIndex = index;
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
