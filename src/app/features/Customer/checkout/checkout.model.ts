export interface OrderItemInterface {
    maSanPham: string;
    tenSanPham: string;
    soLuong: number;
    giaBan: number;   
    hinhAnh?: string;
}

export interface CheckoutInterface {
    maKhachHang: string;
    tenNguoiMua: string;
    soDienThoai: string;
    tinh: string;
    phuong: string;
    diaChiCuThe: string;
    tongTienThanhToan: number;
    phuongThucThanhToan: string;
    sanPhamDaMua: OrderItemInterface[];
}