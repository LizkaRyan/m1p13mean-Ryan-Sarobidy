import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Shop } from '../../../types/api';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-select-shop',
  templateUrl: './select-shop.html',
  styleUrls: ['./select-shop.css']
})
export class SelectShop implements OnInit {
  shops: Shop[] = [];

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.fetchShops().subscribe({
      next: s => this.shops = s,
      error: err => {
        console.error('Erreur récupération magasins', err);
      }
    });
  }

  private fetchShops(): Observable<Shop[]> {
    return this.http.get<Shop[]>(`${environment.baseUrl}/shops`);
  }
}