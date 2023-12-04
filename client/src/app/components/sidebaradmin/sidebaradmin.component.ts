import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

declare const $: any;
declare interface RouteInfo {}


export const ROUTES: RouteInfo[] = [
    //{ path: '/home', title: 'Home',  icon:'library_books', class: ''}, 
    { path: '/register', title: 'Registrar Usuario',  icon:'library_books', class: ''},
    { path: '/user-edit', title:'Editar Datos',icon:'library_books',class: ''},
    { path: '/users', title: 'Usuarios',  icon:'library_books', class: ''},
    { path: '/table-list', title: 'Usuarios en Tabla',  icon:'library_books', class: ''},
];


@Component({
  selector: 'app-sidebaradmin',
  templateUrl: './sidebaradmin.component.html',
  styleUrls: ['./sidebaradmin.component.css'],
  providers: [UserService]
})
export class SidebaradminComponent implements OnInit {
  menuItems: any[];
  public identity;
  public token;
  public user:User[];

  constructor(
    private _userService: UserService
  ) { 
    this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
  }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItems => menuItems);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
