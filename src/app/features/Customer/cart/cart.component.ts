import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Cần để dùng routerLink
import { CartService } from './cart.service';
import { CartDto, CartItem } from './cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  
  cartData: CartDto = { items: [] };
  isLoading = false;

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.isLoading = true;
    this.cartService.getCart().subscribe({
      next: (res) => {
        if (res.success) this.cartData = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Lỗi tải giỏ hàng', err);
        this.isLoading = false;
      }
    });
  }

  // Tăng số lượng
  increase(item: CartItem) {
    const newQuantity = item.soLuong + 1;
    this.updateQuantityAPI(item.maThuoc, newQuantity, item);
  }

  // Giảm số lượng
  decrease(item: CartItem) {
    if (item.soLuong > 1) {
      const newQuantity = item.soLuong - 1;
      this.updateQuantityAPI(item.maThuoc, newQuantity, item);
    }
  }

  // Gọi API cập nhật
  private updateQuantityAPI(productId: string, quantity: number, item: CartItem) {
    this.cartService.updateQuantity(productId, quantity).subscribe({
      next: (res) => {
        if (res.success) item.soLuong = quantity; // Cập nhật lại UI nếu API báo thành công
      },
      error: (err) => alert('Cập nhật thất bại, có thể do vượt quá tồn kho.')
    });
  }

  // Xóa sản phẩm
  removeItem(productId: string) {
    if (confirm('Bạn có chắc muốn bỏ sản phẩm này khỏi giỏ hàng?')) {
      this.cartService.removeItem(productId).subscribe({
        next: (res) => {
          if (res.success) {
            // Lọc sản phẩm bị xóa khỏi mảng hiện tại để UI tự update mà không cần load lại API GetCart
            this.cartData.items = this.cartData.items.filter(i => i.maThuoc !== productId);
          }
        }
      });
    }
  }

  // Tính tổng tiền
  getTotal(): number {
    if (!this.cartData.items) return 0;
    return this.cartData.items.reduce((sum, item) => sum + (item.gia * item.soLuong), 0);
  }
}