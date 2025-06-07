import { Component, OnInit } from '@angular/core';
import { OrdersService } from './orders.service';
import { Proizvod } from '../../proizvodi/proizvodi.model';
import { Order } from './orders.model';
import { MatDialog } from '@angular/material/dialog';
import { ReviewComponent } from './review/review.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  reviewingOrder: Order | null = null;
  reviewValue: number = 1;

  constructor(private ordersService: OrdersService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.orders = this.ordersService.getOrders();
  }

  increaseQuantity(order: Order): void {
    order.quantity += 1;
  }

  decreaseQuantity(order: Order): void {
    if (order.quantity > 1) {
      order.quantity -= 1;
    }
  }

  cancelOrder(order: Order): void {
    this.ordersService.updateOrderStatus(order, 'otkazano');
  }

  removeOrder(order: Order): void {
    this.ordersService.removeOrder(order);
    this.orders = this.ordersService.getOrders(); 
  }

  reviewOrder(order: Order): void {
    this.reviewingOrder = order;
    this.reviewValue = order.review || 1;
  }

  submitReview(): void {
    if (this.reviewingOrder) {
      this.ordersService.addReview(this.reviewingOrder, this.reviewValue);
      this.reviewingOrder = null;
    }
  }

  cancelReview(): void {
    this.reviewingOrder = null;
  }
  openReviewDialog(order: Order): void {
    const dialogRef = this.dialog.open(ReviewComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log('Review submitted:', result);
      this.ordersService.addReview(order, result)
      
    });
  }
}