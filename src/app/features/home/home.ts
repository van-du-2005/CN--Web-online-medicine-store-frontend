import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThuocService, Thuoc } from '../../services/thuoc';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html'
})
export class HomeComponent implements OnInit {
  danhSachThuoc: Thuoc[] = [];
  isLoading = true; // 1. Thêm biến cờ hiệu chờ tải dữ liệu
  activeTab = 0;

  private thuocService = inject(ThuocService);
  private cdr = inject(ChangeDetectorRef); // 2. Công cụ ép Angular vẽ lại giao diện

  danhSachBenh = [
    { ten: 'Tay chân miệng', moTa: 'Tay chân miệng có xu hướng quay lại theo mùa, dễ bùng phát tại trường học và khu vực đông trẻ nhỏ. Trẻ dưới 5 tuổi là nhóm dễ bị ảnh hưởng và có nguy cơ lây lan nhanh.', loiKhuyen: 'Chủ động giữ vệ sinh tay và theo dõi dấu hiệu sớm là điều cần thiết. Đưa trẻ đến khám khi trẻ bỏ ăn, sốt cao khó hạ.' },
    { ten: 'Viêm não mô cầu', moTa: 'Viêm màng não do não mô cầu có dấu hiệu quay lại với nguy cơ lây lan nhanh trong cộng đồng. Trẻ nhỏ, thanh thiếu niên và người sống tập thể là nhóm dễ bị ảnh hưởng.', loiKhuyen: 'Chủ động nhận diện sớm dấu hiệu như sốt cao, cứng cổ và tiêm vắc xin đầy đủ là rất cần thiết. Đừng để đến khi bệnh diễn tiến nặng mới xử trí.' },
    { ten: 'Cúm', moTa: 'Cúm khiến cơ thể mệt mỏi, dễ đuối sức, đặc biệt ở người lớn tuổi và trẻ nhỏ. Thời tiết thay đổi là lúc virus cúm có nguy cơ bùng phát mạnh trở lại.', loiKhuyen: 'Chủ động chăm sóc sức khỏe, tăng cường đề kháng và tiêm vắc xin cúm hàng năm có thể giúp giảm nguy cơ mắc bệnh cho cả gia đình.' },
    { ten: 'Sốt xuất huyết', moTa: 'Sốt xuất huyết đang gia tăng nhanh chóng, nhiều ca trở nặng vì phát hiện trễ hoặc chủ quan. Trong gia đình, người lớn tuổi và trẻ nhỏ là những đối tượng dễ bị tổn thương nhất.', loiKhuyen: 'Đừng để đến khi sốt cao, kiệt sức mới lo bù nước hay tăng đề kháng.' }
  ];

  ngOnInit(): void {
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

  chonTab(index: number) {
    this.activeTab = index;
  }
}
