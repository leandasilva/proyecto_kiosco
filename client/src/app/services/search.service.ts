import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { skipWhile, tap} from 'rxjs/operators';
import { map } from 'rxjs';
import { Observable, of } from 'rxjs';
import { GLOBAL } from './global';
import { Producto } from 'app/models/producto';
import { User } from 'app/models/user';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
    public url:string;
    public token;
    public identity;
    public producto:Producto;
    public user: User;
    

  constructor(private http : HttpClient) {
    this.url = GLOBAL.url;
   }


  getData(query:string){  							              
    return this.http.post<{payload: Array<Producto>}>(this.url+'/getFruits',{payload:query},{
      headers : new HttpHeaders().set('Content-Type','application/json')
                                 .set('Authorization',this.getToken())
    }).pipe(
      map(data => data.payload)
    );
  }
   
   
  getToken(){
    let token = localStorage.getItem('token');

    if(token != "undefined"){
        this.token = token;
    }else{
        this.token = null;
    }

    return this.token;
   }

   getIdentity(){
		let identity = JSON.parse(localStorage.getItem('identity'));

		if(identity != "undefined"){
			this.identity = identity;
		}else{
			this.identity = null;
		}

		return this.identity;
	}


}



