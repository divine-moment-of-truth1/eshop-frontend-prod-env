import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product, ProductsService } from '@bluebits/products';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'admin-products-list',
  templateUrl: './products-list.component.html',
  styles: [
  ]
})
export class ProductsListComponent implements OnInit {

  products: Product[] = [];
  endSub$: Subject<any> = new Subject();
  selectedSortOption = { name: "Alphabetical", value: "name" };

  constructor(private productService: 
    ProductsService, 
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
      this._getProducts();
  }


  updateProduct(productid) {
    this.router.navigateByUrl(`products/form/${productid}`);
  }

  deleteProduct(productId: string) {
    this.confirmationService.confirm({
        message: 'Do you want to delete this product',
        header: 'Delete product',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.productService.deleteProduct(productId)
                .pipe(takeUntil(this.endSub$))
                .subscribe(
                    () => {
                    this._getProducts();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Product deleted!'
                    });
                    },
                    () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Product not deleted!'
                    });
                    }
                );
        }
    });  
  }
  

  private _getProducts() {
      this.productService.getProductsAdmin()
        .pipe(takeUntil(this.endSub$))
        .subscribe(product => {
            this.products = product;
        })
  }

}
