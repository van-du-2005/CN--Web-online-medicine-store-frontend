import { ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // 1. Cấu hình Router và ép cuộn lên đầu trang (top)
    provideRouter(
      routes, 
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }) 
    ),
    
    // 2. Cung cấp công cụ gọi API (không có cái này là không lấy được Thuốc)
    provideHttpClient()
  ]
};