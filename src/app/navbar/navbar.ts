import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  isMenuOpen = false;

  private navbarItems = {
    admin: [
      { label: 'Accueil', route: '/' },
      { label: 'Services', route: '/services' },
      { label: 'À propos', route: '/about' },
      { label: 'Contact', route: '/contact' },
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