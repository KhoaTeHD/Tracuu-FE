import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { MedicinalPlantService } from '../../../core/services/medical-plant.service';
import { FamilyService } from '../../../core/services/family.service';
import { MedicinalPlant } from '../../../core/models/medical-plant.model';
import { firstValueFrom } from 'rxjs';
import { Family } from '../../../core/models/family.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ChartModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  data: any;
  options: any;
  basicData: any;
  basicOptions: any;
  plants: MedicinalPlant [] = [];
  families: Family [] = [];
  theMostSearchedMedicinalPlantsList: MedicinalPlant[] = [];

  constructor(
    private medicinalPlantService: MedicinalPlantService,
    private familyService: FamilyService,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.getMedicinalPlants();
    await this.getFamilies();
    await this.getTheMostSearchedMedicinalPlants();

    this.data = {
      labels: ['Họ thuốc', 'Cây thuốc'], // Nhãn cho các phần trong biểu đồ
      datasets: [
        {
          data: [this.families.length, this.plants.length], // Giá trị cho từng phần
          backgroundColor: ['#FFD700', '#33A458'], // Màu nền từng phần
          hoverBackgroundColor: ['#FFD700', '#33A458'], // Màu nền khi hover
        },
      ],
    };

    this.options = {
      responsive: true, // Tự điều chỉnh kích thước
      plugins: {
        legend: {
          position: 'top', // Vị trí của chú giải (legend)
        },
        tooltip: {
          enabled: true, // Hiển thị tooltip khi hover
        },
      },
    };

     // Cập nhật dữ liệu biểu đồ
     this.basicData = {
      labels: this.theMostSearchedMedicinalPlantsList.map(plant => plant.vietnameseName), // Lấy tên của các cây thuốc
      datasets: [
        {
          label: 'Lượt tìm kiếm', // Tiêu đề cho dữ liệu
          data: this.theMostSearchedMedicinalPlantsList.map(plant => plant.search_count ?? 0), // Lấy số lượt tìm kiếm
          backgroundColor: '#FF91AF', // Màu nền cho các cột
          borderColor: '#FF91AF', // Màu viền cho các cột
          borderWidth: 1, // Độ dày viền cột
        }
      ]
    };

    // Cấu hình thêm cho biểu đồ (nếu cần)
    this.basicOptions = {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true, // Đảm bảo trục y bắt đầu từ 0
        }
      }
    };
  }

  // Hàm xử lý gọi service lấy danh sách cây thuốc
  async getMedicinalPlants(): Promise<void> {
    try {
      // Sử dụng firstValueFrom để lấy dữ liệu từ observable
      const data = await firstValueFrom(this.medicinalPlantService.getAllMedicinalPlants());
      if (data.isSuccess && Array.isArray(data.result)) {
        this.plants = data.result;
      }
    } catch (error) {
      console.error('Error fetching medicinal plants', error);
    }
  }

  // Hàm xử lý gọi service lấy danh sách cây thuốc
  async getFamilies(): Promise<void> {
    try {
      // Sử dụng firstValueFrom để lấy dữ liệu từ observable
      const data = await firstValueFrom(this.familyService.getAllFamilies());
      if (data.isSuccess && Array.isArray(data.result)) {
        this.families = data.result;
      }
    } catch (error) {
      console.error('Error fetching families', error);
    }
  }

  async getTheMostSearchedMedicinalPlants(): Promise<void> {
    try {
      const data = await firstValueFrom(this.medicinalPlantService.getAllMedicinalPlants());
      if (data.isSuccess && Array.isArray(data.result)) {
        // Sắp xếp danh sách theo thuộc tính search_count (giảm dần)
        data.result.sort((a, b) => (b.search_count ?? 0) - (a.search_count ?? 0));
  
        // Lấy tối đa 8 phần tử đầu tiên
        this.theMostSearchedMedicinalPlantsList = data.result.slice(0, 8);

      }
    } catch (error) {
      console.log('Error fetching most searched medicinal plants:', error);
    }
  }
}
