import { Routes } from '@angular/router';
import { HomepageComponent } from './features/homepage/homepage.component';
import { SearchpageComponent } from './features/searchpage/searchpage.component';
import { IntroductionpageComponent } from './features/introductionpage/introductionpage.component';
import { PlantsdetailComponent } from './features/plantsdetail/plantsdetail.component';
import { LoginComponent } from './features/admin/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminComponent } from './features/admin/admin.component';
import { ManageFamilyComponent } from './features/admin/manage-family/manage-family.component';
import { ManageMedicinalplantComponent } from './features/admin/manage-medicinalplant/manage-medicinalplant.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';

export const routes: Routes = [
    { path: '', component: HomepageComponent },
    { path: 'tracuu', component: SearchpageComponent },
    { path: 'gioithieu', component: IntroductionpageComponent},
    { path: 'danhsachcaythuoc/:id', component: PlantsdetailComponent},
    { path: 'login', component: LoginComponent },
    { 
        path: 'admin', 
        component: AdminComponent, 
        children: [
            { path: '', component: DashboardComponent  },
            { path: 'family', component: ManageFamilyComponent  },
            { path: 'medicinalplant', component: ManageMedicinalplantComponent },
        ],
        canActivate: [AuthGuard] 
    },
];
