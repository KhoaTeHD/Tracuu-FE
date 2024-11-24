import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { TokenStorageService } from '../../../core/services/auth/token-storage.service';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api'; // Import MessageService
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, ToastModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MessageService],
})
export class LoginComponent {
  isPasswordVisible: boolean = false;
  PasswordVisible = "Hiện";
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private messageService: MessageService
  ) {}

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
    this.PasswordVisible = this.isPasswordVisible === true? "Ẩn" : "Hiện";
  }

  signIn(): void {
    if(this.checkEmpty()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Vui lòng nhập đầy đủ email và mật khẩu!'
      });
      return;
    }
    this.authService.login(this.email, this.password).subscribe({
      next: (response: any) => {
        this.tokenStorageService.saveToken(response.result.token);
        this.tokenStorageService.saveUser(response.result.user);
        // Điều hướng đến trang admin
        this.router.navigate(['/admin']);
      },
      error: err => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Sai email hoặc mật khẩu!'
        });
      }
    });
  }

  checkEmpty(): boolean {
    return this.email === '' || this.password === '';
  }
}
