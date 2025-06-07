import { Component, OnInit } from '@angular/core';
import { Proizvod } from '../../proizvodi/proizvodi.model';
import { CurrentService } from './current.service';
import { OrdersService } from '../orders/orders.service';

@Component({
  selector: 'app-current',
  templateUrl: './current.component.html',
  styleUrl: './current.component.css'
})
export class CurrentComponent implements OnInit {

  cartItems: { proizvod: Proizvod, quantity: number }[] = [];

  constructor(
    private currentService: CurrentService,
    private ordersService: OrdersService
  ) {}

  ngOnInit(): void {
    this.cartItems = this.currentService.getCartItems();
  }

  removeFromCart(proizvod: Proizvod): void {
    this.currentService.removeFromCart(proizvod);
    this.cartItems = this.currentService.getCartItems();
  }

  placeOrder(): void {
    this.ordersService.addOrder(this.cartItems);
    this.currentService.clearCart();
    this.cartItems = this.currentService.getCartItems(); // Update the cart view
  }

  increaseQuantity(proizvod: Proizvod): void {
    this.currentService.increaseQuantity(proizvod);
    this.cartItems = this.currentService.getCartItems();
  }

  decreaseQuantity(proizvod: Proizvod): void {
    this.currentService.decreaseQuantity(proizvod);
    this.cartItems = this.currentService.getCartItems();
  }

  getTotal(): number {
    return this.currentService.getTotal();
  }

}