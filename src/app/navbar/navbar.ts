import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  isMenuOpen = false;
  role: string | null = null;
  menuItems: any[] = [];

  constructor(private authService: AuthService) {
    this.authService.role$.subscribe(role => {
      this.role = role;
      if (this.role && this.role.toLocaleLowerCase() === 'admin') {
        this.menuItems = this.navbarItems['admin'];
        return;
      }
      if (this.role && this.role.toLocaleLowerCase() === 'boutique') {
        this.menuItems = this.navbarItems['boutique'];
        return;
      }
      this.menuItems = this.navbarItems['client'];
    });
  }

  private navbarItems = {
    admin: [
      { label: 'Room', route: '/admin/room' },
      { label: 'Validation de réservation', route: '/admin/reservation-validation' },
    ],
    boutique: [
      { label: 'Accueil', route: '/' },
      { label: 'Produits', route: '/products' },
    ],
    client: [
      { label: 'Accueil', route: '/' },
    ]
  };


  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
