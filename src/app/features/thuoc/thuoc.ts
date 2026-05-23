import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-thuoc',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './thuoc.html',
  styleUrl: './thuoc.css'
})
export class Thuoc implements OnInit {
  danhSachThuocGoc: any[] = [];
  danhSachHienThi: any[] = [];
  
  totalThuoc: number = 0;
  sapHetHang: number = 0;
  hetHang: number = 0;

  tuKhoaTimKiem: string = '';
  trangThaiLoc: string = '';
  danhMucLoc: string = '';

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.layDanhSachThuoc();
  }

  layDanhSachThuoc() {
    fetch('http://localhost:5237/api/Thuocs')
      .then(res => res.json())
      .then(data => {
        this.danhSachThuocGoc = data;
        this.danhSachHienThi = data;
        
        this.totalThuoc = data.length;
        this.sapHetHang = data.filter((t: any) => t.tonKhoHienTai > 0 && t.tonKhoHienTai <= 10).length;
        this.hetHang = data.filter((t: any) => t.tonKhoHienTai <= 0).length;

        this.cdr.detectChanges();
      })
      .catch(err => console.error('==== LỖI KẾT NỐI ====', err));
  }

  locDuLieu() {
    this.danhSachHienThi = this.danhSachThuocGoc.filter(item => {
      // 1. Lọc theo Tên thuốc
      let thoaManTen = item.tenThuoc.toLowerCase().includes(this.tuKhoaTimKiem.toLowerCase());
      
      // 2. Lọc theo Trạng thái tồn kho
      let thoaManTrangThai = true;
      if (this.trangThaiLoc === 'conhang') thoaManTrangThai = item.tonKhoHienTai > 10;
      if (this.trangThaiLoc === 'saphethang') thoaManTrangThai = item.tonKhoHienTai > 0 && item.tonKhoHienTai <= 10;
      if (this.trangThaiLoc === 'hethang') thoaManTrangThai = item.tonKhoHienTai <= 0;

      // 3. Lọc theo Danh mục
      let thoaManDanhMuc = true;
      // Nếu có chọn một danh mục cụ thể, thì đem so mã Guid
      if (this.danhMucLoc !== '') {
        thoaManDanhMuc = item.maDanhMuc?.toLowerCase() === this.danhMucLoc.toLowerCase();
      }

      // Thuốc nào thỏa mãn cả 3 điều kiện trên thì mới cho hiện ra bảng
      return thoaManTen && thoaManTrangThai && thoaManDanhMuc;
    });
  }
  xoaThuoc(id: string, tenThuoc: string) {
    if (confirm(`Sếp có chắc chắn muốn xóa thuốc "${tenThuoc}" này không?`)) {
      fetch(`http://localhost:5237/api/Thuocs/${id}`, {
        method: 'DELETE'
      })
      .then(async (res) => {
        if (res.ok) {
          this.layDanhSachThuoc();
        } else {
          const errText = await res.text();
          try {
            const errJson = JSON.parse(errText);
            alert('Lỗi: ' + errJson.message);
          } catch {
            alert('Không xóa được sếp ơi! Thuốc này đang bị ràng buộc dữ liệu.');
          }
        }
      })
      .catch(err => console.error('==== LỖI API XÓA ====', err));
    }
  }

  // ==========================================
  // PHẦN XỬ LÝ THÊM THUỐC MỚI KÈM HÌNH ẢNH
  // ==========================================
  // ==========================================
  // PHẦN XỬ LÝ THÊM & SỬA THUỐC
  // ==========================================
  hienThiFormThem: boolean = false; 
  isEditMode: boolean = false; // Phân biệt đang Thêm hay Sửa
  
  thuocMoi: any = {
    tenThuoc: '', tenKhoaHoc: '', maDanhMuc: '', loaiThuoc: '', 
    moTa: '', huongDanSuDung: '', giaBan: 0, tonKhoHienTai: 0
  };

  selectedFile: File | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;

  toggleFormThem() {
    this.hienThiFormThem = !this.hienThiFormThem;
    if (!this.hienThiFormThem) {
      this.resetForm(); // Đóng form thì dọn dẹp sạch sẽ
    } else {
      this.isEditMode = false; // Mở lên mặc định là Thêm mới
    }
  }

  // Hàm dọn dẹp Form
  resetForm() {
    this.thuocMoi = { tenThuoc: '', tenKhoaHoc: '', maDanhMuc: '', loaiThuoc: '', moTa: '', huongDanSuDung: '', giaBan: 0, tonKhoHienTai: 0 };
    this.selectedFile = null;
    this.imagePreviewUrl = null;
    this.isEditMode = false;
  }

  // Hàm Bấm nút Sửa ở bảng
  moFormSua(item: any) {
    this.isEditMode = true;
    this.hienThiFormThem = true;
    
    // Copy toàn bộ dữ liệu của viên thuốc này thả vào form
    this.thuocMoi = { ...item };
    
    // Hiện ảnh cũ lên preview (nếu có)
    if (item.hinhAnh) {
      this.imagePreviewUrl = 'http://localhost:5237' + item.hinhAnh;
    } else {
      this.imagePreviewUrl = null;
    }
    
    // Tự động cuộn trang lên chỗ cái form cho mượt
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = e => this.imagePreviewUrl = reader.result;
      reader.readAsDataURL(file);
    }
  }

  // Hàm Lưu (Dùng chung cho cả Thêm và Sửa)
  luuThuoc() {
    const formData = new FormData();
    if (this.thuocMoi.maThuoc) formData.append('MaThuoc', this.thuocMoi.maThuoc); // Sửa thì phải gửi ID lên
    
    formData.append('TenThuoc', this.thuocMoi.tenThuoc);
    formData.append('MaDanhMuc', this.thuocMoi.maDanhMuc);
    formData.append('GiaBan', this.thuocMoi.giaBan.toString());
    formData.append('TonKhoHienTai', this.thuocMoi.tonKhoHienTai.toString());
    
    if (this.thuocMoi.tenKhoaHoc) formData.append('TenKhoaHoc', this.thuocMoi.tenKhoaHoc);
    if (this.thuocMoi.loaiThuoc) formData.append('LoaiThuoc', this.thuocMoi.loaiThuoc);
    if (this.thuocMoi.moTa) formData.append('MoTa', this.thuocMoi.moTa);
    if (this.thuocMoi.huongDanSuDung) formData.append('HuongDanSuDung', this.thuocMoi.huongDanSuDung);
    
    if (this.selectedFile) formData.append('imageFile', this.selectedFile);

    // KIỂM TRA: Nếu đang Sửa thì dùng PUT kèm ID, Nếu Thêm thì dùng POST
    const url = this.isEditMode 
      ? `http://localhost:5237/api/Thuocs/${this.thuocMoi.maThuoc}` 
      : 'http://localhost:5237/api/Thuocs';
      
    const method = this.isEditMode ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      body: formData 
    })
    .then(async (res) => {
      if (res.ok) {
        alert(this.isEditMode ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
        this.hienThiFormThem = false;
        this.resetForm();
        this.layDanhSachThuoc(); 
      } else {
        const err = await res.text();
        console.error('Lỗi API:', err);
        alert('Backend báo lỗi rồi sếp ơi!');
      }
    })
    .catch(err => console.error('==== LỖI KẾT NỐI ====', err));
  }
}

