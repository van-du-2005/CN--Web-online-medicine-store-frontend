import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.html',
})
export class HeaderComponent {
  searchQuery: string = '';
  menuItems = [
    { label: 'Thực phẩm chức năng', icon: '▼' },
    { label: 'Dược mỹ phẩm', icon: '▼' },
    { label: 'Thuốc', icon: '▼' },
    { label: 'Chăm sóc cá nhân', icon: '▼' },
    { label: 'Thiết bị và Vật tư y tế', icon: '▼' },
  ];

  constructor(
    private router: Router,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {

  }

  isLoggedIn(): boolean {
    return !!this.storageService.getToken();
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  navigateToCart() {
    this.router.navigate(['/cart']);
  }

  navigateToAccount() {
    this.router.navigate(['/account/profile']);
  }

  
  onSearch() {
    console.log('Searching for:', this.searchQuery);
    // Thêm logic tìm kiếm ở đây
  }
}
