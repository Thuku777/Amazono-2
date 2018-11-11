import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';


@Component({
  selector: 'app-seller-products',
  templateUrl: './seller-products.component.html',
  styleUrls: ['./seller-products.component.css']
})
export class SellerProductsComponent implements OnInit {

  products: any;
  private productURL= 'http://localhost:3000/api/seller/products';

  constructor(
    private data: DataService,
    private rest: RestApiService
  ) { }

  async ngOnInit() {
    try{
      const data = await this.rest.get(this.productURL);
      if(data['success']){
        this.products = data['product'];
      }else{
        this.data.error(data['message']);
      }
    }catch(err){
      this.data.error(err['message']);
    }
  }


}
