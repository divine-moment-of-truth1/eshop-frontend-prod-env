import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';

import { CartService } from './services/cart.service';
import { OrdersCartIconComponent } from './components/orders-cart-icon/orders-cart-icon.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { ButtonModule } from 'primeng/button';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';
import { ThankYouComponent } from './pages/thank-you/thank-you.component';
import { AuthGuard } from '@bluebits/users';


const routes: Routes = [
    {
        path: 'cart',
        component: CartPageComponent
    },
    {
        path: 'checkout',
        canActivate: [AuthGuard],
        component: CheckoutPageComponent
    },
    {
        path: 'success',
        component: ThankYouComponent
    },
]


@NgModule({
  imports: [CommonModule,
    RouterModule,
    BadgeModule,
    RouterModule.forChild(routes),
    ButtonModule,
    InputNumberModule,
    FormsModule,
    InputTextModule,
    InputMaskModule,
    DropdownModule,
    ReactiveFormsModule
  ],
  declarations: [
    OrdersCartIconComponent,
    CartPageComponent,
    OrderSummaryComponent,
    CheckoutPageComponent,
    ThankYouComponent
  ],
  exports: [
    OrdersCartIconComponent,
    CartPageComponent,
    OrderSummaryComponent
  ],
})
export class OrdersModule {
    constructor(cartService: CartService) {
        cartService.initCartLocalStorage();
    }
        
}
