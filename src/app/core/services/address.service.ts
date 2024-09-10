import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private apiUrl = 'https://api.viettelpost.com.vn/location/v2/categories'; // Đổi URL nếu bạn dùng API khác

  constructor(private http: HttpClient) {}

  // Lấy danh sách tỉnh/thành phố
  getProvinces(): Observable<any> {
    return this.http.get(`${this.apiUrl}/province`);
  }

  // Lấy danh sách quận/huyện dựa trên tỉnh/thành phố đã chọn
  getDistricts(provinceId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/district?province_id=${provinceId}`);
  }

  // Lấy danh sách phường/xã dựa trên quận/huyện đã chọn
  getWards(districtId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/ward?district_id=${districtId}`);
  }
}
