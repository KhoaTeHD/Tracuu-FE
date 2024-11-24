import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isPasswordVisible: boolean = false;
  PasswordVisible = "Hiện";

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
    this.PasswordVisible = this.isPasswordVisible === true? "Ẩn" : "Hiện";
  }
}
