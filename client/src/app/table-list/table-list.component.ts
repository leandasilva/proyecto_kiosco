import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from 'app/models/user';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css'],
  providers: [UserService]
})
export class TableListComponent implements OnInit {

  public title: string;
	public url: string;
	public identity;
	public token;
	public page;
	public next_page;
	public prev_page;
	public total;
	public pages;
	public users: User[];
	public follows;
	public status: string;

  constructor(
    private _userService: UserService,
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
			this.getUsers(page);
		});
	}

  searchText= '';

	getUsers(page){
		this._userService.getUsers(page).subscribe(
			response => {
				if(!response.users){
					this.status = 'error';
				}else{
					this.total = response.total;
					this.users = response.users;
					this.pages = response.pages;
					this.follows = response.users_following;

					if(page > this.pages){
						this._router.navigate(['/gente',1]);
					}
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
