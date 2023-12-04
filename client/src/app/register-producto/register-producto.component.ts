import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { ProductoService } from '../services/producto.service';
import { Producto } from 'app/models/producto';

@Component({
	selector: 'register-producto',
	templateUrl: './register-producto.component.html',
	providers: [UserService,ProductoService]
}) 
export class RegisterProductoComponent implements OnInit{
	public title:string;
	public user: User;
	public status: string;
	public identity;
	public producto:Producto;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _productoService: ProductoService
	){
		this.identity = this._userService.getIdentity();
		this.title = 'Registrar Producto';
		this.producto = new Producto("",
		"",
		"",
		0,
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
		this._productoService.register(this.producto).subscribe(
			response => {
				if(response.producto && response.producto._id){
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