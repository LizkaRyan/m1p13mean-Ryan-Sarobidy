import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginResponse } from '../../types/api';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-sign-up',
  imports: [FormsModule, CommonModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  role: string = '';
  acceptTerms: boolean = false;
  private http = inject(HttpClient);

  constructor(private router: Router,private authService: AuthService) {}

  onSignup(): void {

    if (this.password !== this.confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }

    let roleToAssign = {
      code: 'CUSTOMER',
      label: 'CUSTOMER'
    };

    if (this.role.toLocaleLowerCase() === 'boutique') {
      roleToAssign = {
        code: 'BOUTIQUE',
        label: 'Boutique'
      };
    }

    this.signUp({
      name: this.name,
      email: this.email,
      password: this.password,
      role: roleToAssign
    }).subscribe({
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

  onLogin(): void {
    this.router.navigate(['/login']);
  }

  signUp(data): Observable<LoginResponse> {
      return new Observable(observer => {
        this.http.post(`${environment.baseUrl}/auth/signup`, data).subscribe({
          next: (res: LoginResponse) => {
            observer.next(res);
            observer.complete();
          },
          error: (err) => alert(err.error.message || 'Erreur lors de l\'inscription')
        });
      });
    }
}
