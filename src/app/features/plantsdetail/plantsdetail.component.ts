import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plantsdetail',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, SidebarComponent, CommonModule],
  templateUrl: './plantsdetail.component.html',
  styleUrls: ['./plantsdetail.component.css']
})
export class PlantsdetailComponent implements AfterViewInit {
  images: string[] = [
    '../../../assets/images/home_page/anh-thao-1-360x240.png',
    '../../../assets/images/home_page/bach-benh-360x240.png',
    '../../../assets/images/home_page/ca-gai-leo-duoc-lieu-tue-linh2-356x240.png',
    '../../../assets/images/home_page/giao-co-lam-1-360x240.png'
  ];
  activeIndex: number = 0;

  @ViewChild('carousel', { static: true }) carousel!: ElementRef;

  ngAfterViewInit() {
    const carouselElement = this.carousel.nativeElement as HTMLElement;
    const carousel = new (window as any).bootstrap.Carousel(carouselElement, {
      interval: false, // Tắt tự động chuyển slide
    });

    // Bắt sự kiện slide thay đổi trong carousel
    carouselElement.addEventListener('slide.bs.carousel', (event: any) => {
      this.activeIndex = event.to; // Cập nhật activeIndex với slide hiện tại
    });
  }

  setActiveImage(index: number) {
    this.activeIndex = index;
    const carouselElement = this.carousel.nativeElement as HTMLElement;
    // Cập nhật carousel đến slide tương ứng
    const carousel = new (window as any).bootstrap.Carousel(carouselElement);
    carousel.to(index);
  }
}
