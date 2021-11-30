import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ColorPickerModule } from 'primeng/colorpicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { EditorModule } from 'primeng/editor';
import { PaginatorModule } from 'primeng/paginator';
import { TagModule } from 'primeng/tag';
import { InputMaskModule } from 'primeng/inputmask';
import { FieldsetModule } from 'primeng/fieldset';
import { NgxStripeModule } from 'ngx-stripe';

import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ShellComponent } from './shared/shell/shell.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { CategoriesListComponent } from './pages/categories/categories-list/categories-list.component'
import { CategoriesFormComponent } from './pages/categories/categories-form/categories-form.component';
import { ProductsListComponent } from './pages/products/products-list/products-list.component';
import { ProductsFormComponent } from './pages/products/products-form/products-form.component';
import { UsersFormComponent } from './users/users-form/users-form.component';
import { UsersListComponent } from './users/users-list/users-list.component';
import { OrdersDetailComponent } from './pages/orders/orders-detail/orders-detail.component';
import { OrdersListComponent } from './pages/orders/orders-list/orders-list.component';

import { MessageService } from 'primeng/api';
import { CategoriesService } from '@bluebits/products';
import { JwtInterceptor, UsersModule, UsersService } from '@bluebits/users';
import { AppRoutingModule } from './app-routing.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';


const UX_MODULE = [
    CardModule,
    ToolbarModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule,
    ColorPickerModule,
    InputNumberModule,
    DropdownModule,
    InputTextareaModule,
    InputSwitchModule,
    EditorModule,
    PaginatorModule,
    TagModule,
    InputMaskModule,
    FieldsetModule
]


@NgModule({
  declarations: [
      AppComponent,
      DashboardComponent,
      ShellComponent,
      SidebarComponent,
      CategoriesListComponent,
      CategoriesFormComponent,
      ProductsListComponent,
      ProductsFormComponent,
      UsersFormComponent,
      UsersListComponent,
      OrdersDetailComponent,
      OrdersListComponent
    ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    FormsModule,
    ReactiveFormsModule,
    UsersModule,
    AppRoutingModule,
    ...UX_MODULE,
    NgxStripeModule.forRoot('pk_test_51JiFcVB3A3vPzVfaZoJ7eu75RA3ZVge9kYuQYmoNrWB8G8v54gxNYh0pLBzbEsGQ6xwLD5upxPgfUCfzZka5C7Hk00Nd66q9yX')
  ],
  providers: [
      CategoriesService, 
      MessageService, 
      ConfirmationService, 
      UsersService, 
      { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
    ],
  bootstrap: [AppComponent],
})
export class AppModule {}
