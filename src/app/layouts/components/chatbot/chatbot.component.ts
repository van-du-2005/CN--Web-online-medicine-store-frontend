import { Component, signal, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from './chatbot.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
  loading?: boolean;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html'
})
export class ChatbotComponent {
  @ViewChild('messageList') messageList!: ElementRef;

  isOpen = signal(false);
  inputText = '';
  private shouldScrollToBottom = false; // ← Chỉ scroll khi cần

  messages: ChatMessage[] = [
    {
      role: 'bot',
      text: 'Xin chào! Tôi là trợ lý AI của Nhà Thuốc Sống Khỏe 🌿\nBạn đang gặp triệu chứng gì hoặc cần tư vấn loại thuốc nào?'
    }
  ];

  constructor(
    private chatService: ChatbotService,
    private sanitizer: DomSanitizer
  ) {}

  toggle() {
    this.isOpen.update(v => !v);
    if (this.isOpen()) {
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  // ← Chuyển markdown đơn giản sang HTML
  renderMarkdown(text: string): SafeHtml {
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Bold: **text**
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Italic: *text*
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Xuống dòng
      .replace(/\n/g, '<br>');

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  scrollToBottom() {
    try {
      if (this.messageList) {
        this.messageList.nativeElement.scrollTop =
          this.messageList.nativeElement.scrollHeight;
      }
    } catch {}
  }

  send() {
    const text = this.inputText.trim();
    if (!text) return;

    this.messages.push({ role: 'user', text });
    this.inputText = '';

    const loadingMsg: ChatMessage = { role: 'bot', text: '', loading: true };
    this.messages.push(loadingMsg);

    // Scroll xuống khi gửi tin nhắn mới
    setTimeout(() => this.scrollToBottom(), 50);

    this.chatService.ask(text).subscribe({
      next: (res) => {
        const idx = this.messages.lastIndexOf(loadingMsg);
        if (idx !== -1) {
          this.messages[idx] = { role: 'bot', text: res.data };
        }
        // Scroll xuống khi nhận được phản hồi
        setTimeout(() => this.scrollToBottom(), 50);
      },
      error: () => {
        const idx = this.messages.lastIndexOf(loadingMsg);
        if (idx !== -1) {
          this.messages[idx] = {
            role: 'bot',
            text: 'Xin lỗi, hiện tại tôi không thể trả lời. Vui lòng thử lại sau.'
          };
        }
        setTimeout(() => this.scrollToBottom(), 50);
      }
    });
  }

  onEnter(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }
}