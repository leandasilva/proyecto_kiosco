import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { GLOBAL } from './global';
import { User } from '../models/user';
import { Cuentacorriente } from 'app/models/cuentacorriente';


@Injectable()
export class CuentacorrienteService{

	public url:string;
	public user:User;
    public cuentacorriente: Cuentacorriente;
    public identity;
    public token;


	constructor(public _http: HttpClient){
		this.url = GLOBAL.url;
	}

	register(cuentacorriente: Cuentacorriente): Observable<any>{
		let params = JSON.stringify(cuentacorriente);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
		                               .set('Authorization',this.getToken());

		return this._http.post(this.url+'nueva-cuenta', params, {headers:headers});
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


    updateCuentacorriente(cuentacorriente: Cuentacorriente):Observable<any>{
		let params = JSON.stringify(cuentacorriente);
		let headers = new HttpHeaders().set('Content-Type','application/json')
									   .set('Authorization',this.getToken());

		return this._http.put(this.url+'update-cuenta/'+cuentacorriente._id, params, {headers: headers});
	}

	getCuentacorrientesUser(id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type','application/json')
									   .set('Authorization',this.getToken());

		return this._http.get(this.url+'cuentas/'+id, {headers: headers});
	}

	getCuentacorriente(id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type','application/json')
									   .set('Authorization',this.getToken());

		return this._http.get(this.url+'cuenta/'+id, {headers: headers});
	}

}