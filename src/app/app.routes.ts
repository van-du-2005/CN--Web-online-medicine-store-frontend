import { Routes } from '@angular/router';

// Nhập khẩu 2 giao diện anh em mình đã làm
import { Thuoc } from './features/thuoc/thuoc';
import { DanhMuc } from './features/danhmuc/danhmuc';
import { NhaCungCap } from './features/nhacungcap/nhacungcap';
import { PhieuNhap } from './features/phieunhap/phieunhap';
export const routes: Routes = [
  // 1. Nếu vô trang chủ (localhost:4200), tự động đẩy sang trang Thuốc
  { path: '', redirectTo: 'thuoc', pathMatch: 'full' },
  
  // 2. Link localhost:4200/thuoc sẽ mở trang Quản lý Thuốc
  { path: 'thuoc', component: Thuoc },
  
  // 3. Link localhost:4200/danhmuc sẽ mở trang Quản lý Danh Mục
  { path: 'danhmuc', component: DanhMuc },
  { path: 'nhacungcap', component: NhaCungCap },
  { path: 'phieunhap', component: PhieuNhap }
];