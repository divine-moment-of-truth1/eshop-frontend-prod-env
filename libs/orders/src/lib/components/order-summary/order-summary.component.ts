import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'orders-order-summary',
  templateUrl: './order-summary.component.html',
  styles: [
  ]
})
export class OrderSummaryComponent implements OnInit, OnDestroy {

  isCheckout = false;
  endSubs$: Subject<any> = new Subject();
  totalPrice: number;

  constructor(private router: Router, private cartService: CartService, private orderService: OrdersService) {
    this.router.url.includes('checkout') ? this.isCheckout = true : this.isCheckout = false;
  }

  ngOnInit(): void {
      this._getOrderSummary();
  }

  ngOnDestroy(): void {
      this.endSubs$.next();
      this.endSubs$.complete();
  }

  private _getOrderSummary() {
      this.cartService.cartSubject$.pipe(takeUntil(this.endSubs$)).subscribe((cart) => {
          this.totalPrice = 0;
          if (cart) {
              cart.items.map((item) => {
                  this.orderService
                    .getProductById(item.product.id)
                    .pipe(take(1))
                    .subscribe((product) => {
                        this.totalPrice += product.price * item.quantity;
                    });
              });
          }
      });
  }

  navigateToCheckout() {
      console.log(this.isCheckout);
    this.router.navigate(['/checkout'])
  }

}
