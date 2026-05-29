import { Component, OnInit, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-danhmuc',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './danhmuc.html',
  styleUrl: './danhmuc.css',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class DanhMuc implements OnInit {
  danhSachGoc: any[] = [];
  danhSachHienThi: any[] = [];

  // 3 Biến tính toán cho 3 thẻ thống kê trên cùng
  totalCount: number = 0;
  activeCount: number = 0;
  hiddenCount: number = 0;

  trangThaiLoc: string = '';

  // Form
  hienThiFormThem: boolean = false;
  isEditMode: boolean = false;
  danhMucMoi: any = { maDanhMuc: '', tenDanhMuc: '', moTa: '', trangThai: true }; // Mặc định Hoạt động

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.layDanhSach(); }

  layDanhSach() {
    fetch('http://localhost:5237/api/DanhMucs')
      .then(res => res.json())
      .then(data => {
        this.danhSachGoc = data;
        this.danhSachHienThi = data;
        this.tinhThongKe();
        this.cdr.detectChanges();
      })
      .catch(err => console.error('Lỗi API:', err));
  }

  tinhThongKe() {
    this.totalCount = this.danhSachGoc.length;
    this.activeCount = this.danhSachGoc.filter((d: any) => d.trangThai === true).length;
    this.hiddenCount = this.danhSachGoc.filter((d: any) => d.trangThai === false).length;
  }

  locDuLieu() {
    this.danhSachHienThi = this.danhSachGoc.filter(item => {
      if (this.trangThaiLoc === 'true') return item.trangThai === true;
      if (this.trangThaiLoc === 'false') return item.trangThai === false;
      return true; // Nếu chọn "Tất cả" thì cho qua hết
    });
  }

  toggleFormThem() {
    this.hienThiFormThem = !this.hienThiFormThem;
    if (!this.hienThiFormThem) this.resetForm();
    else this.isEditMode = false;
  }

  moFormSua(item: any) {
    this.isEditMode = true;
    this.hienThiFormThem = true;
    this.danhMucMoi = { ...item };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetForm() {
    this.danhMucMoi = { maDanhMuc: '', tenDanhMuc: '', moTa: '', trangThai: true };
    this.isEditMode = false;
  }

  luuDanhMuc() {
    // Ép kiểu đảm bảo trangThai gửi lên là boolean (true/false)
    this.danhMucMoi.trangThai = (this.danhMucMoi.trangThai === true || this.danhMucMoi.trangThai === 'true');

    const url = this.isEditMode ? `http://localhost:5237/api/DanhMucs/${this.danhMucMoi.maDanhMuc}` : 'http://localhost:5237/api/DanhMucs';

    // TẠO BẢN SAO DỮ LIỆU ĐỂ GỬI ĐI
    const duLieuGuiDi = { ...this.danhMucMoi };

    // FIX LỖI Ở ĐÂY: Nếu Thêm mới, xóa cái mã rỗng đi để C# không bị lỗi ép kiểu Guid
    if (!this.isEditMode) {
      delete duLieuGuiDi.maDanhMuc;
    }

    fetch(url, {
      method: this.isEditMode ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(duLieuGuiDi)
    }).then(async res => {
      if (res.ok) {
        alert(this.isEditMode ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
        this.hienThiFormThem = false;
        this.resetForm();
        this.layDanhSach();
      } else {
        // In rõ lỗi ra để biết C# đang chê cái gì
        const err = await res.text();
        console.error('Lỗi chi tiết từ C#:', err);
        alert('C# từ chối lưu! Sếp ấn F12 qua tab Console xem chi tiết nhé.');
      }
    });
  }

  xoaDanhMuc(id: string, ten: string) {
    if (confirm(`Sếp có chắc chắn muốn xóa danh mục "${ten}"?`)) {
      fetch(`http://localhost:5237/api/DanhMucs/${id}`, { method: 'DELETE' })
      .then(async res => {
        if (res.ok) this.layDanhSach();
        else {
          const err = await res.json();
          alert('Lỗi: ' + err.message);
        }
      });
    }
  }
}