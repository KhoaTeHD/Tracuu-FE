import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { MedicinalPlantService } from '../../core/services/medical-plant.service';
import { MedicinalPlant } from '../../core/models/medical-plant.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  theMostSearchedMedicinalPlantsList : MedicinalPlant[] = [];
  rareLevelPlantList: MedicinalPlant[] = [];
  displayedRareLevelPlantList: MedicinalPlant[] = [];

  constructor(private medicinalPlantService: MedicinalPlantService) {}
  
  async ngOnInit() {
    await this.getTheMostSearchedMedicinalPlants();
    await this.getRareLavelMedicinalPlants();
  }

  async getTheMostSearchedMedicinalPlants(): Promise<void> {
    try {
      const data = await firstValueFrom(this.medicinalPlantService.getAllMedicinalPlants());
      if (data.isSuccess && Array.isArray(data.result)) {
        // Sắp xếp danh sách theo thuộc tính search_count (giảm dần)
        data.result.sort((a, b) => b.search_count - a.search_count);
  
        // Lấy tối đa 8 phần tử đầu tiên
        this.theMostSearchedMedicinalPlantsList = data.result.slice(0, 8);

      }
    } catch (error) {
      console.log('Error fetching most searched medicinal plants:', error);
    }
  }

  // Hàm này sẽ lấy ra danh sách các loại cây thuốc hiếm
  async getRareLavelMedicinalPlants(): Promise<void> {
    try {
      const data = await firstValueFrom(this.medicinalPlantService.getAllMedicinalPlants());
      if (data.isSuccess && Array.isArray(data.result)) {
        this.rareLevelPlantList = data.result.filter(plant => plant.rareLevel === 1);
        await this.startRandomRarePlants();
        if(this.displayedRareLevelPlantList.length === 0) {
          // Lấy 8 phần tử đầu tiên
          this.displayedRareLevelPlantList = this.rareLevelPlantList.slice(0, 8);
        }
      }
    } catch (error) {
      console.log('Error fetching most searched medicinal plants:', error);
    }
  }

  // Hàm này sẽ chạy sau mỗi 2 phút
  // Sử dụng spread operator ([...this.rareLevelPlantList]) để không làm thay đổi danh sách gốc.
  async startRandomRarePlants(): Promise<void> {
    setInterval(() => {
      if (this.rareLevelPlantList.length > 0) {
        // Random danh sách
        const shuffledList = [...this.rareLevelPlantList].sort(() => Math.random() - 0.5);
  
        const selectedPlants = shuffledList.slice(0, 8);
  
        this.displayedRareLevelPlantList = selectedPlants;
      }
    }, 30000); // 60000 ms = 1 phút
  }
  
}
