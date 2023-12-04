import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';

@Component({
	selector: 'useredit',
	templateUrl: './useredit.component.html',
	providers: [UserService]
})
export class EditComponent implements OnInit{
	public title: string;
	public user: User;
	public identity;
	public token;
	public status: string;
	public url: string;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
	){
		this.title = 'Actualizar los datos';
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

			this.getUser(id);
		});
	}

	getUser(id){
		this._userService.getUser(id).subscribe(
			response => {
				if(response.user){
					this.user = response.user;
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
		this._userService.updateUser(this.user).subscribe(
			response => {
				if(!response.user){
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