import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { Proveedor } from 'app/models/proveedor';
import { ProveedorService } from 'app/services/proveedor.service';

@Component({
	selector: 'registerProveedor',
	templateUrl: './registerProveedor.component.html',
	providers: [UserService,ProveedorService]
}) 
export class RegisterProveedorComponent implements OnInit{
	public title:string;
	public user: User;
	public status: string;
	public identity;
	public proveedor: Proveedor;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _proveedorService: ProveedorService
	){
		this.identity = this._userService.getIdentity();
		this.title = 'Registrar ';
		this.proveedor = new Proveedor("",
		"",
		"",
		"",
		"",
		"",
		"",
		"");
	}

	ngOnInit(){
		console.log('Componente de register cargado...');
	}

	onSubmit(form){
		this._proveedorService.register(this.proveedor).subscribe(
			response => {
				if(response.proveedor && response.proveedor._id){
					//console.log(response.user);

					this.status = 'success';
					form.reset();
				}else{
					this.status = 'error';
				}
			},
			error => {
				console.log(<any>error);
			}
		);
	}
}