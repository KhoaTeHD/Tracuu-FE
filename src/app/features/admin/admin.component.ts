import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AdminHeaderComponent } from '../../shared/components/admin-header/admin-header.component';
import { TokenStorageService } from '../../core/services/auth/token-storage.service';


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, RouterModule, AdminHeaderComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class AdminComponent {
  user: any | null = null;
  constructor(
    private tokenStorageService: TokenStorageService,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadUser();
  }

  async loadUser(): Promise<void> {
    this.user = this.tokenStorageService.getUser();
  }
}
