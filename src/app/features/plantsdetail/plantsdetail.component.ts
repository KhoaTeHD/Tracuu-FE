import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plantsdetail',
  standalone: true,
  imports: [SidebarComponent, CommonModule],
  templateUrl: './plantsdetail.component.html',
  styleUrls: ['./plantsdetail.component.css']
})
export class PlantsdetailComponent implements AfterViewInit {
  images: string[] = [
    'assets/images/home_page/anh-thao-1-360x240.png',
    'assets/images/home_page/bach-benh-360x240.png',
    'assets/images/home_page/ca-gai-leo-duoc-lieu-tue-linh2-356x240.png',
    'assets/images/home_page/giao-co-lam-1-360x240.png'
  ];
  activeIndex: number = 0;

  @ViewChild('carousel', { static: true }) carousel!: ElementRef;

  ngAfterViewInit() {
    const carouselElement = this.carousel.nativeElement as HTMLElement;
    const carousel = new (window as any).bootstrap.Carousel(carouselElement, {
      interval: 3000, // Tự động chuyển slide mỗi 3 giây
      ride: 'carousel' // Bật tự động chạy khi tải trang
    });

    // Bắt sự kiện slide thay đổi trong carousel
    carouselElement.addEventListener('slid.bs.carousel', (event: any) => {
      this.activeIndex = event.to; // Cập nhật activeIndex với slide hiện tại
    });
  }

  setActiveImage(index: number) {
    this.activeIndex = index;
    const carouselElement = this.carousel.nativeElement as HTMLElement;
    const carousel = new (window as any).bootstrap.Carousel(carouselElement);
    carousel.to(index); // Chuyển đến slide được chọn khi nhấn vào thumbnail
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
}
