import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

declare const $: any;
declare interface RouteInfo {}


export const ROUTES: RouteInfo[] = [
    //{ path: '/home', title: 'Home',  icon:'library_books', class: ''},
    { path: '/dashboard', title:'Dashboard', icon:'library_books', class:''},
    { path: '/user-edit', title:'Editar Datos',icon:'library_books',class: ''},
    { path: '/register-producto', title:'Cargar Producto',icon:'library_books',class: ''},
    { path: '/table-producto', title:'Productos',icon:'library_books',class: ''},
    { path: '/register-proveedor', title:'Cargar Proveedor',icon:'library_books',class: ''},
    { path: '/compra', title:'Cargar Compra',icon:'library_books',class: ''},
    { path: '/table-compras', title:'Compras',icon:'library_books',class: ''},
    { path: '/register-cuenta', title:'Cargar Cuenta',icon:'library_books',class: ''},
    { path: '/table-cuentas', title:'Cuentas Corrientes',icon:'library_books',class: ''},
    { path: '/table-cart', title: 'Vender',  icon:'library_books', class: ''},
  ];  




@Component({
  selector: 'app-sidebaruser',
  templateUrl: './sidebaruser.component.html',
  providers: [UserService]
})
export class SidebarUserComponent implements OnInit {
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
