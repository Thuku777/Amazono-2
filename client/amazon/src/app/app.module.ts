import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { RestApiService } from './rest-api.service';
import { DataService } from './data.service';

import { HomepageComponent } from './homepage/homepage.component';
import { CategoryComponent } from './category/category.component';
import { CartComponent } from './cart/cart.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MessageComponent } from './message/message.component';
import { RegistrationComponent } from './registration/registration.component';
import { AuthGuardService } from './auth-guard.service';
import { SettingComponent } from './setting/setting.component';
import { AddressComponent } from './address/address.component';
import { PostproductsComponent } from './postproducts/postproducts.component';
import { SellerProductsComponent } from './seller-products/seller-products.component';



@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    CategoryComponent,
    CartComponent,
    ProfileComponent,
    LoginComponent,
    RegisterComponent,
    MessageComponent,
    RegistrationComponent,
    SettingComponent,
    AddressComponent,
    PostproductsComponent,
    SellerProductsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule.forRoot()
  ],
  providers: [RestApiService, DataService, AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
