import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { GLOBAL } from './global';
import { User } from '../models/user';
import { Producto } from '../models/producto';
import { Proveedor } from 'app/models/proveedor';

@Injectable()
export class ProveedorService{

	public url:string;
	public user:User;
    public producto:Producto;
	public proveedor: Proveedor;
    public identity;
    public token;


	constructor(public _http: HttpClient){
		this.url = GLOBAL.url;
	}

	register(proveedor: Proveedor): Observable<any>{
		let params = JSON.stringify(proveedor);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
		                               .set('Authorization',this.getToken());

		return this._http.post(this.url+'nuevo-proveedor', params, {headers:headers});
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


    updateProveedor(proveedor: Proveedor):Observable<any>{
		let params = JSON.stringify(proveedor);
		let headers = new HttpHeaders().set('Content-Type','application/json')
									   .set('Authorization',this.getToken());

		return this._http.put(this.url+'update-proveedor/'+proveedor._id, params, {headers: headers});
	}

	getProveedoresUser(id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type','application/json')
									   .set('Authorization',this.getToken());

		return this._http.get(this.url+'proveedores/'+id, {headers: headers});
	}

	getProveedor(id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type','application/json')
									   .set('Authorization',this.getToken());

		return this._http.get(this.url+'proveedor/'+id, {headers: headers});
	}

}