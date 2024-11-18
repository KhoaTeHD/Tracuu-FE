import { Component } from '@angular/core';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-introductionpage',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, FooterComponent],
  templateUrl: './introductionpage.component.html',
  styleUrl: './introductionpage.component.css'
})
export class IntroductionpageComponent {

}
