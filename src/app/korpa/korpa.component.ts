import { Component, OnInit } from '@angular/core';
import { Proizvod } from '../proizvodi/proizvodi.model';
import { KorpaService } from './korpa.service';
import { UserService } from '../auth/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-korpa',
  templateUrl: './korpa.component.html',
  styleUrl: './korpa.component.css'
})
export class KorpaComponent implements OnInit {

  cartItems: { proizvod: Proizvod, quantity: number }[] = [];

  constructor(private korpaService: KorpaService, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.cartItems = this.korpaService.getCartItems();
    if(!this.userService.currentUser){
      this.router.navigate(['/login']);
    }
  }

  removeFromCart(proizvod: Proizvod): void {
    this.korpaService.removeFromCart(proizvod);
    this.cartItems = this.korpaService.getCartItems(); // Update cart items after removal
  }

  increaseQuantity(proizvod: Proizvod): void {
    this.korpaService.increaseQuantity(proizvod);
    this.cartItems = this.korpaService.getCartItems(); // Update cart items after increasing quantity
  }

  decreaseQuantity(proizvod: Proizvod): void {
    this.korpaService.decreaseQuantity(proizvod);
    this.cartItems = this.korpaService.getCartItems(); // Update cart items after decreasing quantity
  }

  getTotal(): number {
    return this.korpaService.getTotal();
  }
}