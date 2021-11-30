import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';
import { CardItemDetail } from '../../models/cart';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'orders-cart-page',
  templateUrl: './cart-page.component.html',
  styles: [
  ]
})
export class CartPageComponent implements OnInit, OnDestroy {

  cartItemsDetail: CardItemDetail[] = [];
  cartCount = "0";
  endSubs$: Subject<any> = new Subject();

  constructor(private router: Router, private cartService: CartService, private ordersService: OrdersService) { }

  ngOnInit(): void {
      this._getCartDetails();
  }

  ngOnDestroy() {
      this.endSubs$.next();
      this.endSubs$.complete();
  }

  private _getCartDetails() {
    this.cartService.cartSubject$.pipe(takeUntil(this.endSubs$)).subscribe(respCart => {
        this.cartItemsDetail = [];
        this.cartCount = respCart?.items?.length.toString() ?? "0";
        console.log("CART COUNT:- " + this.cartCount)
        respCart.items.forEach(cartItem => {
            this.ordersService.getProductById(cartItem.product.id).subscribe(respProduct => {
                this.cartItemsDetail.push({
                    product: respProduct,
                    quantity: cartItem.quantity
                });
            });

        });
    });
  }


  backToShop() {
      this.router.navigate(['/products']);
  }


  deleteCart(cartItem: CardItemDetail) {
      this.cartService.deleteCartItem(cartItem.product.id);
  }

  updateCartItemQuantity(event, cartItem: CardItemDetail) {
    this.cartService.setCartItem({ product: cartItem.product, quantity: event.value }, true);
  }
}
