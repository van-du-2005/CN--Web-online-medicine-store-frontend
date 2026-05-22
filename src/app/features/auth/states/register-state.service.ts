import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegisterStateService {
  private emailToVerify: string | null = null;

  setEmail(email: string): void {
    this.emailToVerify = email;
  }

  getEmail(): string | null {
    return this.emailToVerify;
  }

  clear(): void {
    this.emailToVerify = null;
  }
}