import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { ProductoService } from 'app/services/producto.service';
import { GLOBAL } from '../services/global';
import { Producto } from 'app/models/producto';

@Component({
	selector: 'productoedit',
	templateUrl: './productoedit.component.html',
	providers: [UserService,ProductoService]
})
export class ProductoEditComponent implements OnInit{
	public title: string;
	public user: User;
	public identity;
	public token;
	public status: string;
	public url: string;
	public producto: Producto;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _productoService: ProductoService
	){
		this.title = 'Actualizar Producto';
		this.user = this._userService.getIdentity();
		this.identity = this.user;
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
	}

	ngOnInit(){
		console.log(this.user);
		console.log('useredit.component se ha cargado!!');
		this.loadPage();
	}

	loadPage(){
		this._route.params.subscribe(params => {
			let id = params['id'];

			this.getProducto(id);
		});
	}

	getProducto(id){
		this._productoService.getProducto(id).subscribe(
			response => {
				if(response.producto){
					this.producto = response.producto;
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
		this._productoService.updateProducto(this.producto).subscribe(
			response => {
				if(!response.producto){
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