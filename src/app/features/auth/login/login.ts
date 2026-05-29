import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../services/auth.service';
import { StorageService } from '../../../services/storage.service';

declare var google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.html',
})
export class LoginComponent implements OnInit {
  formData = { tenDangNhap: '', matKhau: '' };
  showPassword = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.initGoogleLogin();
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.formData.tenDangNhap.trim() || !this.formData.matKhau.trim()) {
      this.errorMessage = 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.';
      return;
    }

    this.isLoading = true;

    this.authService.login(this.formData).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.data) {
          this.storageService.setToken(res.data);

          if (res.role === 'Admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['account/profile']);
          }
        }
        // Ép Angular vẽ lại giao diện (Tắt vòng xoay)
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;

        if (err.status === 500) {
          this.errorMessage = 'Hệ thống đang bảo trì, vui lòng thử lại sau.';
        } else if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else if (err.error && err.error.errors) {
          const firstErrorKey = Object.keys(err.error.errors)[0];
          this.errorMessage = err.error.errors[firstErrorKey][0];
        } else {
          this.errorMessage = 'Đăng nhập thất bại. Vui lòng kiểm tra lại kết nối.';
        }

        // VŨ KHÍ TỐI THƯỢNG: Ép Angular vẽ lại giao diện để hiện thông báo đỏ ngay lập tức
        this.cdr.detectChanges();
      },
    });
  }

  private initGoogleLogin(): void {
    if (typeof google !== 'undefined') {
      google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: this.handleGoogleCallback.bind(this),
      });

      // Render nút bấm chuẩn của Google
      google.accounts.id.renderButton(document.getElementById('googleBtnContainer'), {
        theme: 'outline',
        size: 'large',
        width: '100%',
        shape: 'rectangular',
      });
    }
  }

  private handleGoogleCallback(response: any): void {
    if (response.credential) {
      const dto = { token: response.credential };

      this.authService.loginWithGoogle(dto).subscribe({
        next: (res) => {
          //  bọc trong ngZone vì sự kiện này được kích hoạt từ bên ngoài Angular (từ Iframe của Google)
          this.ngZone.run(() => {
            if (res.success && res.data) {
              //Lưu JWT vào Cookie
              this.storageService.setToken(res.data);

              //  Điều hướng dựa trên Role
              if (res.role === 'Admin') {
                this.router.navigate(['/admin']);
              } else {
                this.router.navigate(['account/profile']);
              }
            }
          });
        },
        error: (err) => {
          this.ngZone.run(() => {
            alert(err.error?.message || 'Đăng nhập Google thất bại!');
          });
        },
      });
    }
  }
}
