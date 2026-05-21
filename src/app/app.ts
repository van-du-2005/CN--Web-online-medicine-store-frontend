import { Component, inject } from '@angular/core';
import { RouterOutlet, Router, RouterLink } from '@angular/router'; // Đã thêm RouterLink
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  // Phải khai báo RouterLink vào đây thì app.html mới dùng được lệnh chuyển trang
  imports: [RouterOutlet, FormsModule, RouterLink],
  templateUrl: './app.html'
})
export class AppComponent {
  tuKhoaTimKiem = '';
  private router = inject(Router);

  // Hàm xử lý khi người dùng bấm Tìm kiếm
  timKiem() {
    if (this.tuKhoaTimKiem.trim()) {
      this.router.navigate(['/category'], { queryParams: { search: this.tuKhoaTimKiem } });
    }
  }
}
