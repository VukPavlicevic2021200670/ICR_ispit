import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Proizvod } from '../../proizvodi/proizvodi.model';

@Injectable({
  providedIn: 'root'
})
export class CurrentService {
  constructor(private snackBar: MatSnackBar){}
    private cartItems: { proizvod: Proizvod, quantity: number }[] = [];
  
    addToCart(proizvod: Proizvod): void {
      const item = this.cartItems.find(item => item.proizvod === proizvod);
      if (item) {
        item.quantity += 1;
      } else {
        this.cartItems.push({ proizvod, quantity: 1 });
      }
      const snackBarRef = this.snackBar.open('Proizvod dodat u korpu!', 'Undo', { duration: 3000 });

    snackBarRef.onAction().subscribe(() => {
      this.decreaseQuantity(proizvod);
    });
    }
  
    removeFromCart(proizvod: Proizvod): void {
      const index = this.cartItems.findIndex(item => item.proizvod === proizvod);
      if (index > -1) {
        this.cartItems.splice(index, 1);
      }
    }
  
    increaseQuantity(proizvod: Proizvod): void {
      const item = this.cartItems.find(item => item.proizvod === proizvod);
      if (item) {
        item.quantity += 1;
      }
    }
  
    decreaseQuantity(proizvod: Proizvod): void {
      const item = this.cartItems.find(item => item.proizvod === proizvod);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else if (item && item.quantity === 1) {
        this.removeFromCart(proizvod);
      }
    }
  
    getCartItems(): { proizvod: Proizvod, quantity: number }[] {
      return this.cartItems;
    }
  
    getTotal(): number {
      return this.cartItems.reduce((total, item) => total + item.proizvod.cena * item.quantity, 0);
    }

    getTotalItems(): number {
        return this.cartItems.reduce((total, item) => total + item.quantity, 0);
      }
      clearCart(): void {
        this.cartItems = [];
      }
      
  }