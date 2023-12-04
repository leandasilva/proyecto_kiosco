import { Component, OnInit,Input } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from 'app/models/user';
import { Compra } from 'app/models/compra';
import { CompraService } from 'app/services/compra.service';

@Component({
  selector: 'tablecompra',
  templateUrl: './table-compra.component.html',
  styleUrls: ['./table-compra.component.css'],
  providers: [UserService,CompraService]
})
export class TableCompraComponent implements OnInit {

  public title: string;
	public url: string;
	public identity;
	public token;
	public page;
	public next_page;
	public prev_page;
	public total;
	public pages;
	public compras: Compra[];
	public follows;
	public status: string;
	@Input() user: User;

  constructor(
    private _userService: UserService,
	private _compraService: CompraService,
    private _route: ActivatedRoute,
    private _router: Router,
  ) {
    this.identity = this._userService.getIdentity();
   }

  ngOnInit() {
    console.log("users.component ha sido cargado");
		this.actualPage();
  }
  
  searchText = '';

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
			this.getCompras(this.user);
		});
	}


	getCompras(user){
		this._compraService.getComprasUser(user).subscribe(
			response => {
				if(!response.compras){
					this.status = 'error';
				}else{
					this.total = response.total;
					this.compras = response.compras;
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
