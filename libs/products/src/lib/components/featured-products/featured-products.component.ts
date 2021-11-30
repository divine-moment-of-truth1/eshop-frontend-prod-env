import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductsService } from '../../services/products.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'products-featured-products',
  templateUrl: './featured-products.component.html',
  styles: [
  ]
})
export class FeaturedProductsComponent implements OnInit, OnDestroy {
    
    endSubs$: Subject<any> = new Subject();
    featuredProducts: Product[] = [];

  constructor(private productService: ProductsService) { }

  ngOnInit(): void {
      this._getFeaturedProducts();
  }

  ngOnDestroy(): void {
      this.endSubs$.next();
      this.endSubs$.complete();
  }


  private _getFeaturedProducts() {
      this.productService.getFeaturedProducts(4).pipe(takeUntil(this.endSubs$)).subscribe(product => {
        this.featuredProducts = product;
      })
  }

}
