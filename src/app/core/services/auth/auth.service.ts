import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://localhost:7150/api/Auth';

  constructor(private http: HttpClient) { }

  // Đăng nhập
  login(email: string, password: string): Observable<any> {
    // Tạo đối tượng chứa dữ liệu đăng nhập
    const loginData = {
      email: email,
      password: password
    };

    // Gửi yêu cầu POST đến endpoint /login với loginData
    return this.http.post(`${this.baseUrl}/login`, loginData);
  }
}
