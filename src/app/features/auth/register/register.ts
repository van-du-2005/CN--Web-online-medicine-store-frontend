import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { RegisterStateService } from '../states/register-state.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './register.html',
})
export class RegisterComponent {
  formData = {
    hoTen: '',
    tenDangNhap: '',
    soDienThoai: '',
    email: '',
    matKhau: '',
  };

  showPassword = false;
  strengthPct = 0;
  strengthColor = '#f1f5f9';
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private registerState: RegisterStateService,
    private cdr: ChangeDetectorRef,
  ) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  checkStrength(event: any): void {
    const val = event.target.value;
    let strength = 0;
    if (val.length >= 6) strength++;
    if (val.length >= 10) strength++;
    if (/[A-Z]/.test(val)) strength++;
    if (/[0-9]/.test(val)) strength++;
    if (/[^A-Za-z0-9]/.test(val)) strength++;

    this.strengthPct = (strength / 5) * 100;
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'];
    this.strengthColor = strength === 0 ? '#f1f5f9' : colors[strength - 1];
  }

  onSubmit(): void {
    this.errorMessage = '';

    // Kiểm tra không được để trống bất kỳ trường nào
    if (
      !this.formData.hoTen.trim() ||
      !this.formData.tenDangNhap.trim() ||
      !this.formData.soDienThoai.trim() ||
      !this.formData.email.trim() ||
      !this.formData.matKhau.trim()
    ) {
      this.errorMessage = 'Vui lòng điền đầy đủ tất cả các trường dữ liệu bắt buộc.';
      return;
    }

    // Validate Số điện thoại bắt buộc 10 số và bắt đầu bằng số 0
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(this.formData.soDienThoai)) {
      this.errorMessage =
        'Số điện thoại không hợp lệ. Phải bao gồm chính xác 10 chữ số và bắt đầu bằng số 0.';
      return;
    }

    // Validate định dạng Email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(this.formData.email)) {
      this.errorMessage = 'Định dạng địa chỉ Email không chính xác. Vui lòng kiểm tra lại.';
      return;
    }

    this.isLoading = true;

    // Gọi API gửi yêu cầu tạo tài khoản và gửi mã OTP về Email
    this.authService.register(this.formData).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.registerState.setEmail(this.formData.email);
          this.router.navigate(['/auth/verify-otp']);
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;

        if (err.status === 500) {
          this.errorMessage =
            'Hệ thống máy chủ đang gặp sự cố (Lỗi 500). Vui lòng kiểm tra lại Terminal Backend.';
        } else if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        }
        //
        else if (err.error && err.error.errors) {
          const firstErrorKey = Object.keys(err.error.errors)[0];
          this.errorMessage = err.error.errors[firstErrorKey][0];
        } else {
          this.errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.';
        }
        this.cdr.detectChanges();
      },
    });
  }
}
