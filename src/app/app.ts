import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ThuocService, Thuoc } from './services/thuoc'; // Gọi kho dữ liệu thuốc

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, RouterLink, CommonModule],
  templateUrl: './app.html'
})
export class AppComponent implements OnInit {
  tuKhoaTimKiem = '';
  tatCaThuoc: Thuoc[] = []; // Chứa toàn bộ thuốc tải về ngầm
  danhSachGoiY: Thuoc[] = []; // Chứa top 5 thuốc gần giống nhất
  hienThiGoiY = false;

  private router = inject(Router);
  private thuocService = inject(ThuocService);

  ngOnInit() {
    // Tải sẵn danh sách thuốc ngay khi web vừa mở để phục vụ tìm kiếm nhanh
    this.thuocService.getDanhSachThuoc().subscribe(data => {
      this.tatCaThuoc = data;
    });
  }

  // Thuật toán: Bỏ dấu tiếng Việt (ví dụ: "Tiêu Hóa" -> "tieu hoa")
  boDauTiengViet(str: string) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  // Hàm chạy liên tục mỗi khi tay người dùng gõ 1 phím
  onTimKiemThayDoi() {
    if (!this.tuKhoaTimKiem.trim()) {
      this.danhSachGoiY = [];
      this.hienThiGoiY = false;
      return;
    }

    const tuKhoaKoDau = this.boDauTiengViet(this.tuKhoaTimKiem.trim());

    // Lọc ra tối đa 5 sản phẩm có tên chứa từ khóa (dù có gõ sai dấu)
    this.danhSachGoiY = this.tatCaThuoc.filter(thuoc => {
      const tenThuocKoDau = this.boDauTiengViet(thuoc.tenThuoc);
      return tenThuocKoDau.includes(tuKhoaKoDau);
    }).slice(0, 5);

    this.hienThiGoiY = true;
  }

  // Khi bấm nút kính lúp hoặc Enter
  timKiem() {
    this.hienThiGoiY = false;
    if (this.tuKhoaTimKiem.trim()) {
      this.router.navigate(['/category'], { queryParams: { search: this.tuKhoaTimKiem } });
    }
  }

  // Khi click thẳng vào 1 món hàng đang được gợi ý xổ xuống
  chonGoiY(thuoc: Thuoc) {
    this.tuKhoaTimKiem = thuoc.tenThuoc;
    this.hienThiGoiY = false;
    this.router.navigate(['/product/detail', thuoc.maThuoc]); // Bay thẳng tới trang chi tiết
  }

  // Ẩn bảng gợi ý khi click ra chỗ khác
  anGoiY() {
    setTimeout(() => this.hienThiGoiY = false, 200);
  }
}
