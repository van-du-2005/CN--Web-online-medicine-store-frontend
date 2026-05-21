import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Bắt buộc phải có để đọc dữ liệu form
import { ThuocService, Thuoc } from '../../services/thuoc';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './category.html'
})
export class CategoryComponent implements OnInit {
  tatCaThuoc: Thuoc[] = [];
  danhSachThuoc: Thuoc[] = [];
  isLoading = true;
  tieuDeTrang = 'Thực phẩm chức năng';

  // Các biến lưu trạng thái bộ lọc
  tuKhoaHienTai = '';
  tagHienTai = '';
  sapXep = '';
  locGia = '';
  giaTu: number | null = null;
  giaDen: number | null = null;

  private thuocService = inject(ThuocService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.thuocService.getDanhSachThuoc().subscribe({
      next: (data) => {
        this.tatCaThuoc = data;
        this.isLoading = false;

        this.route.queryParams.subscribe(params => {
          this.tuKhoaHienTai = params['search'] || '';
          this.tagHienTai = params['tag'] || '';

          if (this.tuKhoaHienTai) {
            this.tieuDeTrang = `Kết quả tìm kiếm: "${this.tuKhoaHienTai}"`;
          } else if (this.tagHienTai) {
            this.tieuDeTrang = this.tagHienTai;
          } else {
            this.tieuDeTrang = 'Thực phẩm chức năng';
          }

          this.apDungBoLoc(); // Tự động lọc khi vừa vào trang
        });
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Thuật toán lọc
  apDungBoLoc() {
    let ketQua = [...this.tatCaThuoc];

    // 1. Lọc theo từ khóa tìm kiếm
    if (this.tuKhoaHienTai) {
      ketQua = ketQua.filter(t => t.tenThuoc.toLowerCase().includes(this.tuKhoaHienTai.toLowerCase()));
    }

    // 2. Lọc theo khoảng giá
    if (this.locGia === 'duoi100') {
      ketQua = ketQua.filter(t => t.giaBan < 100000);
    } else if (this.locGia === '100-300') {
      ketQua = ketQua.filter(t => t.giaBan >= 100000 && t.giaBan <= 300000);
    } else if (this.locGia === 'tren500') {
      ketQua = ketQua.filter(t => t.giaBan > 500000);
    } else if (this.locGia === 'custom') {
      const min = this.giaTu || 0;
      const max = this.giaDen || 999999999;
      ketQua = ketQua.filter(t => t.giaBan >= min && t.giaBan <= max);
    }

    // 3. Sắp xếp giá
    if (this.sapXep === 'asc') {
      ketQua.sort((a, b) => a.giaBan - b.giaBan);
    } else if (this.sapXep === 'desc') {
      ketQua.sort((a, b) => b.giaBan - a.giaBan);
    }

    this.danhSachThuoc = ketQua;
    this.cdr.detectChanges();
  }
}
