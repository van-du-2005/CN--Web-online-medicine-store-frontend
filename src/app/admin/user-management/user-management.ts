import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-management.html',
  styles: [`
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class UserManagementComponent {
  hienThiForm = false;

  // Dữ liệu mẫu để giao diện có cái hiển thị lên chấm điểm
  danhSachUser = [
    { id: '1', hoTen: 'Nguyễn Văn A', avatar: 'https://placehold.co/150x150?text=A', email: 'a@gmail.com', sdt: '0912 345 678', vaiTro: 'Admin', trangThai: true },
    { id: '2', hoTen: 'Trần Thị B', avatar: 'https://placehold.co/150x150?text=B', email: 'b@gmail.com', sdt: '0987 654 321', vaiTro: 'Dược sĩ', trangThai: true },
    { id: '3', hoTen: 'Lê Văn C', avatar: 'https://placehold.co/150x150?text=C', email: 'c@gmail.com', sdt: '0909 123 456', vaiTro: 'Thu ngân', trangThai: true },
    { id: '4', hoTen: 'Phạm Văn D', avatar: 'https://placehold.co/150x150?text=D', email: 'd@gmail.com', sdt: '0934 567 890', vaiTro: 'Nhân viên kho', trangThai: true },
    { id: '5', hoTen: 'Nguyễn Văn E', avatar: 'https://placehold.co/150x150?text=E', email: 'e@gmail.com', sdt: '0922 223 333', vaiTro: 'Khách hàng', trangThai: true },
  ];

  moFormThem() { this.hienThiForm = true; }
  dongForm() { this.hienThiForm = false; }

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
