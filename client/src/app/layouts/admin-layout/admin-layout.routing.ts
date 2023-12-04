import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { RegisterComponent } from 'app/register/register.component';
import { LoginComponent } from 'app/login/login.component';
import { UsersComponent } from 'app/users/users.component';
import { UserEditComponent } from 'app/user-edit/user-edit.component';
//import { HomeComponent } from 'app/home/home.component';
import { EditComponent } from 'app/useredit/useredit.component';
import { RegisterProductoComponent } from 'app/register-producto/register-producto.component';
import { ProductoEditComponent } from 'app/productoedit/productoedit.component';
import { RegisterProveedorComponent } from 'app/register-proveedor/registerProveedor.component';
import { TableProductoComponent } from 'app/table-producto/table-producto.component';
import { CompraComponent } from 'app/compra/compra.component';
import { TableCompraComponent } from 'app/table-compras/table-compra.component';
import { CuentacorrienteComponent } from 'app/register-cuentacorriente/register-cuentacorriente.component';
import { TableCuentaComponent } from 'app/table-cuenta/table-cuenta.component';
import { CuentaEditComponent } from 'app/cuentaedit/cuentaedit.component';
import { TableCartComponent } from 'app/table-venta/table-cart.component';
import { UserProfileComponent } from 'app/user-profile/user-profile.component';
import { NotificationsComponent } from 'app/notifications/notifications.component';
import { NgModule } from '@angular/core';

export const AdminLayoutRoutes: Routes = [
    //{
    // path: '',
    //  children: [ {
    //   path: 'dashboard',
    //   component: DashboardComponent
   //},
   // {
     //      path: 'userprofile',
       //    component: UserProfileComponent
       //  }]
    //},
    // {
    // path: '',
    // children: [ {
    //   path: 'userprofile',
    //   component: UserProfileComponent
    // }]
    // }, {
    //   path: '',
    //   children: [ {
    //     path: 'icons',
    //     component: IconsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'notifications',
    //         component: NotificationsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'maps',
    //         component: MapsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'typography',
    //         component: TypographyComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'upgrade',
    //         component: UpgradeComponent
    //     }]
    // }   
    { path: 'dashboard',      component: DashboardComponent},
    { path: 'table-list',     component: TableListComponent },
    { path: 'register',       component: RegisterComponent}, 
    { path: 'login',          component: LoginComponent},
    { path: 'users',          component: UsersComponent},
    { path: 'useredit/:id',       component: EditComponent},
    { path: 'user-edit',       component: UserEditComponent},
    //{ path: 'home',           component: HomeComponent},
    { path: 'register-producto', component: RegisterProductoComponent},
    { path: 'table-compras', component: TableCompraComponent},
    { path: 'productoedit/:id', component:ProductoEditComponent},
    { path: 'register-proveedor', component:RegisterProveedorComponent},
    { path: 'table-producto', component:TableProductoComponent},
    { path: 'compra', component:CompraComponent},
    { path: 'register-cuenta', component:CuentacorrienteComponent},
    { path: 'table-cuentas', component:TableCuentaComponent},
    { path: 'cuentaedit/:id', component:CuentaEditComponent},
    { path: 'table-cart', component:TableCartComponent},
    { path: 'user-profile', component: UserProfileComponent},
    { path: 'notifications', component: NotificationsComponent}
  ];

 