import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.html',
  styles: [`
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
  `]
})
export class UserManagementComponent {
  // --- TÌM KIẾM & PHÂN TRANG ---
  tuKhoaTimKiem = '';
  trangHienTai = 1;
  soNguoiTrenTrang = 5;

  // --- CÁC BIẾN TRẠNG THÁI POPUP ---
  hienThiForm = false;
  isEditMode = false;
  hienThiChiTiet = false;
  selectedUser: any = null;
  hienThiXacNhanXoa = false;
  userToDelete: any = null;

  formData: any = { hoTen: '', email: '', sdt: '', vaiTro: 'Chọn vai trò', matKhau: '' };

  // Dữ liệu mẫu (Đã tăng lên 12 người để test phân trang)
  danhSachUser = [
    { id: '1', hoTen: 'Nguyễn Văn A', avatar: 'https://placehold.co/150x150?text=A', email: 'a@gmail.com', sdt: '0912 345 678', vaiTro: 'Admin', trangThai: true },
    { id: '2', hoTen: 'Trần Thị B', avatar: 'https://placehold.co/150x150?text=B', email: 'b@gmail.com', sdt: '0987 654 321', vaiTro: 'Dược sĩ', trangThai: true },
    { id: '3', hoTen: 'Lê Văn C', avatar: 'https://placehold.co/150x150?text=C', email: 'c@gmail.com', sdt: '0909 123 456', vaiTro: 'Thu ngân', trangThai: true },
    { id: '4', hoTen: 'Phạm Văn D', avatar: 'https://placehold.co/150x150?text=D', email: 'd@gmail.com', sdt: '0934 567 890', vaiTro: 'Nhân viên kho', trangThai: true },
    { id: '5', hoTen: 'Nguyễn Văn E', avatar: 'https://placehold.co/150x150?text=E', email: 'e@gmail.com', sdt: '0922 223 333', vaiTro: 'Khách hàng', trangThai: true },
    { id: '6', hoTen: 'Hoàng Thị F', avatar: 'https://placehold.co/150x150?text=F', email: 'hoangf@gmail.com', sdt: '0911 111 222', vaiTro: 'Khách hàng', trangThai: true },
    { id: '7', hoTen: 'Đinh Văn G', avatar: 'https://placehold.co/150x150?text=G', email: 'dinhg@gmail.com', sdt: '0922 333 444', vaiTro: 'Dược sĩ', trangThai: false },
    { id: '8', hoTen: 'Vũ Thị H', avatar: 'https://placehold.co/150x150?text=H', email: 'vuh@gmail.com', sdt: '0933 444 555', vaiTro: 'Thu ngân', trangThai: true },
    { id: '9', hoTen: 'Bùi Văn I', avatar: 'https://placehold.co/150x150?text=I', email: 'buii@gmail.com', sdt: '0944 555 666', vaiTro: 'Nhân viên kho', trangThai: true },
    { id: '10', hoTen: 'Lý Thị K', avatar: 'https://placehold.co/150x150?text=K', email: 'lyk@gmail.com', sdt: '0955 666 777', vaiTro: 'Khách hàng', trangThai: true },
    { id: '11', hoTen: 'Trịnh Văn L', avatar: 'https://placehold.co/150x150?text=L', email: 'trinhl@gmail.com', sdt: '0966 777 888', vaiTro: 'Dược sĩ', trangThai: true },
    { id: '12', hoTen: 'Ngô Thị M', avatar: 'https://placehold.co/150x150?text=M', email: 'ngom@gmail.com', sdt: '0977 888 999', vaiTro: 'Khách hàng', trangThai: true }
  ];

  // --- LOGIC TÌM KIẾM & PHÂN TRANG ---

  // 1. Lọc dữ liệu theo từ khóa tìm kiếm
  get danhSachDaLoc() {
    if (!this.tuKhoaTimKiem.trim()) return this.danhSachUser;
    const tuKhoa = this.tuKhoaTimKiem.toLowerCase().trim();
    return this.danhSachUser.filter(u =>
      u.hoTen.toLowerCase().includes(tuKhoa) ||
      u.email.toLowerCase().includes(tuKhoa) ||
      u.sdt.includes(tuKhoa)
    );
  }

  // 2. Cắt danh sách để hiển thị trên 1 trang (5 người)
  get danhSachHienThi() {
    const batDau = (this.trangHienTai - 1) * this.soNguoiTrenTrang;
    return this.danhSachDaLoc.slice(batDau, batDau + this.soNguoiTrenTrang);
  }

  get tongSoTrang() {
    return Math.ceil(this.danhSachDaLoc.length / this.soNguoiTrenTrang);
  }

  get getPagesArray() {
    return Array(this.tongSoTrang).fill(0).map((x, i) => i + 1);
  }

  get textHienThi() {
    const max = this.danhSachDaLoc.length;
    if (max === 0) return 'Không có kết quả nào';
    const batDau = (this.trangHienTai - 1) * this.soNguoiTrenTrang + 1;
    const ketThuc = Math.min(this.trangHienTai * this.soNguoiTrenTrang, max);
    return `Hiển thị ${batDau} - ${ketThuc} của ${max} người dùng`;
  }

  onSearch() {
    this.trangHienTai = 1; // Reset về trang 1 khi gõ tìm kiếm
  }

  chuyenTrang(page: number) { this.trangHienTai = page; }
  trangTruoc() { if (this.trangHienTai > 1) this.trangHienTai--; }
  trangTiep() { if (this.trangHienTai < this.tongSoTrang) this.trangHienTai++; }


  // --- LOGIC POPUP & DỮ LIỆU CŨ KẾ THỪA ---

  moFormThem() {
    this.isEditMode = false;
    this.formData = { hoTen: '', email: '', sdt: '', vaiTro: 'Chọn vai trò', matKhau: '' };
    this.hienThiForm = true;
  }

  moFormSua(user: any, event: Event) {
    event.stopPropagation();
    this.isEditMode = true;
    this.formData = { ...user };
    this.hienThiForm = true;
  }

  dongForm() { this.hienThiForm = false; }

  luuTaiKhoan() {
    if (this.isEditMode) {
      const index = this.danhSachUser.findIndex(u => u.id === this.formData.id);
      if (index > -1) this.danhSachUser[index] = { ...this.formData };
    } else {
      const newUser = {
        ...this.formData,
        id: (this.danhSachUser.length + 1).toString(),
        avatar: 'https://placehold.co/150x150?text=' + this.formData.hoTen.charAt(0).toUpperCase(),
        trangThai: true
      };
      this.danhSachUser.unshift(newUser);
    }
    this.dongForm();
  }

  toggleTrangThai(user: any, event: Event) {
    event.stopPropagation();
    user.trangThai = !user.trangThai;
  }

  xacNhanXoa(user: any, event: Event) {
    event.stopPropagation();
    this.userToDelete = user;
    this.hienThiXacNhanXoa = true;
  }

  xoaNguoiDung() {
    if (this.userToDelete) {
      this.danhSachUser = this.danhSachUser.filter(u => u.id !== this.userToDelete.id);
      this.hienThiXacNhanXoa = false;
      this.userToDelete = null;
      // Quay về trang trước nếu xóa hết user ở trang cuối
      if (this.trangHienTai > this.tongSoTrang) this.trangHienTai = this.tongSoTrang || 1;
    }
  }

  huyXoa() { this.hienThiXacNhanXoa = false; }

  xemChiTiet(user: any) {
    this.selectedUser = user;
    this.hienThiChiTiet = true;
  }

  dongChiTiet() { this.hienThiChiTiet = false; }

  getRoleColor(role: string): string {
    switch (role) {
      case 'Admin': return 'text-[#8b5cf6]';
      case 'Dược sĩ': return 'text-[#3b82f6]';
      case 'Thu ngân': return 'text-[#f97316]';
      case 'Nhân viên kho': return 'text-[#14b8a6]';
      default: return 'text-gray-500';
    }
  }

  getRoleBadgeColor(role: string): string {
    switch (role) {
      case 'Admin': return 'bg-purple-100 text-purple-700';
      case 'Dược sĩ': return 'bg-blue-100 text-blue-700';
      case 'Thu ngân': return 'bg-orange-100 text-orange-700';
      case 'Nhân viên kho': return 'bg-teal-100 text-teal-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  }
}
