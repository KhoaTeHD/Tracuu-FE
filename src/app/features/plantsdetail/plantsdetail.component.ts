import { Component, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicinalPlantService } from '../../core/services/medical-plant.service';
import { MedicinalPlant } from '../../core/models/medical-plant.model';
import { firstValueFrom } from 'rxjs';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-plantsdetail',
  standalone: true,
  imports: [SidebarComponent, CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './plantsdetail.component.html',
  styleUrls: ['./plantsdetail.component.css']
})
export class PlantsdetailComponent implements OnInit, AfterViewInit {

  activeIndex: number = 0;
  plantDetail: MedicinalPlant | undefined;

  constructor(
    private route: ActivatedRoute,
    private medicinalPlantService: MedicinalPlantService,
    private router: Router
  ) { }

  // Hàm ngOnInit thực hiện việc lấy ID từ route params và gọi hàm getPlantDetail
  ngOnInit(): void {
    // Lắng nghe sự thay đổi của URL paramMap
    this.route.paramMap.subscribe(async (paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        await this.getPlantDetail(+id); // Gọi lại hàm lấy dữ liệu chi tiết
        console.log(this.plantDetail);
      }
      window.scrollTo(0, 0); // Cuộn về đầu trang
    });
  }

  // Hàm getPlantDetail thực hiện việc gọi API để lấy thông tin chi tiết của cây thuốc
  async getPlantDetail(id: number): Promise<void> {
    try {
      const response = await firstValueFrom(this.medicinalPlantService.getMedicinalPlantById(id));
      if (response.isSuccess && response.result) {
        this.plantDetail = response.result;
      }
    } catch (error) {
      console.error('Error fetching plant details:', error);
    }
  }

  // Các thiết lập cho carousel và các hàm điều khiển carousel, thumbnail
  @ViewChild('carousel', { static: true }) carousel!: ElementRef;

  ngAfterViewInit() {
    const carouselElement = this.carousel.nativeElement as HTMLElement;

    // Khởi tạo carousel instance
    const carousel = new (window as any).bootstrap.Carousel(carouselElement, {
      interval: 3000, // Chuyển slide sau mỗi 3 giây
      ride: 'carousel' // Kích hoạt tự động chạy
    });

    // Đăng ký sự kiện "slid.bs.carousel"
    carouselElement.addEventListener('slid.bs.carousel', (event: any) => {
      this.activeIndex = event.to; // Cập nhật activeIndex
    });

    // Log kiểm tra
    console.log('Bootstrap carousel initialized:', carousel);
  }


  setActiveImage(index: number) {
    this.activeIndex = index;
    const carouselElement = this.carousel.nativeElement as HTMLElement;
    const carousel = new (window as any).bootstrap.Carousel(carouselElement);
    if (carousel) {
      carousel.to(index);
    }
  }

  prevSlide() {
    const carouselElement = this.carousel.nativeElement as HTMLElement;
    const carousel = new (window as any).bootstrap.Carousel(carouselElement);
    carousel.prev();
  }

  nextSlide() {
    const carouselElement = this.carousel.nativeElement as HTMLElement;
    const carousel = new (window as any).bootstrap.Carousel(carouselElement);
    carousel.next();
  }

  // Xử lý khi nhấn "Tìm kiếm tương đồng"
  async transferChemistryDataToURL(): Promise<void> {
    if (!this.plantDetail || !this.plantDetail.vector) return;

    const chemistryData: { [key: string]: number } = {
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

    const chemistryKeys = [
      'tinh_dau',
      'vitamin_c',
      'lipid',
      'protid',
      'tanin',
      'glucid',
      'alcaloid',
      'tinh_bot',
      'caroten',
      'cellulose'
    ];

    // Chuyển vector thành key-value trong chemistryData
    chemistryKeys.forEach((key, index) => {
      chemistryData[key] = this.plantDetail!.vector[index];
    });

    // Tạo query params từ chemistryData
    const chemistryParams = Object.entries(chemistryData)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    console.log('Chemistry Data Params:', chemistryParams); // Kiểm tra kết quả

    // Chuyển đến trang kết quả tìm kiếm với queryParams
    this.router.navigate(['/tracuu'], {
      queryParams: { ...chemistryData, page: 1 }, // Reset về trang 1
      queryParamsHandling: 'merge' // Giữ lại các query params khác nếu có
    });
  }
}
