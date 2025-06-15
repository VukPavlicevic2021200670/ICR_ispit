import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { WebService } from '../../services/web.service';
import { PageModel } from '../../models/page.model';
import { FlightModel } from '../../models/flight.model';
import { NgFor, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';
import {PetModel} from "../../models/pet.model";

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [RouterLink, NgIf, HttpClientModule, RouterLink, NgFor],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {

  public webService: WebService
  public userService: UserService
  public data: PageModel<PetModel> | null = null

  constructor(private router: Router, private route: ActivatedRoute) {
    this.webService = WebService.getInstance()
    this.userService = UserService.getInstance()
    this.getPetData()
  }

  public getPetData(page = 0) {
    this.webService.getPets(page)
      .subscribe(rsp => this.data = rsp)
  }

  public first() {
    this.getPetData()
  }

  public previous() {
    if (this.data == undefined) return
    if (this.data.first) return
    this.getPetData(this.data.number - 1)
  }

  public next() {
    if (this.data == undefined) return
    if (this.data.last) return
    this.getPetData(this.data.number + 1)
  }

  public last() {
    if (this.data == undefined) return
    if (this.data.last) return
    this.getPetData(this.data.totalPages - 1)
  }

  public doAddToCart(id: number) {
    AlertService.question('Add to cart', `Do you want to add flight ${id} to cart?`)
      .then(rsp => {
        if (rsp.isConfirmed) {
          if (!this.userService.hasActive()) {
            AlertService.error('You have to be signed in', 'You cant add flights to the cart if you are not signed in!')
            this.router.navigate(['/login'], { queryParams: { from: '/flight/' + id }, relativeTo: this.route });
            return
          }

          this.userService.addToCart(id)
          this.router.navigate(['/profile'], { relativeTo: this.route })
        }
      })
  }

}
