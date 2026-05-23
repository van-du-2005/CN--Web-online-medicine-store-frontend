import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { HeaderComponent } from './layouts/header/header';
// import { ChatbotComponent } from './layouts/components/chatbot/chatbot.component';

@Component({
  selector: 'app-root',
  // imports: [RouterOutlet, HeaderComponent, ChatbotComponent],
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('online-medicine-store-frontend');
}
