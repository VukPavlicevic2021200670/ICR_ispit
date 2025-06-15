import { FlightModel } from "./flight.model"
import {PetModel} from "./pet.model";

export interface UserModel {
    email: string
    password: string
    flights: UserOrderModel[]
}

export interface UserOrderModel {
    id: number,
    pet?: PetModel
    status: 'reserved' | 'paid' | 'canceled'
    rating: 'l' | 'd' | 'na'
    created: string
}