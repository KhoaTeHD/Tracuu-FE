import { Routes } from '@angular/router';
import { HomepageComponent } from './features/homepage/homepage.component';
import { SearchpageComponent } from './features/searchpage/searchpage.component';
import { IntroductionpageComponent } from './features/introductionpage/introductionpage.component';
import { PlantsdetailComponent } from './features/plantsdetail/plantsdetail.component';

export const routes: Routes = [
    { path: '', component: HomepageComponent },
    { path: 'tracuu', component: SearchpageComponent },
    { path: 'gioithieu', component: IntroductionpageComponent},
    { path: 'danhsachcaythuoc/:id', component: PlantsdetailComponent},
];
