import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-phieunhap',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './phieunhap.html'
})
export class PhieuNhap implements OnInit {
  danhSachGoc: any[] = [];
  danhSachHienThi: any[] = [];
  danhSachPhanTrang: any[] = [];

  trangThaiLoc: string = 'TatCa';
  
  // Phân trang
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  pageNumbers: number[] = [];

  // Phiếu nhập đang được chọn để hiển thị chi tiết bên phải
  selectedPhieu: any = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.layDanhSach(); }

  layDanhSach() {
    fetch('http://localhost:5237/api/PhieuNhaps')
      .then(res => res.json())
      .then(data => {
        this.danhSachGoc = data;
        this.locDuLieu();
        
        // Nếu đang chọn 1 phiếu, cập nhật lại dữ liệu mới nhất cho nó
        if (this.selectedPhieu) {
            this.selectedPhieu = this.danhSachGoc.find(p => p.maPhieuNhap === this.selectedPhieu.maPhieuNhap);
        }
      })
      .catch(err => console.error('Lỗi API:', err));
  }

  locDuLieu() {
    if (this.trangThaiLoc === 'TatCa') {
      this.danhSachHienThi = [...this.danhSachGoc];
    } else {
      this.danhSachHienThi = this.danhSachGoc.filter(x => x.trangThai === this.trangThaiLoc);
    }
    
    this.totalPages = Math.ceil(this.danhSachHienThi.length / this.pageSize);
    if (this.totalPages === 0) this.totalPages = 1;
    if (this.currentPage > this.totalPages) this.currentPage = 1;
    
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

  // Hàm bấm vào phiếu bên trái để hiện chi tiết bên phải
  xemChiTiet(phieu: any) {
    this.selectedPhieu = phieu;
  }

  // Tiện ích để Format ID an toàn (Hỗ trợ cả Int lẫn Guid)
  formatId(id: any): string {
    if (!id) return '';
    let str = id.toString();
    return str.length < 6 ? str.padStart(6, '0') : str.substring(0, 6).toUpperCase();
  }

  capNhatTrangThai(id: string, trangThai: string) {
    let hanhDong = trangThai === 'DaDuyet' ? 'PHÊ DUYỆT' : 'TỪ CHỐI';
    if (!confirm(`Bạn có chắc chắn muốn ${hanhDong} phiếu nhập này?`)) return;

    fetch(`http://localhost:5237/api/PhieuNhaps/${id}/trangthai?trangThai=${trangThai}`, {
      method: 'POST'
    }).then(res => {
      if (res.ok) {
        alert('Cập nhật thành công!');
        this.layDanhSach(); // Refresh lại danh sách
      } else alert('Lỗi không thể cập nhật!');
    });
  }
}