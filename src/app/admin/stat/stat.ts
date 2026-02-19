import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ReservationStat, ReservationUnpaid } from '../../../types/api';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideMailbox, lucideCheck, lucideMail,lucideBox, lucideCoins, lucideUser } from '@ng-icons/lucide';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stat',
  imports: [CommonModule, NgIconComponent, FormsModule],
  templateUrl: './stat.html',
  styleUrl: './stat.css',
  providers: [provideIcons({ search: lucideSearch, empty: lucideMailbox, valider: lucideCheck, mail: lucideMail, box: lucideBox, coins: lucideCoins, user: lucideUser })]
})
export class Stat implements AfterViewInit {

  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;
  reservations$!: Observable<ReservationUnpaid[]>;

  startMonth: string;
  endMonth: string;
  endMonthCard: string;

  serchCanva() {
    this.getStat(this.startMonth, this.endMonth).subscribe({
      next: (stats) => {
        this.updateChartData(stats);
      },
      error: (err) => console.error(err)
    });
    // Exemple : appel API ou filtrage
  }

  searchReservation() {
    this.reservations$ = this.getReservation(this.endMonthCard);
  }

  updateChartData(stats: ReservationStat[]) {
    const labels = stats.map(s => s._id);
    const paidData = stats.map(s => s.totalPaid);
    const unpaidData = stats.map(s => s.totalUnpaid);
    // Modifier les labels
    this.chart.data.labels = labels;

    // Modifier les valeurs
    this.chart.data.datasets[0].data = paidData;
    this.chart.data.datasets[1].data = unpaidData;

    // Mettre à jour le chart
    this.chart.update();
  }

  showActions = false;

  private formatOnlyMonth(date: Date): string {
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // ajoute 0 si < 10
    return `${date.getFullYear()}-${month}`;
  }

  constructor(private http: HttpClient) {
    const today = new Date();

    this.endMonth = this.formatOnlyMonth(today);
    this.endMonthCard = this.endMonth;

    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 6, 1);
    this.startMonth = this.formatOnlyMonth(sixMonthsAgo);
  }

  getReservation(endMonth): Observable<ReservationUnpaid[]> {
    return this.http.get<ReservationUnpaid[]>(`${environment.baseUrl}/reservations/unpaid?endMonth=${endMonth}`);
  }

  ngAfterViewInit(): void {
    this.getStat(this.startMonth, this.endMonth).subscribe({
      next: (stats) => {
        this.createChart(stats);
      },
      error: (err) => console.error(err)
    });
    this.reservations$ = this.getReservation(this.endMonthCard);
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

  markAsPaid(id): void {
    if (confirm('Êtes-vous sûr de marquer cette réservation comme payée ?')) {
      this.patchPayment(id, 'PAID').subscribe({
        next: (stats) => { },
        error: (err) => {
          console.error('Erreur lors de la mise à jour du statut:', err);
        }
      });
      this.getStat(this.startMonth, this.endMonth).subscribe({
        next: (stats) => {
          this.createChart(stats);
        },
        error: (err) => console.error(err)
      });
      this.reservations$ = this.getReservation(this.endMonthCard);
    }
  }

  sendReminder(reservation: ReservationUnpaid): void {
    if (confirm('Êtes-vous sûr d\'envoyer un rappel à ce locataire ?')) {
      const notification = {
        message: `Rappel de paiement de la "${reservation.room.name}" avec le montant de ${reservation.amount.toLocaleString('fr-F')} Ar pour le mois de ${this.formatMonth(reservation.month)}`,
        type: {
          code: 'PAYMENT_REMINDER',
          label: 'Rappel de paiement'
        },
        payload: {
          boxId: reservation.room._id,
          reservationId: reservation._id
        }
      }
      this.http.post(`${environment.baseUrl}/users/${reservation.shopUser._id}/notifications`, notification).subscribe({
        next: () => {
          alert('Rappel envoyé avec succès !');
        },
        error: (err) => {
          console.error('Erreur lors de l\'envoi du rappel:', err);
          alert('Une erreur est survenue lors de l\'envoi du rappel.');
        }
      });
    }
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

  patchPayment(id: string, status: string): Observable<ReservationStat[]> {
    return this.http.patch<ReservationStat[]>(`${environment.baseUrl}/reservations/payment/${id}`, { status: status });
  }
}