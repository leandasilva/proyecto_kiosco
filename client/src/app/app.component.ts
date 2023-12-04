import { Component, DoCheck, ElementRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from './models/user';
import { UserService } from './services/user.service';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { GLOBAL } from './services/global';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	providers: [UserService]
}) 
export class AppComponent implements OnInit,DoCheck{
	
	public title:string;
	public user:User;
	public status:string;
	public identity;
	public token;
	public url:string;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private element: ElementRef
	){
		this.url = GLOBAL.url;
		this.title = 'Identificate';
		this.user = new User("",
		"",
		"",
		"",
		"",
		"",
		"",
		"",
		"",
		"",
		"",
		"",);
	}

	ngOnInit(){
		console.log('Componente de login cargado...');
		this.identity = this._userService.getIdentity();
	}

	onSubmit(){
		// loguear al usuario y conseguir sus datos
		this._userService.signup(this.user).subscribe(
			response => {
				this.identity = response.user;

				console.log(this.identity);

				if(!this.identity || !this.identity._id){
					this.status = 'error';
				}else{
					// PERSISTIR DATOS DEL USUARIO
					localStorage.setItem('identity', JSON.stringify(this.identity));

					// Conseguir el token
					this.getToken();
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


	getToken(){
		this._userService.signup(this.user, 'true').subscribe(
			response => {
				this.token = response.token;
				
				console.log(this.token);

				if(this.token.length <= 0){
					this.status = 'error';
				}else{
					
					// PERSISTIR TOKEN DEL USUARIO
					localStorage.setItem('token',this.token);

					// Conseguir los contadores o estadisticas del usuario
					this.getCounters();
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

	getCounters(){
		this._userService.getCounters().subscribe(
			response => {
				localStorage.setItem('stats', JSON.stringify(response));
				this.status = 'success';
				this._router.navigate(['/']);
			},
			error => {
				console.log(<any>error);
			}
		)

	}
	
	  ngDoCheck(){
		  this.identity = this._userService.getIdentity();
	  }
	
	  logout(){
		localStorage.clear();
		this.identity = null;
		this._router.navigate(['/home']);
	  }
}
	