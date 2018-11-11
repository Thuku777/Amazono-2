import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  name = '';
  email = '';
  password = '';
  confirmpassword = '';
  isSeller = false;

  btnDisabled = false;
  constructor(
    private router: Router, 
    private data: DataService, 
    private rest: RestApiService
    ) { }

  ngOnInit() {
  }

  validate() {
    if(this.name){
      if(this.email){
        if(this.password){
          if(this.confirmpassword){
            if(this.password === this.confirmpassword){
              return true;
            }else{
              this.data.error('Password did not march with the Confirm Password');
            }
          }else{
            this.data.error('Confirm Password is not inserted');
          }
        }else{
          this.data.error('Password is not inserted');
        }
      }else{
        this.data.error('Email is not inserted');
      }
    }else{
      this.data.error('Name is not inserted');
    }
    this.password = '';
    this.confirmpassword = '';
    return false;
  }

  async register() {
    this.btnDisabled = true;
    try{
      if(this.validate()){
        const data = await this.rest.post('http://localhost:3000/api/account/signup', {
          name: this.name,
          email: this.email,
          password: this.password,
          isSeller: this.isSeller
        });
        if(data['success']){
          localStorage.setItem('token',data['token']);
          this.data.success('Registration Success');
          await this.data.getProfile();
          this.router.navigate(['/']);
        }else{
          this.data.error(data['message']);
        }
      }
    }catch(error){
      this.data.error(error['message']);
    }
    this.btnDisabled = false;
  }



}
