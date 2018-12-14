import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';
import { ActivatedRoute } from '@angular/router';

//http://localhost:3000/api/seller/products/5be700eef56f093494aa4908
//http://localhost:3000/api/products/5be700eef56f093494aa4908
const ProductURL: string = 'http://localhost:3000/api/seller/products';
@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {

  private productId: string;
  product: any;
  myReview = {
    title: '', 
    decs: '',
    rating: 0
  }

  btnDisabled= false;

  constructor(
    private route: ActivatedRoute,
    private data: DataService,
    private rest: RestApiService
  ) { 
    /*
    this.myReview.title = ''
    this.myReview.decs = ''
    this.myReview.rating = 0
    */
  }

  async ngOnInit() {
    try{
      this.route.params.subscribe(res=>{
        this.productId = res.id;
      })

      if(this.productId){
        this.product = await this.getProductDetail(ProductURL, this.productId);
      }else{
        console.log('Product Id is not fetched from request paramater')
      }
    }catch(err){
      console.log(err);
    }
  }

  async getProductDetail(url: string,param?: string){
    if(param){
      url = `${url}/${param}`
    }
    const data:any = await this.rest.get(url);
    if(data.success){
      return data.product;
    }else{
      this.data.error(data.message);
    }
  }

  async postReview() {
    this.btnDisabled = true;
    try {
      const data = await this.rest.post('http://localhost:3030/api/review', {
        productId: this.product._id,
        title: this.myReview.title,
        description: this.myReview.decs,
        rating: this.myReview.rating,
      });
      data['success']
        ? this.data.success(data['message'])
        : this.data.error(data['message']);
      this.btnDisabled = false;
    } catch (error) {
      this.data.error(error['message']);
    }
  }

}
