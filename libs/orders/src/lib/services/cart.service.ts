import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../models/cart';

export const CART_KEY = "cart";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartSubject$: BehaviorSubject<Cart> = new BehaviorSubject(this.getCart());

  constructor() { }

  initCartLocalStorage() {
      const cart: Cart = this.getCart();

      if(!cart) {
        const initialCart = {
            items: []
        };
        const initialCartJson = JSON.stringify(initialCart);
        localStorage.setItem(CART_KEY, initialCartJson);
      } else {
        this.cartSubject$.next(cart);
      }
  }

  emptyCart() {
    const initialCart = {
        items: []
    };
    const initialCartJson = JSON.stringify(initialCart);
    localStorage.setItem(CART_KEY, initialCartJson);
    this.cartSubject$.next(initialCart);
  }


  getCart() : Cart {
    const cartJsonString: string = localStorage.getItem(CART_KEY);
    const cart: Cart = JSON.parse(cartJsonString)
    return cart;
  }


  setCartItem(cartItem: CartItem, updateCartItem?: boolean): Cart {
    const cart = this.getCart();

    const cartItemExist = cart.items.find((item) => item.product.id === cartItem.product.id);

    if(cartItemExist) {
        cart.items.map((item) => {
            if(item.product.id === cartItem.product.id) {

                if (updateCartItem) {
                    item.quantity = cartItem.quantity;
                } else {
                    item.quantity = item.quantity + cartItem.quantity;
                }
                // return item;
            }
        });
    } else {
        cart.items.push(cartItem);
    }

    const cartJson = JSON.stringify(cart);
    localStorage.setItem(CART_KEY, cartJson);
    this.cartSubject$.next(cart);

    return cart;
  }

  deleteCartItem(productId: string) {
    const cart = this.getCart();

    const newCart = cart.items.filter(item => item.product.id !== productId);

    cart.items = newCart;

    const cartJsonString = JSON.stringify(cart);
    localStorage.setItem(CART_KEY, cartJsonString);

    this.cartSubject$.next(cart);

  }

}
