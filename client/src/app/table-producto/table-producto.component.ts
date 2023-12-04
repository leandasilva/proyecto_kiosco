import { Component, OnInit,Input } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from 'app/models/user';
import { ProductoService } from 'app/services/producto.service';
import { Producto } from 'app/models/producto';

@Component({
  selector: 'tableproducto',
  templateUrl: './table-producto.component.html',
  styleUrls: ['./table-producto.component.css'],
  providers: [UserService,ProductoService]
})
export class TableProductoComponent implements OnInit {

  public title: string;
	public url: string;
	public identity;
	public token;
	public page;
	public next_page;
	public prev_page;
	public total;
	public parcial;
	public subtotal;
	public pages;
	public productos: Producto[];
	public follows;
	public status: string;
	@Input() user: User;

  constructor(
    private _userService: UserService,
	private _productoService: ProductoService,
    private _route: ActivatedRoute,
    private _router: Router,
  ) {
    this.identity = this._userService.getIdentity();
   }

  ngOnInit() {
        console.log("users.component ha sido cargado");
	    this.actualPage();
		console.log(this.productos);   
  }

  actualPage(){
		this._route.params.subscribe(params => {
			let page = +params['page'];
			this.page = page;
			if(!params['page']){
				page = 1;
			}

			if(!page){
				page = 1;
			}else{
				this.next_page = page+1;
				this.prev_page = page-1;

				if(this.prev_page <= 0){
					this.prev_page = 1;
				}
			}
			// devolver listado de usuarios
			this.getProductos(this.user);
		});
	}

  searchText= '';

	getProductos(user){
		this._productoService.getProductosUser(user).subscribe(
			response => {
				if(!response.productos){
					this.status = 'error';
				}else{
					this.total = response.total;
					this.productos = response.productos;
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
