import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../app/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private roleSubject = new BehaviorSubject<string | null>(null);
  role$ = this.roleSubject.asObservable();

  private userId = new BehaviorSubject<string | null>(null);
  userId$ = this.userId.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {

    if (isPlatformBrowser(this.platformId)) {
      const savedRole = localStorage.getItem(environment.roleKey);
      if (savedRole) {
        this.roleSubject.next(savedRole);
      }
    }
  }

  setUserId(userId: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(environment.userIdKey, userId);
    }
    this.userId.next(userId);
  }

  getUserId(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(environment.userIdKey);
    }
    return null;
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
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(environment.tokenKey);
    }
    return null;
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(environment.roleKey);
      localStorage.removeItem(environment.tokenKey);
      localStorage.removeItem(environment.userIdKey);
    }
    this.roleSubject.next(null);
  }
}
