import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nhacungcap',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nhacungcap.html',
  styleUrl: './nhacungcap.css'
})
export class NhaCungCap implements OnInit {
  danhSachGoc: any[] = [];
  danhSachHienThi: any[] = [];
  danhSachPhanTrang: any[] = [];

  tuKhoaTimKiem: string = '';
  trangThaiLoc: string = 'TatCa';

  // Biến Thống kê
  totalNcc: number = 0;
  activeNcc: number = 0;
  pausedNcc: number = 0; // DB chỉ có true/false nên Tạm ngưng tạm = 0
  stoppedNcc: number = 0;

  // Phân trang
  currentPage: number = 1;
  pageSize: number = 8; // Giống trong hình của sếp
  totalPages: number = 1;
  totalItems: number = 0;
  pageNumbers: number[] = [];

  // Quản lý Modal (Popup) bằng Angular
  hienThiModal: boolean = false;
  isEditMode: boolean = false;
  isViewMode: boolean = false;
  
  nccData: any = { maNhaCungCap: '', tenCongTy: '', nguoiLienHe: '', soDienThoai: '', email: '', diaChi: '', trangThai: true };

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.layDanhSach(); }

  layDanhSach() {
    fetch('http://localhost:5237/api/NhaCungCaps')
      .then(res => res.json())
      .then(data => {
        this.danhSachGoc = data.map((item: any) => ({ ...item, email: item.email || item.emai }));
        this.tinhThongKe();
        this.locDuLieu();
      })
      .catch(err => console.error('Lỗi API:', err));
  }

  tinhThongKe() {
    this.totalNcc = this.danhSachGoc.length;
    this.activeNcc = this.danhSachGoc.filter(x => x.trangThai === true).length;
    this.stoppedNcc = this.danhSachGoc.filter(x => x.trangThai === false).length;
    this.pausedNcc = 0;
  }

  locDuLieu() {
    this.danhSachHienThi = this.danhSachGoc.filter(item => {
      let kw = this.tuKhoaTimKiem.toLowerCase();
      let matchKeyword = !kw || 
                         item.tenCongTy?.toLowerCase().includes(kw) || 
                         item.soDienThoai?.toLowerCase().includes(kw) || 
                         item.email?.toLowerCase().includes(kw);
      
      let matchStatus = true;
      if (this.trangThaiLoc === 'HoatDong') matchStatus = item.trangThai === true;
      if (this.trangThaiLoc === 'NgungHoatDong') matchStatus = item.trangThai === false;

      return matchKeyword && matchStatus;
    });

    this.totalItems = this.danhSachHienThi.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    if (this.totalPages === 0) this.totalPages = 1;
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    
    this.pageNumbers = Array.from({length: this.totalPages}, (_, i) => i + 1);
    this.capNhatPhanTrang();
  }

  capNhatPhanTrang() {
    let start = (this.currentPage - 1) * this.pageSize;
    this.danhSachPhanTrang = this.danhSachHienThi.slice(start, start + this.pageSize);
    this.cdr.detectChanges();
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.capNhatPhanTrang();
    }
  }

  // ---- LOGIC POPUP CHUẨN ANGULAR ----
  openModal(mode: string, item?: any) {
    this.hienThiModal = true;
    if (mode === 'add') {
      this.isEditMode = false;
      this.isViewMode = false;
      this.nccData = { maNhaCungCap: '', tenCongTy: '', nguoiLienHe: '', soDienThoai: '', email: '', diaChi: '', trangThai: true };
    } else {
      this.isEditMode = (mode === 'edit');
      this.isViewMode = (mode === 'view');
      this.nccData = { ...item };
    }
  }

  closeModal() {
    this.hienThiModal = false;
  }

  luuNhaCungCap() {
    this.nccData.trangThai = (this.nccData.trangThai === true || this.nccData.trangThai === 'true');
    const duLieuGuiDi = { ...this.nccData };
    
    // Nếu Thêm mới thì xóa ID rỗng đi để C# tự tạo Guid
    if (!this.isEditMode) delete duLieuGuiDi.maNhaCungCap;

    const url = this.isEditMode ? `http://localhost:5237/api/NhaCungCaps/${this.nccData.maNhaCungCap}` : 'http://localhost:5237/api/NhaCungCaps';
    const method = this.isEditMode ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(duLieuGuiDi)
    }).then(res => {
      if (res.ok) {
        alert(this.isEditMode ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
        this.closeModal();
        this.layDanhSach();
      } else alert('Lỗi lưu dữ liệu! Hãy kiểm tra lại.');
    });
  }

  xoaNhaCungCap(id: string, ten: string) {
    if (confirm(`Bạn có chắc chắn muốn xóa "${ten}"?`)) {
      fetch(`http://localhost:5237/api/NhaCungCaps/${id}`, { method: 'DELETE' })
      .then(async res => {
        if (res.ok) this.layDanhSach();
        else {
          const err = await res.json();
          alert(err.message);
        }
      });
    }
  }
}