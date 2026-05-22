import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountService } from '../services/account.service';
import { OrderHistory } from '../models/account.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orders.component.html'
})
export class OrdersComponent implements OnInit {
  orders: OrderHistory[] = [];
  currentFilter: string = 'TatCa';
  isLoading = true;
  isActionLoading = false;

  selectedOrder: OrderHistory | null = null;
  showModal = false;

  tabs = [
    { value: 'TatCa', label: 'Tất cả' },
    { value: 'DangXuLy', label: 'Đang xử lý' },
    { value: 'DangGiao', label: 'Đang giao' },
    { value: 'DaGiao', label: 'Đã giao' },
    { value: 'DaHuy', label: 'Đã hủy' }
  ];

  constructor(
    private accountService: AccountService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadOrders(this.currentFilter);
  }

  loadOrders(filter: string): void {
    this.currentFilter = filter;
    this.isLoading = true;
    this.cdr.detectChanges();

    this.accountService.getOrders(filter).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.orders = res.data;
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  cancelOrder(orderId: string): void {
    if (!confirm('Bạn có chắc muốn hủy đơn hàng này không?')) return;
    
    this.isActionLoading = true;
    this.accountService.cancelOrder(orderId).subscribe({
      next: (res) => {
        this.isActionLoading = false;
        if (res.success) {
          this.loadOrders(this.currentFilter); // Tải lại danh sách
        } else {
          alert(res.message);
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isActionLoading = false;
        alert(err.error?.message || 'Không thể hủy đơn hàng này.');
        this.cdr.detectChanges();
      }
    });
  }

  openModal(order: OrderHistory): void {
    this.selectedOrder = order;
    this.showModal = true;
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedOrder = null;
    this.cdr.detectChanges();
  }

  // Tiện ích UI
  getShortId(id: string): string {
    return id.length >= 8 ? id.substring(0, 8).toUpperCase() : id.toUpperCase();
  }

  getStatusLabel(status: string): string {
    const tab = this.tabs.find(t => t.value === status);
    return tab ? tab.label : status;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'DaGiao': return 'bg-emerald-100 text-emerald-700';
      case 'DaHuy': return 'bg-red-100 text-red-700';
      case 'DangGiao': return 'bg-blue-100 text-blue-700';
      case 'DangXuLy': return 'bg-amber-100 text-amber-700';
      case 'ChoXacNhan': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  }
}