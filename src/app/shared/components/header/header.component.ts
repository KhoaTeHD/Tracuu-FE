import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
// Import Router để sử dụng chức năng điều hướng và truyền query params
import { Router } from '@angular/router';
import { MedicinalPlantService } from '../../../core/services/medical-plant.service';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';
// Import MessageService để sử dụng chức năng hiển thị thông báo, phải install thư viện primeng
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TokenStorageService } from '../../../core/services/auth/token-storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, FormsModule, ToastModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  providers: [MessageService] // Cung cấp MessageService
})
export class HeaderComponent {
  searchQuery: string = '';
  token: any | null = null;

  constructor(
    private router: Router,
    private medicinalPlantService: MedicinalPlantService,
    private messageService: MessageService,
    private tokenStorageService: TokenStorageService
  ) {}

  async ngOnInit(): Promise<void> {
    this.token = this.tokenStorageService.getToken();
  }

  // Xử lý khi nhấn "Tìm kiếm"
  async onSearch(): Promise<void> {
    if (!this.searchQuery || this.searchQuery.trim() === '') {
      // Hiển thị thông báo cảnh báo nếu không có từ khóa tìm kiếm
      this.messageService.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Vui lòng nhập từ khóa tìm kiếm!'
      });
      return;
    }

    try {
      // Gọi service tìm kiếm
      const data = await firstValueFrom(this.medicinalPlantService.searchMedicinalPlants(this.searchQuery));
      if (data.isSuccess && Array.isArray(data.result)) {
        // Điều hướng đến trang tìm kiếm với kết quả
        this.router.navigate(['/tracuu'], { queryParams: { query: this.searchQuery } });
      } 
    } catch (error) {
      console.log(error);
    }
  }
}
