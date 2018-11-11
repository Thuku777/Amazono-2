import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './data.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  isCollapse = false;

  constructor(private route: Router, private data: DataService){
    this.data.getProfile();
  }

  get token(){
    return localStorage.getItem('token');
  }

  collapse() {
    this.isCollapse = true;
  }

  closeDropdown(dropdown: any) {
    dropdown.close();
  }

  logout() {
    this.data.user = {};
    localStorage.clear();
    this.route.navigate(['/']);
  }

  search(){}

}



