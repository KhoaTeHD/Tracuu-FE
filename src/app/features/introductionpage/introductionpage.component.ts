import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-introductionpage',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, SidebarComponent],
  templateUrl: './introductionpage.component.html',
  styleUrl: './introductionpage.component.css'
})
export class IntroductionpageComponent {

}
