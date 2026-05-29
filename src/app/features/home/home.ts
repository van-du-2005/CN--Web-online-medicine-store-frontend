import { Component, OnInit, inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThuocService, Thuoc } from '../../services/thuoc';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html'
})
export class HomeComponent implements OnInit, OnDestroy {
  danhSachThuoc: Thuoc[] = [];
  isLoading = true; // 1. Thêm biến cờ hiệu chờ tải dữ liệu
  activeTab = 0;

  // Countdown timer
  countdownDays = 0;
  countdownHours = 0;
  countdownMinutes = 0;
  countdownSeconds = 0;
  private countdownInterval: any;

  private thuocService = inject(ThuocService);
  private cdr = inject(ChangeDetectorRef); // 2. Công cụ ép Angular vẽ lại giao diện

  danhSachBenh = [
    { ten: 'Tay chân miệng', moTa: 'Tay chân miệng có xu hướng quay lại theo mùa, dễ bùng phát tại trường học và khu vực đông trẻ nhỏ. Trẻ dưới 5 tuổi là nhóm dễ bị ảnh hưởng và có nguy cơ lây lan nhanh.', loiKhuyen: 'Chủ động giữ vệ sinh tay và theo dõi dấu hiệu sớm là điều cần thiết. Đưa trẻ đến khám khi trẻ bỏ ăn, sốt cao khó hạ.' },
    { ten: 'Viêm não mô cầu', moTa: 'Viêm màng não do não mô cầu có dấu hiệu quay lại với nguy cơ lây lan nhanh trong cộng đồng. Trẻ nhỏ, thanh thiếu niên và người sống tập thể là nhóm dễ bị ảnh hưởng.', loiKhuyen: 'Chủ động nhận diện sớm dấu hiệu như sốt cao, cứng cổ và tiêm vắc xin đầy đủ là rất cần thiết. Đừng để đến khi bệnh diễn tiến nặng mới xử trí.' },
    { ten: 'Cúm', moTa: 'Cúm khiến cơ thể mệt mỏi, dễ đuối sức, đặc biệt ở người lớn tuổi và trẻ nhỏ. Thời tiết thay đổi là lúc virus cúm có nguy cơ bùng phát mạnh trở lại.', loiKhuyen: 'Chủ động chăm sóc sức khỏe, tăng cường đề kháng và tiêm vắc xin cúm hàng năm có thể giúp giảm nguy cơ mắc bệnh cho cả gia đình.' },
    { ten: 'Sốt xuất huyết', moTa: 'Sốt xuất huyết đang gia tăng nhanh chóng, nhiều ca trở nặng vì phát hiện trễ hoặc chủ quan. Trong gia đình, người lớn tuổi và trẻ nhỏ là những đối tượng dễ bị tổn thương nhất.', loiKhuyen: 'Đừng để đến khi sốt cao, kiệt sức mới lo bù nước hay tăng đề kháng.' }
  ];

  ngOnInit(): void {
    this.startCountdown();
    this.thuocService.getDanhSachThuoc().subscribe({
      next: (data) => {
        this.danhSachThuoc = data;
        this.isLoading = false; // Tắt cờ loading khi dữ liệu đã về
        this.cdr.detectChanges(); // 3. Báo cho Angular biết: "Vẽ lại giao diện đi, có data rồi!"
      },
      error: (err) => {
        console.error('Lỗi:', err);
        this.isLoading = false;
      }
    });
  }

  private startCountdown(): void {
    // Tính thời gian kết thúc (hôm nay lúc 24:00)
    const targetDate = new Date();
    targetDate.setHours(24, 0, 0, 0); // Nửa đêm hôm nay

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        // Flash sale đã kết thúc
        this.countdownDays = 0;
        this.countdownHours = 0;
        this.countdownMinutes = 0;
        this.countdownSeconds = 0;
        clearInterval(this.countdownInterval);
        return;
      }

      this.countdownDays = Math.floor(distance / (1000 * 60 * 60 * 24));
      this.countdownHours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.countdownMinutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      this.countdownSeconds = Math.floor((distance % (1000 * 60)) / 1000);

      this.cdr.detectChanges();
    };

    updateCountdown(); // Cập nhật ngay lần đầu
    this.countdownInterval = setInterval(updateCountdown, 1000); // Cập nhật mỗi giây
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  chonTab(index: number) {
    this.activeTab = index;
  }
}
