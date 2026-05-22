export interface UserProfile {
  hoTen: string;
  soDienThoai?: string;
  email?: string;
  ngaySinh?: string; // Định dạng YYYY-MM-DD
  gioiTinh?: boolean;
  diaChi?: string;
  hangThanhVien: string;
  diemTichLuy: number;
}

export interface ChangePassword {
  matKhauCu: string;
  matKhauMoi: string;
}

export interface Address {
  maDiaChi?: string;
  hoTenNguoiNhan: string;
  sdtNguoiNhan: string;
  diaChi: string;
  laMacDinh: boolean;
}

export interface OrderDetail {
  tenThuoc: string;
  hinhAnh?: string;
  soLuong: number;
  donGia: number;
}

export interface OrderHistory {
  maDonHang: string;
  ngayDat: string;
  trangThai: string;
  thanhToan: number;
  chiTiet: OrderDetail[];
}
