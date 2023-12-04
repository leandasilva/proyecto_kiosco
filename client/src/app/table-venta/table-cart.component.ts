import { Component,Input, OnInit, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Producto } from 'app/models/producto';
import { ProductoService } from 'app/services/producto.service';
import { CartService } from 'app/services/cart.service';
import { FormControl, FormGroup, FormBuilder } from "@angular/forms";
import { SearchService } from "app/services/search.service";
import { User } from 'app/models/user';
import { UserService } from 'app/services/user.service';
import { Observable } from 'rxjs';
import { debounceTime, filter, finalize, map, switchMap } from 'rxjs/operators';
import { fromEvent, of} from 'rxjs';


@Component({
  selector: 'app-cart',
  templateUrl: './table-cart.component.html',
  providers:[ProductoService,SearchService,UserService]
})
export class TableCartComponent implements OnInit {
  productos: Array<Producto>= [];
  hasQuery:Boolean = false;
  @Input() user: User;

  constructor(
    private router: Router,
    private actRoute: ActivatedRoute,
    private _searchService: SearchService,
  ) {
    
   }

  ngOnInit(): void {
    
  }

  sendData(event:any){
    let query:string= event.target.value;
    let matchSpaces:any = query.match(/\w*/);
    
    if(matchSpaces[0] === query){
      this.productos = [];
      this.hasQuery = false;
      return;
    }
 
    this._searchService.getData(query.trim()).subscribe(result => {
      this.productos = result;
      this.hasQuery = true;
      console.log(result);
    });
  }

  


  
}




