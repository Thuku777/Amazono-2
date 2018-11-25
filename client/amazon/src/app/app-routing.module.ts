
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { HomepageComponent } from './homepage/homepage.component';
import { AuthGuardService } from './auth-guard.service';
import { ProfileComponent } from './profile/profile.component';
import { SettingComponent } from './setting/setting.component';
import { AddressComponent } from './address/address.component';
import { CategoryComponent } from './category/category.component';
import { PostproductsComponent } from './postproducts/postproducts.component';
import { SellerProductsComponent } from './seller-products/seller-products.component';
import { CategoryPageComponent } from './category-page/category-page.component';


const routes: Routes = [
    {
        path: '',
        component: HomepageComponent
    },
    {
        path: 'categories',
        component: CategoryComponent
    },
    {
        path: 'categories/:id',
        component: CategoryPageComponent
    },
    {
        path: 'register',
        component: RegistrationComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'profile/settings',
        component: SettingComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'profile/address',
        component: AddressComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'profile/postproduct',
        component: PostproductsComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'profile/products',
        component: SellerProductsComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: '**',
        redirectTo: ''
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}