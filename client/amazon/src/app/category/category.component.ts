import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  categories: any;
  newCategory = { name: null, desc: null};
  btnDisabled: boolean = false;
  private catURL: string = 'http://localhost:3000/api/categories';

  constructor(
    private data: DataService,
    private rest: RestApiService
  ) {
    this.catURL = 'http://localhost:3000/api/categories';
   }

  async ngOnInit() {
    try{
      const catData = await this.rest.get(this.catURL);
      catData['success']? this.categories = catData['categories']: this.data.error(catData['message']);
    }catch(err){
      this.data.error(err['message']);
    }
  }

  async addCategory(){
    try{
      this.btnDisabled = true;
      const reply = await this.rest.post(this.catURL,{
        name: this.newCategory.name,
        desc: this.newCategory.desc
      })
      reply['success']? this.data.success(reply['message']): this.data.error(reply['message']);
    }catch(err){
      this.data.error(err['message']);
    }
    this.btnDisabled = false;
  }
}

