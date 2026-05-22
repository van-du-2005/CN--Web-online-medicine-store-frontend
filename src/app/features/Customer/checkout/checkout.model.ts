export interface OrderItemInterface {
  maThuoc: string;
  tenThuoc: string;
  soLuong: number;
  donGia: number;
  tongTien: number;
}

export interface CheckoutInterface {
    maKhachHang?: string;
    tenNguoiMua: string;
    soDienThoai: string;
    tinh: string;
    phuong: string;
    diaChiCuThe: string;
    tongTienThanhToan: number;
    phuongThucThanhToan: string;
    sanPhamDaMua: OrderItemInterface[];
}