import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';

//http://localhost:3000/api/products
const productURL = 'http://localhost:3000/api/products';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  products: any;
  constructor(
    private data: DataService,
    private rest: RestApiService
  ) { }

  async ngOnInit() {
    try{
      const data:any = await this.rest.get(productURL);
      if(data.success){
        this.products = data.products;
      }else{
        this.data.error(data.message);
      }
    }catch(err){
      this.data.error(err.message);
    }
  }


}
