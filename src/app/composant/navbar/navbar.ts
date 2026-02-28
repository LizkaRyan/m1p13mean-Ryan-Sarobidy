import { Component, HostListener, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { RouterModule } from '@angular/router';
import { lucideBell } from '@ng-icons/lucide';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { lucideLogOut } from '@ng-icons/lucide';


export interface Notification {
  type: { code: string, label: string },
  payload: any,
  message: string,
  _id: string,
  read: boolean,
  createdAt: string,
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIconComponent],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
  providers: [provideIcons({ bell: lucideBell, logout: lucideLogOut })]
})
export class Navbar implements OnInit {
  isMenuOpen = false;
  role: string | null = null;
  menuItems: any[] = [];
  isNotificationsOpen = false;
  private http = inject(HttpClient);
  private router = inject(Router);

  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  private unreadCountSubject = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountSubject.asObservable();

  page = 1;
  limit = 2;

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

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getTimeAgo(dateInput: string | Date): string {
    const date = new Date(dateInput);
    const now = new Date();

    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    // Moins d'une heure
    if (diffInHours < 1) {
      return "moins d'1 heure";
    }

    // Moins de 24 heures
    if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    }

    // Plus de 24 heures
    const days = Math.floor(diffInDays);
    return `il y a ${days} jour${days > 1 ? 's' : ''}`;
  }

  ngOnInit(): void {
    this.page = 1;
    this.notificationsSubject.next([]);
    this.loadNotifications();
    this.loadUnreadCount();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.page = 1;
        this.notificationsSubject.next([]);
      })
  }

  loadUnreadCount(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.getNbNotificationUnread(userId).subscribe(count => {
      this.unreadCountSubject.next(count);
      if (count > 0) {
        this.makeItAllRead(userId).subscribe(() => {});
      }
    });
  }

  loadNotifications(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.getNotifications(userId, this.page, this.limit)
      .subscribe(data => {

        const current = this.notificationsSubject.value;

        this.notificationsSubject.next([
          ...current,
          ...data
        ]);

        this.page++;
      });
  }

  getNotifications(userId: string, page: number, limit: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${environment.baseUrl}/users/${userId}/notifications?page=${page}&limit=${limit}`);
  }

  getNbNotificationUnread(userId: string): Observable<number> {
    return this.http.get<number>(`${environment.baseUrl}/users/${userId}/notifications/nb-unread`);
  }

  makeItAllRead(userId: string): Observable<any> {
    return this.http.patch(`${environment.baseUrl}/users/${userId}/notifications/mark-all-read`, {});
  }

  private navbarItems = {
    admin: [
      { label: 'Accueil', route: '/admin' },
      { label: 'Room', route: '/admin/room' },
      { label: 'Évènement', route: '/admin/event' },
      { label: 'Validation de réservation', route: '/admin/reservation-validation' },
      { label: 'Validation d\'évènement', route: '/admin/event-validation' },
    ],
    boutique: [
      { label: 'Accueil', route: '/' },
      { label: 'Produits', route: '/products' },
    ],
    client: [
      { label: 'Accueil', route: '/shop' },
      { label: 'Évènements', route: '/event' },
    ]
  };

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      this.isNotificationsOpen = false;
    }
  }

  navigateToNotification(notification: Notification): void {
    if(notification.type.code === 'NEW_EVENT') {
      this.router.navigate(['/event'], { queryParams: { _id: notification.payload.eventId } });
    }
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  toggleNotifications(): void {
    this.isNotificationsOpen = !this.isNotificationsOpen;
    if (this.isNotificationsOpen) {
      this.isMenuOpen = false;
    }
  }

  closeNotifications(): void {
    this.isNotificationsOpen = false;
  }

  seeMore(): void {
    this.loadNotifications();
  }
}
