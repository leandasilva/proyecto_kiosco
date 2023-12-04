import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

declare const $: any;
declare interface RouteInfo {}


export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
    { path: '/notifications', title: 'Notifications',  icon:'notifications', class: '' },
    { path: '/user-profile', title: 'User Profile',  icon:'person', class: '' },
];




@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  providers: [UserService]
})
export class SidebarComponent implements OnInit {
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
