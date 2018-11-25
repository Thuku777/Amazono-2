import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';

const countPerPage: number = 5;
const productsPerCategoryURL: string = 'http://localhost:3000/api/seller/category';
@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.css']
})
export class CategoryPageComponent implements OnInit {

  catId: any;
  catName: string;
  category: any;
  page: number = 1;
  totalProducts: number;
  obtaindProductCount: number;


  constructor(
    private route: ActivatedRoute,
    private data: DataService,
    private rest: RestApiService
  ) { }

  async ngOnInit() {
    this.route.params.subscribe(res=>{
      this.catId = res['id'];
      this.route.queryParams.subscribe(p=>{
        this.catName = p.name;
      })
      this.getData();
    })
  }

  lower(){
    return (this.page-1)*countPerPage+1;
  }
  upper(){
    return this.page*countPerPage;
  }

  getPerPageConst(){
    return countPerPage;
  }

  async getData(event?: any){
    if(event) this.category = null;
    try{
      let finalURL = `${productsPerCategoryURL}/${this.catId}?index=${this.page-1}`;
      console.log(`Final URL: ${finalURL}`);
      //passed
      let data:any = await this.rest.get(finalURL);
      console.log(data);
      if(data.success){
        this.category = data;
        //passed
        this.totalProducts = this.category.totalCount;
        this.obtaindProductCount = this.category.count;
        console.log(this.category.products);
      }else{
        this.data.error(data.message)
      }
    }catch(err){
      this.data.error(err);
    }

  }

}
