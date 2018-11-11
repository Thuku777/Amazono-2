import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class RestApiService {

  constructor(private __http: HttpClient) {
  }

  getHeaders(){
    const token = localStorage.getItem('token');
    return token? new HttpHeaders().set('Authorization', token): null;
  }

  get(link: string){
    return this.__http.get(link, {headers: this.getHeaders()}).toPromise();
  }

  post(link: string, body: any){
    return this.__http.post(link, body, {headers: this.getHeaders()}).toPromise();
  }

}
