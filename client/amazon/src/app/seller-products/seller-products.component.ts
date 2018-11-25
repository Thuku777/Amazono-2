import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';


const productURL: string = 'http://localhost:3000/api/seller/products';
@Component({
  selector: 'app-seller-products',
  templateUrl: './seller-products.component.html',
  styleUrls: ['./seller-products.component.css']
})
export class SellerProductsComponent implements OnInit {

  products: any;

  constructor(
    private data: DataService,
    private rest: RestApiService
  ) { }

  async ngOnInit() {
    try{

      const data = await this.rest.get(productURL);
      if(data['success']){
        this.products = data['products'];
      }else{
        this.data.error(data['message']);
      }
    }catch(err){
      this.data.error(err['message']);
    }
  }


}
