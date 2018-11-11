import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { RestApiService } from './rest-api.service';


@Injectable()
export class DataService {
  message: '';
  messageType: string;
  user: any;

  constructor(
    private __router: Router,
    private rest: RestApiService
    ) {
    this.__router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.message = '';
      }
    });
  }

  error(message) {
    this.message = message;
    this.messageType = 'danger';
  }

  success(message) {
    this.message = message;
    this.messageType = 'success';
  }
  warning(message) {
    this.message = message;
    this.messageType = 'warning';
  }

  async getProfile(){
    try{
      if(localStorage.getItem('token')){
        const data = await this.rest.get('http://localhost:3000/api/account/profile');
        if(data){
          this.user = data['user'];
        }else{
          this.error(new Error('No user information is fetched'));
        }
      }else{
        this.error(new Error('User is not logged in'));
      }
    }catch(e){
      this.error(e);
    }
  }

  /*
  async getAddress(){
    try{
      const data = await this.rest.get('');
      if(data){
        console.log(data['address']);
        return data['address'];
      }else{

      }
    }catch(e){
      this.error(e);
    }
  }
  */
}
