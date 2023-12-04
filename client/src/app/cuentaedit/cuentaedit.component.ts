import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';
import { Cuentacorriente } from 'app/models/cuentacorriente';
import { CuentacorrienteService } from 'app/services/cuentacorriente.service';

@Component({
	selector: 'cuentaedit',
	templateUrl: './cuentaedit.component.html',
	providers: [CuentacorrienteService]
})
export class CuentaEditComponent implements OnInit{
	public title: string;
	public user: User;
	public identity;
	public token;
	public status: string;
	public url: string;
	public cuentacorriente: Cuentacorriente;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _cuentacorrienteService: CuentacorrienteService
	){
		this.title = 'Actualizar los datos';
		this.user = this._userService.getIdentity();
		this.identity = this.user;
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
	}

	ngOnInit(){
		console.log(this.cuentacorriente);
		console.log('useredit.component se ha cargado!!');
	    this.loadPage();
	}

	loadPage(){
		this._route.params.subscribe(params => {
			let id = params['id'];

			this.getCuentacorriente(id);
		});
	}

	getCuentacorriente(id){
		this._cuentacorrienteService.getCuentacorriente(id).subscribe(
			response => {
				if(response.cuentacorriente){
					this.cuentacorriente = response.cuentacorriente;
				}else{
					this.status = 'error';
				}
			},	
			error => {
				console.log(<any>error);
				this._router.navigate(['/home',this.identity._id]);
			}
		);
	}

	onSubmit(){
		this._cuentacorrienteService.updateCuentacorriente(this.cuentacorriente).subscribe(
			response => {
				if(!response.cuentacorriente){
					this.status = 'error';
				}else{
					this.status = 'success';
					localStorage.setItem('identity', JSON.stringify(this.identity));
					this.identity = this.user;
					console.log(this.identity);
				}
			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage);

				if(errorMessage != null){
					this.status = 'error';
				}
			}
		);
	}
	
}