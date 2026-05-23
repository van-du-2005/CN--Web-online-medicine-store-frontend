import { Component, OnInit, inject, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { ThuocService, Thuoc } from '../../services/thuoc';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './header.html',
})
export class HeaderComponent implements OnInit {
  tuKhoaTimKiem = '';
  tatCaThuoc: Thuoc[] = [];
  danhSachGoiY: Thuoc[] = [];
  hienThiGoiY = false;

  private router = inject(Router);
  private storageService = inject(StorageService);
  private thuocService = inject(ThuocService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.thuocService.getDanhSachThuoc().subscribe({
      next: (data) => {
        this.tatCaThuoc = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Lỗi tải thuốc:', err);
        this.cdr.detectChanges();
      } 
    });
  }

  isLoggedIn(): boolean {
    return !!this.storageService.getToken();
  }

  navigateToLogin() { this.router.navigate(['/auth/login']); }
  navigateToCart() { this.router.navigate(['/cart']); }
  navigateToAccount() { this.router.navigate(['/account/profile']); }

  boDauTiengViet(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  onTimKiemThayDoi() {
    if (!this.tuKhoaTimKiem.trim()) {
      this.danhSachGoiY = [];
      this.hienThiGoiY = false;
      return;
    }
    const tuKhoaKoDau = this.boDauTiengViet(this.tuKhoaTimKiem.trim());
    this.danhSachGoiY = this.tatCaThuoc
      .filter(t => this.boDauTiengViet(t.tenThuoc).includes(tuKhoaKoDau))
      .slice(0, 5);
    this.hienThiGoiY = true;
  }

  timKiem() {
    this.hienThiGoiY = false;
    if (this.tuKhoaTimKiem.trim()) {
      this.router.navigate(['/category'], { queryParams: { search: this.tuKhoaTimKiem } });
    }
  }

  chonGoiY(thuoc: Thuoc) {
    this.tuKhoaTimKiem = thuoc.tenThuoc;
    this.hienThiGoiY = false;
    this.router.navigate(['/product/detail', thuoc.maThuoc]);
  }

  anGoiY() {
    setTimeout(() => this.hienThiGoiY = false, 200);
  }
}