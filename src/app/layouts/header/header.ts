import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
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

  onSearch() {
    console.log('Searching for:', this.searchQuery);
    // Thêm logic tìm kiếm ở đây
  }
}
