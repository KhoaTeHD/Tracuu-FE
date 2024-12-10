import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { Family } from '../../../core/models/family.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FamilyService } from '../../../core/services/family.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-manage-family',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    FormsModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    ToastModule,
    InputIconModule,
    ConfirmDialogModule,
    DialogModule,
    ReactiveFormsModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './manage-family.component.html',
  styleUrl: './manage-family.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ManageFamilyComponent implements OnInit {
  ngOnInit(): void {
    this.loadFamilies();
  }

  visible: boolean = false;
  families: Family[] = [];
  clonedFamilies: { [id: number]: Family } = {};

  createFamilyForm: FormGroup = new FormGroup({
    id: new FormControl({ value: null, disabled: true }),
    vietnameseName: new FormControl('', [Validators.required]),
    scientificName: new FormControl('', [Validators.required]),
  });

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private familyService: FamilyService
  ) {}

  handleInput(event: Event, dt: any): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      dt.filterGlobal(inputElement.value, 'contains');
    }
  }

  showDialog(): void {
    var lastFamily = this.families[this.families.length - 1];
    this.visible = true;
  }

  async loadFamilies(): Promise<void> {
    try {
      // Sử dụng firstValueFrom để lấy dữ liệu từ observable
      const data = await firstValueFrom(this.familyService.getAllFamilies());
      if (data.isSuccess && Array.isArray(data.result)) {
        this.families = data.result;
        // Lấy id cuối cùng trong mảng families
        // const lastId = this.families.length > 0 ? this.families[this.families.length - 1].id : 0;
        // this.createFamilyForm.patchValue({
        //   id: (lastId ?? 0) + 1, 
        // });
      }
    } catch (error) {
      console.error('Error fetching families', error);
    }
  }

  onRowEditInit(family: Family) {
    this.clonedFamilies[family.id as number] = { ...family };
  }

  onRowEditSave(family: Family, index: number) {
    if (
      family.vietnameseName?.trim().length !== 0 &&
      family.scientificName?.trim().length !== 0
    ) {
      this.editFamily(family);
      delete this.clonedFamilies[family.id as number];
    } else {
      this.families[index] = this.clonedFamilies[family.id as number];
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Tên không được để trống',
      });
    }
  }

  onRowEditCancel(family: Family, index: number) {
    this.families[index] = this.clonedFamilies[family.id as number];
    delete this.clonedFamilies[family.id as number];
  }

  editFamily(family: Family): void {
    if (family.id !== undefined) {
      this.familyService.updateFamily(family.id, family).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Họ thuốc đã được cập nhật',
          });
          //this.loadColors(); // Reload colors after update
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Đã có lỗi xảy ra!',
          });
        },
      });
    }
  }

  createFamily(): void {
    if (this.createFamilyForm.valid) {
      const newFamily: Family = this.createFamilyForm.value;
      this.familyService.createFamily(newFamily).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Họ thuốc đã được tạo!',
          });
          this.loadFamilies();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Đã có lỗi xảy ra!',
          });
        },
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Vui lòng điền đầy đủ thông tin!',
      });
    }
  }

  // deletefamily(family: Family) {
  //   this.confirmationService.confirm({
  //     message: 'Bạn có chắc xóa "' + family.vietnameseName + '" không?',
  //     header: 'Xác nhận',
  //     icon: 'pi pi-exclamation-triangle',
  //     accept: () => {
  //       this.familyService.deleteFamily(family.id as number).subscribe({
  //         next: () => {
  //           this.families = this.families.filter((val) => val.id !== family.id);
  //           this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đã xóa họ thuốc', life: 3000 });
  //         },
  //         error: () => {
  //           this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Đã có lỗi xảy ra!' });
  //         }
  //       });
  //     }
  //   });
  // }
}
