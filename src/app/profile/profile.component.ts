import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { WebService } from '../../services/web.service';
import { UserOrderModel } from '../../models/user.model';
import Swal from 'sweetalert2';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  public userService = UserService.getInstance()
  public webService = WebService.getInstance()

  public orders: UserOrderModel[] = []

  constructor(private router: Router, private route: ActivatedRoute) {
    if (!this.userService.hasActive()) {
      this.router.navigate(['/login'], { relativeTo: this.route })
      return
    }
    this.loadOrders()
  }

  private loadOrders() {
    try {
      this.orders = this.userService.getUserOrders()!
      if (this.orders.length == 0) return

      // Retrieve flights by id from orders
      this.webService.getPetsByIds(this.orders.map(o => o.id))
        .subscribe(rsp => {
          this.orders.forEach(o => {
            o.pet = rsp.find(ro => ro.id === o.id)
          })
        })
    } catch (e) {
      this.userService.logout()
      this.router.navigate(['/login'], { relativeTo: this.route })
    }
  }

  public doResetPassword() {
    const input = prompt('Enter your new password')
    if (input == null) {
      AlertService.error('Password reset failed','Password cannot be empty!')
      return
    }

    this.userService.changePassword(input as string)
  }

  public details(id: number) {
    this.router.navigate([`/flight/${id}`], { relativeTo: this.route });
  }

  public pay(order: UserOrderModel) {
    this.userService.changeOrderStatus('paid', order)
    this.loadOrders()
  }

  public rate(order: UserOrderModel) {
    // TODO: Implemenitrati rating
    Swal.fire({
      title: 'Leave a rating',
      text: 'Did you enjoy flying with us?',
      icon: 'question',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: '<i class="fa-solid fa-thumbs-up"></i>',
      cancelButtonText: 'cancel',
      denyButtonText: '<i class="fa-solid fa-thumbs-down"></i>',
      customClass: {
        popup: 'card',
        confirmButton: 'btn btn-success',
        denyButton: 'btn btn-danger',
        cancelButton: 'btn btn-primary'
      }
    }).then(res => {
      if (res.isConfirmed) {
        // Korinsik je zadovoljan
        this.userService.changeOrderRating('l', order)
        this.loadOrders()
        return
      }

      if (res.isDenied) {
        // Korinsik je nezadovoljan
        this.userService.changeOrderRating('d', order)
        this.loadOrders()
        return
      }
    })
  }

  public cancel(order: UserOrderModel) {
    this.userService.changeOrderStatus('canceled', order)
    this.loadOrders()
  }
}
