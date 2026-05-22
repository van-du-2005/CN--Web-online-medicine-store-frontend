import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../services/user.service'; // Import Service

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
export class UserManagementComponent implements OnInit {
  // Nhúng UserService vào
  private userService = inject(UserService);

  // Mảng rỗng sẽ được lấp đầy bằng dữ liệu từ Database
  danhSachUser: User[] = [];

  // --- TÌM KIẾM & PHÂN TRANG ---
  tuKhoaTimKiem = '';
  trangHienTai = 1;
  soNguoiTrenTrang = 5;

  // --- CÁC BIẾN TRẠNG THÁI POPUP ---
  hienThiForm = false;
  isEditMode = false;
  hienThiChiTiet = false;
  selectedUser: User | null = null;
  hienThiXacNhanXoa = false;
  userToDelete: User | null = null;

  formData: any = { hoTen: '', email: '', sdt: '', vaiTro: 'Chọn vai trò', matKhau: '' };

  // Hàm chạy ngay khi vừa vào trang Admin
  ngOnInit() {
    this.loadUsers();
  }

  // ==========================================
  // LOGIC GỌI API BACKEND
  // ==========================================

  // Lấy danh sách người dùng
  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.danhSachUser = data;
      },
      error: (err) => console.error('Lỗi khi tải dữ liệu người dùng:', err)
    });
  }

  // Thêm hoặc Cập nhật tài khoản
  luuTaiKhoan() {
    if (this.isEditMode && this.formData.id) {
      this.userService.updateUser(this.formData.id, this.formData).subscribe({
        next: () => {
          this.loadUsers(); // Cập nhật xong thì tải lại bảng
          this.dongForm();
        },
        error: (err) => alert('Có lỗi khi cập nhật tài khoản!')
      });
    } else {
      this.userService.addUser(this.formData).subscribe({
        next: () => {
          this.loadUsers(); // Thêm xong thì tải lại bảng
          this.dongForm();
        },
        error: (err) => alert('Có lỗi khi thêm tài khoản mới!')
      });
    }
  }

  // Khóa / Mở khóa tài khoản
  toggleTrangThai(user: User, event: Event) {
    event.stopPropagation();
    this.userService.toggleStatus(user.id).subscribe({
      next: () => this.loadUsers(),
      error: (err) => alert('Lỗi khi thay đổi trạng thái!')
    });
  }

  // Xóa tài khoản
  xoaNguoiDung() {
    if (this.userToDelete) {
      this.userService.deleteUser(this.userToDelete.id).subscribe({
        next: () => {
          this.loadUsers();
          this.hienThiXacNhanXoa = false;
          this.userToDelete = null;
          // Lùi về trang trước nếu lỡ xóa hết người ở trang cuối
          if (this.trangHienTai > this.tongSoTrang) this.trangHienTai = this.tongSoTrang || 1;
        },
        error: (err) => alert('Lỗi khi xóa người dùng!')
      });
    }
  }


  // ==========================================
  // LOGIC TÌM KIẾM & PHÂN TRANG (GIỮ NGUYÊN)
  // ==========================================

  get danhSachDaLoc() {
    if (!this.tuKhoaTimKiem.trim()) return this.danhSachUser;
    const tuKhoa = this.tuKhoaTimKiem.toLowerCase().trim();
    return this.danhSachUser.filter(u =>
      (u.hoTen && u.hoTen.toLowerCase().includes(tuKhoa)) ||
      (u.email && u.email.toLowerCase().includes(tuKhoa)) ||
      (u.sdt && u.sdt.includes(tuKhoa))
    );
  }

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

  onSearch() { this.trangHienTai = 1; }
  chuyenTrang(page: number) { this.trangHienTai = page; }
  trangTruoc() { if (this.trangHienTai > 1) this.trangHienTai--; }
  trangTiep() { if (this.trangHienTai < this.tongSoTrang) this.trangHienTai++; }

  // ==========================================
  // LOGIC GIAO DIỆN POPUP VÀ MÀU SẮC (GIỮ NGUYÊN)
  // ==========================================

  moFormThem() {
    this.isEditMode = false;
    this.formData = { hoTen: '', email: '', sdt: '', vaiTro: 'Chọn vai trò', matKhau: '' };
    this.hienThiForm = true;
  }

  moFormSua(user: User, event: Event) {
    event.stopPropagation();
    this.isEditMode = true;
    this.formData = { ...user };
    this.hienThiForm = true;
  }

  dongForm() { this.hienThiForm = false; }

  xacNhanXoa(user: User, event: Event) {
    event.stopPropagation();
    this.userToDelete = user;
    this.hienThiXacNhanXoa = true;
  }

  huyXoa() { this.hienThiXacNhanXoa = false; }
  xemChiTiet(user: User) { this.selectedUser = user; this.hienThiChiTiet = true; }
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
