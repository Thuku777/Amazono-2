import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';

@Component({
  selector: 'app-postproducts',
  templateUrl: './postproducts.component.html',
  styleUrls: ['./postproducts.component.css']
})
export class PostproductsComponent implements OnInit {

  product = {
    categoryid: '',
    title: '',
    description: '',
    price: 0,
    product_picture: null
  }

  categories: any;
  btnDisabled: boolean = false;
  productURL: string = 'http://localhost:3000/api/seller/products';
  categoryURL: string = 'http://localhost:3000/api/categories';

  constructor(
    private data: DataService,
    private rest: RestApiService,
    private router: Router
  ) { }

  async ngOnInit() {
    const gotCategories = await this.rest.get(this.categoryURL);
    if(gotCategories['success']){
      this.categories = gotCategories['categories'];
    }else{
      this.data.error(gotCategories['message'])
    }
  }

  async addProduct(){
    try{
      this.btnDisabled = true;
      if(this.validate()){
        let form = new FormData();
        for(let key in this.product){
          if(this.product.hasOwnProperty(key)){
            if(key === 'product_picture'){
              form.append('product_picture',this.product.product_picture,this.product.product_picture.name)
            }else{
              form.append(key,this.product[key]);
            }
          }
        }
        const reply = await this.rest.post(this.productURL,form);
        if(reply['success']){
          this.router.navigate(['/product/sellerproducts'])
          .then(()=>{
            this.data.success(reply['message'])
          })
          .catch((err)=>{
            this.data.error(err);
          })
        }else{
          this.data.error(reply['message'])
        }
      }else{
        throw Error('Validation Failed')
      }
    }catch(err){
      this.data.error(err['message']);
    }
    this.btnDisabled = false;
  }

  validate(){
    if(this.product.title){
      if(this.product.categoryid){
        if(this.product.price>0){
          if(this.product.product_picture){
            return true;
          }else{
            throw Error('Set product image')
          }
        }else{
          throw Error('Set product price')
        }
      }else{
        throw Error('Set category id')
      }
    }else{
      throw Error('Set product name')
    }
  }

  fileChange(event: any){
    this.product.product_picture = event.target.files[0];
  }
}

