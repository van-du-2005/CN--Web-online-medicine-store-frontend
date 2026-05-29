export interface SummaryCards {
  doanhThu: number;
  tongDonHang: number;
  khachHangMoi: number;
  sanPhamDaBan: number;
}

export interface OrderStatusChart {
  labels: string[];
  data: number[];
}

export interface TopProduct {
  stt: number;
  maThuoc: string;
  tenThuoc: string;
  hinhAnh: string;
  soLuongBan: number;
  doanhThu: number;
}

export interface TopCustomer {
  stt: number;
  hoTen: string;
  soDon: number;
  tongTien: number;
}

export interface LowStock {
  maThuoc: string;
  tenThuoc: string;
  tonKhoHienTai: number;
  hinhAnh: string;
}

export interface PagedResult<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}