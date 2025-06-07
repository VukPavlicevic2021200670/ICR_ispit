import { Injectable } from '@angular/core';
import { Proizvod } from '../../proizvodi/proizvodi.model';
import { Order } from './orders.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private orders: Order[] = [];

  addOrder(cartItems: { proizvod: Proizvod, quantity: number }[]): void {
    const newOrders: Order[] = cartItems.map(item => ({
      proizvod: item.proizvod,
      quantity: item.quantity,
      status: 'u toku',
      reviewed: false
    }));
    this.orders.push(...newOrders);
    newOrders.forEach(order => this.startOrderTimer(order));
  }

  getOrders(): Order[] {
    return this.orders;
  }

  clearOrders(): void{
    this.orders = [];
  }

  updateOrderStatus(order: Order, status: 'u toku' | 'pristigo' | 'otkazano'): void {
    order.status = status;
  }

  removeOrder(order: Order): void {
    const index = this.orders.findIndex(o => o.proizvod === order.proizvod);
    if (index !== -1) {
      this.orders.splice(index, 1);
    }
  }

  addReview(order: Order, review: number): void {
    order.review = review;
    order.proizvod.reviews = order.proizvod.reviews || [];
    order.proizvod.reviews.push(review);
    order.reviewed = true;
  }

  private startOrderTimer(order: Order): void {
    setTimeout(() => {
      if (order.status === 'u toku') {
        this.updateOrderStatus(order, 'pristigo');
      }
    }, 10000);
  }
}