import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly TOKEN_KEY = 'accessToken';

  setToken(token: string, days: number = 7): void {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    // Yêu cầu HTTPS (Secure) và chống gửi Cookie chéo trang (SameSite=Strict)
    document.cookie = `${this.TOKEN_KEY}=${encodeURIComponent(token)}; expires=${expires}; path=/; Secure; SameSite=Strict`;
  }

  getToken(): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + this.TOKEN_KEY + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  removeToken(): void {
    document.cookie = `${this.TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}