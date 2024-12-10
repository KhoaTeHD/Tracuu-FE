import { Component, effect, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
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
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { catchError, finalize, firstValueFrom, forkJoin, map, Observable, switchMap, tap } from 'rxjs';
import { MedicinalPlant } from '../../../core/models/medical-plant.model';
import { MedicinalPlantService } from '../../../core/services/medical-plant.service';
import { FileRemoveEvent, FileUploadEvent, FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { BadgeModule } from 'primeng/badge';
import { FamilyService } from '../../../core/services/family.service';
import { Family } from '../../../core/models/family.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-manage-medicinalplant',
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
    FileUploadModule,
    BadgeModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './manage-medicinalplant.component.html',
  styleUrl: './manage-medicinalplant.component.css',
  //encapsulation: ViewEncapsulation.None,
})
export class ManageMedicinalplantComponent implements OnInit {
  ngOnInit(): void {
    this.loadPlants();
    this.loadFamilies();
    this.initForm();
  }

  visible: boolean = false;
  plants: MedicinalPlant[] = [];
  families: Family[] = [];
  clonedPlants: { [id: number]: MedicinalPlant } = {};
  isLoading = false; // Trạng thái loading khi submit

  dialogMode: 'add' | 'edit' = 'add'; // Chế độ của dialog (add hoặc edit)
  selectedPlant: any = null; // Dữ liệu cây thuốc được chọn

  plantForm!: FormGroup;
  rareLevels = [
    { id: -1, name: 'Chưa xác định' },
    { id: 0, name: 'Phổ biến' },
    { id: 1, name: 'Hiếm' },
  ];

  constructor(
    private familyService: FamilyService,
    private http: HttpClient,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private plantService: MedicinalPlantService
  ) {}

  initForm() {
    this.plantForm = this.fb.group({
      id: this.plants.length > 0 ? (this.plants[this.plants.length - 1]?.id ?? 0) + 1 : 0,
      vietnameseName: ['', Validators.required],
      scientificName: ['', Validators.required],
      partUsed: ['', Validators.required],
      description: ['', Validators.required],
      habitat: ['', Validators.required],
      chemicalComposition: ['', Validators.required],
      usage: ['', Validators.required],
      effect: ['', Validators.required],
      summaryEffect: ['', Validators.required],
      familyId: ['', Validators.required],
      rareLevel: [0],
      search_count: [0],
      images: this.fb.array([], [Validators.minLength(4), Validators.maxLength(4)]), // Giới hạn từ 4 hình
      vector: this.fb.array(Array(10).fill(0).map(()=> this.fb.control('', [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]))),
    });

  }

  get imagesArray(): FormArray {
    return this.plantForm.get('images') as FormArray;
  }

  get vectorControls(): FormControl[] {
    return (this.plantForm.get('vector') as FormArray).controls as FormControl[];
  }

  uploadedFiles: any[] = [];

  onUpload(event: FileUploadHandlerEvent): void {
    const files = event.files;

    const newFiles = files.filter((file: File) => {
      return !this.uploadedFiles.some((existingFile) => existingFile.name === file.name);
    });

    // Kiểm tra số lượng hiện tại
    if (files.length > 4) {
      this.messageService.add({
        severity: 'error',
        summary: 'Cảnh báo',
        detail: 'Bạn chỉ được tải lên tối đa 4 hình.',
      });
      return;
    }

    for (const file of newFiles) {
      this.imagesArray.push(new FormControl(file)); // Lưu file vào FormArray
      this.uploadedFiles.push(file); // Lưu vào danh sách hiển thị
    }
  }

  onRemove(event: FileRemoveEvent): void {
    const index = this.uploadedFiles.indexOf(event.file);
    if (index >= 0) {
      this.uploadedFiles.splice(index, 1);
      this.imagesArray.removeAt(index);
    }
  }

  handleInput(event: Event, dt: any): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      dt.filterGlobal(inputElement.value, 'contains');
    }
  }

  showDialog(type: string) {
    this.visible = true;
  }

  async loadPlants(): Promise<void> {
    try {
      // Sử dụng firstValueFrom để lấy dữ liệu từ observable
      const data = await firstValueFrom(
        this.plantService.getAllMedicinalPlants()
      );
      if (data.isSuccess && Array.isArray(data.result)) {
        this.plants = data.result;
        const lastId = this.plants.length > 0 ? this.plants[this.plants.length - 1].id : 0;
        this.plantForm.patchValue({
          id: (lastId ?? 0) + 1, 
        });
      }
    } catch (error) {
      console.error('Error fetching plants', error);
    }
  }

  async loadFamilies(): Promise<void> {
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

  openAddDialog() {
    this.dialogMode = 'add';
    this.visible = true;
    
    // Gán các giá trị mặc định không được null
    this.initForm();


    // Clear uploaded files nếu cần
    this.uploadedFiles = [];
  }

  openEditDialog(plant: any) {
    this.dialogMode = 'edit';
    this.visible = true;
    this.selectedPlant = plant;
  
    // Gán giá trị đầy đủ vào form
    this.plantForm.patchValue({
      id: plant.id,
      vietnameseName: plant.vietnameseName,
      scientificName: plant.scientificName,
      partUsed: plant.partUsed,
      description: plant.description,
      habitat: plant.habitat,
      chemicalComposition: plant.chemicalComposition,
      usage: plant.usage,
      effect: plant.effect,
      search_count: plant.search_count,
      rareLevel: plant.rareLevel,
      summaryEffect: plant.summaryEffect,
      familyId: plant.family?.id, // Nếu `family` là object, gán `id`
    });
    

    // Gán mảng `images` từ `plant.images`
    this.uploadedFiles = plant.images.map((image: any) => ({
      name: image.url.split('/').pop(), // Lấy tên file từ URL
      url: image.url,
    }));
    const imagesArray = this.plantForm.get('images') as FormArray;
    imagesArray.clear();
    plant.images.forEach((image: any) => {
      imagesArray.push(new FormControl({ id: image.id, url: image.url }));
    });

    // Gán mảng `vector` từ `plant.vector`
    const vectorArray = this.plantForm.get('vector') as FormArray;
    vectorArray.clear();
    plant.vector.forEach((value: any) => {
      vectorArray.push(
        this.fb.control(value, [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)])
      );
    });
  }


  // onSubmit(): void {
  //   if (this.plantForm.invalid || this.uploadedFiles.length !== 4) {
  //     this.messageService.add({
  //       severity: 'error',
  //       summary: 'Lỗi',
  //       detail: 'Hãy nhập đầy đủ thông tin và tải lên đúng 4 hình ảnh.',
  //     });
  //     return;
  //   }
  
  //   this.isLoading = true; // Bắt đầu loading

  //   const vietnameseName = this.plantForm.value.vietnameseName;
  //   const id = this.plantForm.value.id; 
  //   const vector = this.vectorControls.map((control) => control.value); // Lấy giá trị vector từ form
    
  //   this.addVectorToQdrant(id, vector, vietnameseName)
  //   .pipe(
  //     switchMap(() => {
  //       // Nếu thêm vector thành công, tiếp tục upload hình ảnh
  //       return this.uploadFilesToCloudinary( this.uploadedFiles);
  //     }),
  //     switchMap((uploadedUrls: string[]) => {
  //       this.imagesArray.clear();
  //       // Gán URL hình ảnh vào form
  //       uploadedUrls.forEach((url) => {
  //         this.imagesArray.push(new FormControl({ id: 0, url }));
  //       });

  //       const payload = this.plantForm.value;
  //       payload.vector = null;

  //       // Gửi dữ liệu cây thuốc đến backend
  //       return this.http.post('https://localhost:7150/api/MedicinalPlant', payload);
  //     }),
  //     catchError((error) => {
  //       // Xử lý lỗi nếu xảy ra
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: 'Lỗi',
  //         detail: 'Đã xảy ra lỗi khi xử lý!',
  //       });
  //       //console.error('Lỗi khi xử lý:', error);
  //       return [];
  //     }),
  //     finalize(() => {
  //       this.isLoading = false; // Kết thúc loading
  //       this.visible = false; // Ẩn dialog
  //       this.loadPlants(); // Load lại danh sách cây thuốc
  //     })
  //   )
  //   .subscribe((response: any) => {
  //     // Xử lý thành công
  //     this.messageService.add({
  //       severity: 'success',
  //       summary: 'Thành công',
  //       detail: 'Cây thuốc đã được tạo thành công!',
  //     });
  //   });
    
  // }
  
  onSubmit(): void {
    if (this.plantForm.invalid || this.uploadedFiles.length !== 4) {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Hãy nhập đầy đủ thông tin và tải lên đúng 4 hình ảnh.',
      });
      return;
    }
  
    this.isLoading = true; // Bắt đầu loading
  
    const id = this.plantForm.value.id;
    const vietnameseName = this.plantForm.value.vietnameseName;
    const vector = this.vectorControls.map((control) => control.value);
    console.log(id);
  
    const updateObservable = this.dialogMode === 'edit'
      ? this.addVectorToQdrant(id, vector, vietnameseName).pipe(
          switchMap(() => this.uploadFilesToCloudinary(this.uploadedFiles)),
          switchMap((uploadedUrls: string[]) => {
            this.imagesArray.clear();
            uploadedUrls.forEach((url) => {
              this.imagesArray.push(new FormControl({ id: 0, url }));
            });
  
            const payload = this.plantForm.value;
            payload.vector = null;
  
            return this.http.put(
              `https://localhost:7150/api/MedicinalPlant/${id}`,
              payload
            );
          })
        )
      : this.addVectorToQdrant(id, vector, vietnameseName).pipe(
          switchMap(() => this.uploadFilesToCloudinary(this.uploadedFiles)),
          switchMap((uploadedUrls: string[]) => {
            this.imagesArray.clear();
            uploadedUrls.forEach((url) => {
              this.imagesArray.push(new FormControl({ id: 0, url }));
            });
  
            const payload = this.plantForm.value;
            payload.vector = null;
  
            return this.http.post('https://localhost:7150/api/MedicinalPlant', payload);
          })
        );
  
    updateObservable
      .pipe(
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Đã xảy ra lỗi khi xử lý!',
          });
          throw error;
        }),
        finalize(() => {
          this.isLoading = false; // Kết thúc loading
          this.visible = false; // Ẩn dialog
          this.loadPlants(); // Load lại danh sách cây thuốc
        })
      )
      .subscribe((response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: this.dialogMode === 'edit'
            ? 'Cây thuốc đã được chỉnh sửa thành công!'
            : 'Cây thuốc đã được thêm thành công!',
        });
      });
  }

  uploadFilesToCloudinary(files: File[]): Observable<string[]> {
    const uploadedUrls: string[] = [];
    const requests = files.map((file) => {
      const formData = new FormData();
      formData.append('file', file); // File cần upload
      formData.append('upload_preset', 'medicinalplants'); // Preset đã tạo
      
  
      // Trả về Observable cho từng file upload
      return this.http.post<any>('https://api.cloudinary.com/v1_1/ddc4rolln/image/upload', formData).pipe(
        map((response) => response.secure_url),
        catchError((error) => {
          console.error(`Lỗi khi upload file ${file.name}:`, error);
          throw new Error('Upload hình ảnh thất bại.');
        })
      );
    });
  
    // Kết hợp tất cả các Observable thành một Observable duy nhất
    return forkJoin(requests).pipe(
      tap((urls: string[]) => uploadedUrls.push(...urls)),
      map(() => uploadedUrls)
    );
  }

  addVectorToQdrant(id: number, vector: number[], payload: any): Observable<any> {
    const url = 'http://52.65.227.224:6333/collections/medical-plants/points';
  
    const body = {
      points: [
        {
          id: id, // ID của vector
          vector: vector, // Giá trị vector
          payload: { "Tên cây thuốc": payload }, // Thông tin bổ sung
        },
      ],
    };
  
    console.log('Request Body:', body); // Debug để kiểm tra body gửi đi

    return this.http.put(url, body).pipe(
      catchError((error) => {
        console.error('Lỗi khi thêm vector vào Qdrant:', error);
        throw error;
      })
    );
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
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Đã xóa cây thuốc',
              life: 3000,
            });
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Đã có lỗi xảy ra!',
            });
          },
        });
      },
    });
  }
}