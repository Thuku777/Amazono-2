import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';
import { Router } from '@angular/router'
import { AppComponent } from '../app.component'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email = '';
  password = '';
  isSeller = false;
  btnDisabled = false;

  constructor(
    private data : DataService, 
    private rest: RestApiService,
    private route: Router
    ) { }

  ngOnInit() {
  }

  validate(){
    if(this.email){
      if(this.password){
        return true;
      }else{
        this.data.error('Password is not set');
      }
    }else{
      this.data.error('Email ID is not set');
    }
    return false;
  }

  async login(){
    try{
      this.btnDisabled = true;
      if(this.validate()){
        const data = await this.rest.post('http://localhost:3000/api/account/login', {
          email: this.email,
          password: this.password,
          isSeller: this.isSeller
        });
        if(data['success']){
          localStorage.setItem('token',data['token']);
          await this.data.getProfile();
          this.route.navigate(['']);
        }else{
          this.data.error(data['message']);
        }
      }else{
//        throw new Error('Validation Failed');
      }
    }catch(error){
      this.data.error(error['message']);
    }
    this.btnDisabled = false;
  }

}
