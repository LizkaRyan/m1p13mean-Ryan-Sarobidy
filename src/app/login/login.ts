import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginResponse } from '../../types/api';
import { environment } from '../environments/environment';

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
  private http = inject(HttpClient);

  constructor(private router: Router) { }

  onLogin(): void {
    const loginResponse = this.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        if (res.user.role.toLocaleLowerCase() === "admin") {
          this.router.navigate(['/room']);
          return;
        }
        if (res.user.role.toLocaleLowerCase() === "boutique") {
          this.router.navigate(['/boutique']);
          return;
        }
        this.router.navigate(['/accueil']);
      }
    });
    console.log('Login response:', loginResponse);
    // Navigation vers le dashboard ou traitement de la connexion

  }

  login({ email, password }): Observable<LoginResponse> {
    return new Observable(observer => {
      this.http.post(`${environment.baseUrl}/auth/login`, { email, password }).subscribe({
        next: (res: LoginResponse) => {
          localStorage.setItem(environment.tokenKey, res.token);
          localStorage.setItem(environment.roleKey, res.user.role);
          observer.next(res);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  onSignup(): void {
    // Navigation vers la page d'inscription
    this.router.navigate(['/signup']);
    console.log('Navigation vers la page d\'inscription');
  }
}