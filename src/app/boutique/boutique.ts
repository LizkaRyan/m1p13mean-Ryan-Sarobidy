import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-boutique',
  templateUrl: './boutique.html',
  styleUrls: ['./boutique.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class Boutique implements OnInit, AfterViewInit {

  @ViewChild('evolutionChart') evolutionChartRef!: ElementRef;
  @ViewChild('statusChart') statusChartRef!: ElementRef;

  dateStart: string = '';
  dateEnd: string = '';

  // KPIs statiques
  kpis = {
    totalBoutiques: 4,
    demandesEnAttente: 3,
    reservationsActives: 2,
    notifications: 7
  };

  // Données statiques pour graphes
  private allData = [
    { shop: 'Zara', date: '2025-12-10', status: 'validated' },
    { shop: 'Zara', date: '2025-12-22', status: 'pending' },
    { shop: 'H&M', date: '2026-01-05', status: 'validated' },
    { shop: 'Zara', date: '2026-01-15', status: 'refused' },
    { shop: 'Nike Store', date: '2026-01-20', status: 'pending' },
    { shop: 'H&M', date: '2026-01-28', status: 'pending' },
    { shop: 'Adidas', date: '2026-02-03', status: 'validated' },
    { shop: 'Nike Store', date: '2026-02-10', status: 'validated' },
    { shop: 'Zara', date: '2026-02-18', status: 'pending' },
    { shop: 'Adidas', date: '2026-02-25', status: 'refused' },
    { shop: 'H&M', date: '2026-03-01', status: 'pending' },
  ];

  // Calendrier statique
  calendarEntries = [
    { shop: 'Zara', start: '2026-01-10', end: '2026-04-10', color: '#6366f1' },
    { shop: 'H&M', start: '2026-01-28', end: '2026-05-28', color: '#7c3aed' },
    { shop: 'Nike Store', start: '2026-02-10', end: '2026-06-10', color: '#0ea5e9' },
    { shop: 'Adidas', start: '2026-02-25', end: '2026-07-25', color: '#10b981' },
  ];

  private evolutionChartInstance: Chart | null = null;
  private statusChartInstance: Chart | null = null;

  ngOnInit(): void {
    const now = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(now.getMonth() - 3);
    this.dateEnd = now.toISOString().split('T')[0];
    this.dateStart = threeMonthsAgo.toISOString().split('T')[0];
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.buildCharts(), 100);
  }

  applyFilter(): void {
    this.buildCharts();
  }

  private getFilteredData() {
    return this.allData.filter(d => d.date >= this.dateStart && d.date <= this.dateEnd);
  }

  private buildCharts(): void {
    this.buildEvolutionChart();
    this.buildStatusChart();
  }

  private buildEvolutionChart(): void {
    const filtered = this.getFilteredData();
    const shops = [...new Set(filtered.map(d => d.shop))];
    const months = [...new Set(filtered.map(d => d.date.substring(0, 7)))].sort();

    const datasets = shops.map((shop, i) => {
      const colors = ['#6366f1', '#7c3aed', '#0ea5e9', '#10b981'];
      return {
        label: shop,
        data: months.map(m => filtered.filter(d => d.shop === shop && d.date.startsWith(m)).length),
        borderColor: colors[i % colors.length],
        backgroundColor: colors[i % colors.length] + '22',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7
      };
    });

    if (this.evolutionChartInstance) this.evolutionChartInstance.destroy();

    this.evolutionChartInstance = new Chart(this.evolutionChartRef.nativeElement, {
      type: 'line',
      data: { labels: months, datasets },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: '#f1f5f9' } },
          x: { grid: { color: '#f1f5f9' } }
        }
      }
    });
  }

  private buildStatusChart(): void {
    const filtered = this.getFilteredData();
    const validated = filtered.filter(d => d.status === 'validated').length;
    const pending = filtered.filter(d => d.status === 'pending').length;
    const refused = filtered.filter(d => d.status === 'refused').length;

    if (this.statusChartInstance) this.statusChartInstance.destroy();

    this.statusChartInstance = new Chart(this.statusChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Validées', 'En attente', 'Refusées'],
        datasets: [{
          data: [validated, pending, refused],
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
          borderWidth: 0,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        cutout: '70%',
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }

  getDurationPercent(start: string, end: string): number {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    const now = new Date().getTime();
    const total = e - s;
    const elapsed = Math.min(now - s, total);
    return Math.max(0, Math.round((elapsed / total) * 100));
  }

  formatDate(d: string): string {
    return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}