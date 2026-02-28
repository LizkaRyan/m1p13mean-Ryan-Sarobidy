import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../app/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenSubject = new BehaviorSubject<string | null>(null);
  token$ = this.tokenSubject.asObservable();

  private roleSubject = new BehaviorSubject<string | null>(null);
  role$ = this.roleSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const savedToken = localStorage.getItem(environment.tokenKey);
      const savedRole = localStorage.getItem(environment.roleKey);
      if (savedToken) {
        this.tokenSubject.next(savedToken);
      }
      if (savedRole) {
        this.roleSubject.next(savedRole);
      }
    }
  }

  setRole(role: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(environment.roleKey, role);
    }
    this.roleSubject.next(role);
  }

  setToken(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(environment.tokenKey, token);
    }
    this.tokenSubject.next(token);
  }

  getToken(): string | null {
    return this.tokenSubject.getValue();
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(environment.roleKey);
      localStorage.removeItem(environment.tokenKey);
    }
    this.tokenSubject.next(null);
    this.roleSubject.next(null);
  }
}
