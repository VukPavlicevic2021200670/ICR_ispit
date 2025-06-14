import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FlightModel } from '../models/flight.model';
import { PageModel } from '../models/page.model';
import { RasaModel } from '../models/rasa.model';
import { PetModel } from '../models/pet.model';
import { v4 as uuidv4 } from 'uuid';

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

  public getPets(page = 0, size = 10) {
    const url = `${this.baseUrl}/pets?page=${page}&size=${size}}`;
    return this.client.get<PageModel<PetModel>>(url);
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



  public formatDate(iso: string | null) {
    if (iso == null) return 'On Time'
    return new Date(iso).toLocaleString('sr-RS')
  }

  public formatValue(str: any | null) {
    if (str == null) return 'N/A'
    return str
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
