import { Component } from '@angular/core';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-introductionpage',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './introductionpage.component.html',
  styleUrl: './introductionpage.component.css'
})
export class IntroductionpageComponent {

}
