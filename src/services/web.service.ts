import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FlightModel } from '../models/flight.model';
import { PageModel } from '../models/page.model';
import { RasaModel } from '../models/rasa.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class WebService {

  private static instance: WebService
  private baseUrl: string
  private client: HttpClient

  private constructor() {
    this.baseUrl = "https://flight.pequla.com/api"
    this.client = inject(HttpClient)
  }

  public static getInstance() {
    if (this.instance == undefined)
      this.instance = new WebService()
    return this.instance
  }

  public getFlights(page = 0, size = 10, sort = "scheduledAt,desc") {
    const url = `${this.baseUrl}/flight?page=${page}&size=${size}&sort=${sort}&type=departure`
    return this.client.get<PageModel<FlightModel>>(url)
  }

  public getRecommendedFlights() {
    return this.getFlights(0, 3)
  }

  public getFlightById(id: number) {
    const url = `${this.baseUrl}/flight/${id}`
    return this.client.get<FlightModel>(url)
  }

  public getFlightsByIds(ids: number[]) {
    const url = `${this.baseUrl}/flight/list`
    return this.client.post<FlightModel[]>(url, ids, {
      headers: {
        'Accept': 'application/json'
      }
    })
  }

  public getDestinationImage(dest: string) {
    return 'https://img.pequla.com/destination/' + dest.split(" ")[0].toLowerCase() + '.jpg'
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
