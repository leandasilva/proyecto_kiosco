import { Component, OnInit,Input } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from 'app/models/user';
import { Cuentacorriente } from 'app/models/cuentacorriente';
import { CuentacorrienteService } from 'app/services/cuentacorriente.service';

@Component({
  selector: 'tableproducto',
  templateUrl: './table-cuenta.component.html',
  styleUrls: ['./table-cuenta.component.css'],
  providers: [UserService,CuentacorrienteService]
})
export class TableCuentaComponent implements OnInit {

  public title: string;
	public url: string;
	public identity;
	public token;
	public page;
	public next_page;
	public prev_page;
	public total;
	public pages;
	public cuentacorrientes: Cuentacorriente;
	public follows;
	public status: string;
	@Input() user: User;

  constructor(
    private _userService: UserService,
	private _cuentacorrienteService: CuentacorrienteService,
    private _route: ActivatedRoute,
    private _router: Router,
  ) {
    this.identity = this._userService.getIdentity();
   }

  ngOnInit() {
    console.log("users.component ha sido cargado");
		this.actualPage();
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
			this.getCuentas(this.user);
		});
	}

  searchText= '';

	getCuentas(user){
		this._cuentacorrienteService.getCuentacorrientesUser(user).subscribe(
			response => {
				if(!response.cuentacorrientes){
					this.status = 'error';
				}else{
					this.total = response.total;
					this.cuentacorrientes = response.cuentacorrientes;
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
