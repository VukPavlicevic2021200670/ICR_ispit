import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { WebService } from '../../services/web.service';
import { PageModel } from '../../models/page.model';
import { PetModel } from '../../models/pet.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [RouterLink, CommonModule, HttpClientModule, FormsModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
  public webService: WebService;
  public userService: UserService;
  public data: PageModel<PetModel> | null = null;
  public pageSize = 10; // Default page size
  public searchName = '';
  public searchBreed = '';
  public searchPetSize = '';
  public searchAge = '';
  public searchPriceRange = '';

  constructor(private router: Router, private route: ActivatedRoute) {
    this.webService = WebService.getInstance();
    this.userService = UserService.getInstance();

    // Get initial page from query params or default to 0
    this.route.queryParams.subscribe(params => {
      const page = params['page'] ? parseInt(params['page']) : 0;
      this.getPetData(page);
    });
  }

  // list.component.ts
  public getPetData(page = 0, size = this.pageSize) {
    this.webService.getPets(
        page,
        size,
        this.searchName,
        this.searchBreed,
        this.searchPetSize,
        this.searchAge,
        this.searchPriceRange
    ).subscribe({
      next: (rsp) => {
        this.data = rsp;
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { page },
          queryParamsHandling: 'merge'
        });
      },
          error: (err) => {
            console.error('Error fetching pets:', err);
            this.data = {
              content: [],
              pageable: {
                sort: { sorted: false, empty: true, unsorted: true },
                pageNumber: 0,
                pageSize: size,
                offset: 0,
                paged: true,
                unpaged: false
              },
              totalPages: 0,
              totalElements: 0,
              last: true,
              size: size,
              number: page,
              sort: { sorted: false, empty: true, unsorted: true },
              numberOfElements: 0,
              first: true,
              empty: true
            };
          }
        });
  }

// Update your navigation methods to use pageable.pageNumber
  public first() {
    this.getPetData(0);
  }

  public previous() {
    if (!this.data) return;
    this.getPetData(this.data.number - 1);
  }

  public next() {
    if (!this.data) return;
    this.getPetData(this.data.number + 1);
  }

  public last() {
    if (!this.data) return;
    this.getPetData(this.data.totalPages - 1);
  }
  public search() {
    // Reset to first page when searching
    this.getPetData(0);
  }

  public resetFilters() {
    this.searchName = '';
    this.searchBreed = '';
    this.searchPetSize = '';
    this.searchAge = '';
    this.searchPriceRange = '';
    this.getPetData(0); // Reset to first page
  }

  public doAddToCart(id: number) {
    AlertService.question('Add to cart', `Do you want to add pet ${id} to cart?`)
        .then(rsp => {
          if (rsp.isConfirmed) {
            if (!this.userService.hasActive()) {
              AlertService.error('You have to be signed in', 'You cant add pets to the cart if you are not signed in!');
              this.router.navigate(['/login'], {
                queryParams: { from: this.router.url },
                relativeTo: this.route
              });
              return;
            }
            this.userService.addToCart(id);
            this.router.navigate(['/profile'], { relativeTo: this.route });
          }
        });
  }
}