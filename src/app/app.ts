import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// 1. Import component Thuoc vào đây
import { Thuoc } from './features/thuoc/thuoc';

@Component({
  selector: 'app-root',
  standalone: true, // Sếp nhớ giữ nguyên dòng này nha
  // 2. Đăng ký nó vào mảng imports
  imports: [RouterOutlet, Thuoc], 
  templateUrl: './app.html',
  styleUrl: './app.css'
}) 
export class App {
  protected readonly title = signal('online-medicine-store-frontend');
}