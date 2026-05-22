import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterModule, Router } from '@angular/router'; 
import { AuthService } from '../../../services/auth.service';
import { RegisterStateService } from '../states/register-state.service';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './verify-otp.html'
})
export class VerifyOtpComponent implements OnInit, OnDestroy {
  otpValues: string[] = ['', '', '', '', '', ''];
  countdown = 60;
  timerInterval: any;
  email = '';
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private registerState: RegisterStateService
  ) {}

  ngOnInit(): void {
    const savedEmail = this.registerState.getEmail();
    
    // Nếu cố ý gõ bậy URL mà chưa qua form đăng ký -> Trả ngược về trang Register ngay lập tức
    if (!savedEmail) {
      this.router.navigate(['/auth/register']);
      return;
    }
    
    this.email = savedEmail;
    this.startCountdown(); 
  }

  ngOnDestroy(): void {
    // Xóa interval tránh hiện tượng rò rỉ bộ nhớ (Memory Leak)
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  startCountdown(): void {
    this.countdown = 60;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    
    this.timerInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.timerInterval);
        this.handleTimeout();
      }
    }, 1000);
  }

  handleTimeout(): void {
    alert('Thời gian xác thực 60 giây đã kết thúc! Vui lòng thực hiện đăng ký lại từ đầu.');
    this.registerState.clear();
    this.router.navigate(['/auth/register']);
  }

  resendOtp(): void {
    this.errorMessage = '';
    this.isLoading = true;

    // Tận dụng lại chính dữ liệu tạm thời để gửi lại mã mà không làm mất thời gian của khách hàng
    this.authService.register({ email: this.email, hoTen: 'Resend', tenDangNhap: 'dummy', soDienThoai: '0000000000', matKhau: 'dummy' }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.startCountdown();
          alert('Đã gửi lại mã OTP mới về hòm thư Email thành công!');
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Không thể gửi lại mã OTP lúc này.';
      }
    });
  }

  submitOtp(): void {
    const fullOtp = this.otpValues.join('');
    
    if (fullOtp.length < 6) {
      this.errorMessage = 'Vui lòng nhập đầy đủ toàn bộ 6 chữ số của mã OTP.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    this.authService.verifyOtp({ email: this.email, otp: fullOtp }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          clearInterval(this.timerInterval);
          this.registerState.clear(); // Dọn dẹp sạch state sau khi xong việc
          alert('Hệ thống xác thực thành công! Bạn có thể thực hiện đăng nhập ngay bây giờ.');
          this.router.navigate(['/auth/login']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Mã xác thực không trùng khớp.';
        
        // Trường hợp Server báo lỗi do Cache hết hạn trong lúc đang nhập bậy
        if (this.errorMessage.includes('hết hạn')) {
          clearInterval(this.timerInterval);
          this.handleTimeout();
        }
      }
    });
  }

  onInput(event: any, index: number): void {
    const val = event.target.value.replace(/\D/g, '').slice(-1);
    this.otpValues[index] = val;
    event.target.value = val;
    // Tự động nhảy sang ô tiếp theo sau khi điền xong 1 số
    if (val && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    // Tự động lùi về ô trước nếu nhấn nút Backspace xóa ký tự
    if (event.key === 'Backspace' && !this.otpValues[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const text = event.clipboardData?.getData('text').replace(/\D/g, '').slice(0, 6) || '';
    for (let i = 0; i < text.length; i++) {
      this.otpValues[i] = text[i];
      const input = document.getElementById(`otp-${i}`) as HTMLInputElement;
      if (input) input.value = text[i];
    }
    document.getElementById(`otp-${Math.min(text.length, 5)}`)?.focus();
  }
}