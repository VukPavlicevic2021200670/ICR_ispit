import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { WebService } from '../../services/web.service';
import { UserPetModel } from '../../models/user.model';
import Swal from 'sweetalert2';
import { AlertService } from '../../services/alert.service';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  public userService = UserService.getInstance()
  public webService = WebService.getInstance()

  public searchPetName = '';
  public searchBreed = '';
  public searchStatus = '';

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

  public get filteredPets(): UserPetModel[] {
    return this.pets.filter(pet => {
      const nameMatch = pet.pet?.name?.toLowerCase().includes(this.searchPetName.toLowerCase()) ?? false;
      const breedMatch = pet.pet?.breed?.toLowerCase().includes(this.searchBreed.toLowerCase()) ?? false;
      const statusMatch = this.searchStatus ? pet.status === this.searchStatus : true;
      return nameMatch && breedMatch && statusMatch;
    });
  }

  // Add these methods to the component class
  public editPet(pet: UserPetModel) {
    Swal.fire({
      title: 'Edit Pet Adoption',
      html: `
      <div class="mb-3">
        <label class="form-label">Status</label>
        <select id="status" class="form-select">
          <option value="reserved" ${pet.status === 'reserved' ? 'selected' : ''}>Reserved</option>
          <option value="paid" ${pet.status === 'paid' ? 'selected' : ''}>Paid</option>
          <option value="canceled" ${pet.status === 'canceled' ? 'selected' : ''}>Canceled</option>
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label">Rating</label>
        <select id="rating" class="form-select">
          <option value="na" ${pet.rating === 'na' ? 'selected' : ''}>Not Rated</option>
          <option value="l" ${pet.rating === 'l' ? 'selected' : ''}>Like</option>
          <option value="d" ${pet.rating === 'd' ? 'selected' : ''}>Dislike</option>
        </select>
      </div>
    `,
      showCancelButton: true,
      confirmButtonText: 'Save',
      preConfirm: () => {
        return {
          status: (document.getElementById('status') as HTMLSelectElement).value,
          rating: (document.getElementById('rating') as HTMLSelectElement).value
        }
      }
    }).then(result => {
      if (result.isConfirmed) {
        this.userService.changePetStatus(result.value.status as any, pet);
        this.userService.changePetRating(result.value.rating as any, pet);
        this.loadPets();
      }
    });
  }

  public cancel(order: UserPetModel) {
    this.userService.changePetStatus('canceled', order)
    this.loadPets()
  }
}
