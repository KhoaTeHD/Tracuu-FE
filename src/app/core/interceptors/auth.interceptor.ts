//Tự động gắn token vào header của mỗi request
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../services/auth/token-storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private tokenStorageService: TokenStorageService) {
    console.log('AuthInterceptor initialized');
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.tokenStorageService.getToken();
    const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/ddc4rolln/image/upload';

    if (req.url === cloudinaryUrl) {
      // Không chỉnh sửa yêu cầu gửi tới Cloudinary
      return next.handle(req);
    }
    
    if (token) {
      const clonedReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(clonedReq);
    }
    return next.handle(req);
  }
}
