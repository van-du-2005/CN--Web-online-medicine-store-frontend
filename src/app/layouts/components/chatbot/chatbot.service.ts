import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5237/api/chatbot/ask';

  ask(prompt: string): Observable<{ success: boolean; data: string }> {
    return this.http.post<{ success: boolean; data: string }>(
      this.apiUrl,
      { prompt },
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }
}