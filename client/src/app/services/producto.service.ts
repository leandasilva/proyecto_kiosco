import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { GLOBAL } from './global';
import { User } from '../models/user';
import { Producto } from '../models/producto';

@Injectable()
export class ProductoService{

	public url:string;
	public user:User;
    public producto:Producto;
    public identity;
    public token;


	constructor(public _http: HttpClient){
		this.url = GLOBAL.url;
	}

	register(producto: Producto): Observable<any>{
		let params = JSON.stringify(producto);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
		                               .set('Authorization',this.getToken());

		return this._http.post(this.url+'nuevo-producto', params, {headers:headers});
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


    updateProducto(producto: Producto):Observable<any>{
		let params = JSON.stringify(producto);
		let headers = new HttpHeaders().set('Content-Type','application/json')
									   .set('Authorization',this.getToken());

		return this._http.put(this.url+'update-producto/'+producto._id, params, {headers: headers});
	}

	getProductosUser(id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type','application/json')
									   .set('Authorization',this.getToken());

		return this._http.get(this.url+'productos/'+id, {headers: headers});
	}

	getProducto(id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type','application/json')
									   .set('Authorization',this.getToken());

		return this._http.get(this.url+'producto/'+id, {headers: headers});
	}

}