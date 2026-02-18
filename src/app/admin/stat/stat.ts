import { AfterViewInit, Component, ElementRef, Output, ViewChild, EventEmitter } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ReservationStat } from '../../../types/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat',
  imports: [CommonModule],
  templateUrl: './stat.html',
  styleUrl: './stat.css',
})
export class Stat implements AfterViewInit {

  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;
  @Output() onMarkPaid = new EventEmitter<any>();
  @Output() onSendReminder = new EventEmitter<any>();
  @Output() onViewDetails = new EventEmitter<any>();

  showActions = false;

  rent = {
    "shop": {
      "_id": "698c5222a4c7623a67cb0ce3",
      "name": "Zara",
      "category": {
        "code": "MODE",
        "label": "Mode"
      }
    },
    "shopUser": {
      "_id": "698c5124a4c7623a67cb0ce2",
      "name": "Boutique",
      "email": "Rakoto@gmail.com"
    },
    "room": {
      "_id": "698c9820d0bdcba2131f0ca0",
      "name": "Box 2"
    },
    "reservationId": "698ca38e245dee41d3bbc8f8",
    "month": "2026-02",
    "amount": 250000,
    "status": "PENDING"
  };

  reservations$ = [
    {
      "shop": {
        "_id": "698c5222a4c7623a67cb0ce3",
        "name": "Zara",
        "category": {
          "code": "MODE",
          "label": "Mode"
        }
      },
      "shopUser": {
        "_id": "698c5124a4c7623a67cb0ce2",
        "name": "Boutique",
        "email": "Rakoto@gmail.com"
      },
      "room": {
        "_id": "698c9820d0bdcba2131f0ca0",
        "name": "Box 2"
      },
      "reservationId": "698ca38e245dee41d3bbc8f8",
      "month": "2026-02",
      "amount": 250000,
      "status": "PENDING"
    },
    {
      "shop": {
        "_id": "698c5222a4c7623a67cb0ce3",
        "name": "Zara",
        "category": {
          "code": "MODE",
          "label": "Mode"
        }
      },
      "shopUser": {
        "_id": "698c5124a4c7623a67cb0ce2",
        "name": "Boutique",
        "email": "Rakoto@gmail.com"
      },
      "room": {
        "_id": "698c97f6d0bdcba2131f0c99",
        "name": "Box 1"
      },
      "reservationId": "6995c497585a0ba2bc626a04",
      "month": "2026-02",
      "amount": 135000,
      "status": "PENDING"
    }
  ];

  constructor(private http: HttpClient) { }

  ngAfterViewInit(): void {
    this.getStat('2026-01', '2026-12').subscribe({
      next: (stats) => {
        this.createChart(stats);
      },
      error: (err) => console.error(err)
    });
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'PENDING': 'En attente',
      'PAID': 'Payé',
      'OVERDUE': 'En retard',
      'CANCELLED': 'Annulé'
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'PENDING': 'bg-amber-100 text-amber-800 border-amber-300',
      'PAID': 'bg-emerald-100 text-emerald-800 border-emerald-300',
      'OVERDUE': 'bg-red-100 text-red-800 border-red-300',
      'CANCELLED': 'bg-slate-100 text-slate-800 border-slate-300'
    };
    return classes[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  }

  getCategoryColor(categoryCode: string): string {
    const colors: { [key: string]: string } = {
      'MODE': 'from-pink-500 to-rose-500',
      'TECH': 'from-blue-500 to-cyan-500',
      'FOOD': 'from-green-500 to-emerald-500',
      'BEAUTY': 'from-purple-500 to-fuchsia-500',
      'SPORT': 'from-orange-500 to-amber-500'
    };
    return colors[categoryCode] || 'from-gray-500 to-slate-500';
  }

  getCategoryBadgeColor(categoryCode: string): string {
    const colors: { [key: string]: string } = {
      'MODE': 'bg-pink-100 text-pink-800 border-pink-300',
      'TECH': 'bg-blue-100 text-blue-800 border-blue-300',
      'FOOD': 'bg-green-100 text-green-800 border-green-300',
      'BEAUTY': 'bg-purple-100 text-purple-800 border-purple-300',
      'SPORT': 'bg-orange-100 text-orange-800 border-orange-300'
    };
    return colors[categoryCode] || 'bg-gray-100 text-gray-800 border-gray-300';
  }

  formatMonth(month: string): string {
    const [year, monthNum] = month.split('-');
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    const monthIndex = parseInt(monthNum) - 1;
    return `${months[monthIndex]} ${year}`;
  }

  getDaysOverdue(month: string): number {
    const [year, monthNum] = month.split('-');
    const dueDate = new Date(parseInt(year), parseInt(monthNum), 5);
    const today = new Date();
    const diffTime = today.getTime() - dueDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }

  isOverdue(month: string): boolean {
    return this.getDaysOverdue(month) > 0;
  }

  markAsPaid(): void {
  }

  sendReminder(): void {
  }

  viewDetails(): void {
  }

  handleMarkPaid(rent: any) {
    console.log('Marquer comme payé:', rent);
    // Appeler votre service API pour mettre à jour le statut
  }

  handleSendReminder(rent: any) {
    console.log('Envoyer rappel à:', rent.shopUser.email);
    // Appeler votre service d'envoi d'email
  }

  handleViewDetails(rent: any) {
    console.log('Voir détails:', rent);
    // Naviguer vers la page de détails ou ouvrir un modal
  }

  createChart(stats: ReservationStat[]) {

    const labels = stats.map(s => s._id);
    const paidData = stats.map(s => s.totalPaid);
    const unpaidData = stats.map(s => s.totalUnpaid);

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Payé',
            data: paidData,
          },
          {
            label: 'Non payé',
            data: unpaidData,
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value: any) {
                return value.toLocaleString('fr-FR') + ' Ar';
              }
            }
          }
        }
      }
    });
  }

  getStat(startMonth: string, endMonth: string): Observable<ReservationStat[]> {
    return this.http.get<ReservationStat[]>(`${environment.baseUrl}/reservations/stats?startMonth=${startMonth}&endMonth=${endMonth}`);
  }
}