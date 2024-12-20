import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
// Import BrowserAnimationsModule để sử dụng các animation của PrimeNG
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

// Cấu hình ứng dụng, cung cấp các provider cần thiết, bao gồm cả MessageService và importProvidersFrom(BrowserAnimationsModule) để hiển thị Toast
export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withInterceptorsFromDi()), { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(), importProvidersFrom(BrowserAnimationsModule),
    MessageService]
};