import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { UserProfile, ChangePassword } from '../models/account.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  profile: UserProfile = { hoTen: '', hangThanhVien: '', diemTichLuy: 0 };
  passwordData: ChangePassword = { matKhauCu: '', matKhauMoi: '' };
  xacNhanMatKhau = '';

  isEditMode = false;
  showPasswordSection = false;
  
  isLoading = true;
  isSaving = false;
  
  successMessage = '';
  errorMessage = '';
  passSuccessMessage = '';
  passErrorMessage = '';

  constructor(
    private accountService: AccountService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.accountService.getProfile().subscribe({
      next: (res) => {
        if (res.success && res.data) this.profile = res.data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Không thể tải thông tin. Vui lòng thử lại sau.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleEdit(): void {
    this.isEditMode = !this.isEditMode;
    this.successMessage = '';
    this.errorMessage = '';
  }

  togglePasswordSection(): void {
    this.showPasswordSection = !this.showPasswordSection;
    this.passErrorMessage = '';
    this.passSuccessMessage = '';
  }

  saveProfile(): void {
    if (!this.profile.hoTen.trim()) {
      this.errorMessage = 'Họ tên không được để trống.';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    
    this.accountService.updateProfile(this.profile).subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res.success) {
          this.successMessage = res.message;
          this.isEditMode = false;
          // Thông báo thành công tự tắt sau 3s
          setTimeout(() => { this.successMessage = ''; this.cdr.detectChanges(); }, 3000);
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err.error?.message || 'Có lỗi xảy ra khi lưu thông tin.';
        this.cdr.detectChanges();
      }
    });
  }

  changePassword(): void {
    this.passErrorMessage = '';
    this.passSuccessMessage = '';

    if (!this.passwordData.matKhauCu || !this.passwordData.matKhauMoi || !this.xacNhanMatKhau) {
      this.passErrorMessage = 'Vui lòng điền đầy đủ các trường mật khẩu.';
      return;
    }
    if (this.passwordData.matKhauMoi.length < 6) {
      this.passErrorMessage = 'Mật khẩu mới phải có ít nhất 6 ký tự.';
      return;
    }
    if (this.passwordData.matKhauMoi !== this.xacNhanMatKhau) {
      this.passErrorMessage = 'Xác nhận mật khẩu không khớp.';
      return;
    }

    this.isSaving = true;
    this.accountService.changePassword(this.passwordData).subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res.success) {
          this.passSuccessMessage = res.message;
          this.passwordData = { matKhauCu: '', matKhauMoi: '' };
          this.xacNhanMatKhau = '';
          this.showPasswordSection = false;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSaving = false;
        this.passErrorMessage = err.error?.message || 'Không thể đổi mật khẩu.';
        this.cdr.detectChanges();
      }
    });
  }
}