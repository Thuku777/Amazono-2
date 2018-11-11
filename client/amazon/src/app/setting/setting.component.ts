import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';


@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {
  btnDisabled = false;
  currentSettings: any;

  constructor(
    private data: DataService,
    private rest: RestApiService
  ) { }

  async ngOnInit() {
    try{
      if(this.data.user){
        this.data.getProfile();
      }
      this.currentSettings = Object.assign({
        newPwd: '',
        pwdConfirm: ''
      },this.data.user);
    }catch(e){
      this.data.error(e);
    }
  }

  async update(){
    this.btnDisabled = true;
    try{
      if(this.validate(this.currentSettings)){
        const data = await this.rest.post('http://localhost:3000/api/account/profile',{
          name: this.currentSettings['name'],
          email: this.currentSettings['email'],
          password: this.currentSettings['newPwd'],
          isSeller: this.currentSettings['isSeller']
        });
        if(data['success']){
          this.data.getProfile();
          this.data.success(data['message'])
        }else{
          this.data.error(data['message'])
        }
      }
    }catch(err){
      this.data.error(err);
    }
    this.btnDisabled = false;
  }


  validate(settings){
    if(settings['name']){
      if(settings['newPwd']){
        if(settings['pwdConfirm']){
          if(settings['newPwd']===settings['pwdConfirm']){
            return true;
          }else{
            this.data.error('Password does not match with confirm password');
          }
        }else{
          this.data.error('Please confirm the password');
        }
      }else{
        if(!settings['pwdConfirm']){
          return true;
        }else{
          this.data.error('Please insert a password');
        }
      }
    }else{
      this.data.error('Please insert a name');
    }
    return false;
  }
}
