import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CheckoutInterface, OrderItemInterface } from './checkout.model';
import { CheckoutService } from './checkout.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;

  provinces: any[] = [{ id: '1', name: 'TP. Hồ Chí Minh' }];
  wards: any[] = [
    { id: 'p1', name: 'Phường Sài Gòn (Quận 1)' },
    { id: 'p2', name: 'Phường Tân Định (Quận 1)' },
    { id: 'p3', name: 'Phường Bến Thành (Quận 1)' },
    { id: 'p4', name: 'Phường Cầu Ông Lãnh (Quận 1)' },
    { id: 'p11', name: 'Phường Chợ Quán (Quận 5)' },
    { id: 'p12', name: 'Phường An Đông (Quận 5)' },
    { id: 'p13', name: 'Phường Chợ Lớn (Quận 5)' }
  ];

  cartItems: OrderItemInterface[] = [];
  totalAmount: number = 0;
  shippingFee: number = 15000;

  constructor(
    private fb: FormBuilder,
    private checkoutService: CheckoutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCheckoutItems();
  }

  initForm(): void {
    this.checkoutForm = this.fb.group({
      buyerName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      province: ['', Validators.required],
      ward: ['', Validators.required],
      specificAddress: ['', Validators.required],
      paymentMethod: ['', Validators.required]
    });
  }

  // Đọc từ sessionStorage thay vì gọi API
  loadCheckoutItems(): void {
    const raw = sessionStorage.getItem('checkoutItems');

    if (!raw) {
      alert('Không có sản phẩm để thanh toán. Vui lòng chọn sản phẩm từ giỏ hàng.');
      this.router.navigate(['/cart']);
      return;
    }

    const selectedItems = JSON.parse(raw); // CartItemUI[]

    this.cartItems = selectedItems.map((item: any) => ({
      maThuoc: item.maThuoc,
      tenThuoc: item.tenThuoc,
      hinhAnh: item.hinhAnh || '',
      soLuong: item.soLuong,
      donGia: item.gia,
      tongTien: item.gia * item.soLuong
    }));

    this.totalAmount = this.cartItems.reduce(
      (sum, item) => sum + item.donGia * item.soLuong, 0
    );
  }

  selectPayment(method: string): void {
    this.checkoutForm.get('paymentMethod')?.setValue(method);
  }

  onSubmit(): void {
    if (this.checkoutForm.valid) {
      const formValues = this.checkoutForm.value;

      if (!this.cartItems || this.cartItems.length === 0) {
        alert('Giỏ hàng thanh toán không được để trống.');
        return;
      }

      const checkoutData = {
        tenNguoiMua: formValues.buyerName,
        soDienThoai: formValues.phoneNumber,
        tinh: formValues.province,
        phuong: formValues.ward,
        diaChiCuThe: formValues.specificAddress,
        tongTienThanhToan: this.totalAmount + this.shippingFee,
        phuongThucThanhToan: formValues.paymentMethod,
        sanPhamDaMua: this.cartItems.map(item => ({
          maThuoc: item.maThuoc,
          tenThuoc: item.tenThuoc,
          soLuong: Number(item.soLuong),
          donGia: Number(item.donGia),
          tongTien: Number(item.donGia) * Number(item.soLuong)
        }))
      };

      this.checkoutService.processCheckout(checkoutData).subscribe({
        next: (response) => {
          if (response.success) {
            sessionStorage.removeItem('checkoutItems'); // ← Xóa sau khi đặt xong
            if (response.paymentUrl) {
              window.location.href = response.paymentUrl;
            } else {
              alert(response.message || 'Đặt hàng thành công!');
              this.router.navigate(['/account/orders']);
            }
          } else {
            alert('Thanh toán thất bại: ' + response.message);
          }
        },
        error: (err) => {
          console.error('Lỗi:', err);
          if (err.error?.errors) console.log('Chi tiết lỗi:', err.error.errors);
          alert('Đã xảy ra lỗi khi xử lý thanh toán!');
        }
      });
    }
  }
}