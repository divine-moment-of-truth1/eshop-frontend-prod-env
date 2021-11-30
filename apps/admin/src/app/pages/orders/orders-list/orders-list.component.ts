import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order, OrdersService, ORDER_STATUS } from '@bluebits/orders';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-orders-list',
  templateUrl: './orders-list.component.html',
  styles: []
})
export class OrdersListComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  orderStatus = ORDER_STATUS;
  endSub$: Subject<any> = new Subject();

  constructor(
    private ordersService: OrdersService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._getOrders();
    // console.log(this.orderStatus[order.status].label)
  }

  ngOnDestroy(): void {
      this.endSub$.next();
      this.endSub$.complete();
  }

  _getOrders() {
    this.ordersService.getOrders()
        .pipe(takeUntil(this.endSub$))
        .subscribe((orders) => {
            this.orders = orders;
        });
  }

  showOrder(orderId) {
    this.router.navigateByUrl(`orders/${orderId}`);
  }

  deleteOrder(orderId: string) {
    this.confirmationService.confirm({
      message: 'Do you want to Delete this Order?',
      header: 'Delete Order',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ordersService.deleteOrder(orderId)
            .pipe(takeUntil(this.endSub$))
            .subscribe(
                () => {
                    this._getOrders();
                    this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Order was deleted!'
                    });
                },
                () => {
                    this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Order was not deleted!'
                    });
                }
            );
        }
    });
  }
}
