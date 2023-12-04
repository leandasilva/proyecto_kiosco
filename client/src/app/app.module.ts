import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { UserGuard } from './services/user.guard';
import { UserService } from './services/user.service';
import { ComponentsModule } from "./components/components.module";
import { AdminLayoutModule } from "./layouts/admin-layout/admin-layout.module";


@NgModule({
    declarations: [
        AppComponent,
        AdminLayoutComponent,
    ],
    providers: [
        AppRoutingModule,
        UserGuard,
        UserService
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule,
        AppRoutingModule,
        ComponentsModule,
        AdminLayoutModule
    ]
})
export class AppModule { }
