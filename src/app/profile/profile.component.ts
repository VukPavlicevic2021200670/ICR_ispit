import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { WebService } from '../../services/web.service';
import { UserPetModel } from '../../models/user.model';
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

  public pets: UserPetModel[] = []

  constructor(private router: Router, private route: ActivatedRoute) {
    if (!this.userService.hasActive()) {
      this.router.navigate(['/login'], { relativeTo: this.route })
      return
    }
    this.loadPets()
  }

  private loadPets() {  // Changed from loadOrders to loadPets
    try {
      this.pets = this.userService.getUserPets()!  // Changed to getUserPets
      if (this.pets.length == 0) return

      this.webService.getPetsByIds(this.pets.map(p => p.id))
          .subscribe(rsp => {
            this.pets.forEach(p => {
              p.pet = rsp.find(rp => rp.id === p.id)
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
    this.router.navigate([`/pet/${id}`], { relativeTo: this.route });
  }

  public pay(pet: UserPetModel) {
    this.userService.changePetStatus('paid', pet)  // Changed to changePetStatus
    this.loadPets()  // Changed to loadPets
  }

  public rate(pet: UserPetModel) {
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
        this.userService.changePetRating('l', pet)
        this.loadPets()
        return
      }

      if (res.isDenied) {
        // Korinsik je nezadovoljan
        this.userService.changePetRating('d', pet)
        this.loadPets()
        return
      }
    })
  }

  public cancel(order: UserPetModel) {
    this.userService.changePetStatus('canceled', order)
    this.loadPets()
  }
}
