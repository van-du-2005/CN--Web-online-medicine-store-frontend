import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { StorageService } from '../../../services/storage.service';
import { UserProfile } from '../models/account.model';

@Component({
  selector: 'app-account-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './account-layout.component.html'
})
export class AccountLayoutComponent implements OnInit {
  profile: UserProfile | null = null;
  isLoading = true;

  constructor(
    private accountService: AccountService,
    private storage: StorageService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSidebarData();
  }

  loadSidebarData(): void {
    this.accountService.getProfile().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.profile = res.data;
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        // Nếu lỗi (ví dụ token hết hạn), đá văng ra log in
        this.isLoading = false;
        this.storage.removeToken();
        this.router.navigate(['/auth/login']);
      }
    });
  }

  logout(): void {
    this.storage.removeToken();
    this.router.navigate(['/auth/login']);
  }

  getRankIcon(rank: string | undefined): string {
    switch (rank) {
      case 'Bac': return '🥈 Bạc';
      case 'Vang': return '🥇 Vàng';
      case 'KimCuong': return '💎 Kim cương';
      default: return '🥉 Đồng';
    }
  }
}