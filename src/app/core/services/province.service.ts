import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProvinceService {
  private apiUrl = 'https://provinces.open-api.vn/api/';

  constructor(private http: HttpClient) {}

  // Get provinces (Tỉnh/Thành phố)
  getProvinces(): Observable<any> {
    return this.http.get(`${this.apiUrl}p/`);
  }

  // Get districts (Quận/Huyện) by province code
  getDistrictsByProvince(provinceCode: string): Observable<any> {
    return this.http.get(`${this.apiUrl}p/${provinceCode}?depth=2`);
  }

  // Get communes (Xã/Phường) by district code
  getCommunesByDistrict(districtCode: string): Observable<any> {
    return this.http.get(`${this.apiUrl}d/${districtCode}?depth=2`);
  }
}
