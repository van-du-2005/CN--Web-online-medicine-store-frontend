import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from './dashboard.service';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  chartInstance: any;

  currentFilter = 'thangnay';
  filters = [
    { value: 'homnay', label: 'Hôm nay' },
    { value: 'tuannay', label: 'Tuần này' },
    { value: 'thangnay', label: 'Tháng này' },
    { value: 'namnay', label: 'Năm nay' },
  ];

  summary: any = null;
  topProducts: any[] = [];
  topCustomers: any[] = [];
  lowStockData: any = { items: [], currentPage: 1, totalPages: 1 };

  isLoadingMain = true;
  isLoadingStock = true;
  errorMessage = '';

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadMainData();
    this.loadStockData(1);
  }

  applyFilter(filterValue: string): void {
    if (this.currentFilter === filterValue) return;
    this.currentFilter = filterValue;
    this.loadMainData();
  }

  loadMainData(): void {
    this.isLoadingMain = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    // Gọi 4 API đồng thời để tránh tắc nghẽn
    forkJoin({
      summary: this.dashboardService.getSummary(this.currentFilter),
      chart: this.dashboardService.getChart(this.currentFilter),
      products: this.dashboardService.getTopProducts(this.currentFilter),
      customers: this.dashboardService.getTopCustomers(this.currentFilter),
    })
      .pipe(
        finalize(() => {
          this.isLoadingMain = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (res) => {
          if (res.summary.success) this.summary = res.summary.data;
          if (res.products.success) this.topProducts = res.products.data?.items || [];
          if (res.customers.success) this.topCustomers = res.customers.data?.items || [];

          if (res.chart.success && res.chart.data) {
            this.renderChart(res.chart.data.labels, res.chart.data.data);
          }
        },
        error: (err) => {
          // Map lỗi từ Backend
          this.errorMessage =
            err.error?.message || 'Có lỗi hệ thống xảy ra khi tải dữ liệu Thống kê.';
        },
      });
  }

  loadStockData(page: number): void {
    if (page < 1 || (this.lowStockData.totalPages && page > this.lowStockData.totalPages)) return;

    this.isLoadingStock = true;
    this.cdr.detectChanges();

    this.dashboardService.getLowStock(page).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.lowStockData = res.data;
        }
        this.isLoadingStock = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoadingStock = false;
        alert(err.error?.message || 'Lỗi tải danh sách tồn kho.');
        this.cdr.detectChanges();
      },
    });
  }

  renderChart(labels: string[], dataArr: number[]): void {
    if (!this.chartCanvas) return;
    const ctx = this.chartCanvas.nativeElement.getContext('2d');

    if (this.chartInstance) this.chartInstance.destroy();

    this.chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            data: dataArr,
            backgroundColor: ['#f59e0b', '#3b82f6', '#0dcaf0', '#10b981', '#ef4444'],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'right',
            labels: { usePointStyle: true, boxWidth: 8, font: { size: 12 } },
          },
        },
      },
    });
  }

  getPagesArray(): number[] {
    const pages = [];
    for (let i = 1; i <= this.lowStockData.totalPages; i++) pages.push(i);
    return pages;
  }
}
