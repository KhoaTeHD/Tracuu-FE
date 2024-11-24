import { Injectable } from '@angular/core';
//npm install ngx-cookie-service
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private tokenKey = 'token';

  constructor(private cookieService: CookieService) { }

  // Lưu token vào cookie
  saveToken(token: string, expiresInDays: number = 1): void {
    this.cookieService.set(this.tokenKey, token, expiresInDays, '/', '', true, 'Strict');
  }

  // Lấy token từ cookie
  getToken(): string | null {
    return this.cookieService.get(this.tokenKey) || null;
  }

  // Xóa token khỏi cookie
  clearToken(): void {
    this.cookieService.delete(this.tokenKey, '/');
  }
  
  saveUser(userDTO: any): void {
    const userString = JSON.stringify(userDTO); // Chuyển đối tượng thành chuỗi JSON
    this.cookieService.set('user', userString, { 
      path: '/', 
      expires: 7, 
      secure: true, 
      sameSite: 'Strict' 
    });
  }

  getUser(): any | null {
    const userString = this.cookieService.get('user'); // Lấy chuỗi JSON từ cookie
    return userString ? JSON.parse(userString) : null;    // Chuyển lại thành đối tượng nếu tồn tại
  }

  deleteUser(): void {
    this.cookieService.delete('user', '/'); // Đường dẫn phải khớp với lúc lưu
  }
}
