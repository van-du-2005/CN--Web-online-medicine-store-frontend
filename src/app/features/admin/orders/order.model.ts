export interface OrderFilterCount {
  tatCa: number;
  choXacNhan: number;
  dangXuLy: number;
  dangGiao: number;
  daGiao: number;
  daHuy: number;
}

export interface OrderListItem {
  maDonHang: string;
  maDonCode: string;
  tenKhachHang: string;
  ngayDatFormat: string;
  tongTien: number;
  trangThai: string;
  trangThaiLabel: string;
  colorCode: string;
}

export interface OrderItem {
  stt: number;
  tenThuoc: string;
  hinhAnh: string;
  donGia: number;
  soLuong: number;
  thanhTien: number;
}

export interface OrderDetail {
  maDonHang: string;
  maDonCode: string;
  ngayDatFormat: string;
  hoTen: string;
  soDienThoai: string;
  diaChi: string;
  trangThai: string;
  phuongThucThanhToan: string;
  tamTinh: number;
  phiVanChuyen: number;
  giamGia: number;
  tongTien: number;
  sanPhams: OrderItem[];
}

export interface PagedOrderResult {
  items: OrderListItem[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}