import { Component } from '@angular/core';
import { MedicinalPlant } from '../../../core/models/medical-plant.model';
import { firstValueFrom } from 'rxjs';
import { MedicinalPlantService } from '../../../core/services/medical-plant.service';
import {CommonModule} from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  theMostSearchedMedicinalPlantsList : MedicinalPlant[] = [];
  theRichestVitaminCMedicinalPlantsList : MedicinalPlant[] = [];
  theRichestProteinMedicinalPlantsList : MedicinalPlant[] = [];

  constructor(private medicinalPlantService: MedicinalPlantService) {}
  
  async ngOnInit() {
    await this.getTheMostSearchedMedicinalPlants();
    await this.gettheRichestVitaminCMedicinalPlantsList();
    await this.gettheRichestProteinMedicinalPlantsList();
  }

  async getTheMostSearchedMedicinalPlants(): Promise<void> {
    try {
      const data = await firstValueFrom(this.medicinalPlantService.getAllMedicinalPlants());
      if (data.isSuccess && Array.isArray(data.result)) {
        // Sắp xếp danh sách theo thuộc tính search_count (giảm dần)

        data.result.sort((a, b) => (b.search_count ?? 0) - (a.search_count ?? 0));
  
        // Lấy tối đa 8 phần tử đầu tiên
        this.theMostSearchedMedicinalPlantsList = data.result.slice(0, 4);

      }
    } catch (error) {
      console.log('Error fetching most searched medicinal plants:', error);
    }
  }

  async gettheRichestVitaminCMedicinalPlantsList(): Promise<void> {
    try {
      const data = await firstValueFrom(this.medicinalPlantService.getPlantsByVitaminC());
      if (data.isSuccess && Array.isArray(data.result)) {
        this.theRichestVitaminCMedicinalPlantsList = data.result;
      }
    } catch (error) {
      console.log('Error fetching most searched medicinal plants:', error);
    }
  }

  async gettheRichestProteinMedicinalPlantsList(): Promise<void> {
    try {
      const data = await firstValueFrom(this.medicinalPlantService.getPlantsByProtein());
      if (data.isSuccess && Array.isArray(data.result)) {
        this.theRichestProteinMedicinalPlantsList = data.result;
      }
    } catch (error) {
      console.log('Error fetching most searched medicinal plants:', error);
    }
  }
}
