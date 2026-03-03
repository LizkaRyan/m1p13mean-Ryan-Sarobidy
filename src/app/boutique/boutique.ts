import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgIcon, NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideBuilding } from '@ng-icons/lucide';

@Component({
  selector: 'app-boutique',
  templateUrl: './boutique.html',
  styleUrls: ['./boutique.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, NgIconComponent],
  providers: [provideIcons({ building: lucideBuilding})],
})
export class Boutique {}