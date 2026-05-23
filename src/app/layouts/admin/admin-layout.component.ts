import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { StorageService } from '../../services/storage.service';
import { AccountService } from '../../../app/features/account/services/account.service';
@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent implements OnInit {
  adminName = 'Quản trị viên';
  adminRole = 'Admin';
  avatarChar = 'A';
  isLoading = false;
  pageTitle = 'Thống kê';

  menuItems = [
    { path: '/admin/phieunhap', label: 'Duyệt phiếu nhập kho', icon: 'fa-file-signature' },
    { path: '/admin/dashboard', label: 'Thống kê', icon: 'fa-chart-pie' },
    { path: '/admin/orders', label: 'Quản lý đơn hàng', icon: 'fa-cart-shopping' },
    { path: '/admin/users', label: 'Quản lý người dùng', icon: 'fa-users-gear' },
    { path: '/admin/danhmuc', label: 'Quản lý danh mục', icon: 'fa-layer-group' },
    { path: '/admin/thuoc', label: 'Quản lý thuốc', icon: 'fa-capsules' },
    { path: '/admin/nhacungcap', label: 'Quản lý nhà cung cấp', icon: 'fa-truck-medical' },
  ];

  constructor(
    private router: Router,
    private storage: StorageService,
    private accountService: AccountService,
    private cdr: ChangeDetectorRef,
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updatePageTitle(event.urlAfterRedirects);
      });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.updatePageTitle(this.router.url);

    this.accountService.getProfile().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.adminName = res.data.hoTen;
          this.adminRole = res.role === 'QuanLy' ? 'Quản lý' : res.role || 'Admin';
          this.avatarChar = this.adminName.charAt(0).toUpperCase();
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  updatePageTitle(url: string): void {
    const activeItem = this.menuItems.find((item) => url.includes(item.path));
    this.pageTitle = activeItem ? activeItem.label : 'Admin Panel';
    this.cdr.detectChanges();
  }

  logout(): void {
    this.storage.removeToken();
    this.router.navigate(['/auth/login']);
  }
}
