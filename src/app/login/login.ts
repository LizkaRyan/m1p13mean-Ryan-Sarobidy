import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginResponse } from '../../types/api';
import { environment } from '../environments/environment';
import { AuthService } from '../../services/auth.service';

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

  constructor(private router: Router, private authService: AuthService) { }

  onLogin(): void {
    this.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.authService.setRole(res.user.role);
        this.authService.setToken(res.token);
        this.authService.setUserId(res.user._id);
        if (res.user.role.toLocaleLowerCase() === "admin") {
          this.router.navigate(['/admin']);
          return;
        }
        if (res.user.role.toLocaleLowerCase() === "boutique") {
          this.router.navigate(['/boutique']);
          return;
        }
        this.router.navigate(['/event']);
      }
    });
  }

  login({ email, password }): Observable<LoginResponse> {
    return new Observable(observer => {
      this.http.post(`${environment.baseUrl}/auth/login`, { email, password }).subscribe({
        next: (res: LoginResponse) => {
          observer.next(res);
          observer.complete();
        },
        error: (err) => alert(err.error.message || 'Erreur lors de la connexion')
      });
    });
  }

  onSignup(): void {
    this.router.navigate(['/signup']);
  }
}