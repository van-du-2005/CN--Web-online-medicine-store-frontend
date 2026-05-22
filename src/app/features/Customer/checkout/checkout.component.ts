import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
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

    provinces: any[] = [
        { id: '1', name: 'TP. Hồ Chí Minh' }
    ];

    wards: any[] = [
        // Quận 1
        { id: 'p1', name: 'Phường Sài Gòn (Quận 1)' },
        { id: 'p2', name: 'Phường Tân Định (Quận 1)' },
        { id: 'p3', name: 'Phường Bến Thành (Quận 1)' },
        { id: 'p4', name: 'Phường Cầu Ông Lãnh (Quận 1)' },
        // Quận 3
        // Quận 5 (xưa)
        { id: 'p11', name: 'Phường Chợ Quán (Quận 5)' },
        { id: 'p12', name: 'Phường An Đông (Quận 5)' },
        { id: 'p13', name: 'Phường Chợ Lớn (Quận 5)' }
    ];
    
    // Nơi lưu trữ danh sách sản phẩm và tổng tiền lấy về từ Backend
    cartItems: OrderItemInterface[] = [];
    totalAmount: number = 0;

    constructor(
        private fb: FormBuilder,
        private checkoutService: CheckoutService
    ) {}

    ngOnInit(): void {
        this.initForm();
        this.loadCartData(); // Tự động lấy dữ liệu giỏ hàng test từ Backend khi mở trang
    }

    initForm(): void {
        // Đã đồng bộ 100% khớp với formControlName bên file HTML của bạn
        this.checkoutForm = this.fb.group({
            buyerName: ['', Validators.required],
            phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
            province: ['', Validators.required],
            ward: ['', Validators.required],
            specificAddress: ['', Validators.required],
            paymentMethod: ['', Validators.required]
        });
    }

    // Hàm load dữ liệu từ giỏ hàng Backend để chuẩn bị submit
    loadCartData(): void {
        // LƯU Ý: Bạn cần đảm bảo checkoutService hoặc một CartService bên Angular 
        // có hàm gọi đến API giỏ hàng của Backend (nơi xử lý file CartService C# bạn gửi).
        // Dưới đây là logic giả định bạn lấy dữ liệu thành công từ endpoint đó:
        
        this.checkoutService.getCartFromBackend().subscribe({
            next: (data: any) => {
                if (data && data.items) {
                    // Map dữ liệu từ CartItemDto (Backend) sang OrderItemInterface (Frontend)
                    this.cartItems = data.items.map((item: any) => ({
                        maSanPham: item.maThuoc,
                        tenSanPham: item.tenThuoc,
                        soLuong: item.soLuong,
                        giaBan: item.gia,
                        hinhAnh: item.hinhAnh
                    }));

                    // Tự động tính tổng tiền từ danh sách sản phẩm test
                    this.totalAmount = this.cartItems.reduce((sum, item) => sum + (item.giaBan * item.soLuong), 0);
                }
            },
            error: (err) => {
                console.error('Không lấy được giỏ hàng từ Backend:', err);
            }
        });
    }

    selectPayment(method: string): void {
        this.checkoutForm.get('paymentMethod')?.setValue(method);
    }

    onSubmit(): void {
        if (this.checkoutForm.valid) {
            // Kiểm tra xem giỏ hàng từ Backend đã kịp load lên chưa
            if (this.cartItems.length === 0) {
                alert('Giỏ hàng trống hoặc chưa tải xong dữ liệu từ Server!');
                return;
            }

            const formValues = this.checkoutForm.value;

            // Đóng gói toàn bộ thông tin chuẩn theo cấu trúc CheckoutInterface
            const checkoutData: CheckoutInterface = {
                maKhachHang: '', // Cứ để trống, Backend sẽ tự đọc từ JWT Token [Authorize]
                tenNguoiMua: formValues.buyerName,
                soDienThoai: formValues.phoneNumber,
                tinh: formValues.province,
                phuong: formValues.ward,
                diaChiCuThe: formValues.specificAddress,
                phuongThucThanhToan: formValues.paymentMethod,
                tongTienThanhToan: this.totalAmount, // Gắn tổng tiền thực tế
                sanPhamDaMua: this.cartItems         // Gắn danh sách thuốc thực tế từ Backend
            };

            // KÍCH HOẠT TIẾN TRÌNH GỌI API ĐẾN BACKEND CONTROLLER
            this.checkoutService.processCheckout(checkoutData).subscribe({
                next: (response) => {
                    if (response.success) {
                        if (response.paymentUrl) {
                            // Nếu chọn ZaloPay thành công -> Điều hướng trình duyệt sang cổng thanh toán
                            window.location.href = response.paymentUrl;
                        } else {
                            // Nếu chọn COD thành công
                            alert(response.message || 'Đặt hàng thành công!');
                        }
                    } else {
                        alert('Xử lý thất bại: ' + response.message);
                    }
                },
                error: (err) => {
                    console.error('Lỗi kết nối API Checkout:', err);
                    alert('Đã xảy ra lỗi hệ thống khi kết nối đến Controller Backend.');
                }
            });
        }
    }
}