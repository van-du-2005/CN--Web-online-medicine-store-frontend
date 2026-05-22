import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { Address } from '../models/account.model';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './addresses.component.html'
})
export class AddressesComponent implements OnInit {
  addresses: Address[] = [];
  newAddress: Address = { hoTenNguoiNhan: '', sdtNguoiNhan: '', diaChi: '', laMacDinh: false };
  
  showAddForm = false;
  isLoading = true;
  isSaving = false;
  
  successMessage = '';
  errorMessage = '';

  constructor(
    private accountService: AccountService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAddresses();
  }

  loadAddresses(): void {
    this.isLoading = true;
    this.accountService.getAddresses().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.addresses = res.data;
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.showAddForm) {
      this.newAddress = { hoTenNguoiNhan: '', sdtNguoiNhan: '', diaChi: '', laMacDinh: false };
    }
  }

  saveAddress(): void {
    if (!this.newAddress.hoTenNguoiNhan || !this.newAddress.sdtNguoiNhan || !this.newAddress.diaChi) {
      this.errorMessage = 'Vui lòng nhập đầy đủ thông tin bắt buộc (*).';
      return;
    }
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(this.newAddress.sdtNguoiNhan)) {
      this.errorMessage = 'Số điện thoại không hợp lệ.';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    this.accountService.addAddress(this.newAddress).subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res.success) {
          this.successMessage = res.message;
          this.toggleAddForm();
          this.loadAddresses();
          setTimeout(() => { this.successMessage = ''; this.cdr.detectChanges(); }, 3000);
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err.error?.message || 'Có lỗi xảy ra khi lưu địa chỉ.';
        this.cdr.detectChanges();
      }
    });
  }

  deleteAddress(id?: string): void {
    if (!id || !confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return;
    
    this.isLoading = true;
    this.accountService.deleteAddress(id).subscribe({
      next: (res) => {
        if (res.success) this.loadAddresses();
      },
      error: (err) => {
        this.isLoading = false;
        alert(err.error?.message || 'Không thể xóa địa chỉ.');
        this.cdr.detectChanges();
      }
    });
  }

  setDefault(id?: string): void {
    if (!id) return;
    this.isLoading = true;
    this.accountService.setDefaultAddress(id).subscribe({
      next: (res) => {
        if (res.success) this.loadAddresses();
      },
      error: (err) => {
        this.isLoading = false;
        alert(err.error?.message || 'Không thể đặt mặc định.');
        this.cdr.detectChanges();
      }
    });
  }
}