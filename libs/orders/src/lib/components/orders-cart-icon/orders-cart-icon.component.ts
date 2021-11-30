import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'orders-cart-icon',
  templateUrl: './orders-cart-icon.component.html',
  styles: [
  ]
})
export class OrdersCartIconComponent implements OnInit {

  cartCount = "0";
  
  constructor(private cartService: CartService) { }

  ngOnInit(): void {
      this.cartService.cartSubject$.subscribe(cart => {
          this.cartCount = cart?.items?.length.toString() ?? "0";
      });
  }

}
