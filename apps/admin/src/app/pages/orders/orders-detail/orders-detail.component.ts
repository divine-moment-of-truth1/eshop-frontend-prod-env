import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order, OrdersService, ORDER_STATUS } from '@bluebits/orders';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'admin-orders-detail',
  templateUrl: './orders-detail.component.html',
  styles: []
})
export class OrdersDetailComponent implements OnInit, OnDestroy {
  order: Order;
  orderStatuses = [];
  selectedStatus: any;
  // orderItems: OrderItem[] = [];
  endSub$: Subject<any> = new Subject();

  constructor(
    private orderService: OrdersService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._mapOrderStatus();
    this._getOrder();
  }

  ngOnDestroy(): void {
    this.endSub$.next();
    this.endSub$.complete();
  }

  private _mapOrderStatus() {
    this.orderStatuses = Object.keys(ORDER_STATUS).map((key) => {
      return {
        id: key,
        name: ORDER_STATUS[key].label
      };
    });
  }

  private _getOrder() {
    this.route.params
        .pipe(takeUntil(this.endSub$))
        .subscribe((params) => {
            if (params.id) {
                this.orderService.getOrderById(params.id).subscribe((order) => {
                    this.order = order;
                    this.selectedStatus = order.status;
                });
            }
        });
  }

  onStatusChange(event) {
    this.orderService.updateOrder({ status: event.value }, this.order.id)
        .pipe(takeUntil(this.endSub$))
        .subscribe(
            () => {
                this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Order is updated!'
                });
            },
            () => {
                this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Order is not updated!'
                });
            }
        );
  }
}
