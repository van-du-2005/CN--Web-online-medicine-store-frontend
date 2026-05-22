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
        // Quận 5
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
        this.checkoutService.getCartFromBackend().subscribe({
            next: (response) => {
                if (response && response.success && response.data && response.data.items) {
                    // Map dữ liệu từ CartItemDto (Backend) sang OrderItemInterface (Frontend)
                    this.cartItems = response.data.items.map((item: any) => ({
                        maThuoc: item.maThuoc,     // ← Đổi từ maSanPham
                        tenThuoc: item.tenThuoc,   // ← Đổi từ tenSanPham
                        soLuong: item.soLuong,
                        donGia: item.gia,          // ← Đổi từ giaBan (cart trả về "gia")
                        tongTien: item.gia * item.soLuong
                        }));

                    // Tự động tính tổng tiền từ danh sách sản phẩm test
                    this.totalAmount = this.cartItems.reduce((sum, item) => sum + (item.donGia * item.soLuong), 0);
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
        const formValues = this.checkoutForm.value;

        // KIỂM TRA: Đảm bảo giỏ hàng đã được load từ Backend về thành công trước đó
        if (!this.cartItems || this.cartItems.length === 0) {
            alert('Giỏ hàng thanh toán không được để trống.');
            return;
        }

        /**
         * ĐÓNG GÓI DỮ LIỆU CHUẨN 100% THEO CHECKOUTDTO PHÍA BACKEND
         * Lưu ý: Các chữ cái đầu tiên viết thường (camelCase) vì .NET Core tự động 
         * chuyển đổi PascalCase sang camelCase khi tiếp nhận JSON từ Frontend.
         */
        const checkoutData = {
            tenNguoiMua: formValues.buyerName,
            soDienThoai: formValues.phoneNumber,
            tinh: formValues.province,
            phuong: formValues.ward,
            diaChiCuThe: formValues.specificAddress,
            tongTienThanhToan: this.totalAmount,
            phuongThucThanhToan: formValues.paymentMethod,
            
            // Danh sách sản phẩm phải khớp với cấu trúc của OrderItemDTO bên Backend
            sanPhamDaMua: this.cartItems.map(item => ({
            maThuoc: item.maThuoc,       // ← maSanPham → maThuoc
            tenThuoc: item.tenThuoc,     // ← tenSanPham → tenThuoc
            soLuong: Number(item.soLuong),
            donGia: Number(item.donGia),   // ← giaBan → donGia
            tongTien: Number(item.donGia) * Number(item.soLuong) // ← Thêm tongTien
            }))
        };

        console.log('Dữ liệu chuẩn bị gửi sang Backend:', checkoutData);

        // GỬI REQUEST SANG CONTROLLER BACKEND
        this.checkoutService.processCheckout(checkoutData).subscribe({
            next: (response) => {
                if (response.success) {
                    if (response.paymentUrl) {
                        // Nếu là ZaloPay -> Điều hướng qua cổng thanh toán
                        window.location.href = response.paymentUrl;
                    } else {
                        // Nếu là COD -> Thông báo thành công
                        alert(response.message || 'Đặt hàng thành công với hình thức COD!');
                    }
                } else {
                    alert('Thanh toán thất bại: ' + response.message);
                }
            },
            error: (err) => {
                console.error('Lỗi kết nối API Checkout:', err);
                
                // Hiển thị chi tiết lỗi cụ thể từ .NET trả về nếu có lệch kiểu dữ liệu
                if (err.error && err.error.errors) {
                    console.log('Chi tiết lỗi từ Backend:', err.error.errors);
                }
                alert('Đã xảy ra lỗi khi xử lý thanh toán. Vui lòng kiểm tra lại thông tin nhập vào!');
            }
        });
    }
}
}