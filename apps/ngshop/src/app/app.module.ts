import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { UiModule } from '@bluebits/ui';
import { ProductsModule } from '@bluebits/products';
import { AccordionModule } from 'primeng/accordion';
import { ToastModule } from 'primeng/toast';
import { JwtInterceptor, UsersModule } from '@bluebits/users';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NgxStripeModule } from 'ngx-stripe';

import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NavComponent } from './shared/nav/nav.component';
import { OrdersModule } from '@bluebits/orders';
import { MessagesComponent } from './shared/messages/messages.component';
import { MessageService } from 'primeng/api';
import { config } from 'process';



const routes: Routes = [
    { path: '', component: HomePageComponent }
]

@NgModule({
  declarations: [AppComponent, HomePageComponent, HeaderComponent, FooterComponent, NavComponent, MessagesComponent],
  imports: [
    BrowserModule, 
    BrowserAnimationsModule, 
    RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' }),
    HttpClientModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    UiModule,
    AccordionModule, 
    ProductsModule,
    OrdersModule,
    ToastModule,
    UsersModule,
    NgxStripeModule.forRoot('pk_test_51JiFcVB3A3vPzVfaZoJ7eu75RA3ZVge9kYuQYmoNrWB8G8v54gxNYh0pLBzbEsGQ6xwLD5upxPgfUCfzZka5C7Hk00Nd66q9yX')
  ],
  providers: [
      MessageService,
      { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  exports: [
    MessagesComponent,
    [RouterModule]
  ],
})
export class AppModule {}
