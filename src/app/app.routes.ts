import { Routes } from '@angular/router';
import { HomepageComponent } from './features/homepage/homepage.component';
import { SearchpageComponent } from './features/searchpage/searchpage.component';

export const routes: Routes = [
    { path: '', component: HomepageComponent },
    { path: 'tracuu', component: SearchpageComponent },
];
