import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class UserGuard implements CanActivate{

	constructor(
		private _router: Router,
		private _userService: UserService	
	){}

	canActivate(){
		let identity = this._userService.getIdentity();

		if(identity && (identity.role == 'ROLE_USER')){
			return true;
		}else{
			this._router.navigate(['/login']);
			return false;
		}
	}
}