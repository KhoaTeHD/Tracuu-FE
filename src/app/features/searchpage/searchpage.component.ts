import { Component, OnInit } from '@angular/core';
// Để sử dụng binding như ngModel thì phải import FormsModule
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FooterComponent } from "../../shared/components/footer/footer.component";
import { HeaderComponent } from '../../shared/components/header/header.component';
import { MedicinalPlantService } from '../../core/services/medical-plant.service';
import { MedicinalPlant } from '../../core/models/medical-plant.model';
// Thực hiện lấy result từ service
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
// Cài đặt bằng npm để có thể use, thực hiện chức năng phân trang auto
import { NgxPaginationModule } from 'ngx-pagination';
// Sử dưng ActivatedRoute để lấy query params
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-searchpage',
  standalone: true,
  imports: [FormsModule, InputTextModule, FooterComponent, HeaderComponent, CommonModule, RouterModule, NgxPaginationModule],
  templateUrl: './searchpage.component.html',
  styleUrls: ['./searchpage.component.css']
})
export class SearchpageComponent implements OnInit {
  // Khởi tạo các biến
  plants: MedicinalPlant[] = [];
  currentPage = 1;
  title = '';
  totalPlants = 0;
  query: string = '';
  isLoading: boolean = false; // Trạng thái loading
  selectedSort: string = ''; // Trạng thái sắp xếp hiện tại

  // Phần dữ liệu hóa học
  chemistryData: { [key: string]: number } = {
    tinh_dau: 0,
    vitamin_c: 0,
    lipid: 0,
    protid: 0,
    tanin: 0,
    glucid: 0,
    alcaloid: 0,
    tinh_bot: 0,
    caroten: 0,
    cellulose: 0
  };

  // Phần label cho dữ liệu hóa học hiển thị
  chemistryLabels: { [key: string]: string } = {
    tinh_dau: 'Tinh dầu',
    vitamin_c: 'Vitamin C',
    lipid: 'Lipid',
    protid: 'Protid',
    tanin: 'Tanin',
    glucid: 'Glucid',
    alcaloid: 'Alcaloid',
    tinh_bot: 'Tinh bột',
    caroten: 'Caroten',
    cellulose: 'Cellulose'
  };

  constructor(private router: Router, private route: ActivatedRoute, private medicinalPlantService: MedicinalPlantService) { }

  // Được gọi 1 lần khi component được khởi tạo, nếu có param thì hiển thị kết quả tìm kiếm, không thì hiển thị tất cả
  async ngOnInit(): Promise<void> {
    // Lấy `query` từ URL
    // Mỗi khi params thay đổi, hàm này sẽ được gọi
    this.route.queryParams.subscribe(async (params) => {
      this.query = params['query'] || ''; // Gán giá trị từ queryParams
      this.currentPage = params['page'] ? +params['page'] : 1;
      this.selectedSort = params['sort'] || ''; // Mặc định là không có sắp xếp
      // Khôi phục `chemistryData` từ query parameters
      Object.keys(this.chemistryData).forEach((key) => {
        if (params[key] !== undefined) {
          this.chemistryData[key] = +params[key]; // Chuyển giá trị thành số
        }
      });

      // Nếu có params, tự động gọi tìm kiếm tương đồng
      const hasChemistryParams = Object.keys(this.chemistryData).some((key) => params[key] !== undefined);
      if (hasChemistryParams) {
        await this.onSearchSimilarity();
      } else if (this.query) {
        this.resetChemistryData();
        await this.onSearchByName();
      } else {
        this.resetChemistryData();
        await this.getMedicinalPlants();
      }
      // Gọi hàm sắp xếp nếu trạng thái `sort` tồn tại
      if (this.selectedSort) {
        this.sortPlants();
      }
    });
  }

  resetChemistryData(): void {
    Object.keys(this.chemistryData).forEach((key) => {
      this.chemistryData[key] = 0;
    });
  }

  // Hàm xử lý khi nhập input thành phần hóa học
  validateInput(event: any) {
    let value = event.target.value;
    const numericValue = parseFloat(value);

    if (isNaN(numericValue) || numericValue < 0) {
      event.target.value = '';
    }
  }

  // Hàm xử lý gọi service lấy danh sách cây thuốc
  async getMedicinalPlants(): Promise<void> {
    this.isLoading = true; // Bật trạng thái loading
    try {
      // Sử dụng firstValueFrom để lấy dữ liệu từ observable
      const data = await firstValueFrom(this.medicinalPlantService.getAllMedicinalPlants());
      if (data.isSuccess && Array.isArray(data.result)) {
        this.plants = data.result;
        this.totalPlants = this.plants.length;
        this.isLoading = false; // Tắt trạng thái loading
        this.title = 'Danh sách cây thuốc';
      }
    } catch (error) {
      console.error('Error fetching medicinal plants', error);
    }
  }

  onPageChange(event: number): void {
    this.currentPage = event;

    // Cuộn lên đầu trang
    window.scrollTo(0, 0);

    // Cập nhật query parameters trong URL, điều này sẽ gọi ngOnit để khởi động lại component
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.currentPage },
      queryParamsHandling: 'merge', // Giữ lại các query parameters khác nếu có
    });
  }


  // Hàm xử lý sắp xếp khi thay đổi dropdown
  onSortChange(order: string): void {
    this.selectedSort = order; // Cập nhật trạng thái sắp xếp
    // Cập nhật query parameters trong URL
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { sort: this.selectedSort },
      queryParamsHandling: 'merge', // Giữ lại các query parameters khác
    });
  }

  sortPlants(): void {
    if (this.selectedSort === 'az') {
      this.sortPlantsAZ();
    } else if (this.selectedSort === 'za') {
      this.sortPlantsZA();
    }
  }

  // Hàm sắp xếp theo tên A-Z
  sortPlantsAZ(): void {
    this.plants.sort((a, b) => {
      return a.vietnameseName?.localeCompare(b.vietnameseName || '', 'vi', { sensitivity: 'base' }) || 0;
    });
  }

  // Hàm sắp xếp theo tên Z-A
  sortPlantsZA(): void {
    this.plants.sort((a, b) => {
      return b.vietnameseName?.localeCompare(a.vietnameseName || '', 'vi', { sensitivity: 'base' }) || 0;
    });
  }

  // Hàm getter trả về danh sách key của dữ liệu hóa học
  get chemistryKeys() {
    return Object.keys(this.chemistryData);
  }

  // Hàm xử lý set giá trị null thành 0 của mảng dữ liệu hóa học
  resetNullValues(): void {
    for (const key in this.chemistryData) {
      if (this.chemistryData[key] === null || this.chemistryData[key] === undefined) {
        this.chemistryData[key] = 0;
      }
    }
  }

  // Xử lý khi nhấn "Tìm kiếm tương đồng"
  async transferChemistryDataToURL(): Promise<void> {
    // Gọi service tìm kiếm
    this.resetNullValues();

    // Chuyển `chemistryData` thành query parameters
    const chemistryParams = Object.entries(this.chemistryData)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    // Cập nhật URL với `chemistryData`
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { ...this.chemistryData, page: 1 }, // Reset về trang 1
      queryParamsHandling: 'merge', // Giữ lại các query parameters khác nếu có
    });
  }

  async onSearchSimilarity(): Promise<void> {
    this.isLoading = true; // Bật trạng thái loading
    try {
      const vector = Object.values(this.chemistryData);
      const data = await firstValueFrom(this.medicinalPlantService.vectorSearchMedicinalPlants(vector));
      if (data.isSuccess && Array.isArray(data.result)) {
        this.plants = data.result; // Lưu kết quả tìm kiếm
        this.totalPlants = this.plants.length;
        this.title = 'Kết quả tìm kiếm';
        window.scrollTo(0, 0);
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.isLoading = false; // Tắt trạng thái loading
    }
  }

  // Xử lý khi nhấn "Tìm kiếm theo tên"
  async onSearchByName(): Promise<void> {
    this.isLoading = true; // Bật trạng thái loading
    try {
      // Gọi service tìm kiếm
      const data = await firstValueFrom(this.medicinalPlantService.searchMedicinalPlants(this.query));
      if (data.isSuccess && Array.isArray(data.result)) {
        this.plants = data.result; // Lưu kết quả tìm kiếm
        this.totalPlants = this.plants.length;
        this.title = 'Kết quả tìm kiếm';
        window.scrollTo(0, 0);
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
    } finally {
      this.isLoading = false; // Tắt trạng thái loading
    }
  }
}
