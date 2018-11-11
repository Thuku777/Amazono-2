import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';


@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {

  btnDisabled: boolean = false;
  currentAddress: any;

  constructor(private _data: DataService, private _rest: RestApiService) { }

  async ngOnInit() {
    try{
      const data = await this._rest.get('http://localhost:3000/api/account/address');
      if(JSON.stringify(data['address'])=='{}' && this._data.message==='') {
        this._data.warning('You have not yet inserted your shipping address');
      }
      this.currentAddress = data['address'];
    }catch(e){
      this._data.error(e['message']);
    }
  }

  async update(){
    this.btnDisabled = true;
    try{
      const res = await this._rest.post('http://localhost:3000/api/account/address',this.currentAddress);
      res['success']
      ?(this._data.success(res['message']),await this._data.getProfile())
      :this._data.error(res['message']);
    }catch(err){
      this._data.error(err['message']);
    }
    this.btnDisabled = false;
  }
}
