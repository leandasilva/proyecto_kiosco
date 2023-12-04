import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { Cuentacorriente } from 'app/models/cuentacorriente';
import { CuentacorrienteService } from 'app/services/cuentacorriente.service';

@Component({
	selector: 'register-cuentacorriente',
	templateUrl: './register-cuentacorriente.component.html',
	providers: [UserService,CuentacorrienteService]
}) 
export class CuentacorrienteComponent implements OnInit{
	public title:string;
	public user: User;
	public cuentacorriente: Cuentacorriente;
	public status: string;
	public identity;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _cuentacorrienteService: CuentacorrienteService
	){
		this.identity = this._userService.getIdentity();
		this.title = 'Registrar Cuenta Corriente';
		this.cuentacorriente = new Cuentacorriente("",
		"",
		"",
		"",
		"",
		"",
		"",
		"0",
		"",
		"");
	}

	ngOnInit(){
		console.log('Componente de register cargado...');
	}

	onSubmit(form){
		this._cuentacorrienteService.register(this.cuentacorriente).subscribe(
			response => {
				if(response.cuentacorriente && response.cuentacorriente._id){
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