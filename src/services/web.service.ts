import {HttpClient, HttpParams} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PageModel } from '../models/page.model';
import { RasaModel } from '../models/rasa.model';
import {PetModel, ReviewModel} from '../models/pet.model';
import { v4 as uuidv4 } from 'uuid';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WebService {

  private static instance: WebService
  private baseUrl: string
  private client: HttpClient

  private constructor() {
    this.baseUrl = "http://localhost:3000/api"
    this.client = inject(HttpClient)
  }

  public static getInstance() {
    if (this.instance == undefined)
      this.instance = new WebService()
    return this.instance
  }

  // web.service.ts
  public getPets(
      page = 0,
      size = 10,
      name?: string,
      breed?: string,
      petSize?: string,
      age?: string,
      priceRange?: string
  ): Observable<PageModel<PetModel>> {
    let params = new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString());

    if (name) params = params.set('name', name);
    if (breed) params = params.set('breed', breed);
    if (petSize) params = params.set('petSize', petSize); // Pet size filter
    if (age) params = params.set('age', age);
    if (priceRange) params = params.set('priceRange', priceRange);

    return this.client.get<PageModel<PetModel>>(`${this.baseUrl}/pets`, { params });
  }

  public getRecommendedPets() {
    return this.getPets(0, 3)
  }

  public getPetById(id: number) {
    const url = `${this.baseUrl}/pets/${id}`
    return this.client.get<PetModel>(url)
  }

  public getPetsByIds(ids: number[]) {
    const url = `${this.baseUrl}/pets/list`
    return this.client.post<PetModel[]>(url, ids, {
      headers: {
        'Accept': 'application/json'
      }
    })
  }

  public getPetImage(name: string) {
    console.log(name)
    const url = `${this.baseUrl}/pets/name/${encodeURIComponent(name)}`;
    return this.client.get<PetModel>(url);
  }

  public addReview(petId: number, review: Partial<ReviewModel>): Observable<PetModel> {
    const url = `${this.baseUrl}/pets/${petId}/reviews`;
    return this.client.post<PetModel>(url, review, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }

  private retrieveRasaSession() {
    if (!localStorage.getItem('session'))
      localStorage.setItem('session', uuidv4())

    return localStorage.getItem('session')
  }

  public sendRasaMessage(value: string) {
    const url = 'http://localhost:5005/webhooks/rest/webhook'
    return this.client.post<RasaModel[]>(url,
      {
        sender: this.retrieveRasaSession(),
        email: localStorage.getItem('active') ? localStorage.getItem('active') : null,
        message: value
      },
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    )
  }
}
