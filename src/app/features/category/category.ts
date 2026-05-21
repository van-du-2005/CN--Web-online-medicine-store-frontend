import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
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
  tieuDeTrang = 'Sản phẩm';

  tuKhoaHienTai = '';
  tagHienTai = '';
  sapXep = '';
  locGia = '';
  giaTu: number | null = null;
  giaDen: number | null = null;

  danhMucSidebar: string[] = [];
  danhMucCha = ''; // THÊM BIẾN NÀY để lưu tên nhóm mẹ (VD: Thực phẩm chức năng)

  cayDanhMuc: any = {
    'Thực phẩm chức năng': ['Vitamin & Khoáng chất', 'Miễn dịch - Đề kháng', 'Tiêu hóa', 'Tim mạch - Huyết áp', 'Đường huyết - Tiểu đường'],
    'Dược mỹ phẩm': ['Chăm sóc da mặt', 'Chăm sóc cơ thể', 'Chăm sóc tóc - da đầu', 'Mỹ phẩm trang điểm', 'Giải pháp làn da'],
    'Thuốc': ['Thuốc bổ, vitamin và khoáng chất', 'Tiêu hóa, gan mật', 'Tim mạch, tiểu đường', 'Xương khớp, gout', 'Thần kinh, não bộ', 'Da liễu, dị ứng', 'Mắt, tai mũi họng', 'Tiết niệu, sinh dục', 'Giảm đau, hạ sốt'],
    'Chăm sóc cá nhân': ['Thực phẩm - Đồ uống', 'Vệ sinh cá nhân', 'Chăm sóc răng miệng', 'Đồ dùng gia đình', 'Thiết bị làm đẹp', 'Tinh dầu các loại'],
    'Thiết bị y tế': ['Dụng cụ y tế', 'Dụng cụ theo dõi', 'Dụng cụ sơ cứu', 'Khẩu trang']
  };

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
            this.danhMucSidebar = [];
            this.danhMucCha = '';
          } else if (this.tagHienTai) {
            this.tieuDeTrang = this.tagHienTai;
            this.capNhatSidebar(this.tagHienTai);
          } else {
            this.tieuDeTrang = 'Tất cả sản phẩm';
            this.danhMucSidebar = [];
            this.danhMucCha = '';
          }

          this.apDungBoLoc();
        });
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  capNhatSidebar(tag: string) {
    for (const [key, values] of Object.entries(this.cayDanhMuc)) {
      if (key === tag || (values as string[]).includes(tag)) {
        this.danhMucSidebar = values as string[];
        this.danhMucCha = key; // LƯU LẠI NHÓM MẸ để hiện lên Breadcrumb
        return;
      }
    }
    this.danhMucSidebar = [];
    this.danhMucCha = '';
  }

  apDungBoLoc() {
    let ketQua = [...this.tatCaThuoc];

    if (this.tuKhoaHienTai) {
      ketQua = ketQua.filter(t => t.tenThuoc.toLowerCase().includes(this.tuKhoaHienTai.toLowerCase()));
    }

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

    if (this.sapXep === 'asc') {
      ketQua.sort((a, b) => a.giaBan - b.giaBan);
    } else if (this.sapXep === 'desc') {
      ketQua.sort((a, b) => b.giaBan - a.giaBan);
    }

    this.danhSachThuoc = ketQua;
    this.cdr.detectChanges();
  }
}
