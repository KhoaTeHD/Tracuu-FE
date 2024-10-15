import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FooterComponent } from "../../shared/components/footer/footer.component";

@Component({
  selector: 'app-searchpage',
  standalone: true,
  imports: [FormsModule, InputTextModule, FooterComponent],
  templateUrl: './searchpage.component.html',
  styleUrl: './searchpage.component.css'
})
export class SearchpageComponent {
  validateInput(event: any) {
    let value = event.target.value;
    const numericValue = parseFloat(value);

    if (isNaN(numericValue) || numericValue < 0 || numericValue > 200) {
      event.target.value = '0';
    }
  }
}
