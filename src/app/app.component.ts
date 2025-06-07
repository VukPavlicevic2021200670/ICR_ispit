import { Component, OnInit } from '@angular/core';
import { UserService } from './auth/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ProfileComponent } from './auth/profile/profile.component';
import { CurrentService } from './korpa/current/current.service';
import { OrdersService } from './korpa/orders/orders.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'app-kva-fitness';

  profileOpened: boolean = false;

  constructor (public userService: UserService, public dialog: MatDialog, public currentService: CurrentService, public ordersService: OrdersService) {}
  ngOnInit(): void {
    console.log(this.getTotalItems())
  }

  openProfile(userId?: number) {
    if (userId !== undefined && userId !== null && typeof userId === 'number' && !isNaN(userId)) {

    this.profileOpened = true;
    const profileDialog = this.dialog.open(ProfileComponent, {
      disableClose: true,
      width: '50vw',
      data: {user: this.userService.getUserById(userId)}
    });

    profileDialog.afterClosed().subscribe((r) => {
      this.profileOpened = false;
    })
  }
  }
  getTotalItems(): number {
    return this.currentService.getTotalItems();
  }
  logout(){
    this.userService.logout();
    this.currentService.clearCart();
    this.ordersService.clearOrders();
  }
}
