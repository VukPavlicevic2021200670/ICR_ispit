import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FlightModel } from '../../models/flight.model';
import { WebService } from '../../services/web.service';
import { NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SafePipe } from '../../services/safe.pipe';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-flight',
  standalone: true,
  imports: [HttpClientModule, RouterLink, NgIf, SafePipe],
  templateUrl: './flight.component.html',
  styleUrl: './flight.component.css'
})
export class FlightComponent {

  public webService: WebService
  public userService: UserService
  public flight: FlightModel | null = null;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.webService = WebService.getInstance()
    this.userService = UserService.getInstance()
    route.params.subscribe(params => {
      // Preuzimamo variajble iz putanje
      const id = params['id']

      // Preuzimamo JSON objekat leta za ID
      this.webService.getFlightById(id)
        .subscribe(rsp => this.flight = rsp)
    })
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

  public getMapUrl(): string {
    return `https://www.google.com/maps?output=embed&q=${this.flight?.destination}`
  }
}
