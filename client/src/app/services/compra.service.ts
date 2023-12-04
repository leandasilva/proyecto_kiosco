import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { GLOBAL } from './global';
import { User } from '../models/user';
import { Compra } from 'app/models/compra';
import { Proveedor } from 'app/models/proveedor';

@Injectable()
export class CompraService{

	public url:string;
	public user:User;
    public compra:Compra;
	public proveedor:Proveedor;
    public identity;
    public token;


	constructor(public _http: HttpClient){
		this.url = GLOBAL.url;
	}

	register(compra: Compra): Observable<any>{
		let params = JSON.stringify(compra);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
		                               .set('Authorization',this.getToken());

		return this._http.post(this.url+'nueva-compra', params, {headers:headers});
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

	getToken(){
		let token = localStorage.getItem('token');

		if(token != "undefined"){
			this.token = token;
		}else{
			this.token = null;
		}

		return this.token;
	}


	getComprasUser(id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type','application/json')
									   .set('Authorization',this.getToken());

		return this._http.get(this.url+'compras/'+id, {headers: headers});
	}

}