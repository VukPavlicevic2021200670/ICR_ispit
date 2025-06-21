import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PetModel } from '../../models/pet.model';
import {NgClass, NgFor, NgIf} from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SafePipe } from '../../services/safe.pipe';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';
import {WebService} from "../../services/web.service";

@Component({
  selector: 'app-pet',
  standalone: true,
  imports: [HttpClientModule, RouterLink, NgIf, SafePipe, NgFor, NgClass],
  templateUrl: './pet.component.html',
  styleUrl: './pet.component.css'
})
export class PetComponent {

  public webService: WebService
  public userService: UserService
  public pet: PetModel | null = null;

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
}
