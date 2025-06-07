import { Component, OnInit } from '@angular/core';
import { Proizvod } from './proizvodi.model';
import { ProizvodService } from './proizvodi.service';
import { CurrentService } from '../korpa/current/current.service';
import { UserService } from '../auth/user.service';

interface FilterValues {
  cena: { min: number | null; max: number | null };
  totalCena: { min: number | null; max: number | null };
  tag: Set<string>;
  kolekcija: Set<string>;
  searchTerm: string;
}

@Component({
  selector: 'app-proizvodi',
  templateUrl: './proizvodi.component.html',
  styleUrl: './proizvodi.component.css'
})
export class ProizvodiComponent implements OnInit {
  constructor(private proizvodiService: ProizvodService, private currentService: CurrentService, private userService: UserService) {}

  proizvodi: Proizvod[] = [];
  filteredProizvodi: Proizvod[] = [];
  tags: Set<string> = new Set();
  collections: Set<string> = new Set();
  filterValues: FilterValues = {
    cena: { min: null, max: null },
    totalCena: { min: null, max: null },
    tag: new Set<string>(),
    kolekcija: new Set<string>(),
    searchTerm: ''
  };

  ngOnInit(): void {
    this.proizvodi = this.proizvodiService.getProizvodi();
    this.filteredProizvodi = this.proizvodi;
    this.updatePriceRange();

    this.filterValues.cena.min = this.filterValues.totalCena.min;
    this.filterValues.cena.max = this.filterValues.totalCena.max;
    
    this.proizvodi.forEach(proizvod => {
      proizvod.tag.forEach(tag => this.tags.add(tag));
      this.collections.add(proizvod.kolekcija);
    });
  }

  calculateAverageReview(reviews: (number | string)[]): number {
    if (!reviews || reviews.length === 0) {
      return 0;
    }
    const numericReviews = reviews.map(review => typeof review === 'string' ? parseFloat(review) : review);
    const sum = numericReviews.reduce((a, b) => a + b, 0); // Sum of all reviews
    return sum / numericReviews.length; // Average review
  }
  
  
  doFilter(): void {
    this.filteredProizvodi = this.proizvodi.filter(proizvod => {
      const matchesCena =
        this.filterValues.cena &&
        (proizvod.cena &&
          proizvod.cena >= (this.filterValues.cena.min ?? Number.MIN_VALUE) &&
          proizvod.cena <= (this.filterValues.cena.max ?? Number.MAX_VALUE));
      const matchesTags =
        this.filterValues.tag.size === 0 ||
        proizvod.tag.some(tag => this.filterValues.tag.has(tag));
      const matchesKolekcija =
        this.filterValues.kolekcija.size === 0 ||
        this.filterValues.kolekcija.has(proizvod.kolekcija);
      const matchesSearchTerm =
        !this.filterValues.searchTerm ||
        proizvod.name.toLowerCase().includes(this.filterValues.searchTerm.toLowerCase());
      return matchesCena && matchesTags && matchesKolekcija && matchesSearchTerm;
    });
  }

  updatePriceRange(): void {
    const allProizvodi = this.proizvodiService.getProizvodi();

    if (allProizvodi.length === 0) {
      this.filterValues.cena.min = 0;
      this.filterValues.cena.max = 0;
      return;
    }

    let minPrice = allProizvodi[0].cena;
    let maxPrice = allProizvodi[0].cena;

    allProizvodi.forEach(proizvod => {
      minPrice = Math.min(minPrice, proizvod.cena);
      maxPrice = Math.max(maxPrice, proizvod.cena);
    });

    this.filterValues.totalCena.min = minPrice;
    this.filterValues.totalCena.max = maxPrice;
  }

  onPriceChange(): void {
    this.doFilter();
  }

  onSearchChange(): void {
    this.doFilter();
  }

  updateCheckboxFilter(value: string, filterSet: Set<string>): void {
    if (filterSet.has(value)) {
      filterSet.delete(value);
    } else {
      filterSet.add(value);
    }
    this.doFilter();
  }

  addToCart(proizvod: Proizvod): void {
    if(!this.userService.currentUser){}
    else{
    this.currentService.addToCart(proizvod);
    }
  }
}
