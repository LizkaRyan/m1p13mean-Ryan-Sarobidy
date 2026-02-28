import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Navbar } from './composant/navbar/navbar';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Footer } from './composant/footer/footer';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  showNavbar = true;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const hiddenRoutes = ['/login', '/register'];

        const show = !hiddenRoutes.includes(this.router.url);

        this.showNavbar = show;
      });
  }
}
