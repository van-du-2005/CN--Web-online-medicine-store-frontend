import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from './order.service';
import { OrderFilterCount, OrderListItem, OrderDetail } from './order.model';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders-admin.component.html',
})
export class OrdersAdminComponent implements OnInit {
  counts: OrderFilterCount = {
    tatCa: 0,
    choXacNhan: 0,
    dangXuLy: 0,
    dangGiao: 0,
    daGiao: 0,
    daHuy: 0,
  };
  orders: OrderListItem[] = [];
  selectedOrder: OrderDetail | null = null;

  currentFilter: string = 'TatCa';
  currentPage: number = 1;
  totalPages: number = 1;
  newStatus: string = '';

  isLoadingCounts = false;
  isLoadingList = false;
  isLoadingDetail = false;
  isSaving = false;

  constructor(
    private orderService: OrderService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadCounts();
    this.loadOrders('TatCa', 1);
  }

  loadCounts(): void {
    this.isLoadingCounts = true;
    this.orderService.getCounts().subscribe({
      next: (res) => {
        if (res.success && res.data) this.counts = res.data;
        this.isLoadingCounts = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoadingCounts = false;
        this.cdr.detectChanges();
      },
    });
  }

  loadOrders(status: string, page: number): void {
    if (page < 1 || (this.totalPages > 1 && page > this.totalPages)) return;

    this.currentFilter = status;
    this.currentPage = page;
    this.isLoadingList = true;
    this.selectedOrder = null; // Reset detail khi đổi tab
    this.cdr.detectChanges();

    this.orderService.getOrders(status, page, 15).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.orders = res.data.items;
          this.totalPages = res.data.totalPages;
          // Tự động load chi tiết đơn đầu tiên nếu có
          if (this.orders.length > 0) {
            this.loadDetail(this.orders[0].maDonHang);
          }
        }
        this.isLoadingList = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoadingList = false;
        alert(err.error?.message || 'Lỗi tải danh sách đơn hàng.');
        this.cdr.detectChanges();
      },
    });
  }

  loadDetail(id: string): void {
    this.isLoadingDetail = true;
    this.cdr.detectChanges();

    this.orderService.getDetail(id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.selectedOrder = res.data;
          this.newStatus = res.data.trangThai; // Gán trạng thái hiện tại vào combox
        }
        this.isLoadingDetail = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoadingDetail = false;
        alert(err.error?.message || 'Lỗi tải chi tiết đơn hàng.');
        this.cdr.detectChanges();
      },
    });
  }

  // Check trạng thái đã hoàn thành/hủy
  isReadonlyStatus(): boolean {
    if (!this.selectedOrder) return false;
    return this.selectedOrder.trangThai === 'DaGiao' || this.selectedOrder.trangThai === 'DaHuy';
  }

  saveStatus(): void {
    if (!this.selectedOrder) return;

    // Nếu trạng thái mới không đổi so với ban đầu thì không làm gì cả
    if (this.newStatus === this.selectedOrder.trangThai) return;

    // Cảnh báo khi chuyển sang DaGiao hoặc DaHuy
    if (this.newStatus === 'DaGiao' || this.newStatus === 'DaHuy') {
      const confirmMsg =
        'Nếu thay đổi trạng thái sang Hoàn thành hoặc Đã hủy thì không thể thay đổi nữa. Bạn có chắc chắn muốn thay đổi?';
      if (!confirm(confirmMsg)) return; // Nếu user cancel thì thoát
    }

    this.isSaving = true;
    this.cdr.detectChanges();

    this.orderService.updateStatus(this.selectedOrder.maDonHang, this.newStatus).subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res.success) {
          alert('Cập nhật trạng thái thành công!');
          this.loadCounts();
          this.loadOrders(this.currentFilter, this.currentPage); // Reload lại danh sách hiện tại
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSaving = false;
        alert(err.error?.message || 'Lỗi cập nhật trạng thái!');
        // Reset lại combox về trạng thái cũ nếu lỗi
        if (this.selectedOrder) this.newStatus = this.selectedOrder.trangThai;
        this.cdr.detectChanges();
      },
    });
  }

  getPagesArray(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) pages.push(i);
    return pages;
  }
}
