import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Shop } from '../../../types/api';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select-shop',
  templateUrl: './select-shop.html',
  styleUrls: ['./select-shop.css'],
  imports: [CommonModule],
  standalone: true,
})
export class SelectShop implements OnInit {
  shops: Shop[] = [];

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.fetchShops().subscribe({
      next: s => this.shops = s,
      error: err => {
        console.error('Erreur récupération magasins', err);
      }
    });
  }

  private fetchShops(): Observable<Shop[]> {
    // var id = this.authService.getUserId();
    // var id = "698c5124a4c7623a67cb0ce2";
    // console.log('User ID:', id);
    // return this.http.get<Shop[]>(`${environment.baseUrl}/shops/${id}`);
     return this.http.get<Shop[]>(`${environment.baseUrl}/shops`);
  }
}