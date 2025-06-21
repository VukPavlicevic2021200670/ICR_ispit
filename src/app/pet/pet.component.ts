import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {PetModel, ReviewModel} from '../../models/pet.model';
import {NgClass, NgFor, NgIf} from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SafePipe } from '../../services/safe.pipe';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';
import {WebService} from "../../services/web.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-pet',
  standalone: true,
  imports: [HttpClientModule, RouterLink, NgIf, SafePipe, NgFor, NgClass, FormsModule],
  templateUrl: './pet.component.html',
  styleUrl: './pet.component.css'
})
export class PetComponent {

  public webService: WebService
  public userService: UserService
  public pet: PetModel | null = null;
  public newReview: Partial<ReviewModel> = {
    rating: 5,
    comment: ''
  };

  constructor(private router: Router, private route: ActivatedRoute) {
    this.webService = WebService.getInstance()
    this.userService = UserService.getInstance()
    route.params.subscribe(params => {
      // Preuzimamo variajble iz putanje
      const id = params['id']

      // Preuzimamo JSON objekat leta za ID
      this.webService.getPetById(id)
          .subscribe(rsp => this.pet = rsp)
    })
  }

  public doAddToCart(id: number) {
    AlertService.question('Add to cart', `Do you want to add pet ${id} to cart?`)
        .then(rsp => {
          if (rsp.isConfirmed) {
            if (!this.userService.hasActive()) {
              AlertService.error('You have to be signed in', 'You cant add flights to the cart if you are not signed in!')
              this.router.navigate(['/login'], { queryParams: { from: '/flight/' + id }, relativeTo: this.route });
              return
            }

            this.userService.addPetToCart(id)
            this.router.navigate(['/profile'], { relativeTo: this.route })
          }
        })
  }
  public canAddReview(): boolean {
    if (!this.pet || !this.userService.hasActive()) return false;

    const userPets = this.userService.getUserPets();
    if (!userPets) return false;

    // Check if user has this pet with status 'paid' and hasn't reviewed it yet
    const userPet = userPets.find(p => p.id === this.pet?.id && p.status === 'paid');
    if (!userPet) return false;

    // Check if user already reviewed this pet
    const userEmail = this.userService.getActive() as string;
    return !this.pet.reviews.some(r => r.author === userEmail);
  }

  public submitReview() {
    if (!this.pet || !this.userService.hasActive()) return;

    const userEmail = this.userService.getActive() as string;
    const review: Partial<ReviewModel> = {
      author: userEmail,
      rating: Number(this.newReview.rating),
      comment: this.newReview.comment || ''
    };

    this.webService.addReview(this.pet.id, review).subscribe({
      next: (updatedPet) => {
        this.pet = updatedPet;
        this.newReview = { rating: 5, comment: '' };
        AlertService.info('Review Submitted');
      },
      error: (err) => {
        console.error('Error submitting review:', err);
        AlertService.error('Error', 'Failed to submit review. Please try again.');
      }
    });
  }
}
