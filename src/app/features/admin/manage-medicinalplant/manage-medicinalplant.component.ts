import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { MedicinalPlant } from '../../../core/models/medical-plant.model';
import { MedicinalPlantService } from '../../../core/services/medical-plant.service';

@Component({
  selector: 'app-manage-medicinalplant',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule, FormsModule, InputTextModule, DropdownModule, ButtonModule, ToastModule, InputIconModule, ConfirmDialogModule, DialogModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './manage-medicinalplant.component.html',
  styleUrl: './manage-medicinalplant.component.css'
})
export class ManageMedicinalplantComponent implements OnInit {
  ngOnInit(): void {
    this.loadPlants();
  }

  visible: boolean = false;
  plants: MedicinalPlant[] = [];
  clonedPlants: { [id: number]: MedicinalPlant } = {};
  createPlant: MedicinalPlant = {};
  dialogTitle: string = 'Thêm';

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private plantService: MedicinalPlantService) { }

  handleInput(event: Event, dt: any): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      dt.filterGlobal(inputElement.value, 'contains');
    }
  }

  showDialog(type: string) {
    if (type === 'add') {
      this.createPlant = {};
      this.dialogTitle = 'Thêm';
    }
    this.visible = true;
  }

  async loadPlants(): Promise<void> {
    try {
      // Sử dụng firstValueFrom để lấy dữ liệu từ observable
      const data = await firstValueFrom(this.plantService.getAllMedicinalPlants());
      if (data.isSuccess && Array.isArray(data.result)) {
        this.plants = data.result;
      }
    } catch (error) {
      console.error('Error fetching plants', error);
    }
  }

  onRowEditInit(plant: MedicinalPlant) {
    this.clonedPlants[plant.id as number] = { ...plant };
  }

  onRowEditSave(plant: MedicinalPlant, index: number) {
    if (plant.vietnameseName?.trim().length !== 0) {
      //this.editplant(plant);
      delete this.clonedPlants[plant.id as number];
    } else {
      this.plants[index] = this.clonedPlants[plant.id as number];
      this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Tên không hợp lệ' });
    }
  }

  onRowEditCancel(plant: MedicinalPlant, index: number) {
    this.plants[index] = this.clonedPlants[plant.id as number];
    delete this.clonedPlants[plant.id as number];
  }

  editColor(plant: MedicinalPlant): void {
    if(plant.id !== undefined){
      this.plantService.updateMedicinalPlant(plant.id, plant).subscribe({
        next: response => {
          this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Cây thuốc đã được cập nhật' });
          //this.loadColors(); // Reload colors after update
        },
        error: err => {
          this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Đã có lỗi xảy ra!' });
        }
      });
    }
  }

  deleteplant(plant: MedicinalPlant) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc xóa ' + plant.vietnameseName + ' không?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.plantService.deleteMedicinalPlant(plant.id as number).subscribe({
          next: () => {
            this.plants = this.plants.filter((val) => val.id !== plant.id);
            this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đã xóa cây thuốc', life: 3000 });
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Đã có lỗi xảy ra!' });
          }
        });
      }
    });
  }
}
