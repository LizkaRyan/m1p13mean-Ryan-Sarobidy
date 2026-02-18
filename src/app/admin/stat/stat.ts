import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ReservationStat } from '../../../types/api';

@Component({
  selector: 'app-stat',
  imports: [],
  templateUrl: './stat.html',
  styleUrl: './stat.css',
})
export class Stat implements AfterViewInit {

  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.getStat('2026-01', '2026-12').subscribe({
      next: (stats) => {
        this.createChart(stats);
      },
      error: (err) => console.error(err)
    });
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