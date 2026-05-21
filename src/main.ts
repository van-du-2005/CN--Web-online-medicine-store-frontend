import 'zone.js'
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
// Đổi 'App' thành 'AppComponent' cho khớp với file app.ts
import { AppComponent } from './app/app';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
