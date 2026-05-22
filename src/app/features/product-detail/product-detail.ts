import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../Customer/cart/cart.service';
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-detail.html'
})
export class ProductDetailComponent implements OnInit {
  thuoc: any = null;
  isLoading = true;
  soLuong = 1; // 1. Khai báo biến lưu Số lượng mua (Mặc định là 1)

  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private cartService = inject(CartService);
  private router = inject(Router);

  ngOnInit(): void {
    const maThuoc = this.route.snapshot.paramMap.get('id');

    if (maThuoc) {
      this.http.get(`http://localhost:5237/api/Thuoc/${maThuoc}`).subscribe({
        next: (data) => {
          this.thuoc = data;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Lỗi khi lấy chi tiết thuốc', err);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  // 2. Hàm Tăng số lượng
  tangSoLuong() {
    this.soLuong++;
  }

  // 3. Hàm Giảm số lượng (Không cho giảm dưới 1)
  giamSoLuong() {
    if (this.soLuong > 1) {
      this.soLuong--;
    }
  }

  // 4. Hàm "che giấu" cái mã ID dài ngoằng của Danh Mục
  getTenDanhMuc(maDanhMuc: string): string {

    if (!maDanhMuc) return 'Chưa cập nhật';
    // Nếu phát hiện nó là cái mã ID (dài hơn 20 ký tự), thì tự động hiển thị chữ đẹp
    if (maDanhMuc.length > 20) return 'Thuốc & Thực phẩm chức năng';
    return maDanhMuc;

  }
  kiemTraSoLuongInput(event: any) {
    let value = parseInt(event.target.value);

    // Nếu gõ số âm, gõ chữ (NaN) hoặc để trống thì tự động đưa về 1
    if (isNaN(value) || value < 1) {
      this.soLuong = 1;
    } else {
      this.soLuong = value;
    }
  }

  // Thêm sản phẩm vào giỏ hàng
  themVaoGioHang() {
    if (!this.thuoc || !this.thuoc.maThuoc) {
      alert('Không thể thêm sản phẩm này vào giỏ hàng');
      return;
    }

    this.cartService.addToCart(this.thuoc.maThuoc, this.soLuong).subscribe({
      next: (res) => {
        if (res.success) {
          alert(`Đã thêm ${this.soLuong} ${this.thuoc.tenThuoc} vào giỏ hàng`);
          this.soLuong = 1; // Reset số lượng
        } else {
          alert(res.message || 'Thêm vào giỏ hàng thất bại');
        }
      },
      error: (err) => {
        console.error('Lỗi thêm vào giỏ hàng:', err);
        alert('Lỗi: Không thể thêm vào giỏ hàng. Vui lòng đăng nhập hoặc thử lại.');
      }
    });
  }

  // Mua ngay: Thêm vào giỏ hàng rồi chuyển sang checkout
  muaNgay() {
    if (!this.thuoc || !this.thuoc.maThuoc) {
      alert('Không thể mua sản phẩm này');
      return;
    }

    // Lưu sản phẩm hiện tại vào sessionStorage cho checkout page
    const cartItem = {
      maThuoc: this.thuoc.maThuoc,
      tenThuoc: this.thuoc.tenThuoc,
      soLuong: this.soLuong,
      gia: this.thuoc.giaBan,
      hinhAnh: this.thuoc.hinhAnh
    };

    sessionStorage.setItem('checkoutItems', JSON.stringify([cartItem]));
    // Chuyển sang trang checkout
    this.router.navigate(['/checkout']);
  }
}
