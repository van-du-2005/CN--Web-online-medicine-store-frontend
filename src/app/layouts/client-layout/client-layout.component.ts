import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// Thay đổi đường dẫn import dưới đây cho khớp với vị trí file header.ts của bạn
import { HeaderComponent } from '../header/header'; 
import { ChatbotComponent } from '../components/chatbot/chatbot.component';

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, ChatbotComponent], 
  
  templateUrl: './client-layout.component.html'
})
export class ClientLayoutComponent {}