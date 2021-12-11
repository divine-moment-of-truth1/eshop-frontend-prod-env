import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../models/product';
import { ProductsService } from '../../services/products.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { CartItem, CartService } from '@bluebits/orders';

@Component({
  selector: 'products-product-page',
  templateUrl: './product-page.component.html',
  styles: [
  ]
})
export class ProductPageComponent implements OnInit, OnDestroy {

  product: Product;
  endSubs$: Subject<any> = new Subject;
  quantity = 1;

  constructor(private productService: ProductsService, private activatedRoute: ActivatedRoute, private cartService: CartService) { };

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
        if(params.productid) {
            this._getProduct(params.productid);
        }
    })
  }

  ngOnDestroy(): void {
      this.endSubs$.next();
      this.endSubs$.complete();
  }

  private _getProduct(productid?: string) {
    this.productService.getProductById(productid).pipe(takeUntil(this.endSubs$)).subscribe(product => {
        this.product = product;
    })
  }

  addProductToCart() {
      const cartItem: CartItem = {
          product: this.product,
          quantity: this.quantity
      }

      this.cartService.setCartItem(cartItem);
  }

}
