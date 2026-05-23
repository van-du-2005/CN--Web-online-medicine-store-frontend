import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { StorageService } from '../../../services/storage.service';
import { ApiResponse } from '../../../models/api-response.model';
import {
  SummaryCards,
  OrderStatusChart,
  TopProduct,
  TopCustomer,
  LowStock,
  PagedResult,
} from './dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/api/admin/dashboard`;

  constructor(
    private http: HttpClient,
    private storage: StorageService,
  ) {}

  private getAuthHeaders() {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${this.storage.getToken()}` }) };
  }

  getSummary(filter: string): Observable<ApiResponse<SummaryCards>> {
    return this.http.get<ApiResponse<SummaryCards>>(
      `${this.apiUrl}/summary?filter=${filter}`,
      this.getAuthHeaders(),
    );
  }

  getChart(filter: string): Observable<ApiResponse<OrderStatusChart>> {
    return this.http.get<ApiResponse<OrderStatusChart>>(
      `${this.apiUrl}/chart?filter=${filter}`,
      this.getAuthHeaders(),
    );
  }

  getTopProducts(
    filter: string,
    page: number = 1,
    limit: number = 5,
  ): Observable<ApiResponse<PagedResult<TopProduct>>> {
    return this.http.get<ApiResponse<PagedResult<TopProduct>>>(
      `${this.apiUrl}/top-products?filter=${filter}&page=${page}&limit=${limit}`,
      this.getAuthHeaders(),
    );
  }

  getTopCustomers(
    filter: string,
    page: number = 1,
    limit: number = 5,
  ): Observable<ApiResponse<PagedResult<TopCustomer>>> {
    return this.http.get<ApiResponse<PagedResult<TopCustomer>>>(
      `${this.apiUrl}/top-customers?filter=${filter}&page=${page}&limit=${limit}`,
      this.getAuthHeaders(),
    );
  }

  getLowStock(
    page: number = 1,
    limit: number = 15,
  ): Observable<ApiResponse<PagedResult<LowStock>>> {
    return this.http.get<ApiResponse<PagedResult<LowStock>>>(
      `${this.apiUrl}/low-stock?page=${page}&limit=${limit}`,
      this.getAuthHeaders(),
    );
  }
}
