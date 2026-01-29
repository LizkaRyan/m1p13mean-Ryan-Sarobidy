import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [FormsModule]
})
export class Login {
  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onLogin(): void {
    // Logique de connexion
    console.log('Tentative de connexion avec:', this.email);
      // Navigation vers le dashboard ou traitement de la connexion
      this.router.navigate(['/']);
  }

  onSignup(): void {
    // Navigation vers la page d'inscription
    this.router.navigate(['/signup']);
    console.log('Navigation vers la page d\'inscription');
  }
}