import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Thuoc {
  maThuoc: string;
  maDanhMuc: string;
  tenThuoc: string;
  giaBan: number;
  hinhAnh: string;
  moTa: string;
  loaiThuoc: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThuocService {
  private apiUrl = `${environment.apiUrl}/api/Thuoc`;
  private http = inject(HttpClient);

  getDanhSachThuoc(): Observable<Thuoc[]> {
    return this.http.get<Thuoc[]>(this.apiUrl);
  }
}
