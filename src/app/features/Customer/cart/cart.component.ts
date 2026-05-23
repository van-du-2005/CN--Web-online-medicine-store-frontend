import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from './cart.service';
import { CartDto, CartItem } from './cart.model';

export interface CartItemUI extends CartItem {
  selected?: boolean;
}

export interface CartDtoUI {
  items: CartItemUI[];
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  
  cartData: CartDtoUI = { items: [] };
  isLoading = true;

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
  this.isLoading = true;
  
  this.cartService.getCart().subscribe({
    next: (res) => {    
      this.cartData = {
        items: (res?.data?.items || []).map((item: CartItem) => ({
          ...item,
          selected: true
        }))
      };
      this.isLoading = false;
      this.cdr.detectChanges();
    },
    error: (err) => {
      this.cartData = { items: [] };
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  });
}

  // Chuyển đến trang checkout
  proceedToCheckout() {
    const selectedItems = this.cartData.items.filter(item => item.selected);
    
    if (selectedItems.length === 0) {
      alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán');
      return;
    }
    
    // Lưu dữ liệu vào session/storage để checkout component lấy
    sessionStorage.setItem('checkoutItems', JSON.stringify(selectedItems));
    
    // Navigate đến trang checkout
    this.router.navigate(['/checkout']);
  }

  // Tăng số lượng
  increase(item: CartItemUI) {
    const newQuantity = item.soLuong + 1;
    this.updateQuantityAPI(item.maThuoc, newQuantity, item);
  }

  // Giảm số lượng
  decrease(item: CartItemUI) {
    if (item.soLuong > 1) {
      const newQuantity = item.soLuong - 1;
      this.updateQuantityAPI(item.maThuoc, newQuantity, item);
    }
  }

  // Gọi API cập nhật
  private updateQuantityAPI(productId: string, quantity: number, item: CartItemUI) {
    this.cartService.updateQuantity(productId, quantity).subscribe({
      next: (res) => {
        if (res.success) {
          item.soLuong = quantity;
          this.cdr.detectChanges();
        }
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
            this.cdr.detectChanges();
          }
        }
      });
    }
  }

  //Trạng thái nút "Chọn tất cả"
  isAllSelected(): boolean {
    if(!this.cartData.items || this.cartData.items.length === 0) return false;
    return this.cartData.items.every(item => item.selected);
  }

  // Chọn tất cả
  toggleAll(event: any) {
    const isChecked = event.target.checked;
    this.cartData.items.forEach(item => item.selected = isChecked);
  }

  // Tính tổng tiền
  getTotal(): number {
    if (!this.cartData.items) return 0;
    return this.cartData.items.reduce((sum, item) => sum + (item.gia * item.soLuong), 0);
  }
}