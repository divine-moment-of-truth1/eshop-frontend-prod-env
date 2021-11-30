import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '@bluebits/users';
import { Subject } from 'rxjs';
import { Cart } from '../../models/cart';
import { Order } from '../../models/order';
import { OrderItem } from '../../models/order-item';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'orders-checkout-page',
  templateUrl: './checkout-page.component.html',
  styles: [
  ]
})
export class CheckoutPageComponent implements OnInit, OnDestroy {
  checkoutFormGroup: FormGroup;
  isSubmitted = false;
  orderItems: OrderItem[] = [];
  obtainedAllFormData = false;
  userId: string;
  countries = [];
  endSub$: Subject<any> = new Subject();

  constructor(private router: Router, 
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private cartSrvice: CartService,
    private orderService: OrdersService
  ) { }

  ngOnInit(): void {
    this._initCheckoutForm();
    this._autoFillUserData();
    this._getCartItems();
    this._getCountries();
  }

  ngOnDestroy() {
      this.endSub$.next();
      this.endSub$.complete();
  }

  private _autoFillUserData() {
    this.usersService
        .observeCurrentUser()
        .pipe(takeUntil(this.endSub$))
        .subscribe(user => {
            console.log("USER:- " + user)
            if(user) {
                this.userId = user.id;
                this.checkoutForm.name.setValue(user.name);
                this.checkoutForm.email.setValue(user.email);
                this.checkoutForm.phone.setValue(user.phone);
                this.checkoutForm.city.setValue(user.city);
                this.checkoutForm.country.setValue(user.country);
                this.checkoutForm.zip.setValue(user.zip);
                this.checkoutForm.apartment.setValue(user.apartment);
                this.checkoutForm.street.setValue(user.street);  
        }
    })
  }
  
  private _initCheckoutForm() {
    this.checkoutFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      phone: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      zip: ['', Validators.required],
      apartment: [''],
      street: ['', Validators.required]
    });
  }

  private _getCountries() {
    this.countries = this.usersService.getCountries();
  }

  private _getCartItems() {
      const cart: Cart = this.cartSrvice.getCart();
      this.orderItems = cart.items.map(item => {
          return {
              product: item.product,
              quantity: item.quantity
          };
      });
  }

  backToCart() {
    this.router.navigate(['/cart']);
  }

  get checkoutForm() {
    return this.checkoutFormGroup.controls;
  }

  placeOrder() {
      this.isSubmitted = true;
      if(this.checkoutFormGroup.invalid) {
          return;
      }

      const order: Order = {
        orderItems: this.orderItems,
        shippingAddress1: this.checkoutForm.street.value,
        shippingAddress2: this.checkoutForm.apartment.value,
        city: this.checkoutForm.city.value,
        zip: this.checkoutForm.zip.value,
        country: this.checkoutForm.country.value,
        phone: this.checkoutForm.phone.value,
        status: 0,
        user: this.userId,
        dateOrdered: `${Date.now()}`
      };

      this.orderService.cacheOrderData(order);

      this.orderService.createCheckoutSession(this.orderItems).subscribe(error => {
        if(error) {
            console.log('Error in redirect to payment');
        }
    });

  }

}
