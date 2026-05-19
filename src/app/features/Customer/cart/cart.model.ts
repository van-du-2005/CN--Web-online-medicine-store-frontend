export interface CartItem {
  maThuoc: string;
  tenThuoc: string;
  hinhAnh: string;
  gia: number;
  soLuong: number;
}

export interface CartDto {
  items: CartItem[];
  totalPrice?: number;
}