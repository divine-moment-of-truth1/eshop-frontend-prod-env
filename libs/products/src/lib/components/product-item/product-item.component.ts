import { Component, Input } from '@angular/core';
import { Product } from '../../models/product';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { CartService, CartItem } from '@bluebits/orders';


@Component({
  selector: 'products-product-item',
  templateUrl: './product-item.component.html',
  styles: [
  ]
})
export class ProductItemComponent {
  @Input() product: Product;

  constructor(private cartService: CartService) { }

  addProductToCart() {
    const cartItem: CartItem = {
        product: this.product,
        quantity: 1
    }

    this.cartService.setCartItem(cartItem);
  }
}
