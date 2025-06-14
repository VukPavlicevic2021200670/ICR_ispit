import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PetModel } from '../../models/pet.model';
import { MockapiService } from '../../services/mockapi.service';
import { NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SafePipe } from '../../services/safe.pipe';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-pet',
  standalone: true,
  imports: [HttpClientModule, RouterLink, NgIf, SafePipe],
  templateUrl: './pet.component.html',
  styleUrl: './pet.component.css'
})
export class PetComponent {

  public pet: PetModel | null = null;

  constructor(
      private router: Router,
      private route: ActivatedRoute,
      private mockApi: MockapiService,
      private userService: UserService
  ) {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.mockApi.getPetById(id).subscribe(pet => this.pet = pet ?? null);
    });
  }

  public doAddToCart(id: number) {
    AlertService.question('Add to cart', `Do you want to adopt pet ${id}?`)
        .then(rsp => {
          if (rsp.isConfirmed) {
            if (!this.userService.hasActive()) {
              AlertService.error('You have to be signed in', 'You can’t add pets to the cart if you are not signed in!');
              this.router.navigate(['/login'], { queryParams: { from: '/pet/' + id }, relativeTo: this.route });
              return;
            }

            this.userService.addToCart(id);
            this.router.navigate(['/profile'], { relativeTo: this.route });
          }
        });
  }
}
