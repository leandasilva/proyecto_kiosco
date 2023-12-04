import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { RegisterComponent } from 'app/register/register.component';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { LoginComponent } from 'app/login/login.component';
import { UsersComponent } from 'app/users/users.component';
import { UserEditComponent } from 'app/user-edit/user-edit.component';
import { HomeComponent } from '../../home/home.component';
import { EditComponent } from 'app/useredit/useredit.component';
import { SearchPipe } from 'app/users/search.pipe';
import { RegisterProductoComponent } from 'app/register-producto/register-producto.component';
import { ProductoEditComponent } from 'app/productoedit/productoedit.component';
import { RegisterProveedorComponent } from '../../register-proveedor/registerProveedor.component';
import { TableProductoComponent } from '../../table-producto/table-producto.component';
import { CompraComponent } from 'app/compra/compra.component';
import { TableCompraComponent } from 'app/table-compras/table-compra.component';
import { MomentModule } from 'angular2-moment';
import { CuentacorrienteComponent } from 'app/register-cuentacorriente/register-cuentacorriente.component';
import { TableCuentaComponent } from 'app/table-cuenta/table-cuenta.component';
import { CuentaEditComponent } from 'app/cuentaedit/cuentaedit.component';
import { TableCartComponent } from 'app/table-venta/table-cart.component';
import { AutocompleteLibModule } from "angular-ng-autocomplete";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatAutocompleteModule,
    BrowserAnimationsModule,
    AutocompleteLibModule,
    HttpClientModule,
    MomentModule
  ],
  declarations: [
    DashboardComponent,
    TableListComponent,
    RegisterComponent,
    LoginComponent,
    UsersComponent,
    UserEditComponent,
    HomeComponent,
    EditComponent,
    SearchPipe,
    RegisterProductoComponent,
    ProductoEditComponent,
    RegisterProveedorComponent,
    TableProductoComponent,
    CompraComponent,
    TableCompraComponent,
    CuentacorrienteComponent,
    TableCuentaComponent,
    CuentaEditComponent,
    TableCartComponent
]})

export class AdminLayoutModule {}
