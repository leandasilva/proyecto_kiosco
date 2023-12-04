import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';
import { ProveedorService } from 'app/services/proveedor.service';
import { Compra } from 'app/models/compra';
import { CompraService } from 'app/services/compra.service';
import { Proveedor } from 'app/models/proveedor';

@Component({
	selector: 'app-compra',
	templateUrl: './compra.component.html',
	providers: [UserService, ProveedorService,CompraService]
})
export class CompraComponent implements OnInit{
	public title: string;
	public proveedores: Proveedor;
	public compra:Compra;
	public identity;
	public pages;
	public total;
	public page;
	public token;
	public url: string;
	public status: string;
	public follows;
	public user:User;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _proveedorService: ProveedorService,
		private _compraService: CompraService
	){
		this.title = 'Cargar';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.compra = new Compra("","","","","","");
	}

	ngOnInit(){
		console.log('add.component cargado...');
		this.getProveedores(this.user);
	}

	onSubmit(form){
		this._compraService.register(this.compra).subscribe(
			response => {
				if(response.compra){
					this.status = 'success';
					form.reset();
				}
			},
			error => {
				this.status = 'error';
				console.log(<any>error);
			}
		);
	}

	getProveedores(user){
		this._proveedorService.getProveedoresUser(user).subscribe(
			response => {
				if(!response.proveedores){
					this.status = 'error';
				}else{
					this.total = response.total;
					this.proveedores = response.proveedores;
					this.pages = response.pages;
					this.follows = response.users_following;
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