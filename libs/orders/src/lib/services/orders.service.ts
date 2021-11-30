import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Order } from '../models/order';
import { environment } from '@env/environment';
import { OrderItem } from '../models/order-item';
import { StripeService } from 'ngx-stripe';


@Injectable({
  providedIn: 'root'
})
export class OrdersService {

    apiURLOrders = environment.apiUrl + 'orders';
    apiURLProducts = environment.apiUrl + 'products';

    constructor(private http: HttpClient, private stripeService: StripeService) { }

    getOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(this.apiURLOrders);
    }

    getOrderById(orderId: string): Observable<Order> {
        return this.http.get<Order>(`${this.apiURLOrders}/${orderId}`);
    }

    createOrder(order: Order): Observable<Order> {
        return this.http.post<Order>(this.apiURLOrders, order);
    }

    deleteOrder(orderId: string): Observable<any> {
        return this.http.delete<any>(`${this.apiURLOrders}/${orderId}`);
    }

    updateOrder(orderStatus: { status: string }, orderId: string): Observable<Order> {
         return this.http.put<Order>(`${this.apiURLOrders}/${orderId}`, orderStatus)
    }

    getOrdersCount(): Observable<number>  {
        return this.http
            .get<number>(this.apiURLOrders + '/get/count')
            .pipe(map((objectValue: any) => objectValue.orderCount));
    }

    getTotalSales(): Observable<number> {
        return this.http
            .get<number>(this.apiURLOrders + '/get/totalSales')
            .pipe(map((objectValue: any) => objectValue.totalSales));
    }

    getProductById(productId: string): Observable<any> {
        return this.http.get<any>(`${this.apiURLProducts}/${productId}`);
    }

    createCheckoutSession(orderItems: OrderItem[]) {
        return this.http.post<any>(`${this.apiURLOrders}/create-checkout-session`, orderItems).pipe(
            switchMap((session: { id: string } ) => {
                return this.stripeService.redirectToCheckout({ sessionId: session.id })
            })
        );
    }

    cacheOrderData(order: Order) {
        localStorage.setItem('orderData', JSON.stringify(order));
    }

    getCachedOrderData(): Order {
        return JSON.parse(localStorage.getItem('orderData'))
    }

    removCachedOrderData() {
        localStorage.removeItem('orderData');
    }
}
