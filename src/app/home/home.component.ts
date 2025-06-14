import { CommonModule, NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { PageModel } from '../../models/page.model';
import { FlightModel } from '../../models/flight.model';
import { SafePipe } from '../../services/safe.pipe';
import { RouterLink } from '@angular/router';
import { WebService } from '../../services/web.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    HttpClientModule,
    NgFor,
    CommonModule,
    SafePipe
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  public webService: WebService
  public flights: PageModel<FlightModel> | undefined = undefined

  constructor() {
      this.webService = WebService.getInstance()
  }

  ngOnInit(): void {
    this.webService.getRecommendedFlights().subscribe(res => this.flights = res)
  }

  public getMapUrl(): string {
    return `https://www.google.com/maps?output=embed&q=${this.flights?.content[0].destination}`
  }
}
