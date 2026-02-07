import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
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
